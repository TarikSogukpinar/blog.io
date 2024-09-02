"use client";
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutUser } from "../../utils/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarPage() {
  const t = useTranslations("NavbarPage");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const isLoginPage = pathname.includes("/login");

  useEffect(() => {
    const token = Cookies.get("JWT");
    setIsAuthenticated(!!token);

    if (token) {
      const fetchProfileImage = async () => {
        try {
          const response = await fetch(
            "https://blog.tariksogukpinar.dev/api/v1/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setProfileImageUrl(data.result.imageUrl);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };

      fetchProfileImage();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      Cookies.remove("JWT");
      setIsAuthenticated(false);
      router.push(`/`);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const localePath = `/${pathname.split("/")[1]}/`;

  const homeHref = isAuthenticated ? `${localePath}home` : "/";

  const baseURL = "https://blog.tariksogukpinar.dev/api"; // Base URL
  const fullImageUrl = `${baseURL}${profileImageUrl}`;

  return (
    <Disclosure as="nav" className="bg-gray-950 fixed top-0 left-0 w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center h-16">
                <Image
                  src="/icon.png"
                  alt="Blog"
                  width={64}
                  height={64}
                  className="h-auto"
                  unoptimized={true}
                  priority={true}
                />
                <Link
                  href={homeHref}
                  className="ml-2 rounded-md bg-transparent px-3 py-2 text-sm text-white"
                >
                  Blog.io
                  <br />
                  <small className="bg-opacity-35 rounded-md">
                    Alternative Medium
                  </small>
                </Link>
                <div className="ml-4 flex">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-32 lg:w-48 transition-all duration-300 ease-in-out focus:w-64 rounded-full bg-gray-800 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block px-4 py-2 sm:text-sm"
                  />
                  <button className="ml-2 text-gray-300 hover:text-white">
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex justify-end lg:justify-end">
                <div className="hidden lg:flex lg:space-x-4">
                  <Link
                    href="/post"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Post Article
                  </Link>
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        className="flex items-center justify-center rounded-full bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          width={8}
                          height={8}
                          src={fullImageUrl}
                          alt="Profile"
                        />
                      </button>
                      {menuOpen && (
                        <div
                          className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                          style={{ transform: "translateX(50%)" }}
                        >
                          <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {t("Settings")}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {t("Sign out")}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    !isLoginPage && (
                      <Link
                        href={`${localePath}login`}
                        className="bg-gray-950 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-900 hover:text-white"
                      >
                        {t("StartHere")}
                      </Link>
                    )
                  )}
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

          <Disclosure.Panel className="lg:hidden overflow-auto">
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
              {isAuthenticated && (
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        width={10}
                        height={10}
                        src={
                          profileImageUrl ||
                          "https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg"
                        }
                        alt="Profile"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        Tom Cook
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        tom@example.com
                      </div>
                    </div>
                    {/* <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
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
                      {t("Library")}
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("Stories")}
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="/settings"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("Settings")}
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("Sign out")}
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
