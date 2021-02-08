import React, { Component, ErrorInfo } from "react";

interface ErrorBoundaryProps {}
interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="error">
          <h1>Something went wrong :(</h1>
          <p className="error__details">
            {this.state.error && this.state.error.toString()}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
