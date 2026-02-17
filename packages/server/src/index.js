const { createServer } = require('http');
const path = require('path');
const { createExpressApp } = require('./app');
const { setupSocketIO } = require('./socket');
const { createCLIManager } = require('./cli');
const { logger } = require('./logger');

/**
 * Start the Claude Code web server
 * @param {Object} options - Configuration options
 * @param {number} options.port - Server port, default 4000
 * @param {string} options.host - Server host, default '0.0.0.0'
 * @param {string} options.claudePath - Claude CLI path, default 'claude' (resolved from PATH)
 * @param {string} options.workDir - Claude CLI working directory, default user HOME
 * @param {string} options.anthropicBaseUrl - Anthropic API Base URL (required)
 * @param {string} options.anthropicAuthToken - Anthropic Auth Token (required)
 * @param {string} options.anthropicModel - Anthropic Model, default 'claude-sonnet-4-5-20250929'
 * @param {string} options.anthropicSmallFastModel - Anthropic Small Fast Model, default 'claude-sonnet-4-5-20250929'
 * @returns {Object} Server instance and control methods
 */
function startClaudeCodeServer(options = {}) {
  const {
    port = 4000,
    host = '0.0.0.0',
    claudePath = 'claude',
    workDir = process.env.HOME,
    anthropicBaseUrl,
    anthropicAuthToken,
    anthropicModel = 'claude-sonnet-4-5-20250929',
    anthropicSmallFastModel = 'claude-sonnet-4-5-20250929',
  } = options;

  // Internal fixed config
  const viewsDir = path.join(__dirname, '../views');
  const corsOrigin = 'http://localhost:3000';

  // Validate required params
  if (!anthropicBaseUrl) {
    logger.error('anthropicBaseUrl is required');
    logger.error('Please provide an Anthropic API Base URL when starting the server');
    process.exit(1);
  }

  if (!anthropicAuthToken) {
    logger.error('anthropicAuthToken is required');
    logger.error('Please provide an Anthropic Auth Token when starting the server');
    process.exit(1);
  }

  // Create Express app
  const app = createExpressApp({ viewsDir });

  // Create HTTP server
  const httpServer = createServer(app);

  // Reference to Socket.IO instance
  let io = null;

  // Create CLI manager
  const cliManager = createCLIManager({
    claudePath,
    workDir,
    anthropicBaseUrl,
    anthropicAuthToken,
    anthropicModel,
    anthropicSmallFastModel,
    getIO: () => io,
  });

  // Setup Socket.IO
  io = setupSocketIO(httpServer, cliManager, { corsOrigin });

  // Start server
  httpServer.listen(port, host, () => {
    logger.success(`WebSocket server running at http://${host}:${port}`);
  });

  // Stop server
  function stop() {
    logger.info('Shutting down server...');
    cliManager.stop();
    httpServer.close();
  }

  return {
    app,
    httpServer,
    io,
    stop,
  };
}

module.exports = {
  startClaudeCodeServer,
};
