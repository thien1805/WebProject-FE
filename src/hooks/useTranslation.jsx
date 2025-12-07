import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import viTranslations from '../locales/vi.json';
import enTranslations from '../locales/en.json';

const translations = {
  [LANGUAGES.VI]: viTranslations,
  [LANGUAGES.EN]: enTranslations
};

/**
 * Hook to get translations based on current language
 * @returns {Object} { t: function, language: string }
 * 
 * Usage:
 * const { t, language } = useTranslation();
 * <h1>{t('common.home')}</h1>
 * <p>{t('booking.title')}</p>
 */
export const useTranslation = () => {
  const { language } = useLanguage();
  
  /**
   * Get translation by key path (e.g., 'common.home', 'booking.title')
   * @param {string} keyPath - Dot-separated key path
   * @param {Object} params - Optional parameters for string interpolation
   * @returns {string} Translated string or key if not found
   */
  const t = (keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let value = translations[language];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Return the key if translation not found
        console.warn(`Translation not found: ${keyPath}`);
        return keyPath;
      }
    }
    
    // Handle string interpolation {{variable}}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };
  
  return { t, language };
};

/**
 * Get translation without hook (for use outside components)
 * @param {string} lang - Language code ('vi' or 'en')
 * @param {string} keyPath - Dot-separated key path
 * @returns {string} Translated string
 */
export const getTranslation = (lang, keyPath) => {
  const keys = keyPath.split('.');
  let value = translations[lang] || translations[LANGUAGES.VI];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return keyPath;
    }
  }
  
  return value;
};

export default useTranslation;
