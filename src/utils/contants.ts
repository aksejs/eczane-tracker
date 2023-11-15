import { LanguageKind } from './types'

export const GOOGLE_API_KEY = import.meta.env.VITE_GEOCODE_API_KEY
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY

export const LANGUAGES: { name: keyof typeof LanguageKind }[] = [
  { name: 'EN' },
  { name: 'TR' },
  { name: 'RU' },
  { name: 'UA' },
]
