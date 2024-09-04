"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/elements/LoadingSpinner";
import Image from "next/image";

const truncateContent = (content, limit) => {
  if (content > limit) {
    return content.substring(0, limit) + "...";
  }
  return content;
};

const PostDetail = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      const token = Cookies.get("JWT");
      axios
        .get(`http://localhost:5000/api/v1/blog/post/slug/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const postData = response.data.result;
          setPost(postData);

          if (postData.slug) {
            const cleanedSlug = postData.slug
              .trim()
              .replace(/\s+/g, "-")
              .toLowerCase();
            router.replace(`/en/post/${cleanedSlug}`);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("API error:", err);
          setError("Failed to fetch post details");
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading Post Details...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-lg font-semibold">{error}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div className="w-full p-6 md:p-12 bg-white">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12">
        <div className="title">
          <p className="mb-4 text-3xl md:text-4xl font-bold text-gray-800">
            Details
          </p>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg shadow-md">
        <Image
          src={post.image || "https://via.placeholder.com/300"}
          alt="Post Image"
          width={800}
          height={400}
          priority={true}
          unoptimized={true}
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
      </div>
    </div>
  );
};

export default PostDetail;
