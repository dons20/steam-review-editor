import { OutputBlockData } from "@editorjs/editorjs";

export const image = ({ data }: OutputBlockData) => {
  return `[img]${data.file.url}[/img]`;
};