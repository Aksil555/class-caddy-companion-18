import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ru' | 'pt' | 'ar';

// Translations for different languages
export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    schedule: 'Schedule',
    homework: 'Homework',
    notes: 'Notes',
    copyright: '© 2025 AksilFlow'
  },
  es: {
    dashboard: 'Panel',
    schedule: 'Horario',
    homework: 'Tareas',
    notes: 'Notas',
    copyright: '© 2025 AksilFlow'
  },
  fr: {
    dashboard: 'Tableau de bord',
    schedule: 'Calendrier',
    homework: 'Devoirs',
    notes: 'Notes',
    copyright: '© 2025 AksilFlow'
  },
  de: {
    dashboard: 'Dashboard',
    schedule: 'Zeitplan',
    homework: 'Hausaufgaben',
    notes: 'Notizen',
    copyright: '© 2025 AksilFlow'
  },
  zh: {
    dashboard: '仪表板',
    schedule: '日程表',
    homework: '家庭作业',
    notes: '笔记',
    copyright: '© 2025 AksilFlow'
  },
  ja: {
    dashboard: 'ダッシュボード',
    schedule: 'スケジュール',
    homework: '宿題',
    notes: 'メモ',
    copyright: '© 2025 AksilFlow'
  },
  ru: {
    dashboard: 'Панель',
    schedule: 'Расписание',
    homework: 'Домашняя работа',
    notes: 'Заметки',
    copyright: '© 2025 AksilFlow'
  },
  pt: {
    dashboard: 'Painel',
    schedule: 'Agenda',
    homework: 'Lição de casa',
    notes: 'Notas',
    copyright: '© 2025 AksilFlow'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    schedule: 'جدول',
    homework: 'واجب منزلي',
    notes: 'ملاحظات',
    copyright: '© 2025 AksilFlow'
  }
};

// Create the language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  
  // Check if the browser language is supported
  const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'pt', 'ar'];
  
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'en'; // Default to English if not supported
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem('appLanguage');
    
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    
    // Otherwise detect from browser
    return detectBrowserLanguage();
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
