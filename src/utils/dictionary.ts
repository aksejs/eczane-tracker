import { LANGUAGES } from './contants';

const DISTANCE_DISCTIONARY = {
  [LANGUAGES.en]: 'Distance',
  [LANGUAGES.ru]: 'Расстояние',
  [LANGUAGES.tr]: 'Uzaklık',
  [LANGUAGES.ua]: 'Відстань',
} as const;

const NO_PHARMACIES = {
  [LANGUAGES.en]: 'Error loading pharmacies for this address. Please try to enter another one',
  [LANGUAGES.ru]: 'Ошибка при загрузки аптек для данного адреса. Пожалуйста попробуйте другой',
  [LANGUAGES.tr]: 'Bu adres için eczaneler yüklenirken hata oluştu. Lütfen başka bir tane girmeyi deneyin',
  [LANGUAGES.ua]: 'Помилка при завантаженні аптек для цієї адреси. Будь ласка, спробуйте інший',
};

export const DICTIONARY = {
  distance: DISTANCE_DISCTIONARY,
  errors: {
    noPharmacies: NO_PHARMACIES,
  },
} as const;
