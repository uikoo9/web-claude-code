const chalk = require('chalk');

function getTimestamp() {
  const now = new Date();
  return now.toISOString().split('T')[1].split('.')[0];
}

const logger = {
  info(...args) {
    console.log(chalk.blue('ℹ'), chalk.gray(`[${getTimestamp()}]`), ...args);
  },

  success(...args) {
    console.log(chalk.green('✓'), chalk.gray(`[${getTimestamp()}]`), chalk.green(...args));
  },

  warn(...args) {
    console.log(chalk.yellow('⚠'), chalk.gray(`[${getTimestamp()}]`), chalk.yellow(...args));
  },

  error(...args) {
    console.error(chalk.red('✖'), chalk.gray(`[${getTimestamp()}]`), chalk.red(...args));
  },

  debug(...args) {
    console.log(chalk.gray('⋯'), chalk.gray(`[${getTimestamp()}]`), chalk.gray(...args));
  },

  cli(...args) {
    console.log(chalk.cyan('►'), chalk.gray(`[${getTimestamp()}]`), chalk.cyan(...args));
  },

  divider(title) {
    if (title) {
      console.log(chalk.gray(`\n${'─'.repeat(10)} ${title} ${'─'.repeat(50 - title.length)}`));
    } else {
      console.log(chalk.gray('─'.repeat(60)));
    }
  },
};

module.exports = { logger };
