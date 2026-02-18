const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { generateExpectScript } = require('./expect-template');
const { logger } = require('./logger');

/**
 * Create a Claude CLI manager
 * @param {Object} options - Configuration options
 * @param {string} options.claudePath - Claude CLI path
 * @param {string} options.workDir - Claude CLI working directory
 * @param {string} options.anthropicBaseUrl - Anthropic API Base URL
 * @param {string} options.anthropicAuthToken - Anthropic Auth Token
 * @param {string} options.anthropicModel - Anthropic Model
 * @param {string} options.anthropicSmallFastModel - Anthropic Small Fast Model
 * @param {Function} options.getIO - Function to get the Socket.IO instance
 * @returns {Object} CLI manager object
 */
function createCLIManager(options) {
  const { claudePath, workDir, anthropicBaseUrl, anthropicAuthToken, anthropicModel, anthropicSmallFastModel, getIO } =
    options;

  let cliProcess = null;
  let tempExpectScript = null;

  /**
   * Start Claude CLI
   */
  function start() {
    logger.info('Starting Claude CLI...');

    try {
      // Generate expect script
      const scriptContent = generateExpectScript(claudePath);

      // Write temporary expect script file
      tempExpectScript = path.join(os.tmpdir(), `claude-expect-${Date.now()}.exp`);
      fs.writeFileSync(tempExpectScript, scriptContent, { mode: 0o755 });

      // Spawn process
      cliProcess = spawn(tempExpectScript, [], {
        cwd: workDir,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          ANTHROPIC_BASE_URL: anthropicBaseUrl,
          ANTHROPIC_AUTH_TOKEN: anthropicAuthToken,
          ANTHROPIC_MODEL: anthropicModel,
          ANTHROPIC_SMALL_FAST_MODEL: anthropicSmallFastModel,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      logger.success('Claude CLI started');

      // Set encoding
      if (cliProcess.stdout) {
        cliProcess.stdout.setEncoding('utf8');
      }
      if (cliProcess.stderr) {
        cliProcess.stderr.setEncoding('utf8');
      }

      // Listen to stdout
      cliProcess.stdout.on('data', (data) => {
        // Filter out expect's spawn command output
        const filteredData = data
          .split('\n')
          .filter((line) => !line.trim().startsWith('spawn '))
          .join('\n');

        if (filteredData) {
          const io = getIO();
          if (io) {
            io.emit('cli-output', {
              type: 'stdout',
              data: filteredData,
              time: new Date().toISOString(),
            });
          }
        }
      });

      // Listen to stderr
      cliProcess.stderr.on('data', (data) => {
        const io = getIO();
        if (io) {
          io.emit('cli-output', {
            type: 'stderr',
            data: data,
            time: new Date().toISOString(),
          });
        }
      });

      // Listen for process exit
      cliProcess.on('close', (code) => {
        logger.warn(`CLI process exited with code: ${code}`);
        const io = getIO();
        if (io) {
          io.emit('cli-output', {
            type: 'exit',
            data: `\nProcess exited with code: ${code}\n`,
            time: new Date().toISOString(),
          });
        }
        cliProcess = null;

        // Clean up temporary expect script
        cleanupTempScript();
      });

      // Listen for process error
      cliProcess.on('error', (err) => {
        logger.error('CLI process error:', err.message);
        const io = getIO();
        if (io) {
          io.emit('cli-output', {
            type: 'error',
            data: `Error: ${err.message}\n`,
            time: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      logger.error('Failed to start CLI:', error.message);
      const io = getIO();
      if (io) {
        io.emit('cli-output', {
          type: 'error',
          data: `Failed to start: ${error.message}\n`,
          time: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Clean up temporary script file
   */
  function cleanupTempScript() {
    if (tempExpectScript && fs.existsSync(tempExpectScript)) {
      try {
        fs.unlinkSync(tempExpectScript);
      } catch (err) {
        logger.error('Failed to clean up temp file:', err.message);
      }
    }
  }

  /**
   * Write data to CLI
   * @param {string} data - Data to write
   */
  function write(data) {
    if (cliProcess && cliProcess.stdin.writable) {
      cliProcess.stdin.write(data);
      return true;
    }
    return false;
  }

  /**
   * Stop the CLI process
   */
  function stop() {
    if (cliProcess) {
      cliProcess.kill();
      cliProcess = null;
    }
    cleanupTempScript();
  }

  /**
   * Check if CLI is running
   * @returns {boolean}
   */
  function isRunning() {
    return cliProcess !== null;
  }

  return {
    start,
    stop,
    write,
    isRunning,
  };
}

module.exports = {
  createCLIManager,
};
