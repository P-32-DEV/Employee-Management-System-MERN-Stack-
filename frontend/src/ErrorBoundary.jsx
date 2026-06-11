import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#f8fafc',
          fontFamily: 'Inter, sans-serif',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '400px', margin: 0 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(to right, #6366f1, #9333ea)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
