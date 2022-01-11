import React from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from './en.json';
import th from './th.json';
import {setLanguageData} from '@react-native-community/async-storage';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  th,
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL =
  currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
React.I18nManager.allowRTL(isRTL);
console.log(currentLocale);
// Localizing momentjs to Hebrew or English
if (currentLocale.indexOf('th') === 0) {
  // moment.locale('th')
  I18n.locale = 'th';
} else {
  // moment.locale('en')
  I18n.locale = 'en';
}

export function changeLanguage(language) {
  return I18n.locale = language;
}

// The method we'll use instead of a regular string
export const Language = {
  t: (name) => {
    return I18n.t(name);
  },
  getLang: () => {
    return I18n.locale;
  },
};
