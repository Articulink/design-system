'use client';

import { Component, forwardRef } from 'react';

/**
 * Articulink ErrorBoundary Component
 *
 * React error boundary for graceful error handling.
 *
 * Usage:
 *   <ErrorBoundary fallback={<ErrorFallback />}>
 *     <App />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary
 *     onError={(error, info) => logError(error, info)}
 *     onReset={() => resetState()}
 *   >
 *     <Component />
 *   </ErrorBoundary>
 */

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((props: ErrorFallbackProps) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset when resetKeys change
    if (this.state.hasError && prevProps.resetKeys !== this.props.resetKeys) {
      const keysChanged = this.props.resetKeys?.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      if (keysChanged) {
        this.resetError();
      }
    }
  }

  resetError = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback({ error: this.state.error, resetError: this.resetError });
      }

      if (fallback) {
        return fallback;
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * DefaultErrorFallback - Default error UI
 */
export interface DefaultErrorFallbackProps extends ErrorFallbackProps {
  title?: string;
  showError?: boolean;
}

export const DefaultErrorFallback = forwardRef<HTMLDivElement, DefaultErrorFallbackProps>(
  (
    {
      error,
      resetError,
      title = 'Something went wrong',
      showError = process.env.NODE_ENV === 'development',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-error-bg rounded-xl border border-error"
        role="alert"
      >
        <svg
          className="w-12 h-12 text-error mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-lg font-semibold text-error-text mb-2">{title}</h2>

        {showError && error && (
          <div className="mb-4 p-3 bg-white rounded-lg max-w-lg w-full">
            <p className="text-sm text-error font-mono break-all">{error.message}</p>
            {error.stack && (
              <pre className="mt-2 text-xs text-lagoon overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={resetError}
          className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
);

DefaultErrorFallback.displayName = 'DefaultErrorFallback';

/**
 * withErrorBoundary - HOC to wrap component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

/**
 * useErrorBoundary - Hook to programmatically throw errors to boundary
 */
export function useErrorBoundary() {
  const throwError = (error: Error) => {
    throw error;
  };

  return { throwError };
}

export default ErrorBoundary;
