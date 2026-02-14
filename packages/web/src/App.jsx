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
    // 创建终端实例
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
      cols: 160, // 设置最大列数，适配 1400px 宽度
    });

    // 创建 fit addon
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // 打开终端
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 写入欢迎消息
    term.writeln('\x1b[1;36m欢迎使用 webcc.dev: web-claude-code\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[90m正在连接到服务器...\x1b[0m\n');

    // 监听终端输入 - 直接发送所有按键到服务器
    term.onData((data) => {
      if (socketRef.current && socketRef.current.connected) {
        // 将所有按键直接发送到服务器，包括回车、箭头键等
        socketRef.current.emit('cli-input', data);
      }
    });

    // 获取 WebSocket 配置（根据环境自动检测）
    const getWebSocketConfig = () => {
      const hostname = window.location.hostname;
      // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

      // 在线模式：检测是否在 webcc.dev 域名
      if (hostname === 'webcc.dev' || hostname === 'www.webcc.dev') {
        return {
          url: 'wss://ws.webcc.dev',
          path: '/ws',
        };
      }

      // 本地模式：localhost 或其他域名
      // 开发环境会通过 Vite proxy 代理到 4000 端口
      // 生产环境前后端同端口，直接连接
      return {
        url: undefined, // 使用相对路径，自动适配当前域名
        path: '/ws',
      };
    };

    const { url, path } = getWebSocketConfig();

    // 连接到 Socket.IO 服务器
    const socket = url ? io(url, { path }) : io({ path });
    socketRef.current = socket;

    // Socket 事件处理函数
    const handleConnect = () => {
      setIsConnected(true);
      term.writeln('\x1b[1;32m✓ 已连接到服务器\x1b[0m');
      term.writeln('\x1b[90m正在启动 Claude CLI...\x1b[0m\n');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      term.writeln('\n\x1b[1;31m✗ 已断开连接\x1b[0m');
    };

    const handleConnectError = (error) => {
      setIsConnected(false);
      term.writeln(`\x1b[1;31m✗ 连接失败: ${error.message}\x1b[0m`);
      term.writeln('\x1b[90m正在尝试重新连接...\x1b[0m\n');
    };

    const handleError = (error) => {
      term.writeln(`\x1b[1;31m✗ 错误: ${error.message || error}\x1b[0m\n`);
    };

    const handleCliOutput = (data) => {
      if (data.data) {
        term.write(data.data);
      }
    };

    // 注册 Socket 事件监听器
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('error', handleError);
    socket.on('cli-output', handleCliOutput);

    // 使用 ResizeObserver 改进终端大小调整
    const resizeObserver = new ResizeObserver(() => {
      // 使用 requestAnimationFrame 防止频繁调用
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
      resizeObserverRef.current = resizeObserver;
    }

    // 清理函数
    return () => {
      // 清理 ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      // 清理 Socket 事件监听器
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('error', handleError);
      socket.off('cli-output', handleCliOutput);
      socket.disconnect();

      // 清理终端
      term.dispose();
    };
  }, []);

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const restartCLI = () => {
    if (socketRef.current) {
      if (xtermRef.current) {
        xtermRef.current.writeln('\n\x1b[1;33m正在重启 CLI...\x1b[0m\n');
      }
      socketRef.current.emit('cli-restart');
    }
  };

  return (
    <div className="app-container">
      {/* Mac 风格窗口 */}
      <div className="terminal-window">
        {/* 头部 */}
        <div className="app-header">
          {/* Mac 三色按钮 */}
          <div className="window-controls">
            <div className="window-control close" title="关闭"></div>
            <div className="window-control minimize" title="最小化"></div>
            <div className="window-control maximize" title="最大化"></div>
          </div>

          <div className="header-left">
            <h1 className="app-title">webcc.dev: web-claude-code</h1>
            <div className="connection-status">
              <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
              <span>{isConnected ? '已连接' : '未连接'}</span>
            </div>
          </div>

          <div className="header-buttons">
            <button onClick={clearTerminal} className="header-button">
              清空终端
            </button>
            <button onClick={restartCLI} disabled={!isConnected} className="header-button restart">
              重启 CLI
            </button>
          </div>
        </div>

        {/* 终端区域 */}
        <div ref={terminalRef} className="terminal-container" />
      </div>
    </div>
  );
}

export default App;
