import React from 'react';

interface State {
 hasError: boolean;
 error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
 state: State = { hasError: false, error: null };

 static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
  }

 componentDidCatch(error: Error, info: React.ErrorInfo) {
 console.error('[ErrorBoundary] React render crash:', error, info.componentStack);
  }

 render() {
 if (this.state.hasError) {
 return (
        <div style={{ padding: 32, color: '#f2643e', fontFamily: 'monospace', background: '#0a0e17', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>⚠️ Application Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#e2a33a', fontSize: 14 }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#8b96aa', fontSize: 12, marginTop: 16 }}>
            {this.state.error?.stack}
          </pre>
          <button
 onClick={() => this.setState({ hasError: false, error: null })}
 style={{ marginTop: 24, padding: '8px 16px', background: '#007afc', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
 Retry
          </button>
        </div>
      );
    }
 return this.props.children;
  }
}
