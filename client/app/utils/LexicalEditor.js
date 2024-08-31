"use client"; // Next.js client-side bileşeni olduğunu belirtir

import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {
  // Tema stilini buraya ekleyebilirsiniz.
  // Bu kısımda font ve stil tanımlamaları yapabilirsiniz.
  text: {
    bold: "text-bold",
    italic: "text-italic",
    underline: "text-underline",
    ltr: "ltr",
    rtl: "rtl",
    paragraph: "editor-paragraph",
  },
  // Diğer stil tanımlamaları da eklenebilir
};

function onError(error) {
  console.error("Lexical error:", error);
}

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor", // Editör için bir isim alanı tanımlanır
    theme, // Tema ayarlarını ekledik
    onError, // Hata yönetimi fonksiyonu
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin /> {/* Geri alma/yineleme işlevselliği */}
        <AutoFocusPlugin /> {/* Sayfa yüklendiğinde editörü otomatik odaklar */}
      </div>
    </LexicalComposer>
  );
}
