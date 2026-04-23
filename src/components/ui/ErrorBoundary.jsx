import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this for production logging integration.
    console.error('Unhandled app error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-md-background px-4">
          <div className="w-full max-w-lg rounded-[24px] bg-md-surface-container p-8 text-left shadow-md-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-md-tertiary text-md-on-tertiary">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-subtitle font-medium tracking-tight text-md-on-background">Something went wrong</h1>
            <p className="mb-6 text-body leading-relaxed text-md-on-background/75">
              The page encountered an unexpected error. Reload to continue.
            </p>
            <Button onClick={this.handleReload}>Reload App</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}