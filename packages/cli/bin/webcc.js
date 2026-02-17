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
  .description('Web Claude Code - A web interface for Claude Code')
  .version(packageJson.version, '-v, --version', 'Show version')
  .helpOption('-h, --help', 'Show help');

// Main command
program.action(async () => {
  try {
    // Show banner
    showBanner();

    // Load config
    const config = getConfig(process.cwd());

    logger.info('Starting server...\n');

    // Start server
    const server = startClaudeCodeServer(config);

    // Display URLs
    logger.success('Server started!\n');
    logger.info('Access URLs:');
    logger.info(`  Local:   http://localhost:${config.port}`);
    if (config.host === '0.0.0.0') {
      logger.info(`  Network: http://<your-ip>:${config.port}`);
    } else {
      logger.info(`  Network: http://${config.host}:${config.port}`);
    }
    logger.info('\nPress Ctrl+C to stop the server');

    // Handle exit signals
    process.on('SIGINT', () => {
      logger.info('\nStopping server...');
      server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('\nStopping server...');
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start:', error.message);
    process.exit(1);
  }
});

// 解析命令行参数
program.parse(process.argv);
