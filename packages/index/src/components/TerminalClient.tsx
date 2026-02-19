'use client';

import Terminal from '@webccc/ui-terminal';
import '@webccc/ui-terminal/dist/index.css';

export default function TerminalClient({ token }: { token: string }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ minWidth: '1280px', width: '100%', height: '100%' }}>
        <Terminal mode="online" token={token} wsUrl="https://ws.webcc.dev" />
      </div>
    </div>
  );
}
