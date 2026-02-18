'use client';

import Terminal from '@webccc/ui-terminal';
import '@webccc/ui-terminal/dist/index.css';

export default function TerminalClient({ token }: { token: string }) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Terminal mode="online" token={token} wsUrl="https://ws.webcc.dev" />
    </div>
  );
}
