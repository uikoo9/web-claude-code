const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const inquirer = require('inquirer');
const { logger } = require('./logger');

function checkEnvFile(cwd) {
  const envPath = path.join(cwd, '.env');
  return fs.existsSync(envPath);
}

function loadEnvConfig(cwd) {
  const envPath = path.join(cwd, '.env');
  const result = dotenv.config({ path: envPath, override: true });

  if (result.error) {
    logger.error('Failed to read .env file:', result.error.message);
    process.exit(1);
  }

  const parsed = result.parsed || {};

  return {
    port: parsed.PORT ? parseInt(parsed.PORT) : 4000,
    host: parsed.HOST || '0.0.0.0',
    claudePath: parsed.CLAUDE_PATH || 'claude',
    workDir: parsed.WORK_DIR || process.cwd(),
    anthropicBaseUrl: parsed.ANTHROPIC_BASE_URL,
    anthropicAuthToken: parsed.ANTHROPIC_AUTH_TOKEN,
    anthropicModel: parsed.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    anthropicSmallFastModel: parsed.ANTHROPIC_SMALL_FAST_MODEL || 'claude-sonnet-4-5-20250929',
  };
}

function getConfig(cwd) {
  if (!checkEnvFile(cwd)) {
    logger.error('.env file not found. Please create a .env file in the current directory and try again.');
    logger.error('Required: ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN');
    process.exit(1);
  }

  logger.success('Found .env file, loading config...');
  const config = loadEnvConfig(cwd);

  if (!config.anthropicBaseUrl || !config.anthropicAuthToken) {
    logger.error('.env file is missing required fields.');
    logger.error('Required: ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN');
    process.exit(1);
  }

  return config;
}

module.exports = { getConfig };
