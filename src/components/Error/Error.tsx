import React from 'react';
import { useLanguageContext } from '@app/store/LanguageContext';
import { DICTIONARY } from '@app/utils/contants';

export const Error: React.FC = () => {
  const { currentLang } = useLanguageContext();
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      {DICTIONARY.errors.noPharmacies[currentLang]}
    </div>
  );
};
