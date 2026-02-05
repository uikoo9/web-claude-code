const chalk = require('chalk');

/**
 * 获取格式化的时间戳
 * @returns {string} 格式化的时间戳
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString().split('T')[1].split('.')[0];
}

/**
 * 日志工具
 */
const logger = {
  /**
   * 信息日志（蓝色）
   * @param {...any} args - 日志内容
   */
  info(...args) {
    console.log(chalk.blue('ℹ'), chalk.gray(`[${getTimestamp()}]`), ...args);
  },

  /**
   * 成功日志（绿色）
   * @param {...any} args - 日志内容
   */
  success(...args) {
    console.log(chalk.green('✓'), chalk.gray(`[${getTimestamp()}]`), chalk.green(...args));
  },

  /**
   * 警告日志（黄色）
   * @param {...any} args - 日志内容
   */
  warn(...args) {
    console.log(chalk.yellow('⚠'), chalk.gray(`[${getTimestamp()}]`), chalk.yellow(...args));
  },

  /**
   * 错误日志（红色）
   * @param {...any} args - 日志内容
   */
  error(...args) {
    console.error(chalk.red('✖'), chalk.gray(`[${getTimestamp()}]`), chalk.red(...args));
  },

  /**
   * 调试日志（灰色）
   * @param {...any} args - 日志内容
   */
  debug(...args) {
    console.log(chalk.gray('⋯'), chalk.gray(`[${getTimestamp()}]`), chalk.gray(...args));
  },

  /**
   * CLI 输出日志（青色）
   * @param {...any} args - 日志内容
   */
  cli(...args) {
    console.log(chalk.cyan('►'), chalk.gray(`[${getTimestamp()}]`), chalk.cyan(...args));
  },

  /**
   * 分割线
   * @param {string} title - 可选的标题
   */
  divider(title) {
    if (title) {
      console.log(chalk.gray(`\n${'─'.repeat(10)} ${title} ${'─'.repeat(50 - title.length)}`));
    } else {
      console.log(chalk.gray('─'.repeat(60)));
    }
  },
};

module.exports = { logger };
