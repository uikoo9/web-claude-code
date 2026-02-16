# @webccc/online-server

WebSocket server for web-claude-code online mode.

## Overview

This package provides a WebSocket server that enables remote access to local Claude CLI sessions. It uses Socket.IO with a room-based architecture to manage connections between CLI clients and browser clients.

## Architecture

```
Browser (www.webcc.dev/token)
    ↓ WebSocket
WebSocket Server (this package)
    - Manages rooms by token
    - Forwards messages between CLI and browsers
    ↓ WebSocket
Local CLI Client
    ↓ Process communication
Claude CLI Process
```

## Installation

```bash
cd packages/online-server
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

**Environment Variables:**

| Variable   | Default       | Description                                      |
| ---------- | ------------- | ------------------------------------------------ |
| `PORT`     | `4000`        | WebSocket server port                            |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API

### WebSocket Events

#### Client → Server

**1. register** - Register connection

```javascript
// CLI registration
socket.emit('register', {
  type: 'cli',
  token: 'abc123def456',
});

// Browser registration
socket.emit('register', {
  type: 'browser',
  token: 'abc123def456',
});
```

**2. cli-input** - Send user input to CLI (Browser only)

```javascript
socket.emit('cli-input', {
  token: 'abc123def456',
  data: 'ls\n',
});
```

**3. cli-output** - Send CLI output to browsers (CLI only)

```javascript
socket.emit('cli-output', {
  token: 'abc123def456',
  data: 'file1.txt\nfile2.txt\n',
});
```

#### Server → Client

**1. registered** - Registration successful

```javascript
// CLI
socket.on('registered', ({ token, publicUrl }) => {
  console.log('Public URL:', publicUrl);
});

// Browser
socket.on('registered', ({ token }) => {
  console.log('Connected to session:', token);
});
```

**2. error** - Registration failed

```javascript
socket.on('error', ({ message }) => {
  console.error('Error:', message);
});
```

**3. cli-input** - Receive user input from browser (CLI only)

```javascript
socket.on('cli-input', ({ data }) => {
  cliProcess.stdin.write(data);
});
```

**4. cli-output** - Receive CLI output (Browser only)

```javascript
socket.on('cli-output', ({ data }) => {
  terminal.write(data);
});
```

**5. cli-disconnected** - CLI disconnected (Browser only)

```javascript
socket.on('cli-disconnected', () => {
  console.log('CLI session ended');
});
```

## Room Management

The server maintains a `Map<token, room>` structure:

```javascript
{
  cliSocket: Socket,        // CLI connection
  browserSockets: Socket[], // Browser connections
  createdAt: number         // Timestamp
}
```

**Room Lifecycle:**

1. CLI connects → Create room with token
2. Browser connects → Join existing room
3. CLI disconnects → Notify all browsers, keep room if browsers exist
4. Last connection disconnects → Delete room
5. Auto-cleanup after 24 hours (inactive rooms)

## Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start src/server.js --name webcc-ws-server

# View logs
pm2 logs webcc-ws-server

# Restart
pm2 restart webcc-ws-server

# Stop
pm2 stop webcc-ws-server

# Auto-start on boot
pm2 startup
pm2 save
```

### Nginx Configuration

```nginx
upstream webcc_ws_server {
    server 127.0.0.1:4000;
}

server {
    listen 443 ssl http2;
    server_name www.webcc.dev;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/www.webcc.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.webcc.dev/privkey.pem;

    # WebSocket proxy
    location /ws {
        proxy_pass http://webcc_ws_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout settings
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
}
```

## Security

**CORS:**

- Development: Allow all origins (`*`)
- Production: Only allow `https://www.webcc.dev`

**Token Security:**

- 16-character random string (nanoid)
- Entropy: 62^16 ≈ 4.7 × 10^28

**Rate Limiting:**

- Consider adding socket.io-rate-limit for production

**Auto-cleanup:**

- Rooms expire after 24 hours of inactivity

## Monitoring

**Key Metrics:**

```bash
# View active connections
pm2 monit

# View logs
pm2 logs webcc-ws-server

# Check server status
curl http://localhost:4000/
```

**Room Statistics:**

Add a debug endpoint to view active rooms:

```javascript
httpServer.on('request', (req, res) => {
  if (req.url === '/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        rooms: rooms.size,
        connections: io.sockets.sockets.size,
      }),
    );
  }
});
```

## License

MIT
