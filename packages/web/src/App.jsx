import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

function App() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
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
    term.writeln('\x1b[1;36m欢迎使用 Claude CLI Terminal\x1b[0m');
    term.writeln('\x1b[90m正在连接到服务器...\x1b[0m\n');

    // 监听终端输入 - 直接发送所有按键到服务器
    term.onData((data) => {
      if (socketRef.current && socketRef.current.connected) {
        // 将所有按键直接发送到服务器，包括回车、箭头键等
        socketRef.current.emit('cli-input', data);
      }
    });

    // 连接到 Socket.IO 服务器
    const socket = io('http://localhost:4000');
    socketRef.current = socket;

    // 连接成功
    socket.on('connect', () => {
      setIsConnected(true);
      term.writeln('\x1b[1;32m✓ 已连接到服务器\x1b[0m');
      term.writeln('\x1b[90m正在启动 Claude CLI...\x1b[0m\n');
    });

    // 接收 CLI 输出
    socket.on('cli-output', (data) => {
      if (data.data) {
        term.write(data.data);
      }
    });

    // 断开连接
    socket.on('disconnect', () => {
      setIsConnected(false);
      term.writeln('\n\x1b[1;31m✗ 已断开连接\x1b[0m');
    });

    // 窗口大小调整
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.disconnect();
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
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        color: '#e8e8e8',
      }}
    >
      {/* 头部 */}
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#2d2d2d',
          borderBottom: '1px solid #3d3d3d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Claude CLI Terminal</h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#6bcf7f' : '#ff6b6b',
              }}
            ></div>
            <span>{isConnected ? '已连接' : '未连接'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={clearTerminal}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3d3d3d',
              color: '#e8e8e8',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#4d4d4d')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#3d3d3d')}
          >
            清空终端
          </button>
          <button
            onClick={restartCLI}
            disabled={!isConnected}
            style={{
              padding: '8px 16px',
              backgroundColor: isConnected ? '#4d4d4d' : '#3d3d3d',
              color: isConnected ? '#e8e8e8' : '#888',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (isConnected) e.target.style.backgroundColor = '#5d5d5d';
            }}
            onMouseLeave={(e) => {
              if (isConnected) e.target.style.backgroundColor = '#4d4d4d';
            }}
          >
            重启 CLI
          </button>
        </div>
      </div>

      {/* 终端区域 */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          padding: '10px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}

export default App;
