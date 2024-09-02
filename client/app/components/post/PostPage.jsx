"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaTasks,
  FaQuoteRight,
  FaCode,
  FaLink,
  FaUnlink,
} from "react-icons/fa";
import LoadingSpinner from "../elements/LoadingSpinner";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-4 p-4 rounded-lg mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("bold")
            ? "bg-gray-950 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaBold /> Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("italic")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaItalic /> Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("underline")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaUnderline /> Underline
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "left" })
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignLeft /> Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "center" })
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignCenter /> Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignRight /> Right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignJustify /> Justify
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("bulletList")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaListUl /> Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("orderedList")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaListOl /> Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("taskList")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaTasks /> Task List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("blockquote")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaQuoteRight /> Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("codeBlock")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaCode /> Code Block
      </button>
      <button
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("link")
            ? "bg-gray-950 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaLink /> Link
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
      >
        <FaUnlink /> Unlink
      </button>
      <input
        type="color"
        onInput={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        value={editor.getAttributes("textStyle").color || "#000000"}
        className="h-10 w-10 p-1 rounded-md border border-gray-300"
      />
    </div>
  );
};

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [tagIds, setTagIds] = useState([1]);
  const [encrypted, setEncrypted] = useState(false); // Varsayılan olarak false
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Başlangıçta true, çünkü veriler yükleniyor
  const [isSubmitting, setIsSubmitting] = useState(false); // Form gönderim durumu
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Bold,
      Italic,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-2",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start my-4",
        },
        nested: true,
      }),
      TextStyle.configure({ types: [ListItem.name] }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ],
    content: `<h2>Editörünüze Hoş Geldiniz</h2><p>Bu, Tiptap editörünün varsayılan bir içeriğidir. Bu içerik, editör yüklendiğinde otomatik olarak görünür. Metni düzenlemek veya kendi içeriğinizi yazmak için tıklayın ve başlayın.</p><p>Aşağıdaki menüyü kullanarak metni kalın, italik veya altı çizili yapabilirsiniz. Aynı zamanda metni hizalayabilir, listeler oluşturabilir veya bağlantılar ekleyebilirsiniz.</p><p></p>`,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
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
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      } finally {
        setLoading(false); // Veriler yüklendiğinde spinner'ı gizle
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Form gönderilirken spinner'ı göster

    try {
      const content = editor?.getHTML();
      const postData = {
        title,
        content,
        slug,
        categoryId: parseInt(categoryId),
        tagIds: tagIds.map((id) => parseInt(id)),
        encrypted,
      };

      console.log("Sending data:", postData);

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
      resetForm();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post.");
      toast.error("Error creating post!");
    } finally {
      setIsSubmitting(false); // Form gönderimi bittiğinde spinner'ı gizle
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategoryId(1);
    setTagIds([1]);
    setEncrypted(false);
    editor?.commands.setContent("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 p-4 bg-white rounded-lg">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
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
            <div className="p-4 border rounded-xl shadow-sm">
              <MenuBar editor={editor} />

              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <div className="flex gap-2 p-2 bg-white border rounded-md shadow-lg">
                    <button
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-2 py-1 rounded-md border text-sm font-medium ${
                        editor.isActive("bold")
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`px-2 py-1 rounded-md border text-sm font-medium ${
                        editor.isActive("italic")
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Italic
                    </button>
                    {/* Diğer butonları burada ekleyin */}
                  </div>
                </BubbleMenu>
              )}

              <EditorContent editor={editor} className="mb-48" />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="encrypted"
              checked={encrypted}
              onChange={(e) => setEncrypted(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="encrypted"
              className="block text-sm font-medium text-gray-700"
            >
              Encrypt Post
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className={`bg-gray-950 text-white px-4 py-2 rounded-lg ${
              isSubmitting ? "hover:bg-gray-700" : "hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin inline-block mr-2" />
            ) : (
              "Publish"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
