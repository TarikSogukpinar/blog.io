"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast, Toaster } from "react-hot-toast";
import { loginUser, handleGithubCallback } from "../../utils/auth";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];

  const [loading, setLoading] = useState(false);
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    handleGithubCallback();
  }, []);

  const notifyError = (message) => toast.error(message);

  const handleLogin = (e) => {
    setLoginValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(loginValues.email, loginValues.password);

      if (res.error) {
        throw new Error(res.error);
      }

      Cookies.set("JWT", res.result.accessToken, {
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      setTimeout(() => {
        router.push(`/${lang}/home`);
        router.refresh();
      }, 1000);

      window.location.href = `/${lang}/home`;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t("userNameorPasswordError");
      notifyError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    window.location.href = "http://127.0.0.1:5000/api/auth/github";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/api/auth/google";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md space-y-8">
        <h2 className="flex text-black text-4xl justify-center items-center ">
          {t("welcome")}
        </h2>

        <div className="bg-white px-6 py-5 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  {t("email")}
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleLogin}
                    value={loginValues.email}
                    required
                    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="johndoe@gmail.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-black"
              >
                {t("password")}
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleLogin}
                  value={loginValues.password}
                  required
                  placeholder="********"
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm leading-6 text-black"
                >
                  {t("remember")}
                </label>
              </div>

              <div className="text-sm leading-6">
                <a
                  href="#"
                  className="font-semibold text-gray-600 hover:text-gray-500"
                >
                  {t("forgotPassword")}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t("signin")}
              </button>
            </div>
          </form>

          <div>
            <div className="relative mt-10">
              <div>
                <div>
                  <div className="relative flex justify-center text-sm font-medium leading-6 rounded-md">
                    <span className=" px-6 text-black rounded-md mb-2">
                      {t("orContinueWith")}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col justify-center space-y-4">
                    <div>
                      <button
                        onClick={handleGithubLogin}
                        className="flex w-full justify-center rounded-md bg-gray-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <FaGithub className="mr-2 mt-1" /> Sign in with Github
                      </button>
                    </div>
                    <div>
                      <button
                        type="submit"
                        onClick={handleGoogleLogin}
                        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <FaGoogle className="mr-2 mt-1" /> Sign in with Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
