"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import TiptapEditor from "@/app/utils/TiptapEditor";
import { GrDocumentCloud } from "react-icons/gr";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast, { Toaster } from "react-hot-toast"; 

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [tagIds, setTagIds] = useState([1]);
  const [encrypted, setEncrypted] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing your content...</p>",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = editor.getHTML(); // Tiptap editöründen içeriği alıyoruz

    const postData = {
      title,
      content,
      slug,
      categoryId,
      tagIds,
      encrypted,
    };

    try {
      const token = Cookies.get("JWT");
      const response = await axios.post(
        "http://localhost:5000/api/v1/blog/create-post",
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post created successfully!");
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post.");
      toast.error("Error creating post!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 p-4 bg-white rounded-lg">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <GrDocumentCloud className="text-2xl text-black mr-2" />{" "}
          <h1 className="text-2xl font-medium">New Post</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-medium">
            Category ID
          </label>
          <input
            type="number"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tagIds" className="block text-sm font-medium">
            Tag IDs
          </label>
          <input
            type="text"
            id="tagIds"
            value={tagIds}
            onChange={(e) =>
              setTagIds(
                e.target.value.split(",").map((id) => Number(id.trim()))
              )
            }
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Enter tag IDs separated by commas"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Content</label>
          <TiptapEditor editor={editor} />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="encrypted"
            checked={encrypted}
            onChange={(e) => setEncrypted(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="encrypted" className="block text-sm font-medium">
            Encrypt Post
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
