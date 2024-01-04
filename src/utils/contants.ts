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

const DISTANCE_DISCTIONARY = {
  [LANGUAGES.en]: 'Distance',
  [LANGUAGES.ru]: 'Расстояние',
  [LANGUAGES.tr]: 'Uzaklık',
  [LANGUAGES.ua]: 'Відстань',
} as const;

const NO_PHARMACIES = {
  [LANGUAGES.en]: 'Error loading pharmacies for this address.\nPlease try to enter a different one',
  [LANGUAGES.ru]: 'Ошибка при загрузки аптек для данного адреса.\nПожалуйста попробуйте другой',
  [LANGUAGES.tr]: 'Bu adres için eczaneler yüklenirken hata oluştu.\nLütfen başka bir tane girmeyi deneyin',
  [LANGUAGES.ua]: 'Помилка при завантаженні аптек для цієї адреси.\nБудь ласка, спробуйте інший',
};

export const DICTIONARY = {
  distance: DISTANCE_DISCTIONARY,
  errors: {
    noPharmacies: NO_PHARMACIES,
  },
} as const;
