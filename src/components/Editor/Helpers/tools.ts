import { Editor } from "@tiptap/react";

function getNoParseSelection(editor: Editor) {
  const { selection, doc } = editor.state;
  const { from, to, $from, $to } = selection;

  if (selection.empty || $from.parent.type.name !== "noParse" || !$from.sameParent($to)) {
    return null;
  }

  return {
    from,
    to,
    selectedText: doc.textBetween(from, to, "\n", "\n"),
  };
}

function replaceNoParseSelection(editor: Editor, content: string) {
  const selection = getNoParseSelection(editor);

  if (!selection) {
    return false;
  }

  editor.chain().focus().insertContentAt({ from: selection.from, to: selection.to }, content).run();

  return true;
}

function wrapSelectionWithLiteralTag(editor: Editor, tagName: string) {
  const selection = getNoParseSelection(editor);
  if (!selection) {
    return false;
  }

  return replaceNoParseSelection(editor, `[${tagName}]${selection.selectedText}[/${tagName}]`);
}

function wrapSelectionWithLiteralList(editor: Editor, tagName: "list" | "olist") {
  const selection = getNoParseSelection(editor);
  if (!selection) {
    return false;
  }

  const items = selection.selectedText
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => `[*]${item}`)
    .join("\n");

  if (!items) {
    return false;
  }

  return replaceNoParseSelection(editor, `[${tagName}]\n${items}\n[/${tagName}]`);
}

export const addLink = async (editor: Editor, prompt: any) => {
  const previousUrl = editor.getAttributes("link")?.href || "";
  const url = await prompt({ title: "Enter Link URL:", defaultValue: previousUrl });

  if (url === null) {
    return;
  }

  const selection = getNoParseSelection(editor);
  if (selection && url) {
    replaceNoParseSelection(editor, `[url=${url}]${selection.selectedText}[/url]`);
    return;
  }

  if (url) {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  } else if (url === "") {
    editor.chain().focus().unsetLink().run();
  }
};

export const addImage = async (editor: Editor, prompt: any) => {
  const url = await prompt({ title: "Enter image URL:" });
  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};

export const addQuote = async (editor: Editor, prompt: any) => {
  const noParseSelection = getNoParseSelection(editor);

  if (editor.isActive("quote")) {
    editor.chain().focus().unsetQuote().run();
    return;
  }

  const author = await prompt({ title: "Enter author name (optional):" });
  if (author !== null) {
    if (noParseSelection) {
      const openTag = author ? `[quote=${author}]` : "[quote]";
      replaceNoParseSelection(editor, `${openTag}${noParseSelection.selectedText}[/quote]`);
      return;
    }

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
  if (wrapSelectionWithLiteralTag(editor, "b")) {
    return;
  }

  editor.chain().focus().toggleBold().run();
};

export const toggleItalic = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "i")) {
    return;
  }

  editor.chain().focus().toggleItalic().run();
};

export const toggleUnderline = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "u")) {
    return;
  }

  editor.chain().focus().toggleUnderline().run();
};

export const toggleStrike = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "strike")) {
    return;
  }

  editor.chain().focus().toggleStrike().run();
};

// Headings
export const toggleHeading1 = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "h1")) {
    return;
  }

  editor.chain().focus().toggleHeading({ level: 1 }).run();
};

export const toggleHeading2 = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "h2")) {
    return;
  }

  editor.chain().focus().toggleHeading({ level: 2 }).run();
};

export const toggleHeading3 = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "h3")) {
    return;
  }

  editor.chain().focus().toggleHeading({ level: 3 }).run();
};

// Lists
export const toggleBulletList = (editor: Editor) => {
  if (wrapSelectionWithLiteralList(editor, "list")) {
    return;
  }

  editor.chain().focus().toggleBulletList().run();
};

export const toggleOrderedList = (editor: Editor) => {
  if (wrapSelectionWithLiteralList(editor, "olist")) {
    return;
  }

  editor.chain().focus().toggleOrderedList().run();
};

// Block elements
export const toggleCodeBlock = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "code")) {
    return;
  }

  editor.chain().focus().toggleCodeBlock().run();
};

export const toggleSpoiler = (editor: Editor) => {
  if (wrapSelectionWithLiteralTag(editor, "spoiler")) {
    return;
  }

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
  const input = await prompt({ title: "Enter Steam store URL:" });
  if (!input) return;
  const match = String(input).match(/app\/(\d+)/i);
  if (!match) return;
  const appid = match[1];
  editor
    .chain()
    .focus()
    .insertContent({
      type: "steamStoreEmbed",
      attrs: { appid },
    })
    .run();
};

export const insertSteamWorkshop = async (editor: Editor, prompt: any) => {
  const input = await prompt({ title: "Enter Steam Workshop URL:" });
  if (!input) return;
  const match = String(input).match(/[?&]id=(\d+)/i);
  if (!match) return;
  const workshopid = match[1];
  editor
    .chain()
    .focus()
    .insertContent({
      type: "steamWorkshopEmbed",
      attrs: { workshopid },
    })
    .run();
};

export const insertYouTube = async (editor: Editor, prompt: any) => {
  const input = await prompt({ title: "Enter YouTube URL:" });
  if (!input) return;
  const str = String(input);
  const match = str.match(/[?&]v=([-\w]+)/i) || str.match(/youtu\.be\/([-\w]+)/i);
  if (!match) return;
  const videoid = match[1];
  editor
    .chain()
    .focus()
    .insertContent({
      type: "youtubeEmbed",
      attrs: { videoid },
    })
    .run();
};
