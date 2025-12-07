import React, { createContext, useContext, useState, useEffect } from "react";

// Supported languages
export const LANGUAGES = {
  VI: "vi",
  EN: "en",
};

// Language context
const LanguageContext = createContext(null);

// Custom hook to use language
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Language Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to Vietnamese
    const saved = localStorage.getItem("language");
    return saved || LANGUAGES.VI;
  });

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem("language", language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Toggle between VI and EN
  const toggleLanguage = () => {
    setLanguage((prev) =>
      prev === LANGUAGES.VI ? LANGUAGES.EN : LANGUAGES.VI
    );
  };

  // Switch to specific language
  const switchLanguage = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
    }
  };

  // Check if current language is Vietnamese
  const isVietnamese = language === LANGUAGES.VI;

  // Check if current language is English
  const isEnglish = language === LANGUAGES.EN;

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    switchLanguage,
    isVietnamese,
    isEnglish,
    LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
