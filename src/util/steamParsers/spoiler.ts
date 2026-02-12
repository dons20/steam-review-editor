import { OutputBlockData } from "@editorjs/editorjs";

export const spoiler = ({ data }: OutputBlockData) => {
  return `[spoiler]${data.text}[/spoiler]`;
};
