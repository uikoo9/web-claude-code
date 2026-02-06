# @webccc/cli

[简体中文](./packages/cli/README.zh-CN.md) | English

Web Claude Code CLI - Command-line tool to run Claude Code in your web browser.

## Introduction

`@webccc/cli` is a command-line tool that allows you to use Claude Code directly in your web browser, providing a convenient web-based terminal interface for Claude CLI.

![Demo Screenshot](https://static-small.vincentqiao.com/webcc.png)

Features:

- 🚀 Quick server startup to access Claude Code via web browser
- 🔧 Auto-detect `.env` configuration files
- 💬 Interactive configuration wizard
- 🎨 Colored log output
- 📦 Ready to use out of the box

## Installation

### Global Installation (Recommended)

```bash
npm install -g @webccc/cli
```

After global installation, you can use the `webcc` command in any directory.

### Local Installation

```bash
npm install @webccc/cli
```

After local installation, you can use it via `npx webcc` or in `package.json` scripts.

## Usage

### Quick Start

```bash
webcc
```

The CLI will automatically check if a `.env` file exists in the current directory:

- **With `.env` file**: Automatically load configuration and start server
- **Without `.env` file**: Launch interactive configuration wizard

### Command Options

```bash
webcc -h          # Show help information
webcc --help      # Show help information
webcc -v          # Show version number
webcc --version   # Show version number
```

## Configuration

### Method 1: Using .env File (Recommended)

Create a `.env` file in your project directory:

```bash
# Anthropic API Configuration (Required)
ANTHROPIC_BASE_URL=http://your-api-url:3000/api
ANTHROPIC_AUTH_TOKEN=your_auth_token_here

# Claude CLI Configuration (Optional)
CLAUDE_PATH=claude
WORK_DIR=/path/to/your/project

# Claude Model Configuration (Optional)
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
ANTHROPIC_SMALL_FAST_MODEL=claude-sonnet-4-5-20250929

# Server Configuration (Optional)
PORT=4000
HOST=0.0.0.0
```

Then run:

```bash
webcc
```

### Method 2: Interactive Configuration

If no `.env` file exists, running `webcc` will prompt you to enter:

1. Anthropic API Base URL (Required)
2. Anthropic Auth Token (Required)
3. Claude CLI Path (Optional, default: `claude`)
4. Working Directory (Optional, default: current directory)
5. Claude Model (Optional, default: `claude-sonnet-4-5-20250929`)
6. Small Fast Model (Optional, default: `claude-sonnet-4-5-20250929`)
7. Server Port (Optional, default: `4000`)
8. Server Host (Optional, default: `0.0.0.0`)

## Configuration Details

### Required Configuration

| Config Item            | Environment Variable   | Description                        |
| ---------------------- | ---------------------- | ---------------------------------- |
| Anthropic API Base URL | `ANTHROPIC_BASE_URL`   | Anthropic API base URL             |
| Anthropic Auth Token   | `ANTHROPIC_AUTH_TOKEN` | Anthropic API authentication token |

### Optional Configuration

| Config Item       | Environment Variable         | Default Value                | Description                      |
| ----------------- | ---------------------------- | ---------------------------- | -------------------------------- |
| Claude CLI Path   | `CLAUDE_PATH`                | `claude`                     | Path to Claude CLI executable    |
| Working Directory | `WORK_DIR`                   | Current directory            | Claude CLI working directory     |
| Claude Model      | `ANTHROPIC_MODEL`            | `claude-sonnet-4-5-20250929` | Main Claude model to use         |
| Small Fast Model  | `ANTHROPIC_SMALL_FAST_MODEL` | `claude-sonnet-4-5-20250929` | Small fast model for quick tasks |
| Server Port       | `PORT`                       | `4000`                       | Web server listening port        |
| Server Host       | `HOST`                       | `0.0.0.0`                    | Web server listening host        |

## Usage Examples

### Example 1: Using .env File

```bash
# Create .env file
cat > .env << EOF
ANTHROPIC_BASE_URL=http://localhost:3000/api
ANTHROPIC_AUTH_TOKEN=sk-ant-xxxxx
PORT=8080
EOF

# Start server
webcc
```

Output:

```
  _    _      _      _____ _____
 | |  | |    | |    /  __ /  __ \
 | |  | | ___| |__  | /  \| /  \/
 | |/\| |/ _ | '_ \ | |   | |
 \  /\  |  __| |_) || \__/| \__/\
  \/  \/ \___|_.__/  \____/\____/

  webcc.dev: web-claude-code
  Version: 0.0.4

✓ [12:34:56] Found .env file, loading configuration...
ℹ [12:34:56] Starting server...

✓ [12:34:56] Server started successfully!

ℹ [12:34:56] Access URLs:
ℹ [12:34:56]   Local: http://localhost:8080
ℹ [12:34:56]   Network: http://<your-ip>:8080
ℹ [12:34:56]
Press Ctrl+C to stop the server
```

### Example 2: Interactive Configuration

```bash
webcc
```

Prompts:

```
  _    _      _      _____ _____
 | |  | |    | |    /  __ /  __ \
 | |  | | ___| |__  | /  \| /  \/
 | |/\| |/ _ | '_ \ | |   | |
 \  /\  |  __| |_) || \__/| \__/\
  \/  \/ \___|_.__/  \____/\____/

  webcc.dev: web-claude-code
  Version: 0.0.4

ℹ [12:34:56] .env file not found, please provide configuration:

? Anthropic API Base URL (Required): http://localhost:3000/api
? Anthropic Auth Token (Required): sk-ant-xxxxx
? Claude CLI Path: (claude)
? Server Port: (4000)
? Server Host: (0.0.0.0)

ℹ [12:34:56] Starting server...
...
```

## Requirements

- Node.js >= 14.0.0
- Claude CLI installed on the system
- expect tool (for PTY support)
  - macOS: `brew install expect`
  - Ubuntu/Debian: `sudo apt-get install expect`
  - Windows: Use WSL or alternatives

## Integration with npm scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "webcc"
  }
}
```

Then use:

```bash
npm start
```

## Troubleshooting

### Issue: Claude CLI Not Found

**Error Message:**

```
✖ [12:34:56] Failed to start CLI: spawn claude ENOENT
```

**Solution:**

- Ensure Claude CLI is properly installed
- Check if `claude` command is in PATH
- Or specify full path in `.env` with `CLAUDE_PATH`

### Issue: Port Already in Use

**Error Message:**

```
✖ [12:34:56] Error: listen EADDRINUSE :::4000
```

**Solution:**

- Change port number in `.env` with `PORT=8080`
- Or free up the occupied port

### Issue: Missing expect Tool

**Error Message:**

```
✖ [12:34:56] Failed to start CLI: spawn expect ENOENT
```

**Solution:**

- macOS: `brew install expect`
- Linux: `sudo apt-get install expect`
- Windows: Use WSL

## License

MIT

## Links

- [GitHub](https://github.com/uikoo9/web-claude-code)
- [Issues](https://github.com/uikoo9/web-claude-code/issues)
- [Website](https://webcc.dev)
