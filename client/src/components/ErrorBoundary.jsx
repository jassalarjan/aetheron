import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-800 font-mono">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 