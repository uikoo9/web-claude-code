const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const inquirer = require('inquirer');
const { logger } = require('./logger');

/**
 * 检查 .env 文件是否存在
 * @param {string} cwd - 当前工作目录
 * @returns {boolean}
 */
function checkEnvFile(cwd) {
  const envPath = path.join(cwd, '.env');
  return fs.existsSync(envPath);
}

/**
 * 从 .env 文件加载配置
 * @param {string} cwd - 当前工作目录
 * @returns {Object} 配置对象
 */
function loadEnvConfig(cwd) {
  const envPath = path.join(cwd, '.env');
  const result = dotenv.config({ path: envPath, override: true });

  if (result.error) {
    logger.error('读取 .env 文件失败:', result.error.message);
    process.exit(1);
  }

  // 使用 parsed 对象获取配置，避免被系统环境变量影响
  const parsed = result.parsed || {};

  return {
    port: parsed.PORT ? parseInt(parsed.PORT) : 4000,
    host: parsed.HOST || '0.0.0.0',
    claudePath: parsed.CLAUDE_PATH || 'claude',
    anthropicBaseUrl: parsed.ANTHROPIC_BASE_URL,
    anthropicAuthToken: parsed.ANTHROPIC_AUTH_TOKEN,
    anthropicModel: parsed.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    anthropicSmallFastModel: parsed.ANTHROPIC_SMALL_FAST_MODEL || 'claude-sonnet-4-5-20250929',
  };
}

/**
 * 通过交互式问答获取配置
 * @returns {Promise<Object>} 配置对象
 */
async function promptConfig() {
  logger.info('未找到 .env 文件，请提供以下配置信息：\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'anthropicBaseUrl',
      message: 'Anthropic API Base URL (必填):',
      validate: (input) => {
        if (!input.trim()) {
          return '此项为必填项';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'anthropicAuthToken',
      message: 'Anthropic Auth Token (必填):',
      validate: (input) => {
        if (!input.trim()) {
          return '此项为必填项';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'claudePath',
      message: 'Claude CLI 路径:',
      default: 'claude',
    },
    {
      type: 'input',
      name: 'port',
      message: '服务器端口:',
      default: '4000',
      validate: (input) => {
        const port = parseInt(input);
        if (isNaN(port) || port < 1 || port > 65535) {
          return '请输入有效的端口号 (1-65535)';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'host',
      message: '服务器主机:',
      default: '0.0.0.0',
    },
  ]);

  return {
    port: parseInt(answers.port),
    host: answers.host,
    claudePath: answers.claudePath,
    anthropicBaseUrl: answers.anthropicBaseUrl,
    anthropicAuthToken: answers.anthropicAuthToken,
    anthropicModel: 'claude-sonnet-4-5-20250929',
    anthropicSmallFastModel: 'claude-sonnet-4-5-20250929',
  };
}

/**
 * 获取配置（从 .env 或交互式问答）
 * @param {string} cwd - 当前工作目录
 * @returns {Promise<Object>} 配置对象
 */
async function getConfig(cwd) {
  if (checkEnvFile(cwd)) {
    logger.success('发现 .env 文件，正在加载配置...');
    const config = loadEnvConfig(cwd);

    // 验证必填项
    if (!config.anthropicBaseUrl || !config.anthropicAuthToken) {
      logger.error('.env 文件缺少必填配置项');
      logger.error('必填项: ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN');
      process.exit(1);
    }

    return config;
  } else {
    return await promptConfig();
  }
}

module.exports = { getConfig };
