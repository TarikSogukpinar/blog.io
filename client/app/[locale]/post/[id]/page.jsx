"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/elements/LoadingSpinner";

const truncateContent = (content, limit) => {
  if (content.length > limit) {
    return content.substring(0, limit) + "...";
  }
  return content;
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      console.log("Fetching post with id:", id);
      const token = Cookies.get("JWT");
      axios
        .get(`https://blog.tariksogukpinar.dev/api/blog/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("API response:", response.data);
          setPost(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API error:", err);
          setError("Failed to fetch post details");
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="w-full p-6 md:p-12 bg-white">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12">
        <div className="title">
          <p className="mb-4 text-3xl md:text-4xl font-bold text-gray-800">
            Details
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading Post Details...
          </p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      ) : !post ? (
        <div>No post found</div>
      ) : (
        <>
          <div className="mb-4 overflow-hidden rounded-lg shadow-md">
            <img
              src={post.image || "https://via.placeholder.com/300"}
              alt="Post Image"
              className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div>
            <span className="bg-gray-800 text-white mb-4 inline-block rounded py-1 px-4 text-center text-xs font-semibold leading-loose">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              {truncateContent(post.content, 20)}
            </p>
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-600">
                Created by:{" "}
                <span className="font-semibold">{post.author.name}</span> <br />
                Created on:{" "}
                <span className="font-semibold">
                  {new Date(post.createdAt).toLocaleString()}
                </span>{" "}
                <br />
                Encryption:{" "}
                <span className="font-semibold">{post.encryption}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
