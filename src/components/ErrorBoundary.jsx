import React from "react";
import ErrorPage from "../pages/ErrorPage";

/**
 * Catches React render errors in the tree and shows ErrorPage.
 * Wrap the app or route tree in App.jsx.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code={500}
          title="Something Went Wrong"
          message="An unexpected error occurred. Please try again or go back to home."
          onRetry={this.handleRetry}
          showHome
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
