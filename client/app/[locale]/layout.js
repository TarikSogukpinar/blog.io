import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/page";
import Footer from "./footer/page";
import { NextIntlClientProvider, useMessages } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nest.js, Next.js, Medium Alternative Blog App",
  description: "Generated by tariksogukpinar.dev",
};

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  const messages = useMessages();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="description"
          content="Nest.js, Next.js, Medium Alternative Blog App"
        />
        <meta
          name="keywords"
          content="Nestjs, Nextjs, TypeScript, Docker, ElasticSearch, Redis"
        />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="mt-10 overflow-hidden">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
