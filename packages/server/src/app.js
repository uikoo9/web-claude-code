const express = require('express');
const cors = require('cors');
const path = require('path');

/**
 * Create Express app
 * @param {Object} options - Configuration options
 * @param {string} options.viewsDir - Path to views directory
 * @returns {Object} Express app instance
 */
function createExpressApp(options = {}) {
  const { viewsDir } = options;

  const app = express();

  // Configure CORS
  app.use(cors());

  // Serve static files from views directory as root
  app.use(
    express.static(viewsDir, {
      setHeaders: (res, filePath) => {
        // Set correct Content-Type for .js files
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
        // Set correct Content-Type for .css files
        if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
      },
    }),
  );

  // Return index.html at root path (ensures SPA routing works)
  app.get('/', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
  });

  return app;
}

module.exports = {
  createExpressApp,
};
