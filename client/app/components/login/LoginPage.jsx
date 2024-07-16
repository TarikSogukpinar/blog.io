"use client";
import React, { useState } from "react";
import Image from "next/image";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { toast, Toaster } from "react-hot-toast";
import { loginUser } from "../../utils/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    setLoginValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = loginUser(loginValues.email, loginValues.password);

    toast.promise(loginPromise, {
      loading: t("loading"), // Assuming you have a translation for loading
      success: t("authSuccess"), // Assuming you have a translation for success
      error: (err) => `${t("authError")}: ${err.message}`, // Assuming you have a translation for error
    });

    try {
      const res = await loginPromise;

      if (res.error) {
        throw new Error(res.error);
      }

      Cookies.set("JWT", res.result.accessToken, {
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t("userNameorPasswordError");
      const errorStatus = error.response?.data?.statusCode || "";
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
                    placeholder="johndoe@example.com"
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
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-gray-800 px-6 text-white">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
