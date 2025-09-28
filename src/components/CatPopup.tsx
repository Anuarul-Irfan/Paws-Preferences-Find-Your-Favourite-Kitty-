import React from 'react'
import { Cat } from '../types/cat'

interface CatPopupProps {
  cat: Cat | null
  isOpen: boolean
  onClose: () => void
}

export const CatPopup: React.FC<CatPopupProps> = ({ cat, isOpen, onClose }) => {
  if (!isOpen || !cat) return null

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ×
        </button>
        
        <div className="popup-image-container">
          <img 
            src={cat.url} 
            alt={`Cat with tags: ${cat.tags.join(', ')}`}
            className="popup-image"
          />
          {cat.url.includes('.gif') && (
            <div className="popup-gif-indicator">GIF</div>
          )}
        </div>
        
        <div className="popup-info">
          <h3>Cat Tags</h3>
          <div className="popup-tags">
            {cat.tags.map((tag, index) => (
              <span key={index} className="popup-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
