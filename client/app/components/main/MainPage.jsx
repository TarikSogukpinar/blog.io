"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function MainPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const savedLocale = Cookies.get("NEXT_LOCALE");
    if (savedLocale && savedLocale !== currentLocale) {
      setCurrentLocale(savedLocale);
    } else {
      Cookies.set("NEXT_LOCALE", currentLocale, { expires: 365 });
    }
  }, [currentLocale]);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Blogio</span>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <main className="flex items-center justify-center min-h-screen">
        <div className="relative isolate">
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu  blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          ></div>
          <div className="flex flex-col items-center text-center">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Open Source Blog Application
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none italic">
                    Just a simple opensource blog application built with
                    Nest.js, Next.js
                    <br />
                    <small className="font-bold">Latest version 1.0.0</small>
                  </p>
                  <div className="mt-10 flex flex-col items-center gap-x-6">
                    <Link
                      href="/login"
                      className="rounded-md bg-gray-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Login
                    </Link>
                    <Link
                      href="https://github.com/TarikSogukpinar/blog.io"
                      className="text-sm font-semibold leading-6 text-gray-900 mt-2"
                      target="_blank"
                    >
                      Open Source Repo <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
