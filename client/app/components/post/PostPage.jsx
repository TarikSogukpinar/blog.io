"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import EditorCustom from "@/app/utils/TiptapEditor";
import TiptapEditor from "@/app/utils/TiptapEditor";

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
        "/api/v1/create-post",
        { title, content }, // Content burada TiptapEditor'den alınan değer
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        router.push("/"); // Başarılıysa ana sayfaya yönlendirme
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create a New Post</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Publish
        </button>
      </div>
      <TiptapEditor/>
    </div>
  );
}
