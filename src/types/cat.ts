export interface Cat {
  id: string
  url: string
  tags: string[]
  mimetype?: string
  createdAt?: string
}

export interface AppState {
  cats: Cat[]
  currentIndex: number
  likedCats: Cat[]
  dislikedCats: Cat[]
  loading: boolean
  error: string | null
  showSummary: boolean
  imageLoading: boolean
  preloadedImages: Set<string>
  usedCatIds: Set<string>
  selectedCat: Cat | null
  showPopup: boolean
  isAnimating: boolean
  animationDirection: 'left' | 'right' | null
  showCompletionFeedback: boolean
  completionType: 'like' | 'dislike' | null
}

export interface FilterConfig {
  filter?: string
  type?: string
  width?: number
  height?: number
  brightness?: number
  saturation?: number
  hue?: number
  lightness?: number
  tags: string[]
}