import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import i18next from 'i18next';

const languages = new Map<string, { nativeName: string }>([
    ['en', {nativeName: 'English'}],
]);

i18next.init({
    lng: 'en',
    interpolation: {
        escapeValue: false
    },
    fallbackLng: false,
});

export const i18nextPromise = i18next.use(Backend).use(LanguageDetector).init({
    debug: false,
    fallbackLng: "en",
    supportedLngs: <unknown>[...languages.keys()] as readonly string[],
    load: 'languageOnly'
})

export {languages, i18next};
