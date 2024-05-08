"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar";
import Heading from "@tiptap/extension-heading";

export default function TipTap({
  body,
  onChange,
}: {
  body: string;
  onChange: (e: any) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-2xl font-bold",
          level: [2],
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "rounded-m border min-h-80 border-input bg-black-100 p-4",
      },
    },
    content: body,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <div className="overflow-y-auto h-80">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
