export const API_BASE_URL = 'https://cataas.com'
export const MAX_CATS = 10
export const MAX_ATTEMPTS = 50
export const PRELOAD_COUNT = 3

export const STORAGE_KEYS = {
  USED_CAT_IDS: 'paws-preferences-used-cat-ids'
} as const

export const INVALID_TAG_PATTERNS = [
  /^\s*$/,           // Empty or whitespace only
  /^\.+$/,           // Only dots
  /^\d+$/,           // Only numbers
  /^[^a-zA-Z0-9\s-]+$/, // Only special characters
  /^\s+|\s+$/,       // Leading or trailing whitespace
  /^[-_]+$/,         // Only dashes or underscores
  /^[A-Z]+$/,        // Only uppercase letters (likely system tags)
  /^(null|undefined|true|false)$/i, // JavaScript keywords
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, // Date patterns
  /^[0-9]+x[0-9]+$/, // Resolution patterns like "1920x1080"
] as const
