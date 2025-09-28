import React from 'react'
import { Cat } from '../types/cat'

interface CatGridProps {
  cats: Cat[]
  onCatClick: (cat: Cat) => void
}

export const CatGrid: React.FC<CatGridProps> = ({ cats, onCatClick }) => {
  return (
    <div className="cat-grid">
      {cats.map((cat) => (
        <div 
          key={cat.id} 
          className="liked-cat-card"
          onClick={() => onCatClick(cat)}
        >
          <div className="liked-cat-image-container">
            <img 
              src={cat.url} 
              alt={`Cat with tags: ${cat.tags.join(', ')}`}
              className="liked-cat-image"
            />
            {cat.url.includes('.gif') && (
              <div className="liked-gif-indicator">GIF</div>
            )}
          </div>
          <div className="liked-cat-info">
            <div className="liked-cat-tags">
              {cat.tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="liked-cat-tag">
                  {tag}
                </span>
              ))}
              {cat.tags.length > 4 && (
                <span className="liked-cat-tag more-tags">
                  +{cat.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
