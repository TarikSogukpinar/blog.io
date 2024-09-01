import React from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-4 p-4 rounded-lg mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaBold /> Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaItalic /> Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("underline")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaUnderline /> Underline
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignLeft /> Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignCenter /> Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignRight /> Right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaAlignJustify /> Justify
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaListUl /> Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("orderedList")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaListOl /> Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("taskList")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaTasks /> Task List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("blockquote")
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <FaQuoteRight /> Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-1 ${
          editor.isActive("codeBlock")
            ? "bg-blue-500 text-white border-blue-500"
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
            ? "bg-blue-500 text-white border-blue-500"
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

export default function TiptapEditor() {
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
    content: `
      <h2>Editörünüze Hoş Geldiniz</h2>
      <p>
        Bu, Tiptap editörünün varsayılan bir içeriğidir. Bu içerik, editör yüklendiğinde otomatik olarak görünür. 
        Metni düzenlemek veya kendi içeriğinizi yazmak için tıklayın ve başlayın.
      </p>
      <p>
        Aşağıdaki menüyü kullanarak metni kalın, italik veya altı çizili yapabilirsiniz.
        Aynı zamanda metni hizalayabilir, listeler oluşturabilir veya bağlantılar ekleyebilirsiniz.
      </p>
       <p class="mb-8"></p> <!-- Ekstra boşluk için -->
    `,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Tiptap Editör</h1>

      <MenuBar editor={editor} />

      {/* BubbleMenu'yu burada tanımlayın */}
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
              onClick={() => editor.chain().focus().toggleItalic().run()}
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
  );
}
