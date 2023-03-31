import { LanguageKind } from '@app/utils/types'
import { createContext, useState } from 'react'

export const LanguageContext = createContext<{
  currentLang: LanguageKind
  setCurrentLang: (lang: LanguageKind) => void
}>({
  currentLang: LanguageKind.EN,
  setCurrentLang: () => {},
})

export const LanguageContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageKind>(LanguageKind.EN)

  return (
    <LanguageContext.Provider
      value={{
        currentLang: language,
        setCurrentLang: setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
