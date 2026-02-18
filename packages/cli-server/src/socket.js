const { Server } = require('socket.io');
const { logger } = require('./logger');

/**
 * Setup Socket.IO server
 * @param {Object} httpServer - HTTP server instance
 * @param {Object} cliManager - CLI manager instance
 * @param {Object} options - Configuration options
 * @param {string} options.corsOrigin - Allowed CORS origin
 * @returns {Object} Socket.IO instance
 */
function setupSocketIO(httpServer, cliManager, options = {}) {
  const { corsOrigin = 'http://localhost:3000' } = options;

  // Create Socket.IO server
  const io = new Server(httpServer, {
    path: '/ws',
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  // Connection event
  io.on('connection', (socket) => {
    logger.info('Client connected:', socket.id);

    // Start CLI if not already running
    if (!cliManager.isRunning()) {
      cliManager.start();
    }

    // Receive client input and forward to CLI
    socket.on('cli-input', (data) => {
      logger.debug('Received client input:', JSON.stringify(data));
      const success = cliManager.write(data);
      if (!success) {
        socket.emit('cli-output', {
          type: 'error',
          data: 'CLI process is not running or not writable\n',
          time: new Date().toISOString(),
        });
      }
    });

    // Restart CLI
    socket.on('cli-restart', () => {
      logger.info('Restarting CLI');
      cliManager.stop();
      setTimeout(() => {
        cliManager.start();
      }, 500);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      logger.info('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = {
  setupSocketIO,
};
