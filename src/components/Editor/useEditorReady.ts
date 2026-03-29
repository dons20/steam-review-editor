import { useState, useEffect } from "react";
import { useCurrentEditor } from "@tiptap/react";

/**
 * Returns true only after the TipTap editor's ProseMirror view has been
 * mounted to the DOM. Components that access `editor.view.dom` (like
 * BubbleMenu) must wait for this before rendering, otherwise the view
 * Proxy throws during Suspense reveals.
 */
export function useEditorReady(): boolean {
  const { editor } = useCurrentEditor();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!editor) {
      setReady(false);
      return;
    }

    // Check if already mounted (editorView is the internal backing field)
    if ((editor as any).editorView) {
      setReady(true);
      return;
    }

    // Wait for the "mount" event which fires after createView()
    const onMount = () => setReady(true);
    const onUnmount = () => setReady(false);

    editor.on("mount", onMount);
    editor.on("unmount", onUnmount);

    return () => {
      editor.off("mount", onMount);
      editor.off("unmount", onUnmount);
    };
  }, [editor]);

  return ready;
}
