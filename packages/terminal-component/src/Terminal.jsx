import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import './Terminal.css';

/**
 * Terminal Component
 * @param {Object} props
 * @param {'local' | 'online'} props.mode - Connection mode
 * @param {string} [props.token] - Token for online mode
 * @param {string} [props.wsUrl] - WebSocket server URL for online mode (e.g., 'https://ws.webcc.dev')
 */
function TerminalComponent({ mode = 'local', token = '', wsUrl = '' }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const historyBufferRef = useRef('');
  const storageKeyRef = useRef('');

  const clearHistory = () => {
    try {
      const key = storageKeyRef.current;
      localStorage.removeItem(key);
      historyBufferRef.current = '';
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
    }
  };

  useEffect(() => {
    // Storage configuration
    const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_LINES = 10000;

    const getStorageKey = () => {
      if (mode === 'online') {
        return `terminal-history-online-${token}`;
      }
      return 'terminal-history-local';
    };

    const loadHistory = () => {
      try {
        const key = getStorageKey();
        const history = localStorage.getItem(key);
        return history || '';
      } catch (error) {
        console.error('Failed to load history from localStorage:', error);
        return '';
      }
    };

    const saveHistory = (data) => {
      try {
        const key = storageKeyRef.current;
        let newHistory = historyBufferRef.current + data;

        // Limit by size
        if (newHistory.length > MAX_STORAGE_SIZE) {
          newHistory = newHistory.slice(-MAX_STORAGE_SIZE);
        }

        // Limit by lines (approximate)
        const lines = newHistory.split('\n');
        if (lines.length > MAX_LINES) {
          newHistory = lines.slice(-MAX_LINES).join('\n');
        }

        historyBufferRef.current = newHistory;
        localStorage.setItem(key, newHistory);
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
        if (error.name === 'QuotaExceededError') {
          try {
            const recentData = data.slice(-MAX_STORAGE_SIZE / 2);
            historyBufferRef.current = recentData;
            localStorage.setItem(storageKeyRef.current, recentData);
          } catch (_) {
            // ignore cleanup errors
          }
        }
      }
    };

    // Validate online mode params
    if (mode === 'online' && (!token || !wsUrl)) {
      console.error('Token and wsUrl are required for online mode');
      return;
    }

    // Initialize storage key
    storageKeyRef.current = getStorageKey();

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

    // Load and restore history
    const history = loadHistory();
    if (history) {
      historyBufferRef.current = history;
      term.write(history);
    } else {
      // Write welcome message only if no history
      term.writeln('\x1b[1;36mWelcome to Claude CLI Terminal\x1b[0m');
      term.writeln('\x1b[90mConnecting to server...\x1b[0m\n');
    }

    // Listen for terminal input
    term.onData((data) => {
      if (socketRef.current && socketRef.current.connected) {
        if (mode === 'online') {
          socketRef.current.emit('cli-input', { token, data });
        } else {
          socketRef.current.emit('cli-input', data);
        }
      }
    });

    // Connect to Socket.IO server
    const socketConfig = { path: '/ws', transports: ['websocket'] };
    const socket = mode === 'online' ? io(wsUrl, socketConfig) : io(socketConfig);
    socketRef.current = socket;

    // Socket event handlers
    const handleConnect = () => {
      if (mode === 'online') {
        socket.emit('register', { type: 'browser', token });
      } else {
        setIsConnected(true);
        term.writeln('\x1b[1;32m✓ Connected to server\x1b[0m');
        term.writeln('\x1b[90mStarting Claude CLI...\x1b[0m\n');
      }
    };

    const handleRegistered = () => {
      setIsConnected(true);
      term.writeln('\x1b[1;32m✓ Connected to server\x1b[0m');
      term.writeln('\x1b[90mWaiting for CLI session...\x1b[0m\n');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      term.writeln('\n\x1b[1;31m✗ Disconnected\x1b[0m');
    };

    const handleCliDisconnected = () => {
      term.writeln('\n\x1b[1;33m✗ CLI session ended\x1b[0m');
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
        saveHistory(data.data);
      }
    };

    // Register socket event listeners
    socket.on('connect', handleConnect);
    socket.on('registered', handleRegistered);
    socket.on('disconnect', handleDisconnect);
    socket.on('cli-disconnected', handleCliDisconnected);
    socket.on('connect_error', handleConnectError);
    socket.on('error', handleError);
    socket.on('cli-output', handleCliOutput);

    // Use ResizeObserver for terminal resize handling
    const resizeObserver = new ResizeObserver(() => {
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
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      socket.off('connect', handleConnect);
      socket.off('registered', handleRegistered);
      socket.off('disconnect', handleDisconnect);
      socket.off('cli-disconnected', handleCliDisconnected);
      socket.off('connect_error', handleConnectError);
      socket.off('error', handleError);
      socket.off('cli-output', handleCliOutput);
      socket.disconnect();

      term.dispose();
    };
  }, [mode, token, wsUrl]);

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      clearHistory();
    }
  };

  return (
    <div className="terminal-app-container">
      <div className="terminal-app-header">
        <div className="terminal-header-left">
          <h1 className="terminal-app-title">Claude CLI Terminal</h1>
          <div className="terminal-connection-status">
            <div className={`terminal-status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="terminal-header-buttons">
          <button onClick={clearTerminal} className="terminal-header-button">
            Clear Terminal
          </button>
        </div>
      </div>
      <div ref={terminalRef} className="terminal-container" />
    </div>
  );
}

export default TerminalComponent;
