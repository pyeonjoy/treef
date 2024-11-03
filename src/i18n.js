// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
  en: {
    translation: {
      "test": "Coding Test",
      "message":"Enter yout message...",
      "submit":"send"
  }},
  ko: {
    translation: {
      "test": "코딩 테스트",
      "message":"메시지를 입력하세요...",
      "submit":"전송"
  },
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    // ns: ['common'], // 사용하고자 하는 네임스페이스를 지정
    // defaultNS: 'common',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false,
  });

export default i18n;
