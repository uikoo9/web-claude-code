#!/usr/bin/env node

const { program } = require('commander');
const { startClaudeCodeServer } = require('@webccc/server');
const { showBanner } = require('../src/banner');
const { getConfig } = require('../src/config');
const { logger } = require('../src/logger');
const packageJson = require('../package.json');

// 定义 CLI 程序
program
  .name('webcc')
  .description('Web Claude Code - 为 Claude Code 提供 Web 界面')
  .version(packageJson.version, '-v, --version', '显示版本号')
  .helpOption('-h, --help', '显示帮助信息');

// 主命令
program.action(async () => {
  try {
    // 显示 Banner
    showBanner();

    // 获取配置
    const config = await getConfig(process.cwd());

    logger.info('正在启动服务器...\n');

    // 启动服务器
    const server = startClaudeCodeServer(config);

    // 显示访问地址
    logger.success('服务器启动成功！\n');
    logger.info('访问地址:');
    logger.info(`  本地: http://localhost:${config.port}`);
    if (config.host === '0.0.0.0') {
      logger.info(`  网络: http://<your-ip>:${config.port}`);
    } else {
      logger.info(`  网络: http://${config.host}:${config.port}`);
    }
    logger.info('\n按 Ctrl+C 停止服务器');

    // 处理退出信号
    process.on('SIGINT', () => {
      logger.info('\n正在停止服务器...');
      server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('\n正在停止服务器...');
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('启动失败:', error.message);
    process.exit(1);
  }
});

// 解析命令行参数
program.parse(process.argv);
