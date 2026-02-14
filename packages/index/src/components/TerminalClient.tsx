'use client';

export default function TerminalClient() {
  return (
    <iframe
      src="/terminal/index.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
      title="Web Terminal"
    />
  );
}
