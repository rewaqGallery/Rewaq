import React from "react";
import "./style/ErrorDisplay.css";

/**
 * Inline error message with optional retry and dismiss.
 * Use in Cart, Favourites, ProductDetails, Products when API/state error exists.
 * @param {Object} props
 * @param {string} props.message - Error message to show
 * @param {Function} [props.onRetry] - Called when user clicks Retry
 * @param {Function} [props.onDismiss] - Called when user clicks Dismiss (e.g. clear error in Redux)
 * @param {string} [props.className] - Extra class for wrapper
 */
function ErrorDisplay({ message, onRetry, onDismiss, className = "" }) {
  if (!message) return null;

  return (
    <div className={`error-display ${className}`} role="alert">
      <span className="error-display-icon" aria-hidden>!</span>
      <p className="error-display-message">{message}</p>
      <div className="error-display-actions">
        {onRetry && (
          <button
            type="button"
            className="error-display-btn error-display-retry"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="error-display-btn error-display-dismiss"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
