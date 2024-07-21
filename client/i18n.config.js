export const locales = ["en", "tr"];

export const isValidLocale = (locale) => {
  locales.includes(locale), console.log(`Loading translations for ${locale}.`);
};
