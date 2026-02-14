export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#ff6b6b',
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '12px',
        }}
      >
        Invalid Access Token
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: '#a0a0a0',
          marginBottom: '30px',
          maxWidth: '500px',
        }}
      >
        The access token you provided is invalid or has expired. Please obtain a new token and try
        again.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0',
          textDecoration: 'none',
          borderRadius: '6px',
          border: '1px solid #3d3d3d',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
      >
        Go to Homepage
      </a>
    </div>
  );
}
