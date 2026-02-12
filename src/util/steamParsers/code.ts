import { OutputBlockData } from "@editorjs/editorjs";

export const code = ({ data }: OutputBlockData) => {
  return `[code]${data.text}[/code]`;
};
