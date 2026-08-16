import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, translations, interpolate } from './translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate a key with optional {placeholder} params */
  t: (key: string, params?: Record<string, string | number>) => string;
};

const STORAGE_KEY = 'flexora-barber-language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const isLanguage = (value: string | null): value is Language =>
  value === 'uz' || value === 'ru' || value === 'en';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return isLanguage(stored) ? stored : 'uz';
    } catch {
      return 'uz';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const dict = translations[language];
      const template = dict[key] ?? key;
      return interpolate(template, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
