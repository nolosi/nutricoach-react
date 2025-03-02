import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Laden der Übersetzungen über http (alle Übersetzungen sind gespeichert unter /public/locales/{language}/{namespace})
  .use(Backend)
  // Erkennung der Benutzersprache
  .use(LanguageDetector)
  // Integration mit React
  .use(initReactI18next)
  // Initialisierung von i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en', 'de', 'sq'],
    
    interpolation: {
      escapeValue: false, // nicht nötig für React
    },
    
    // Backend-Konfiguration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Standardnamespace
    defaultNS: 'common',
    
    react: {
      useSuspense: true,
    },
  });

export default i18n; 