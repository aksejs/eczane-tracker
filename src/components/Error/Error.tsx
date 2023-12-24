import React from 'react';
import { useLanguageContext } from '@app/store/LanguageContext';
import { DICTIONARY } from '@app/utils/dictionary';

export const Error: React.FC = () => {
  const { currentLang } = useLanguageContext();
  return (
    <div className="flex items-center justify-center">
      {DICTIONARY.errors.noPharmacies[currentLang]}
    </div>
  );
};
