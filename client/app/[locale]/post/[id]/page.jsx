"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/elements/LoadingSpinner";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <img
          src={post.image || "https://via.placeholder.com/300"}
          alt="Post Image"
          className="w-full h-64 object-cover mb-4"
        />
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  );
};

export default PostDetail;
