const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { generateExpectScript } = require('./expect-template');

/**
 * 创建 Claude CLI 管理器
 * @param {Object} options - 配置选项
 * @param {string} options.claudePath - Claude CLI 路径
 * @param {string} options.anthropicBaseUrl - Anthropic API Base URL
 * @param {string} options.anthropicAuthToken - Anthropic Auth Token
 * @param {string} options.anthropicModel - Anthropic Model
 * @param {string} options.anthropicSmallFastModel - Anthropic Small Fast Model
 * @param {Object} options.io - Socket.IO 实例
 * @returns {Object} CLI 管理器对象
 */
function createCLIManager(options) {
  const { claudePath, anthropicBaseUrl, anthropicAuthToken, anthropicModel, anthropicSmallFastModel, io } = options;

  let cliProcess = null;
  let tempExpectScript = null;

  /**
   * 启动 Claude CLI
   */
  function start() {
    console.log('正在启动 claude CLI...');

    try {
      // 生成 expect 脚本
      const scriptContent = generateExpectScript(claudePath);

      // 创建临时 expect 脚本文件
      tempExpectScript = path.join(os.tmpdir(), `claude-expect-${Date.now()}.exp`);
      fs.writeFileSync(tempExpectScript, scriptContent, { mode: 0o755 });

      // 启动进程
      cliProcess = spawn(tempExpectScript, [], {
        cwd: process.env.HOME,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          ANTHROPIC_BASE_URL: anthropicBaseUrl,
          ANTHROPIC_AUTH_TOKEN: anthropicAuthToken,
          ANTHROPIC_MODEL: anthropicModel,
          ANTHROPIC_SMALL_FAST_MODEL: anthropicSmallFastModel,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      console.log('Claude CLI 已启动（通过 expect），PID:', cliProcess.pid);

      // 设置编码
      if (cliProcess.stdout) {
        cliProcess.stdout.setEncoding('utf8');
      }
      if (cliProcess.stderr) {
        cliProcess.stderr.setEncoding('utf8');
      }

      // 监听标准输出
      cliProcess.stdout.on('data', (data) => {
        console.log('=== CLI 输出 ===');
        console.log(data);
        console.log('=== 输出结束 ===');
        io.emit('cli-output', {
          type: 'stdout',
          data: data,
          time: new Date().toISOString(),
        });
      });

      // 监听错误输出
      cliProcess.stderr.on('data', (data) => {
        console.log('=== CLI 错误 ===');
        console.log(data);
        console.log('=== 输出结束 ===');
        io.emit('cli-output', {
          type: 'stderr',
          data: data,
          time: new Date().toISOString(),
        });
      });

      // 监听进程退出
      cliProcess.on('close', (code) => {
        console.log(`CLI 进程退出，退出码: ${code}`);
        io.emit('cli-output', {
          type: 'exit',
          data: `\n进程已退出，退出码: ${code}\n`,
          time: new Date().toISOString(),
        });
        cliProcess = null;

        // 清理临时 expect 脚本文件
        cleanupTempScript();
      });

      // 监听进程错误
      cliProcess.on('error', (err) => {
        console.error('CLI 进程错误:', err);
        io.emit('cli-output', {
          type: 'error',
          data: `错误: ${err.message}\n`,
          time: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('启动 CLI 失败:', error);
      io.emit('cli-output', {
        type: 'error',
        data: `启动失败: ${error.message}\n`,
        time: new Date().toISOString(),
      });
    }
  }

  /**
   * 清理临时脚本文件
   */
  function cleanupTempScript() {
    if (tempExpectScript && fs.existsSync(tempExpectScript)) {
      try {
        fs.unlinkSync(tempExpectScript);
        console.log('已清理临时 expect 脚本');
      } catch (err) {
        console.error('清理临时文件失败:', err.message);
      }
    }
  }

  /**
   * 写入数据到 CLI
   * @param {string} data - 要写入的数据
   */
  function write(data) {
    if (cliProcess && cliProcess.stdin.writable) {
      cliProcess.stdin.write(data);
      return true;
    }
    return false;
  }

  /**
   * 停止 CLI 进程
   */
  function stop() {
    if (cliProcess) {
      cliProcess.kill();
      cliProcess = null;
    }
    cleanupTempScript();
  }

  /**
   * 检查 CLI 是否正在运行
   * @returns {boolean}
   */
  function isRunning() {
    return cliProcess !== null;
  }

  return {
    start,
    stop,
    write,
    isRunning,
  };
}

module.exports = {
  createCLIManager,
};
