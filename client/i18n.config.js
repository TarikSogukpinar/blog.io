export const locales = ["en", "tr"];

// Tür tanımlaması yerine, geçerli olup olmadığını kontrol eden bir fonksiyon
export const isValidLocale = (locale) => {
  locales.includes(locale), console.log(`Loading translations for ${locale}.`);
};
