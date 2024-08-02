"use client";
import React, { useState } from "react";
import axios from "axios";
import QuillEditor from "@/app/utils/QuillEditor"; // QuillEditor yolunuza dikkat edin
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("JWT");
      const response = await axios.post(
        "/api/create-post",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        router.push("/"); // Başarılıysa ana sayfaya yönlendir
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post.");
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Create a New Post</h1> */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <QuillEditor value={content} onChange={setContent} />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-950 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
