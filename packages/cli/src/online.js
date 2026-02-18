const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { io } = require('socket.io-client');
const { generateExpectScript } = require('@webccc/cli-server');
const { logger } = require('./logger');

const WS_SERVER = 'https://ws.webcc.dev';

/**
 * Start online mode: connect to ws.webcc.dev as CLI and bridge local Claude process
 * @param {string} token - Access token
 * @param {Object} config - Config from .env
 */
function startOnlineClient(token, config) {
  const {
    claudePath = 'claude',
    workDir = process.env.HOME,
    anthropicBaseUrl,
    anthropicAuthToken,
    anthropicModel,
    anthropicSmallFastModel,
  } = config;

  let cliProcess = null;
  let tempScript = null;

  // Connect to ws.webcc.dev
  const socket = io(WS_SERVER, {
    path: '/ws',
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    logger.info('Connecting to webcc.dev...');
    socket.emit('register', { type: 'cli', token });
  });

  socket.on('registered', () => {
    logger.success('Session is live!');
    logger.info(`  Open this URL in your browser: https://www.webcc.dev/${token}`);
    logger.info('  Anyone with this link can view your terminal session.');
    logger.info('\nPress Ctrl+C to end the session.\n');
    cliProcess = spawnClaude({
      claudePath,
      workDir,
      anthropicBaseUrl,
      anthropicAuthToken,
      anthropicModel,
      anthropicSmallFastModel,
      socket,
      token,
    });
  });

  socket.on('cli-input', ({ data }) => {
    if (cliProcess && cliProcess.stdin.writable) {
      cliProcess.stdin.write(data);
    }
  });

  socket.on('error', (err) => {
    logger.error('Server error:', err.message || err);
    cleanup();
    process.exit(1);
  });

  socket.on('disconnect', (reason) => {
    logger.warn('Disconnected from ws.webcc.dev:', reason);
    cleanup();
    process.exit(0);
  });

  socket.on('connect_error', (err) => {
    logger.error('Failed to connect to ws.webcc.dev:', err.message);
    process.exit(1);
  });

  function cleanup() {
    if (cliProcess) {
      cliProcess.kill();
      cliProcess = null;
    }
    if (tempScript && fs.existsSync(tempScript)) {
      try {
        fs.unlinkSync(tempScript);
      } catch (_) {
        // ignore cleanup errors
      }
    }
  }

  function spawnClaude(opts) {
    const scriptContent = generateExpectScript(opts.claudePath);
    tempScript = path.join(os.tmpdir(), `claude-expect-${Date.now()}.exp`);
    fs.writeFileSync(tempScript, scriptContent, { mode: 0o755 });

    const proc = spawn(tempScript, [], {
      cwd: opts.workDir,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        ANTHROPIC_BASE_URL: opts.anthropicBaseUrl,
        ANTHROPIC_AUTH_TOKEN: opts.anthropicAuthToken,
        ANTHROPIC_MODEL: opts.anthropicModel,
        ANTHROPIC_SMALL_FAST_MODEL: opts.anthropicSmallFastModel,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (proc.stdout) proc.stdout.setEncoding('utf8');
    if (proc.stderr) proc.stderr.setEncoding('utf8');

    proc.stdout.on('data', (data) => {
      opts.socket.emit('cli-output', { token: opts.token, data });
    });

    proc.stderr.on('data', (data) => {
      opts.socket.emit('cli-output', { token: opts.token, data });
    });

    proc.on('close', (code) => {
      logger.warn(`Claude CLI exited with code: ${code}`);
      opts.socket.emit('cli-output', { token: opts.token, data: `\nProcess exited with code: ${code}\n` });
      opts.socket.disconnect();
      cleanup();
      process.exit(0);
    });

    proc.on('error', (err) => {
      logger.error('Claude CLI error:', err.message);
      opts.socket.emit('cli-output', { token: opts.token, data: `Error: ${err.message}\n` });
    });

    logger.success('Claude CLI started');
    return proc;
  }

  // Handle local exit signals
  process.on('SIGINT', () => {
    logger.info('\nEnding session...');
    socket.disconnect();
    cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    socket.disconnect();
    cleanup();
    process.exit(0);
  });
}

module.exports = { startOnlineClient };
