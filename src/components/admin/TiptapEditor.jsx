import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { uploadMedia } from "@/services/media.js";

export default function TiptapEditor({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Tulis isi artikel di sini…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-article min-h-[320px] rounded-b-lg border border-t-0 border-line bg-white px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("URL tautan:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  function triggerImageUpload() {
    fileInputRef.current?.click();
  }

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadMedia("content", file);
      editor.chain().focus().setImage({ src: media.url }).run();
    } catch (err) {
      alert("Upload gambar gagal: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: LinkIcon, action: addLink, active: editor.isActive("link") },
    { icon: ImageIcon, action: triggerImageUpload, active: false },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-line bg-ink/[0.02] p-1.5">
        {tools.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={t.action}
            disabled={uploading}
            className={`rounded-md p-2 transition ${t.active ? "bg-brand/10 text-brand" : "text-ink/60 hover:bg-ink/5"}`}
          >
            <t.icon size={15} />
          </button>
        ))}
        {uploading && <span className="ml-1 text-xs text-muted">Mengunggah gambar…</span>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFile}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
