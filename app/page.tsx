'use client'

import { useEffect } from 'react'
import '../src/App.css'
import { useCats } from '../src/hooks/useCats'
import { useSwipe } from '../src/hooks/useSwipe'
import { calculateStatistics } from '../src/utils/statistics'
import { LoadingSpinner } from '../src/components/LoadingSpinner'
import { CatCard } from '../src/components/CatCard'
import { SummaryScreen } from '../src/components/SummaryScreen'
import { ErrorScreen } from '../src/components/ErrorScreen'
import { CatPopup } from '../src/components/CatPopup'

export default function Home() {
  const {
    state,
    loadCats,
    handleLike,
    handleDislike,
    handleImageLoad,
    handleImageError,
    restart,
    showCatPopup,
    closeCatPopup,
    preloadNextImages
  } = useCats()

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleDislike,
    onSwipeRight: handleLike
  })

  // Load cats on component mount
  useEffect(() => {
    loadCats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  // Preload next images when current index changes
  useEffect(() => {
    if (state.cats.length > 0 && state.currentIndex < state.cats.length) {
      preloadNextImages(state.cats, state.currentIndex)
    }
  }, [state.currentIndex, state.cats, preloadNextImages])


  // Loading state
  if (state.loading) {
    return (
      <div className="app">
        <LoadingSpinner message="Loading adorable cats..." />
      </div>
    )
  }

  // Error state
  if (state.error) {
    return (
      <div className="app">
        <ErrorScreen error={state.error} onRetry={loadCats} />
      </div>
    )
  }

  // Summary state
  if (state.showSummary) {
    const stats = calculateStatistics(state.cats, state.likedCats, state.dislikedCats)
    
    return (
      <div className="app">
        <SummaryScreen
          likedCats={state.likedCats}
          stats={stats}
          onCatClick={showCatPopup}
          onRestart={restart}
        />
      </div>
    )
  }

  // Main app state
  const currentCat = state.cats[state.currentIndex]
  
  if (!currentCat) {
    return <LoadingSpinner message="No cats available" />
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🐱 Paws & Preferences</h1>
        <p>Find Your Favourite Kitty!</p>
        <div className="progress">
          <span>{state.currentIndex + 1} / {state.cats.length}</span>
        </div>
      </header>

      <main className="main">
        <CatCard
          cat={currentCat}
          imageLoading={state.imageLoading}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          onLike={handleLike}
          onDislike={handleDislike}
          onTouchStart={swipeHandlers.handleTouchStart}
          onTouchMove={swipeHandlers.handleTouchMove}
          onTouchEnd={swipeHandlers.handleTouchEnd}
          onMouseDown={swipeHandlers.handleMouseDown}
          onMouseMove={swipeHandlers.handleMouseMove}
          onMouseUp={swipeHandlers.handleMouseUp}
          dragOffset={swipeHandlers.dragOffset}
          isSwipeActive={swipeHandlers.isSwipeActive}
          swipeDirection={swipeHandlers.swipeDirection}
          isAnimating={state.isAnimating}
          animationDirection={state.animationDirection}
        />
      </main>

      <CatPopup
        cat={state.selectedCat}
        isOpen={state.showPopup}
        onClose={closeCatPopup}
      />
    </div>
  )
}
