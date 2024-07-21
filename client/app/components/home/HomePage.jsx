"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("JWT");
    console.log(token);
    if (token) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <div className="flex justify-center items-center mt-10">
      {isSignedIn ? (
        <p>
          Welcome back! You have successfully logged in. This app is still under
          development.
          <Link
            href={"https://github.com/TarikSogukpinar/blog.io"}
            target="_blank"
            className="flex justify-center items-center"
          >
            {" "}
            <FaGithub className="mr-2" /> Open Source Repo
          </Link>
        </p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
