import React from 'react'
import { Statistics } from '../utils/statistics'

interface SummaryStatsProps {
  stats: Statistics
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  return (
    <div className="stats">
      <div className="stat-item liked-stat">
        <div className="stat-number">{stats.likedCount}</div>
        <div className="stat-label">Liked Cats</div>
        <div className="stat-percentage">{stats.likePercentage}%</div>
      </div>
      
      <div className="stat-item disliked-stat">
        <div className="stat-number">{stats.dislikedCount}</div>
        <div className="stat-label">Disliked Cats</div>
        <div className="stat-percentage">{stats.dislikePercentage}%</div>
      </div>
      
      <div className="stat-item total-stat">
        <div className="stat-number">{stats.totalCats}</div>
        <div className="stat-label">Total Cats</div>
        <div className="stat-percentage">{stats.completionRate}% complete</div>
      </div>
    </div>
  )
}
