# @webccc/cli-server

Web Claude Code Server - Server-side implementation providing web interface for Claude Code.

## Introduction

This is an Express and Socket.IO based server that:

- Starts and manages Claude CLI process
- Provides WebSocket interface for browser to interact with Claude CLI
- Serves static web interface files

## Installation

```bash
npm install @webccc/cli-server
```

## Usage

```javascript
const { startClaudeCodeServer } = require('@webccc/cli-server');

// Start server (requires Claude configuration)
const server = startClaudeCodeServer({
  claudePath: 'claude', // Optional, Claude CLI path, default 'claude'
  anthropicBaseUrl: 'http://your-api-url:3000/api', // Required
  anthropicAuthToken: 'your_auth_token_here', // Required
  anthropicModel: 'claude-sonnet-4-5-20250929', // Optional, default value
  anthropicSmallFastModel: 'claude-sonnet-4-5-20250929', // Optional, default value
  port: 4000, // Optional, default 4000
  host: '0.0.0.0', // Optional, default '0.0.0.0'
});

// Stop server when needed
process.on('SIGINT', () => {
  server.stop();
  process.exit(0);
});
```

## API

### startClaudeCodeServer(options)

Start Claude Code web server.

**Parameters:**

- `options` (Object) - Optional configuration object
  - `claudePath` (string) - Optional, Claude CLI path, default `'claude'` (search from PATH)
  - `anthropicBaseUrl` (string) - **Required** Anthropic API Base URL
  - `anthropicAuthToken` (string) - **Required** Anthropic Auth Token
  - `anthropicModel` (string) - Optional, Claude model, default `'claude-sonnet-4-5-20250929'`
  - `anthropicSmallFastModel` (string) - Optional, small fast model, default `'claude-sonnet-4-5-20250929'`
  - `port` (number) - Optional, server port, default `4000`
  - `host` (string) - Optional, server host, default `'0.0.0.0'`

**Returns:**

Returns an object with the following properties:

- `app` - Express application instance
- `httpServer` - HTTP server instance
- `io` - Socket.IO instance
- `stop()` - Method to stop the server

## HTTP Routes

- `GET /` - Returns web interface index.html
- `GET /assets/*` - Static resource files (CSS, JS, etc.)

## WebSocket Events

**Path:** `/ws`

### Client → Server

- `cli-input` - Send input to Claude CLI
- `cli-restart` - Restart Claude CLI process

### Server → Client

- `cli-output` - Output from Claude CLI
  ```javascript
  {
    type: 'stdout' | 'stderr' | 'exit' | 'error',
    data: string,
    time: string // ISO 8601 format
  }
  ```

## Directory Structure

```
packages/cli-server/
├── src/
│   ├── index.js           # Main module, exports startClaudeCodeServer
│   ├── app.js             # Express application configuration
│   ├── socket.js          # Socket.IO server configuration
│   ├── cli.js             # Claude CLI process manager
│   ├── expect-template.js # Expect script template generator
│   └── logger.js          # Logging utility
├── views/                 # Web interface static files (build output)
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
├── server.js              # Standalone server entry point
├── package.json
└── README.md
```

## Requirements

- Node.js >= 14.0.0
- Claude CLI installed on the system
- expect tool (for PTY support)

## Cross-platform Notes

The server uses dynamically generated expect script to provide PTY support and start Claude CLI. On different platforms:

- **macOS/Linux**: Requires expect tool installation

  ```bash
  # macOS
  brew install expect

  # Ubuntu/Debian
  sudo apt-get install expect
  ```

- **Windows**: Use alternatives like WSL or node-pty

## Dependencies

- `express` - Web framework
- `socket.io` - WebSocket communication
- `cors` - Cross-Origin Resource Sharing

## License

MIT
