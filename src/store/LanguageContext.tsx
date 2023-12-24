import { createContext, useContext, useState } from 'react';
import { LANGUAGES, LanguageType } from '@app/utils/types';

export const LanguageContext = createContext<{
  currentLang: LanguageType;
  setCurrentLang:(lang: LanguageType) => void;
    }>({
      currentLang: LANGUAGES.en,
      setCurrentLang: () => {},
    });

export const LanguageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>(LANGUAGES.en);

  return (
    <LanguageContext.Provider
      value={{
        currentLang: language,
        setCurrentLang: setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
