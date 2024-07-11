"use client";
import { useState, useEffect, Fragment } from "react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, usePathname, useSearchParams } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarPage() {
  const t = useTranslations("NavbarPage");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const locale = usePathname();

  // console.log(router, "router değeri");

  // const { locale } = router; // Use the locale from the router

  console.log(locale, "locale değeri");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/status"); // Replace with your API endpoint
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error fetching auth status:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout"); // Replace with your logout endpoint
      setIsAuthenticated(false);
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const changeLanguage = (newLocale) => {
  //   const currentPath = window.location.pathname;
  //   const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLocale}`);

  //   Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
  //   router.push(newPath);
  // };

  return (
    <Disclosure as="nav" className="bg-gray-950">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <a
                  href={`/`}
                  className="rounded-md bg-transparent px-3 py-2 text-sm font-medium text-white"
                >
                  Blog.io
                </a>
              </div>
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="hidden lg:flex lg:space-x-4">
                  <a
                    href="#"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Github
                  </a>
                  <a
                    href="#"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    About Project
                  </a>
                  <a
                    href="/contact"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Write Blog
                  </a>
                  <a
                    href={`${locale}/login`} // Dynamically set the href with the current locale
                    className="bg-gray-950 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-900 hover:text-white"
                  >
                    Start Here
                  </a>
                </div>
              </div>
              <div className="flex lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                {t("Dashboard")}
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {t("Team")}
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {t("Projects")}
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {t("Calendar")}
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0"></div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    Tom Cook
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    tom@example.com
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {t("Your Profile")}
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {t("Settings")}
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {t("Sign out")}
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
