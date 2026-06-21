'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionaries } from '@/i18n/dictionaries';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('riq_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.language && dictionaries[user.language]) {
          setLanguageState(user.language);
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: string) => {
    if (dictionaries[lang]) {
      setLanguageState(lang);
      // We also update the riq_user in local storage here to persist immediately
      const savedUser = localStorage.getItem('riq_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          user.language = lang;
          localStorage.setItem('riq_user', JSON.stringify(user));
        } catch (e) {}
      }
    }
  };

  const t = (key: string): string => {
    const dict = dictionaries[language] || dictionaries['en'];
    return dict[key] || key;
  };

  // Always provide the context to avoid SSR errors
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
