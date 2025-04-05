import { OutputBlockData } from "@editorjs/editorjs";

export const list = ({ data }: OutputBlockData) => {
  const listStyle = data.style === "unordered" ? "list" : "olist";

  const recursor = (items: any, listStyle: string) => {
    const list = items.map((item: any) => {
      if (!item.content && !item.items) return `[*] ${item}`;

      let nestedList = "";
      if (item.items?.length) nestedList = recursor(item.items, listStyle);
      if (item.content) return `[*] ${item.content}${nestedList}`;
    });

    return `[${listStyle}]${list.join("")}[/${listStyle}]`;
  };

  return recursor(data.items, listStyle);
};