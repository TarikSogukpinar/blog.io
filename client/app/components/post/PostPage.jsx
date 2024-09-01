"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  const [categories, setCategories] = useState([]);
  const [tagIds, setTagIds] = useState([1]);
  const [encrypted, setEncrypted] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const defaultContent = `
    <h2>Editörünüze Hoş Geldiniz</h2>
    <p>
      Bu, Tiptap editörünün varsayılan bir içeriğidir. Bu içerik, editör yüklendiğinde otomatik olarak görünür. 
      Metni düzenlemek veya kendi içeriğinizi yazmak için tıklayın ve başlayın.
    </p>
    <p>
      Aşağıdaki menüyü kullanarak metni kalın, italik veya altı çizili yapabilirsiniz.
      Aynı zamanda metni hizalayabilir, listeler oluşturabilir veya bağlantılar ekleyebilirsiniz.
    </p>
    <p class="mb-8"></p>
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultContent,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const token = Cookies.get("JWT");
      const response = await axios.get(
        "http://localhost:5000/api/v1/category/getAllCategories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const content = editor?.getHTML(); // HTML içeriğini al

      const postData = {
        post: {
          title,
          content,
          slug,
          categoryId: parseInt(categoryId),
          tagIds: tagIds.map((id) => parseInt(id)),
          encrypted,
        },
      };

      const token = Cookies.get("JWT");
      const response = await axios.post(
        "http://localhost:5000/api/v1/blog/create-post",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Post created successfully!");
      console.log("Post created successfully:", response.data);
      // Başarılı gönderimden sonra formu sıfırla
      resetForm();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post.");
      toast.error("Error creating post!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategoryId(1);
    setTagIds([1]);
    setEncrypted(false);
    editor?.commands.setContent(defaultContent);
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
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="tagIds" className="block text-sm font-medium">
            Tag IDs
          </label>
          <input
            type="text"
            id="tagIds"
            value={tagIds.join(", ")}
            onChange={(e) =>
              setTagIds(e.target.value.split(",").map((id) => id.trim()))
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
