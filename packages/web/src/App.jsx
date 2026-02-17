import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import './App.css';

function App() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"Cascadia Code", "Fira Code", "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#e8e8e8',
        cursor: '#6bcf7f',
        black: '#000000',
        red: '#ff6b6b',
        green: '#6bcf7f',
        yellow: '#ffd93d',
        blue: '#74b9ff',
        magenta: '#e066ff',
        cyan: '#4ecdc4',
        white: '#e8e8e8',
        brightBlack: '#888888',
        brightRed: '#ff6b6b',
        brightGreen: '#6bcf7f',
        brightYellow: '#ffd93d',
        brightBlue: '#74b9ff',
        brightMagenta: '#e066ff',
        brightCyan: '#4ecdc4',
        brightWhite: '#ffffff',
      },
      scrollback: 10000,
      allowProposedApi: true,
    });

    // Create fit addon
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Write welcome message
    term.writeln('\x1b[1;36mWelcome to Claude CLI Terminal\x1b[0m');
    term.writeln('\x1b[90mConnecting to server...\x1b[0m\n');

    // Listen for terminal input - send all keystrokes directly to the server
    term.onData((data) => {
      if (socketRef.current && socketRef.current.connected) {
        // Send all keystrokes directly to server, including Enter, arrow keys, etc.
        socketRef.current.emit('cli-input', data);
      }
    });

    // Connect to Socket.IO server (relative path /ws, auto-adapts to domain/IP/localhost)
    // In development, Vite proxy forwards requests to port 4000
    // In production, frontend and backend share the same port
    const socket = io({
      path: '/ws',
    });
    socketRef.current = socket;

    // Socket event handlers
    const handleConnect = () => {
      setIsConnected(true);
      term.writeln('\x1b[1;32m✓ Connected to server\x1b[0m');
      term.writeln('\x1b[90mStarting Claude CLI...\x1b[0m\n');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      term.writeln('\n\x1b[1;31m✗ Disconnected\x1b[0m');
    };

    const handleConnectError = (error) => {
      setIsConnected(false);
      term.writeln(`\x1b[1;31m✗ Connection failed: ${error.message}\x1b[0m`);
      term.writeln('\x1b[90mAttempting to reconnect...\x1b[0m\n');
    };

    const handleError = (error) => {
      term.writeln(`\x1b[1;31m✗ Error: ${error.message || error}\x1b[0m\n`);
    };

    const handleCliOutput = (data) => {
      if (data.data) {
        term.write(data.data);
      }
    };

    // Register socket event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('error', handleError);
    socket.on('cli-output', handleCliOutput);

    // Use ResizeObserver for terminal resize handling
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to debounce resize calls
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
      resizeObserverRef.current = resizeObserver;
    }

    // Cleanup
    return () => {
      // Disconnect ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      // Remove socket event listeners
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('error', handleError);
      socket.off('cli-output', handleCliOutput);
      socket.disconnect();

      // Dispose terminal
      term.dispose();
    };
  }, []);

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="header-left">
          <h1 className="app-title">Claude CLI Terminal</h1>
          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="header-buttons">
          <button onClick={clearTerminal} className="header-button">
            Clear Terminal
          </button>
        </div>
      </div>

      {/* Terminal area */}
      <div ref={terminalRef} className="terminal-container" />
    </div>
  );
}

export default App;
