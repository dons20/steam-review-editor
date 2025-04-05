import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Header from "@editorjs/header";
import Table from "@editorjs/table";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";
import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

type EditorJSConfig = {
  [toolName: string]: ToolConstructable|ToolSettings;
};

export const EDITOR_JS_TOOLS: EditorJSConfig = {
  list: List,
  image: {
    class: Image,
    inlineToolbar: true,
  },
  quote: Quote,
  table: {
    // @ts-expect-error Types in Table don't align with React EditorJS
    class: Table,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    shortcut: "CMD+SHIFT+H",
  },
  underline: Underline,
  inlineCode: InlineCode,
};
