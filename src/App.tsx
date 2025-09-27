import { useState, useEffect } from 'react'
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

function App() {
  // State management using useState hook
  const [state, setState] = useState<AppState>({
    cats: [],
    currentIndex: 0,
    likedCats: [],
    showSummary: false,
    loading: true
  })

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
      setState(prev => ({
        ...prev,
        likedCats: [...prev.likedCats, currentCat],
        currentIndex: prev.currentIndex + 1
      }))
    }
  }

  // Function to handle dislike action
  const handleDislike = () => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1
    }))
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
        <p>Swipe right to like, left to dislike</p>
        <div className="progress">
          {state.currentIndex + 1} / {state.cats.length}
        </div>
      </div>
      
      <div className="swipe-container">
        <div className="cat-card">
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
        </div>
      </div>
    </div>
  )
}

export default App
