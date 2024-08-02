"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchPost } from "@/app/utils/post";
import PostCard from "../elements/PostCard";
import LoadingSpinner from "../elements/LoadingSpinner";

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("JWT");
    if (token) {
      setIsSignedIn(true);
      fetchPost(token).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.data || []);
        }
        setIsLoading(false); // Stop loading
      });
    } else {
      setIsLoading(false); // Stop loading if not signed in
    }
  }, []);

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      {isLoading ? (
        <LoadingSpinner />
      ) : isSignedIn ? (
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <p>Lütfen giriş yapın</p>
      )}
    </div>
  );
}
