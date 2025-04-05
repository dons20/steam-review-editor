import { OutputBlockData } from "@editorjs/editorjs";

export const bold = ({ data }: OutputBlockData) => {
  return `[b]${data.text}[/b]`;
};

export const italic = ({ data }: OutputBlockData) => {
  return `[i]${data.text}[/i]`;
};

export const underline = ({ data }: OutputBlockData) => {
  return `[u]${data.text}[/u]`;
};

export const strikethrough = ({ data }: OutputBlockData) => {
  return `[strike]${data.text}[/strike]`;
};
