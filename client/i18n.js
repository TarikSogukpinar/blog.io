import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./i18n.config";

// Load the translation file for the active locale
// on each request and make it available to our
// pages, components, etc.
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) {
    return notFound();
  }

  return {
    messages: (await import(`.public/locales/${locale}.json`)).default,
  };
});
