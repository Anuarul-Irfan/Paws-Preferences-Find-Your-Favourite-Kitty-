import { useState, useEffect, useRef } from 'react'
import './App.css'

// Define types for our cat data
interface Cat {
  id: string
  url: string
  width: number
  height: number
}

// Define types for our app state
interface AppState {
  cats: Cat[]
  currentIndex: number
  likedCats: Cat[]
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

  // Function to fetch cats from Cataas API
  const fetchCats = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      // Fetch 10 cats from Cataas API
      const promises = Array.from({ length: 10 }, (_, i) => 
        fetch('https://cataas.com/cat?json=true')
          .then(response => response.json())
          .then(data => ({
            id: `${data._id}-${i}`,
            url: `https://cataas.com${data.url}`,
            width: data.width || 400,
            height: data.height || 400
          }))
      )
      
      const cats = await Promise.all(promises)
      setState(prev => ({ 
        ...prev, 
        cats, 
        loading: false 
      }))
    } catch (error) {
      console.error('Error fetching cats:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Load cats when component mounts
  useEffect(() => {
    fetchCats()
  }, [])

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
    // Add animation for dislike action
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100vw) rotate(-30deg)'
      cardRef.current.style.opacity = '0'
    }
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }))
      
      // Reset card position
      if (cardRef.current) {
        cardRef.current.style.transform = ''
        cardRef.current.style.opacity = ''
      }
    }, 300)
  }

  // Check if we've gone through all cats
  useEffect(() => {
    if (state.currentIndex >= state.cats.length && state.cats.length > 0) {
      setState(prev => ({ ...prev, showSummary: true }))
    }
  }, [state.currentIndex, state.cats.length])

  // Function to restart the app
  const restart = () => {
    setState({
      cats: [],
      currentIndex: 0,
      likedCats: [],
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
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  // Summary state
  if (state.showSummary) {
    return (
      <div className="app">
        <div className="summary">
          <h1>🎉 Your Cat Preferences!</h1>
          <p>You liked {state.likedCats.length} out of {state.cats.length} cats!</p>
          
          <div className="liked-cats">
            <h2>Your Favorites:</h2>
            <div className="cat-grid">
              {state.likedCats.map((cat) => (
                <img 
                  key={cat.id} 
                  src={cat.url} 
                  alt="Liked cat" 
                  className="liked-cat-image"
                />
              ))}
            </div>
          </div>
          
          <button onClick={restart} className="restart-btn">
            Find More Cats! 🐱
          </button>
        </div>
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
          <img 
            src={currentCat.url} 
            alt="Cat" 
            className="cat-image"
          />
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
