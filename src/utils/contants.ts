import { Address } from './types';

export const GOOGLE_API_KEY = import.meta.env.VITE_GEOCODE_API_KEY;
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
export const IS_DEV = import.meta.env.DEV;

export const INITIAL_ADDRESS: Address = {
  fullAddress:
    'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
  district: 'fatih',
  location: { lat: 41.008582, lng: 28.980067 },
  city: 'Istanbul',
} as const;

export const LANGUAGES = {
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
  ua: 'UA',
} as const;
