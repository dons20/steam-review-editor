import { Editor } from "@tiptap/react";

export const addLink = async (editor: Editor, prompt: any) => {
  const url = await prompt({ title: "Enter URL:" });
  if (url) {
    editor.chain().focus().setLink({ href: url }).run();
  }
};

export const addImage = async (editor: Editor, prompt: any) => {
  const url = await prompt({ title: "Enter image URL:" });
  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};

export const addQuote = async (editor: Editor, prompt: any) => {
  if (editor.isActive("quote")) {
    editor.chain().focus().unsetQuote().run();
    return;
  }

  const author = await prompt({ title: "Enter author name (optional):" });
  if (author !== null) {
    editor
      .chain()
      .focus()
      .setQuote({ author: author || undefined })
      .run();
  }
};

export const insertTable = (editor: Editor) => {
  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).blur().run();
  // editor.chain().blur().run();
};

export const clearContent = async (editor: Editor, confirm: any) => {
  const confirmed = await confirm({
    title: "Clear All Content",
    message: "Are you sure you want to clear all content? This action cannot be undone.",
  });
  if (confirmed) {
    editor.chain().focus().clearContent(true).run();
    // Signal the editor host to cancel the pending debounced save and wipe
    // localStorage immediately, so a page refresh won't restore old content.
    window.dispatchEvent(new CustomEvent("steameditor:clearall"));
  }
};

// Text formatting
export const toggleBold = (editor: Editor) => {
  editor.chain().focus().toggleBold().run();
};

export const toggleItalic = (editor: Editor) => {
  editor.chain().focus().toggleItalic().run();
};

export const toggleUnderline = (editor: Editor) => {
  editor.chain().focus().toggleUnderline().run();
};

export const toggleStrike = (editor: Editor) => {
  editor.chain().focus().toggleStrike().run();
};

// Headings
export const toggleHeading1 = (editor: Editor) => {
  editor.chain().focus().toggleHeading({ level: 1 }).run();
};

export const toggleHeading2 = (editor: Editor) => {
  editor.chain().focus().toggleHeading({ level: 2 }).run();
};

export const toggleHeading3 = (editor: Editor) => {
  editor.chain().focus().toggleHeading({ level: 3 }).run();
};

// Lists
export const toggleBulletList = (editor: Editor) => {
  editor.chain().focus().toggleBulletList().run();
};

export const toggleOrderedList = (editor: Editor) => {
  editor.chain().focus().toggleOrderedList().run();
};

// Block elements
export const toggleCodeBlock = (editor: Editor) => {
  editor.chain().focus().toggleCodeBlock().run();
};

export const toggleSpoiler = (editor: Editor) => {
  editor.chain().focus().toggleSpoiler().run();
};

export const toggleNoParse = (editor: Editor) => {
  editor.chain().focus().toggleNoParse().run();
};

export const setHorizontalRule = (editor: Editor) => {
  editor.chain().focus().setHorizontalRule().run();
};

export const clearFormatting = (editor: Editor) => {
  editor.chain().focus().unsetAllMarks().clearNodes().run();
};

export const insertSteamStore = async (editor: Editor, prompt: any) => {
  const input = await prompt({ title: "Enter Steam App ID or store URL:" });
  if (!input) return;
  const match = String(input).match(/app\/(\d+)/i) || String(input).match(/^(\d+)$/);
  if (!match) return;
  const appid = match[1];
  editor.chain().focus().insertContent({
    type: "steamStoreEmbed",
    attrs: { appid },
  }).run();
};

export const insertSteamWorkshop = async (editor: Editor, prompt: any) => {
  const input = await prompt({ title: "Enter Workshop item ID or URL:" });
  if (!input) return;
  const match = String(input).match(/[?&]id=(\d+)/i) || String(input).match(/^(\d+)$/);
  if (!match) return;
  const workshopid = match[1];
  editor.chain().focus().insertContent({
    type: "steamWorkshopEmbed",
    attrs: { workshopid },
  }).run();
};

export const insertYouTube = async (editor: Editor, prompt: any) => {
  const input = await prompt({ title: "Enter YouTube URL or video ID:" });
  if (!input) return;
  const str = String(input);
  const match =
    str.match(/[?&]v=([-\w]+)/i) ||
    str.match(/youtu\.be\/([-\w]+)/i) ||
    str.match(/^([-\w]{11})$/);
  if (!match) return;
  const videoid = match[1];
  editor.chain().focus().insertContent({
    type: "youtubeEmbed",
    attrs: { videoid },
  }).run();
};
