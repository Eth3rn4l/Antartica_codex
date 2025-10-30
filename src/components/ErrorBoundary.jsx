import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log to a remote service here
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#b91c1c', background: '#fff1f2' }}>
          <h2>Ha ocurrido un error en la aplicación</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}</p>
          {this.state.info && <details style={{ whiteSpace: 'pre-wrap' }}>{this.state.info.componentStack}</details>}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
