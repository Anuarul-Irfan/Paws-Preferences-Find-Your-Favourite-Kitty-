import { Cat, FilterConfig } from '../types/cat'
import { API_BASE_URL, MAX_CATS, MAX_ATTEMPTS, INVALID_TAG_PATTERNS } from '../utils/constants'

export const validateTag = (tag: string): boolean => {
  // Clean the tag first
  const cleanTag = tag.trim()
  
  return !INVALID_TAG_PATTERNS.some(pattern => pattern.test(cleanTag)) && 
         cleanTag.length > 0 && 
         cleanTag.length <= 50 &&
         // Additional check for tags that might cause API issues
         !cleanTag.includes('?') &&
         !cleanTag.includes('#') &&
         !cleanTag.includes('&') &&
         !cleanTag.includes('=') &&
         !cleanTag.includes('+')
}

export const fetchTags = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tags`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const tags = await response.json()
    return tags.filter(validateTag)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
}

export const fetchCatWithTag = async (tag: string): Promise<Cat | null> => {
  try {
    // URL encode the tag to handle special characters
    const encodedTag = encodeURIComponent(tag)
    const response = await fetch(`${API_BASE_URL}/cat/${encodedTag}?json=true`)
    
    if (!response.ok) {
      // Only log 404s in development, not in production
      if (process.env.NODE_ENV === 'development' && response.status !== 404) {
        console.warn(`HTTP error for tag ${tag}: ${response.status}`)
      }
      return null
    }
    
    const catData = await response.json()
    
    if (catData && catData.id && catData.tags && Array.isArray(catData.tags) && catData.tags.length > 0) {
      return {
        id: catData.id,
        url: `${API_BASE_URL}/cat/${catData.id}`,
        tags: catData.tags,
        mimetype: catData.mimetype,
        createdAt: catData.createdAt
      }
    }
    return null
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to fetch cat for tag ${tag}:`, error)
    }
    return null
  }
}

export const fetchCatWithFilter = async (config: FilterConfig): Promise<Cat | null> => {
  try {
    const params = new URLSearchParams()
    
    if (config.filter) params.append('filter', config.filter)
    if (config.type) params.append('type', config.type)
    if ('width' in config && config.width) params.append('width', config.width.toString())
    if ('height' in config && config.height) params.append('height', config.height.toString())
    if ('brightness' in config && config.brightness) params.append('brightness', config.brightness.toString())
    if ('saturation' in config && config.saturation) params.append('saturation', config.saturation.toString())
    if ('hue' in config && config.hue) params.append('hue', config.hue.toString())
    if ('lightness' in config && config.lightness) params.append('lightness', config.lightness.toString())
    params.append('json', 'true')
    
    const response = await fetch(`${API_BASE_URL}/cat?${params.toString()}`)
    
    if (!response.ok) {
      // Only log non-404 errors in development
      if (process.env.NODE_ENV === 'development' && response.status !== 404) {
        console.warn(`HTTP error for filter config: ${response.status}`)
      }
      return null
    }
    
    const catData = await response.json()
    
    if (catData && catData.id && catData.tags && Array.isArray(catData.tags) && catData.tags.length > 0) {
      return {
        id: catData.id,
        url: `${API_BASE_URL}/cat/${catData.id}`,
        tags: catData.tags,
        mimetype: catData.mimetype,
        createdAt: catData.createdAt
      }
    }
    return null
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to fetch cat with filter:`, error)
    }
    return null
  }
}

export const fetchCats = async (
  usedCatIds: Set<string>,
  markCatAsUsed: (id: string) => void
): Promise<Cat[]> => {
  const validTags = await fetchTags()
  if (validTags.length === 0) {
    throw new Error('No valid tags available')
  }

  const cats: Cat[] = []
  const tagsToUse = validTags.slice(0, 20)
  
  // Fetch cats with specific tags (aim for 5)
  for (let i = 0; i < Math.min(tagsToUse.length, 5); i++) {
    if (cats.length >= MAX_CATS) break
    
    const cat = await fetchCatWithTag(tagsToUse[i])
    if (cat && !usedCatIds.has(cat.id)) {
      cats.push(cat)
      markCatAsUsed(cat.id)
    }
  }
  
  // Add some random cats with different filters for variety
  const filterConfigs: FilterConfig[] = [
    { filter: 'mono', tags: ['monochrome'] },
    { filter: 'negate', tags: ['negated'] },
    { type: 'square', tags: ['square'] },
    { type: 'medium', tags: ['medium'] },
    { filter: 'custom', brightness: 1.2, tags: ['bright'] }
  ]
  
  // Fetch cats with different filters (aim for 5, or fewer if already have enough from tags)
  for (let i = 0; i < filterConfigs.length && cats.length < MAX_CATS; i++) {
    const cat = await fetchCatWithFilter(filterConfigs[i])
    if (cat && !usedCatIds.has(cat.id)) {
      cats.push(cat)
      markCatAsUsed(cat.id)
    }
  }
  
  // Fill remaining slots with random cats until we have exactly MAX_CATS
  let attempts = 0
  while (cats.length < MAX_CATS && attempts < MAX_ATTEMPTS) {
    attempts++
    const randomIndex = Math.floor(Math.random() * validTags.length)
    const randomTag = validTags[randomIndex]
    
    const cat = await fetchCatWithTag(randomTag)
    if (cat && !usedCatIds.has(cat.id)) {
      cats.push(cat)
      markCatAsUsed(cat.id)
    }
  }
  
  if (cats.length === 0) {
    throw new Error('Failed to fetch any cats')
  }
  
  return cats
}
