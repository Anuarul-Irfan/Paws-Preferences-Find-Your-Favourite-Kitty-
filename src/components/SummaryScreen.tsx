import React from 'react'
import { Cat } from '../types/cat'
import { Statistics } from '../utils/statistics'
import { CatGrid } from './CatGrid'
import { SummaryStats } from './SummaryStats'

interface SummaryScreenProps {
  likedCats: Cat[]
  stats: Statistics
  onCatClick: (cat: Cat) => void
  onRestart: () => void
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  likedCats,
  stats,
  onCatClick,
  onRestart
}) => {
  // Calculate most favourite tag
  const getMostFavouriteTag = () => {
    const tagCounts: { [key: string]: number } = {}
    
    likedCats.forEach(cat => {
      cat.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    const sortedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
    
    return sortedTags.length > 0 ? sortedTags[0] : null
  }

  const mostFavouriteTag = getMostFavouriteTag()

  return (
    <div className="summary">
      <h1>Your Cat Preferences Summary</h1>
      <p>Here's what we learned about your cat preferences!</p>
      
      <SummaryStats stats={stats} />
      
      {mostFavouriteTag && (
        <div className="favourite-tag-section">
          <h2>Your Most Favourite Tag</h2>
          <div className="favourite-tag-card">
            <div className="favourite-tag-name">{mostFavouriteTag[0]}</div>
            <div className="favourite-tag-count">Appeared in {mostFavouriteTag[1]} cat{mostFavouriteTag[1] > 1 ? 's' : ''}</div>
          </div>
        </div>
      )}
      
      {likedCats.length > 0 && (
        <div className="liked-cats">
          <h2>Your Liked Cats ({likedCats.length})</h2>
          <CatGrid cats={likedCats} onCatClick={onCatClick} />
        </div>
      )}
      
      <button className="restart-btn" onClick={onRestart}>
        Start Over
      </button>
    </div>
  )
}
