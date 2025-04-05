import { OutputBlockData } from "@editorjs/editorjs";

export const noParse = ({ data }: OutputBlockData) => {
  return `[noparse]${data.text}[/noparse]`;
};
