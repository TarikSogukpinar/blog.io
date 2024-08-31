import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex space-x-2 bg-gray-100 p-2 rounded-md mb-4">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("paragraph") ? "bg-gray-300" : "bg-white"
        }`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("bold") ? "bg-gray-300" : "bg-white"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("italic") ? "bg-gray-300" : "bg-white"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("strike") ? "bg-gray-300" : "bg-white"
        }`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive("highlight") ? "bg-gray-300" : "bg-white"
        }`}
      >
        Highlight
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        Right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`px-4 py-2 rounded-md border ${
          editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        Justify
      </button>
    </div>
  );
};

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: `
      <h3 class="text-center">
        Devs Just Want to Have Fun by Cyndi Lauper
      </h3>
      <p class="text-center">
        I come home in the morning light<br>
        My mother says, <mark class="bg-yellow-100">“When you gonna live your life right?”</mark><br>
        Oh mother dear we’re not the fortunate ones<br>
        And devs, they wanna have fun<br>
        Oh devs just want to have fun</p>
      <p class="text-center">
        The phone rings in the middle of the night<br>
        My father yells, "What you gonna do with your life?"<br>
        Oh daddy dear, you know you’re still number one<br>
        But <s>girls</s>devs, they wanna have fun<br>
        Oh devs just want to have
      </p>
      <p class="text-center">
        That’s all they really want<br>
        Some fun<br>
        When the working day is done<br>
        Oh devs, they wanna have fun<br>
        Oh devs just wanna have fun<br>
        (devs, they wanna, wanna have fun, devs wanna have)
      </p>
    `,
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-lg mx-auto bg-white p-6 rounded-lg shadow"
      />
    </>
  );
}
