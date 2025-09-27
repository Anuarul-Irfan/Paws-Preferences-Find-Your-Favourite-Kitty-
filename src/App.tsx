import { useState, useEffect, useRef } from 'react'
import './App.css'

// Define types for our cat data
interface Cat {
  id: string
  url: string
  width: number
  height: number
  tags: string[]
  createdAt: string
}

// Define types for our app state
interface AppState {
  cats: Cat[]
  currentIndex: number
  likedCats: Cat[]
  dislikedCats: Cat[]
  showSummary: boolean
  loading: boolean
}

// Define types for swipe gestures
interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
  direction: 'left' | 'right' | null
}

function App() {
  // State management using useState hook
  const [state, setState] = useState<AppState>({
    cats: [],
    currentIndex: 0,
    likedCats: [],
    dislikedCats: [],
    showSummary: false,
    loading: true
  })

  // Swipe gesture state
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    direction: null
  })

  // Reference to the cat card for animations
  const cardRef = useRef<HTMLDivElement>(null)

  // State for image loading
  const [imageLoading, setImageLoading] = useState<boolean>(true)
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  
  // State for tracking used cat IDs to prevent duplicates
  const [usedCatIds, setUsedCatIds] = useState<Set<string>>(new Set())
  
  // State for cat popup
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null)
  const [showPopup, setShowPopup] = useState<boolean>(false)

  // Load used cat IDs from localStorage on component mount
  useEffect(() => {
    const savedUsedIds = localStorage.getItem('usedCatIds')
    if (savedUsedIds) {
      try {
        const parsedIds = JSON.parse(savedUsedIds)
        setUsedCatIds(new Set(parsedIds))
      } catch (error) {
        console.warn('Failed to parse saved used cat IDs:', error)
      }
    }
  }, [])

  // Save used cat IDs to localStorage whenever it changes
  useEffect(() => {
    if (usedCatIds.size > 0) {
      localStorage.setItem('usedCatIds', JSON.stringify([...usedCatIds]))
    }
  }, [usedCatIds])

  // Function to check if a cat ID has been used
  const isCatUsed = (catId: string): boolean => {
    return usedCatIds.has(catId)
  }

  // Function to mark a cat as used
  const markCatAsUsed = (catId: string): void => {
    setUsedCatIds(prev => new Set([...prev, catId]))
  }

  // Function to show cat popup
  const showCatPopup = (cat: Cat): void => {
    setSelectedCat(cat)
    setShowPopup(true)
  }

  // Function to close cat popup
  const closeCatPopup = (): void => {
    setShowPopup(false)
    setSelectedCat(null)
  }

  // Function to preload images
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]))
        resolve()
      }
      img.onerror = reject
      img.src = url
    })
  }

  // Function to preload next few images
  const preloadNextImages = async (cats: Cat[], currentIndex: number) => {
    const nextImages = cats.slice(currentIndex + 1, currentIndex + 4) // Preload next 3 images
    const preloadPromises = nextImages.map(cat => preloadImage(cat.url))
    
    try {
      await Promise.allSettled(preloadPromises)
    } catch (error) {
      console.warn('Some images failed to preload:', error)
    }
  }

  // Function to fetch cats from Cataas API with real tags
  const fetchCats = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      // First, get available tags from the API
      const tagsResponse = await fetch('https://cataas.com/api/tags')
      const allTags = await tagsResponse.json()
      
      // Filter out invalid tags
      const validTags = allTags.filter((tag: string) => {
        return tag && 
          typeof tag === 'string' && 
          tag.trim().length > 1 && // At least 2 characters
          !tag.match(/^[.#@]$/) && // Not just special characters
          !tag.match(/^\d+$/) && // Not just numbers
          tag.trim() !== '' && // Not empty
          !tag.includes('(') && // No parentheses (often problematic)
          !tag.includes(')') &&
          !tag.includes('[') && // No brackets
          !tag.includes(']') &&
          !tag.includes('{') && // No braces
          !tag.includes('}') &&
          !tag.includes(' ') // No spaces (often problematic in URLs)
      })
      
      console.log('Filtered valid tags:', validTags.slice(0, 20))
      
      // Get cats with different tags and filters
      const cats: Cat[] = []
      const tagsToUse = validTags.slice(0, 15) // Use first 15 valid tags
      
      // Fetch cats with specific tags
      for (let i = 0; i < Math.min(tagsToUse.length, 5); i++) {
        try {
          const response = await fetch(`https://cataas.com/cat/${tagsToUse[i]}?json=true`)
          
          if (!response.ok) {
            console.warn(`HTTP error for tag ${tagsToUse[i]}: ${response.status}`)
            continue
          }
          
          const catData = await response.json()
          
          if (catData && catData.id && !isCatUsed(catData.id)) {
            // Check if cat has tags and they're not empty
            const hasValidTags = catData.tags && 
              Array.isArray(catData.tags) && 
              catData.tags.length > 0 && 
              catData.tags.some((tag: string) => tag && tag.trim().length > 0)
            
            if (hasValidTags) {
              cats.push({
                id: catData.id,
                url: `https://cataas.com/cat/${catData.id}`,
                width: 400,
                height: 400,
                tags: catData.tags,
                createdAt: catData.createdAt || new Date().toISOString()
              })
              markCatAsUsed(catData.id)
            }
          }
        } catch (tagError) {
          console.warn(`Failed to fetch cat for tag ${tagsToUse[i]}:`, tagError)
        }
      }
      
      // Add some random cats with different filters for variety
      const filterConfigs = [
        { filter: 'mono', tags: ['monochrome'] },
        { filter: 'negate', tags: ['negated'] },
        { type: 'square', tags: ['square'] },
        { type: 'medium', tags: ['medium'] },
        { filter: 'custom', brightness: 1.2, tags: ['bright'] }
      ]
      
      for (let i = 0; i < filterConfigs.length && cats.length < 10; i++) {
        const config = filterConfigs[i]
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
        
        try {
          const response = await fetch(`https://cataas.com/cat?${params.toString()}`)
          
          if (!response.ok) {
            console.warn(`HTTP error for filter ${JSON.stringify(config)}: ${response.status}`)
            continue
          }
          
          const catData = await response.json()
          
          if (catData && catData.id && !isCatUsed(catData.id)) {
            // Check if cat has tags and they're not empty
            const hasValidTags = catData.tags && 
              Array.isArray(catData.tags) && 
              catData.tags.length > 0 && 
              catData.tags.some((tag: string) => tag && tag.trim().length > 0)
            
            if (hasValidTags) {
              cats.push({
                id: catData.id,
                url: `https://cataas.com/cat/${catData.id}`,
                width: 400,
                height: 400,
                tags: catData.tags,
                createdAt: catData.createdAt || new Date().toISOString()
              })
              markCatAsUsed(catData.id)
            }
          }
        } catch (filterError) {
          console.warn(`Failed to fetch cat with filter ${JSON.stringify(config)}:`, filterError)
        }
      }
      
      // If we still don't have enough cats, add some random ones
      let attempts = 0
      const maxAttempts = 50 // Prevent infinite loop
      
      while (cats.length < 10 && attempts < maxAttempts) {
        attempts++
        const randomIndex = Math.floor(Math.random() * validTags.length)
        const randomTag = validTags[randomIndex]
        
        try {
          const response = await fetch(`https://cataas.com/cat/${randomTag}?json=true`)
          
          if (!response.ok) {
            console.warn(`HTTP error for random tag ${randomTag}: ${response.status}`)
            continue
          }
          
          const catData = await response.json()
          
          if (catData && catData.id && !isCatUsed(catData.id)) {
            // Check if cat has tags and they're not empty
            const hasValidTags = catData.tags && 
              Array.isArray(catData.tags) && 
              catData.tags.length > 0 && 
              catData.tags.some((tag: string) => tag && tag.trim().length > 0)
            
            if (hasValidTags) {
              cats.push({
                id: catData.id,
                url: `https://cataas.com/cat/${catData.id}`,
        width: 400,
        height: 400,
                tags: catData.tags,
                createdAt: catData.createdAt || new Date().toISOString()
              })
              markCatAsUsed(catData.id)
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch random cat with tag ${randomTag}:`, error)
        }
      }
      
      console.log('Fetched cats with real API data:', cats)
      setState(prev => ({ 
        ...prev, 
        cats, 
        loading: false 
      }))
      
      // Preload the first few images
      if (cats.length > 0) {
        preloadNextImages(cats, -1)
      }
    } catch (error) {
      console.error('Error fetching cats:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Load cats when component mounts
  useEffect(() => {
    fetchCats()
  }, [])

  // Preload images when current index changes
  useEffect(() => {
    if (state.cats.length > 0) {
      preloadNextImages(state.cats, state.currentIndex)
    }
  }, [state.currentIndex, state.cats])

  // Handle image loading state
  useEffect(() => {
    if (state.cats.length > 0 && state.currentIndex < state.cats.length) {
      const currentCat = state.cats[state.currentIndex]
      if (preloadedImages.has(currentCat.url)) {
        setImageLoading(false)
      } else {
        setImageLoading(true)
      }
    }
  }, [state.currentIndex, state.cats, preloadedImages])

  // Function to handle like action
  const handleLike = () => {
    const currentCat = state.cats[state.currentIndex]
    if (currentCat) {
      // Add animation for like action
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(100vw) rotate(30deg)'
        cardRef.current.style.opacity = '0'
      }
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          likedCats: [...prev.likedCats, currentCat],
          currentIndex: prev.currentIndex + 1
        }))
        
        // Reset card position
        if (cardRef.current) {
          cardRef.current.style.transform = ''
          cardRef.current.style.opacity = ''
        }
      }, 300)
    }
  }

  // Function to handle dislike action
  const handleDislike = () => {
    const currentCat = state.cats[state.currentIndex]
    if (currentCat) {
    // Add animation for dislike action
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100vw) rotate(-30deg)'
      cardRef.current.style.opacity = '0'
    }
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
          dislikedCats: [...prev.dislikedCats, currentCat],
        currentIndex: prev.currentIndex + 1
      }))
      
      // Reset card position
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = ''
      }
    }, 300)
    }
  }

  // Check if we've gone through all cats
  useEffect(() => {
    if (state.currentIndex >= state.cats.length && state.cats.length > 0) {
      setState(prev => ({ ...prev, showSummary: true }))
    }
  }, [state.currentIndex, state.cats.length])

  // Function to restart the app
  const restart = () => {
    // Clear used cat IDs for a fresh start
    setUsedCatIds(new Set())
    localStorage.removeItem('usedCatIds')
    
    setState({
      cats: [],
      currentIndex: 0,
      likedCats: [],
      dislikedCats: [],
      showSummary: false,
      loading: true
    })
    fetchCats()
  }

  // Touch/Mouse event handlers for swipe gestures
  const handleStart = (clientX: number, clientY: number) => {
    setSwipeState({
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isDragging: true,
      direction: null
    })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!swipeState.isDragging) return

    const deltaX = clientX - swipeState.startX
    const deltaY = clientY - swipeState.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only consider it a horizontal swipe if horizontal movement is greater than vertical
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      const direction = deltaX > 0 ? 'right' : 'left'
      setSwipeState(prev => ({
        ...prev,
        currentX: clientX,
        currentY: clientY,
        direction
      }))

      // Update card position for visual feedback
      if (cardRef.current) {
        const rotation = deltaX * 0.1
        const translateX = deltaX * 0.5
        cardRef.current.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`
        cardRef.current.style.opacity = `${1 - Math.abs(deltaX) / 300}`
      }
    }
  }

  const handleEnd = () => {
    if (!swipeState.isDragging) return

    const deltaX = swipeState.currentX - swipeState.startX
    const absDeltaX = Math.abs(deltaX)

    // If swipe distance is significant, trigger the action
    if (absDeltaX > 100) {
      if (deltaX > 0) {
        handleLike()
      } else {
        handleDislike()
      }
    } else {
      // If swipe distance is not significant, just reset the card position
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = ''
      }
    }

    // Reset swipe state
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isDragging: false,
      direction: null
    })
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Mouse event handlers (for desktop testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Add global mouse events for smooth dragging
  useEffect(() => {
    if (swipeState.isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
      const handleGlobalMouseUp = () => handleEnd()

      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [swipeState.isDragging])

  // Loading state
  if (state.loading) {
    return (
      <div className="app">
        <div className="loading">
          <h1>🐱 Finding adorable cats for you...</h1>
          <p>Loading different cat styles and filters...</p>
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  // Summary state
  if (state.showSummary) {
    // Calculate comprehensive statistics
    const totalCats = state.cats.length
    const likedCount = state.likedCats.length
    const dislikedCount = state.dislikedCats.length
    const likePercentage = Math.round((likedCount / totalCats) * 100)
    const dislikePercentage = Math.round((dislikedCount / totalCats) * 100)
    const completionRate = Math.round(((likedCount + dislikedCount) / totalCats) * 100)
    
    // Tag analysis
    const allLikedTags = state.likedCats.flatMap(cat => cat.tags)
    const allDislikedTags = state.dislikedCats.flatMap(cat => cat.tags)
    const uniqueLikedTags = [...new Set(allLikedTags)]
    const uniqueDislikedTags = [...new Set(allDislikedTags)]
    const mostLikedTag = allLikedTags.length > 0 
      ? allLikedTags.reduce((a, b, _, arr) => 
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      : null
    const mostDislikedTag = allDislikedTags.length > 0 
      ? allDislikedTags.reduce((a, b, _, arr) => 
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      : null

    return (
      <div className="app">
        <div className="summary">
          <h1>🎉 Your Cat Preferences!</h1>
          <p>You've completed {completionRate}% of your cat journey!</p>
          
          {/* Main Statistics */}
          <div className="stats">
            <div className="stat-item liked-stat">
              <span className="stat-number">{likedCount}</span>
              <span className="stat-label">Liked Cats</span>
              <span className="stat-percentage">{likePercentage}%</span>
            </div>
            <div className="stat-item disliked-stat">
              <span className="stat-number">{dislikedCount}</span>
              <span className="stat-label">Disliked Cats</span>
              <span className="stat-percentage">{dislikePercentage}%</span>
            </div>
            <div className="stat-item total-stat">
              <span className="stat-number">{totalCats}</span>
              <span className="stat-label">Total Cats</span>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">{uniqueLikedTags.length}</span>
              <span className="stat-label">Liked Tags</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{uniqueDislikedTags.length}</span>
              <span className="stat-label">Disliked Tags</span>
            </div>
          </div>

          {/* Tag Preferences */}
          {(mostLikedTag || mostDislikedTag) && (
            <div className="stats">
              {mostLikedTag && (
              <div className="stat-item">
                  <span className="stat-number">#{mostLikedTag}</span>
                <span className="stat-label">Favorite Tag</span>
              </div>
            )}
              {mostDislikedTag && (
                <div className="stat-item">
                  <span className="stat-number">#{mostDislikedTag}</span>
                  <span className="stat-label">Least Favorite Tag</span>
              </div>
            )}
          </div>
          )}
          
          <div className="liked-cats">
            <h2>Your Favorites (Click to view details):</h2>
            <div className="cat-grid">
              {state.likedCats.map((cat) => (
                <div 
                  key={cat.id} 
                  className="liked-cat-container"
                  onClick={() => showCatPopup(cat)}
                >
                  <img 
                    src={cat.url} 
                    alt="Liked cat" 
                    className="liked-cat-image"
                  />
                  {cat.url.includes('.gif') && (
                    <div className="liked-gif-indicator">🎬</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={restart} className="restart-btn">
            Find More Cats! 🐱
          </button>
        </div>
        
        {/* Cat Tags Popup */}
        {showPopup && selectedCat && (
          <div className="popup-overlay" onClick={closeCatPopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="popup-close" onClick={closeCatPopup}>×</button>
              <div className="popup-image-container">
                <img 
                  src={selectedCat.url} 
                  alt="Cat" 
                  className="popup-image"
                />
                {selectedCat.url.includes('.gif') && (
                  <div className="popup-gif-indicator">🎬 GIF</div>
                )}
              </div>
              <div className="popup-info">
                <h3>Cat Tags</h3>
                <div className="popup-tags">
                  {selectedCat.tags.map((tag, index) => (
                    <span key={index} className="popup-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main swiping interface
  const currentCat = state.cats[state.currentIndex]
  
  if (!currentCat) {
    return (
      <div className="app">
        <div className="error">
          <h1>Oops! No cats found</h1>
          <button onClick={fetchCats} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🐱 Paws Preferences</h1>
        <p>Swipe right to like ❤️, left to dislike ❌</p>
        <p className="instructions">Or use the buttons below</p>
        <div className="progress">
          {state.currentIndex + 1} / {state.cats.length}
        </div>
      </div>
      
      <div className="swipe-container">
        <div 
          ref={cardRef}
          className="cat-card"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {imageLoading && (
            <div className="image-loading">
              <div className="spinner"></div>
              <p>Loading adorable cat...</p>
            </div>
          )}
          <img 
            src={currentCat.url} 
            alt="Cat" 
            className="cat-image"
            style={{ display: imageLoading ? 'none' : 'block' }}
            onLoad={() => {
              console.log('Image loaded successfully:', currentCat.url)
              setImageLoading(false)
            }}
            onError={(e) => {
              console.error('Image failed to load:', currentCat.url)
              setImageLoading(false)
              // Set a fallback image
              e.currentTarget.src = 'https://placehold.co/400x400/ff6b6b/ffffff?text=Cat+Not+Found'
            }}
          />
          
          {/* Cat tags display */}
          {currentCat.tags && currentCat.tags.length > 0 && (
            <div className="cat-tags">
              {currentCat.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="cat-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* GIF indicator */}
          {currentCat.url.includes('.gif') && (
            <div className="gif-indicator">
              🎬 GIF
            </div>
          )}
          
          <div className="cat-actions">
            <button 
              onClick={handleDislike} 
              className="dislike-btn"
              aria-label="Dislike"
            >
              ❌
            </button>
            <button 
              onClick={handleLike} 
              className="like-btn"
              aria-label="Like"
            >
              ❤️
            </button>
          </div>
          
          {/* Swipe direction indicators */}
          {swipeState.isDragging && swipeState.direction && (
            <div className={`swipe-indicator ${swipeState.direction}`}>
              {swipeState.direction === 'right' ? '❤️ LIKE' : '❌ DISLIKE'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App