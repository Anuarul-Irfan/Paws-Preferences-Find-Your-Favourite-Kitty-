import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading adorable cats..." 
}) => {
  return (
    <div className="loading">
      <h1>{message}</h1>
      <div className="spinner"></div>
    </div>
  )
}
