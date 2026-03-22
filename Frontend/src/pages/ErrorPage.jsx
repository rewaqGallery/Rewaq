import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/ErrorPage.css";


function ErrorPage({ code = 404, title, message, showHome = true, onRetry }) {
  const navigate = useNavigate();

  const defaults = {
    404: {
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
    },
    500: {
      title: "Server Error",
      message: "Something went wrong on our end. Please try again later.",
    },
    403: {
      title: "Access Denied",
      message: "You don't have permission to view this page.",
    },
    default: {
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again.",
    },
  };

  const content = defaults[code] ?? defaults.default;
  const displayTitle = title ?? content.title;
  const displayMessage = message ?? content.message;

  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-code">{code}</div>
        <h1 className="error-title">{displayTitle}</h1>
        <p className="error-message">{displayMessage}</p>
        <div className="error-actions">
          {onRetry && (
            <button
              type="button"
              className="error-btn error-btn-primary"
              onClick={() => onRetry()}
            >
              Try Again
            </button>
          )}
          {showHome && (
            <Link to="/" className="error-btn error-btn-secondary">
              Back to Home
            </Link>
          )}
          {!onRetry && showHome && (
            <button
              type="button"
              className="error-btn error-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
