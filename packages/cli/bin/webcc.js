#!/usr/bin/env node

const { program } = require('commander');
const { startClaudeCodeServer } = require('@webccc/cli-server');
const { showBanner } = require('../src/banner');
const { getConfig } = require('../src/config');
const { selectMode, promptOnlineToken } = require('../src/mode');
const { startOnlineClient } = require('../src/online');
const { logger } = require('../src/logger');
const packageJson = require('../package.json');

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

    // Select startup mode
    const mode = await selectMode();

    if (mode === 'online') {
      const token = await promptOnlineToken();
      startOnlineClient(token, config);
      return;
    }

    // Local mode
    logger.info('Starting server...\n');

    const server = startClaudeCodeServer(config);

    logger.success('Server started!\n');
    logger.info('Access URLs:');
    logger.info(`  Local:   http://localhost:${config.port}`);
    if (config.host === '0.0.0.0') {
      logger.info(`  Network: http://<your-ip>:${config.port}`);
    } else {
      logger.info(`  Network: http://${config.host}:${config.port}`);
    }
    logger.info('\nPress Ctrl+C to stop the server');

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

// Parse CLI args
program.parse(process.argv);
