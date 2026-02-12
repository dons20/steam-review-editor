import { OutputBlockData } from "@editorjs/editorjs";

export const paragraph = ({ data }: OutputBlockData) => {
  return data.text;
};
