import { OutputBlockData } from "@editorjs/editorjs";

export const quote = ({ data }: OutputBlockData) => {
  return `[quote${data.author ? `=${data.author}` : ""}]${data.text}[/quote]`;
};
