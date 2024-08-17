"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchPost } from "@/app/utils/post";
import PostCard from "../elements/PostCard";
import LoadingSpinner from "../elements/LoadingSpinner";
import { FaExclamationCircle } from "react-icons/fa"; // İkonu import ediyoruz

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 40;

  useEffect(() => {
    const token = Cookies.get("JWT");
    if (token) {
      setIsSignedIn(true);
      loadPosts(token, page);
    } else {
      setIsLoading(false);
    }
  }, [page]);

  const loadPosts = (token, page) => {
    fetchPost(token, page, pageSize).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setPosts(data.data || []);
        setTotalPages(data.meta.totalPages);
      }
      setIsLoading(false);
    });
  };

  const handlePageChange = (newPage) => {
    setIsLoading(true);
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-semibold">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 md:p-12 bg-white">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 header">
        <div className="title">
          <p className="mb-4 text-3xl md:text-4xl font-bold text-gray-800">
            Latest articles
          </p>
          <p className="text-lg md:text-2xl font-bold text-gray-600">
            All articles are listed here
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading Posts...
          </p>
        </div>
      ) : isSignedIn ? (
        <>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:gap-12 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-20">
              <FaExclamationCircle className="text-6xl text-gray-600 mb-4" />
              <p className="text-2xl font-semibold text-gray-600">
                No posts available.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>
              Pages {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-gray-950 text-lg font-semibold">
            Posts are not loaded because you are not signed in.
          </p>
        </div>
      )}
    </div>
  );
}
