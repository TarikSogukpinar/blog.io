"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchPost } from "@/app/utils/post";

const truncateContent = (content, limit) => {
  if (content.length > limit) {
    return content.substring(0, limit) + "...";
  }
  return content;
};

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-md">
      <div className="mb-4 overflow-hidden rounded">
        <img
          src={post.image || "https://via.placeholder.com/300"}
          alt="Post Image"
          className="w-full h-48 object-cover"
        />
      </div>
      <div>
        <span className="bg-primary mb-5 inline-block rounded py-1 px-4 text-center text-xs font-semibold leading-loose text-white">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700">{truncateContent(post.content, 20)}</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

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
      });
    }
  }, []);

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      {isSignedIn ? (
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
