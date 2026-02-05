const { spawn } = require('child_process');

/**
 * 启动一个交互式 CLI 工具
 * @param {string} command - 要执行的命令
 * @param {string[]} args - 命令参数
 * @param {object} options - spawn 选项
 */
function startCLI(command, args = [], options = {}) {
  // 使用 spawn 启动子进程，inherit 模式会直接继承父进程的输入输出
  const cli = spawn(command, args, {
    stdio: 'inherit', // 继承父进程的 stdin, stdout, stderr
    shell: true, // 在 shell 中运行
    ...options,
  });

  // 监听进程退出事件
  cli.on('close', (code) => {
    console.log(`CLI 工具已退出，退出码: ${code}`);
    process.exit(code);
  });

  // 监听错误事件
  cli.on('error', (err) => {
    console.error('启动 CLI 工具失败:', err);
    process.exit(1);
  });

  return cli;
}

// 示例用法：启动一个交互式 CLI 工具
// 你可以替换成任何你想要启动的 CLI 命令

// 示例 1: 启动 node REPL
// startCLI('node');

// 示例 2: 启动 npm
// startCLI('npm', ['init']);

// 示例 3: 启动自定义 CLI 工具
// startCLI('your-cli-tool', ['--interactive']);

// 示例 4: 启动 Python 交互式环境
// startCLI('python3');

// 从命令行参数获取要执行的命令
const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.log('使用方法: node index.js <command> [args...]');
  console.log('示例: node index.js node');
  console.log('示例: node index.js npm init');
  process.exit(0);
}

// 启动 CLI 工具
startCLI(command, args);
