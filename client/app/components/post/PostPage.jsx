"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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
    <div className="w-auto h-auto mt-5">
      <TiptapEditor value={content} onChange={setContent} />
    </div>
  );
}
