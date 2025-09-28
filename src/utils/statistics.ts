import { Cat } from '../types/cat'

export interface Statistics {
  totalCats: number
  likedCount: number
  dislikedCount: number
  likePercentage: number
  dislikePercentage: number
  completionRate: number
  allLikedTags: string[]
  allDislikedTags: string[]
  uniqueLikedTags: string[]
  uniqueDislikedTags: string[]
  mostLikedTag: string
  mostDislikedTag: string
}

export const calculateStatistics = (
  cats: Cat[],
  likedCats: Cat[],
  dislikedCats: Cat[]
): Statistics => {
  const totalCats = cats.length
  const likedCount = likedCats.length
  const dislikedCount = dislikedCats.length
  const likePercentage = Math.round((likedCount / totalCats) * 100)
  const dislikePercentage = Math.round((dislikedCount / totalCats) * 100)
  const completionRate = Math.round(((likedCount + dislikedCount) / totalCats) * 100)
  
  // Tag analysis
  const allLikedTags = likedCats.flatMap(cat => cat.tags)
  const allDislikedTags = dislikedCats.flatMap(cat => cat.tags)
  const uniqueLikedTags = [...new Set(allLikedTags)]
  const uniqueDislikedTags = [...new Set(allDislikedTags)]
  
  // Find most common tags
  const likedTagCounts = allLikedTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const dislikedTagCounts = allDislikedTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostLikedTag = Object.keys(likedTagCounts).reduce((a, b) => 
    likedTagCounts[a] > likedTagCounts[b] ? a : b, 'None'
  )
  
  const mostDislikedTag = Object.keys(dislikedTagCounts).reduce((a, b) => 
    dislikedTagCounts[a] > dislikedTagCounts[b] ? a : b, 'None'
  )

  return {
    totalCats,
    likedCount,
    dislikedCount,
    likePercentage,
    dislikePercentage,
    completionRate,
    allLikedTags,
    allDislikedTags,
    uniqueLikedTags,
    uniqueDislikedTags,
    mostLikedTag,
    mostDislikedTag
  }
}
