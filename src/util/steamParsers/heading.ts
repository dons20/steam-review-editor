import { OutputBlockData } from "@editorjs/editorjs";

export const heading = ({ data }: OutputBlockData) => {
  return `[h1]${data.text}[/h1]`;
};
