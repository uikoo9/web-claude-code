const figlet = require('figlet');
const chalk = require('chalk');

/**
 * 显示 Banner
 */
function showBanner() {
  const banner = figlet.textSync('WebCC', {
    font: 'Standard',
    horizontalLayout: 'default',
  });

  console.log(chalk.cyan(banner));
  console.log(chalk.gray('  webcc.dev: web-claude-code'));
  console.log(chalk.gray('  Version: 0.0.1\n'));
}

module.exports = { showBanner };
