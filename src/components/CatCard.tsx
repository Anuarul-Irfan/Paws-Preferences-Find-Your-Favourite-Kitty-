import React from 'react'
import { Cat } from '../types/cat'

interface CatCardProps {
  cat: Cat
  imageLoading: boolean
  onImageLoad: () => void
  onImageError: () => void
  onLike: () => void
  onDislike: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  dragOffset: { x: number; y: number }
  isSwipeActive: boolean
  swipeDirection: 'left' | 'right' | null
  isAnimating?: boolean
  animationDirection?: 'left' | 'right' | null
  showCompletionFeedback?: boolean
  completionType?: 'like' | 'dislike' | null
}

export const CatCard: React.FC<CatCardProps> = ({
  cat,
  imageLoading,
  onImageLoad,
  onImageError,
  onLike,
  onDislike,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  dragOffset,
  isSwipeActive,
  swipeDirection,
  isAnimating = false,
  animationDirection = null,
  showCompletionFeedback = false,
  completionType = null
}) => {
      const cardStyle: React.CSSProperties = {
        transform: isSwipeActive
          ? `translate(${dragOffset.x}px, ${dragOffset.y * 0.1}px) rotate(${dragOffset.x * 0.1}deg)`
          : isAnimating && animationDirection
          ? `translate(${animationDirection === 'right' ? '100vw' : '-100vw'}, 0px) rotate(${animationDirection === 'right' ? '30deg' : '-30deg'})`
          : 'translate(0px, 0px) rotate(0deg)',
        transition: isSwipeActive ? 'none' : isAnimating ? 'transform 0.5s ease-in' : 'transform 0.3s ease-out',
        opacity: isAnimating ? 0.7 : 1,
        pointerEvents: imageLoading ? 'none' : 'auto'
      }

  return (
    <div className="swipe-container">
      <div 
        className="cat-card"
        style={cardStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {imageLoading && (
          <div className="image-loading">
            <div className="spinner"></div>
            <p>Loading cat...</p>
          </div>
        )}
        
        <img
          src={cat.url}
          alt={`Cat with tags: ${cat.tags.join(', ')}`}
          onLoad={onImageLoad}
          onError={onImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />

        {/* Swipe feedback overlays */}
        {isSwipeActive && swipeDirection === 'right' && (
          <div className="swipe-overlay like-overlay">
            <div className="swipe-text">LIKE</div>
            <div className="swipe-icon">❤️</div>
          </div>
        )}
        
        {isSwipeActive && swipeDirection === 'left' && (
          <div className="swipe-overlay dislike-overlay">
            <div className="swipe-text">NOPE</div>
            <div className="swipe-icon">❌</div>
          </div>
        )}

        {/* Animation feedback overlays */}
        {isAnimating && animationDirection === 'right' && (
          <div className="swipe-overlay like-overlay">
            <div className="swipe-text">LIKE</div>
            <div className="swipe-icon">❤️</div>
          </div>
        )}
        
        {isAnimating && animationDirection === 'left' && (
          <div className="swipe-overlay dislike-overlay">
            <div className="swipe-text">NOPE</div>
            <div className="swipe-icon">❌</div>
          </div>
        )}

        {/* Completion feedback overlays */}
        {showCompletionFeedback && completionType === 'like' && (
          <div className="completion-overlay like-completion">
            <div className="completion-icon">❤️</div>
            <div className="completion-text">LIKED!</div>
          </div>
        )}
        
        {showCompletionFeedback && completionType === 'dislike' && (
          <div className="completion-overlay dislike-completion">
            <div className="completion-icon">❌</div>
            <div className="completion-text">DISLIKED!</div>
          </div>
        )}
        
        <div className="cat-tags">
          {cat.tags.map((tag, index) => (
            <span key={index} className="cat-tag">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="cat-actions">
          <button className="dislike-btn" onClick={onDislike}>
            ❌
          </button>
          <button className="like-btn" onClick={onLike}>
            ❤️
          </button>
        </div>
      </div>
    </div>
  )
}
