import { Address, LanguageKind } from './types';

export const GOOGLE_API_KEY = import.meta.env.VITE_GEOCODE_API_KEY;
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export const LANGUAGES: { name: keyof typeof LanguageKind }[] = [
  { name: 'EN' },
  { name: 'TR' },
  { name: 'RU' },
  { name: 'UA' },
];

export const INITIAL_ADDRESS: Address = {
  fullAddress:
    'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
  district: 'fatih',
  location: { lat: 41.008582, lng: 28.980067 },
  city: 'Istanbul',
};
