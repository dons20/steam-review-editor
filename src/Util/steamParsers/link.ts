import { OutputBlockData } from "@editorjs/editorjs";

export const link = ({ data }: OutputBlockData) => {
  return `[url=${data.url}]${data.text}[/url]`;
};
