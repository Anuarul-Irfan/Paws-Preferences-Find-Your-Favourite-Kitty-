import { useCallback, useRef, useState } from 'react'

interface SwipeHandlers {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export const useSwipe = ({ onSwipeLeft, onSwipeRight }: SwipeHandlers) => {
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const mouseStartX = useRef<number | null>(null)
  const mouseStartY = useRef<number | null>(null)
  const isDragging = useRef(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isSwipeActive, setIsSwipeActive] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
    setIsSwipeActive(true)
    setDragOffset({ x: 0, y: 0 })
    setSwipeDirection(null)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current

    setDragOffset({ x: deltaX, y: deltaY })

    // Determine swipe direction for visual feedback
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(null)
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current

    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    }

    // Reset states
    touchStartX.current = null
    touchStartY.current = null
    setIsSwipeActive(false)
    setDragOffset({ x: 0, y: 0 })
    setSwipeDirection(null)
  }, [onSwipeLeft, onSwipeRight])

  // Disable mouse functionality for web users - only touch for mobile
  const handleMouseDown = useCallback(() => {
    // No-op for web users
  }, [])

  const handleMouseMove = useCallback(() => {
    // No-op for web users
  }, [])

  const handleMouseUp = useCallback(() => {
    // No-op for web users
  }, [])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    dragOffset,
    isSwipeActive,
    swipeDirection
  }
}
