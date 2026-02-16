import React from 'react'
import './LoadingSkeleton.css'

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__image" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__price" />
        <div className="skeleton skeleton-card__price-small" />
        <div className="skeleton-card__badges">
          <div className="skeleton skeleton-card__badge" />
          <div className="skeleton skeleton-card__badge" />
          <div className="skeleton skeleton-card__badge" />
        </div>
        <div className="skeleton-card__footer">
          <div className="skeleton skeleton-card__checkbox" />
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
