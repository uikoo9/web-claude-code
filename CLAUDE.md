# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based interface for Claude Code, enabling users to interact with Claude through a browser-based terminal. The project is a monorepo managed by Lerna and Nx.

## Architecture Design

The system architecture follows this flow:

1. User runs the CLI tool (@webccc/cli)
2. CLI invokes the server package (@webccc/server)
3. Server starts a Node.js service that spawns Claude Code CLI process
4. Server serves the web interface and establishes WebSocket connections
5. Web terminal interacts with Claude Code via WebSocket bidirectional communication

### Package Responsibilities

1. **@webccc/cli** (packages/cli) - **Entry point, will be published**
   - The main tool users will run to start the web-based Claude Code
   - Calls the server's start method to launch the service

2. **@webccc/server** (packages/server) - **Core service, will be published**
   - Exports a method like `startWebClaudeCode()` to start the service
   - Spawns and manages the Claude Code CLI process
   - Provides WebSocket server for real-time communication
   - Serves the built web interface (static files from @webccc/web build)
   - Bridges stdin/stdout between Claude CLI and WebSocket connections

3. **@webccc/web** (packages/web) - **Frontend, will NOT be published**
   - React application with xterm.js terminal emulation
   - Builds static files that are packaged into @webccc/server
   - Connects to server via Socket.IO for real-time interaction
   - Displays Claude Code output in a browser-based terminal

**Current Development State**: The implementation is currently in packages/web/server.js for development purposes. The final architecture will move this to packages/server, with web's build output bundled into the server package.

## Development Commands

### Root Level

- `npm run build` - Build all packages using Lerna
- `npm run lint` - Run build, prettier, and eslint on all packages
- `npm run prettier` - Format code with Prettier
- `npm run eslint` - Lint code with ESLint
- `npm run cz` - Commit using Commitizen (conventional commits)
- `npm run graph` - Visualize project dependencies with Nx
- `npm run clean` - Clear Nx cache

### Web Package (packages/web)

- `npm run dev` - Start Vite dev server on port 3000
- `npm run server` - Start WebSocket server on port 4000
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

## Development Workflow

**Current Development Setup** (before full integration):

1. Start the WebSocket server: `cd packages/web && npm run server`
2. In a separate terminal, start the web interface: `cd packages/web && npm run dev`
3. The browser should open automatically to http://localhost:3000

The web interface connects to the WebSocket server at http://localhost:4000, which manages the Claude CLI process.

**Final Production Flow** (after packaging):

1. User installs: `npm install -g @webccc/cli`
2. User runs: `webcc` (or the cli command)
3. CLI starts server with embedded web interface
4. Browser automatically opens to interact with Claude Code

## Project Structure

- **Monorepo Management**: Using Lerna with independent versioning
- **Build System**: Nx for build caching and dependency management
- **Workspaces**: All packages/\* are defined as workspaces in root package.json
- **Build Dependencies**: Nx automatically handles build order based on package dependencies
- **Integration Point**: Web package builds output to be bundled into server package
- **Package Relationships**:
  - CLI depends on Server
  - Server includes Web's built static files
  - Web is development-only, not published

## Code Quality

- Husky git hooks are configured for pre-commit validation
- lint-staged runs prettier and eslint on all staged files
- Conventional commits enforced via commitlint
- All commits should follow conventional commit format (enforced via commitizen)

## Publishing

- **@webccc/cli** and **@webccc/server** will be published to npm
- **@webccc/web** will NOT be published (its build output is bundled into server)
- Packages use independent versioning (Lerna independent mode)
- Use `npm run pb` (lerna publish) to publish packages
- Publishing is restricted to main branch only
- Published packages have public access to npm registry

**Build Flow for Publishing**:

1. Web package builds static files
2. Static files are copied/bundled into server package
3. CLI and server packages are published to npm
4. Users install CLI package, which depends on server package

## Key Dependencies

- **Frontend**: React 18, xterm.js (terminal emulation), socket.io-client
- **Server**: Express 5, Socket.IO, node-pty (for PTY support)
- **Build Tools**: Vite, Lerna, Nx
- **Code Quality**: ESLint, Prettier, Husky, lint-staged, commitlint

## Styling Guidelines

### packages/index (Landing Page)

The landing page uses **vanilla CSS** (no UI framework) with the following standards:

- **Units**: Always use `px` for all measurements (font sizes, spacing, borders, etc.). Do NOT use `rem`, `em`, or other relative units.
- **Responsive Design**: Use CSS media queries with pixel-based breakpoints for responsive layouts
- **CSS Variables**: Use CSS custom properties defined in `:root` for colors, fonts, and common values
- **Browser Support**: Target modern browsers with standard CSS features

**Rationale**: Pixel units provide precise, predictable control over layout and typography, ensuring consistency across different devices and browsers.

## Important Notes

- **Development State**: Server implementation is currently in packages/web/server.js for rapid development. This will be moved to packages/server before publishing.
- **Build Integration**: The web package's build output must be integrated into the server package before publishing, so server can serve static files.
- **CLI Process Management**: The server spawns Claude CLI with proper PTY support (currently using expect script)
- **WebSocket Communication**: Real-time bidirectional communication between browser and Claude CLI via Socket.IO
- **CORS Configuration**: Currently configured for http://localhost:3000 during development
- **Terminal Emulation**: Uses xterm-256color TERM setting for proper color support in browser
- **Working Directory**: Claude CLI is spawned in the user's HOME directory by default
