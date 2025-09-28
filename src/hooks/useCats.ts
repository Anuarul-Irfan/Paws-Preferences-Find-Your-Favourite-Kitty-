import { useState, useCallback } from 'react'
import { Cat, AppState } from '../types/cat'
import { fetchCats } from '../services/catApi'
import { useUsedCatIds } from './useLocalStorage'
import { PRELOAD_COUNT } from '../utils/constants'

const initialPreloadedImages = new Set<string>()

export const useCats = () => {
  const { usedCatIds, markCatAsUsed, clearUsedCats } = useUsedCatIds()
  
  const [state, setState] = useState<AppState>({
    cats: [],
    currentIndex: 0,
    likedCats: [],
    dislikedCats: [],
    loading: false,
    error: null,
    showSummary: false,
    imageLoading: false,
    preloadedImages: initialPreloadedImages,
    usedCatIds,
    selectedCat: null,
    showPopup: false,
    isAnimating: false,
    animationDirection: null,
    showCompletionFeedback: false,
    completionType: null
  })

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }, [])

  const preloadNextImages = useCallback(async (cats: Cat[], currentIndex: number) => {
    const imagesToPreload: string[] = []
    
    for (let i = 1; i <= PRELOAD_COUNT; i++) {
      const nextIndex = currentIndex + i
      if (nextIndex < cats.length) {
        imagesToPreload.push(cats[nextIndex].url)
      }
    }
    
    const preloadPromises = imagesToPreload.map(url => 
      preloadImage(url).catch(error => 
        console.warn('Failed to preload image:', error)
      )
    )
    
    await Promise.all(preloadPromises)
  }, [preloadImage])

  const loadCats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const cats = await fetchCats(usedCatIds, markCatAsUsed)
      
      setState(prev => ({
        ...prev,
        cats,
        currentIndex: 0,
        likedCats: [],
        dislikedCats: [],
        loading: false,
        showSummary: false,
        imageLoading: true
      }))
      
      // Preload next images
      await preloadNextImages(cats, 0)
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load cats'
      }))
    }
  }, [preloadNextImages, usedCatIds, markCatAsUsed])

  const handleLike = useCallback(() => {
    const currentCat = state.cats[state.currentIndex]
    if (!currentCat) return

    // Start animation
    setState(prev => ({
      ...prev,
      isAnimating: true,
      animationDirection: 'right'
    }))

    // Complete the action after animation
    setTimeout(() => {
      const newIndex = state.currentIndex + 1
      const shouldShowSummary = newIndex >= state.cats.length

      setState(prev => ({
        ...prev,
        likedCats: [...prev.likedCats, currentCat],
        // Don't update currentIndex yet - keep showing current cat during feedback
        imageLoading: false,
        showSummary: shouldShowSummary,
        isAnimating: false,
        animationDirection: null,
        showCompletionFeedback: true,
        completionType: 'like'
      }))

      // Hide completion feedback and show next card after 1 second
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          showCompletionFeedback: false,
          completionType: null,
          currentIndex: newIndex, // Update currentIndex when ready to show next cat
          imageLoading: false
        }))
      }, 1000)
    }, 500) // Match animation duration
  }, [state.cats, state.currentIndex])

  const handleDislike = useCallback(() => {
    const currentCat = state.cats[state.currentIndex]
    if (!currentCat) return

    // Start animation
    setState(prev => ({
      ...prev,
      isAnimating: true,
      animationDirection: 'left'
    }))

    // Complete the action after animation
    setTimeout(() => {
      const newIndex = state.currentIndex + 1
      const shouldShowSummary = newIndex >= state.cats.length

      setState(prev => ({
        ...prev,
        dislikedCats: [...prev.dislikedCats, currentCat],
        // Don't update currentIndex yet - keep showing current cat during feedback
        imageLoading: false,
        showSummary: shouldShowSummary,
        isAnimating: false,
        animationDirection: null,
        showCompletionFeedback: true,
        completionType: 'dislike'
      }))

      // Hide completion feedback and show next card after 1 second
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          showCompletionFeedback: false,
          completionType: null,
          currentIndex: newIndex, // Update currentIndex when ready to show next cat
          imageLoading: false
        }))
      }, 1000)
    }, 500) // Match animation duration
  }, [state.cats, state.currentIndex])

  const handleImageLoad = useCallback(() => {
    setState(prev => ({ ...prev, imageLoading: false }))
  }, [])

  const handleImageError = useCallback(() => {
    setState(prev => ({ ...prev, imageLoading: false }))
  }, [])

  const restart = useCallback(() => {
    clearUsedCats()
    setState(prev => ({
      ...prev,
      cats: [],
      currentIndex: 0,
      likedCats: [],
      dislikedCats: [],
      loading: true, // Set loading to true to show loading spinner
      error: null,
      showSummary: false,
      imageLoading: false,
      preloadedImages: new Set<string>(),
      selectedCat: null,
      showPopup: false,
      isAnimating: false,
      animationDirection: null,
      showCompletionFeedback: false,
      completionType: null
    }))
    
    // Load new cats after clearing the state
    loadCats()
  }, [clearUsedCats, loadCats])

  const showCatPopup = useCallback((cat: Cat) => {
    setState(prev => ({ ...prev, selectedCat: cat, showPopup: true }))
  }, [])

  const closeCatPopup = useCallback(() => {
    setState(prev => ({ ...prev, selectedCat: null, showPopup: false }))
  }, [])

  return {
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
  }
}
