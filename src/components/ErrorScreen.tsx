import React from 'react'

interface ErrorScreenProps {
  error: string
  onRetry: () => void
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="error">
      <h1>Oops! Something went wrong</h1>
      <p>{error}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}
