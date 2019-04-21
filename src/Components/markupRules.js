export default {
    rules: [
        {
            /**
             * @param {import('slate').Document} obj
             * @param {Array<import('immutable').List>} children
             */
            serialize(obj, children) {
                if (obj.object === "block") {
                    let root = children.get(0);
                    //Handle nested lists
                    if (typeof root === "object") {
                        root = root.join("");
                    }
                    if (!root) root = "";

                    switch (obj.type) {
                        case "heading":
                            return `[h1]${root}[/h1]\n`;
                        case "paragraph":
                            return `${root}\n` || null;
                        case "spoiler":
                            return `[spoiler]${root}[/spoiler]\n`;
                        case "noparse":
                            return `[noparse]${root}[/noparse]\n`;
                        case "quote":
                            let author = obj.data.get("author");
                            return `[quote${author ? `=${author}` : ""}]${root}[/quote]\n`;
                        case "code":
                            return `[code]${root}[/code]\n`;
                        case "image":
                            let img = obj.data.get("img");
                            return `[img]${img}[/img]\n`;
                        case "ordered list":
                            return `[olist]\n${children.join("")}[/olist]\n`;
                        case "unordered list":
                            return `[list]\n${children.join("")}[/list]\n`;
                        case "list item":
                            return `\t[*]${root}\n`;
                        case "table":
                            return `[table]${root}[/table]`;
                        case "table-header":
                            return `\n\t[th]${children.join("")}\n\t[/th]\n`;
                        case "table-row":
                            return `\n\t[tr]${children.join("")}\n\t[/tr]\n`;
                        case "table-cell":
                            return `\n\t\t[td]${children.join("").replace(/\n/g, "")}[/td]`;
                        default:
                            return;
                    }
                } else if (obj.object === "mark") {
                    switch (obj.type) {
                        case "bold":
                            return `[b]${children}[/b]`;
                        case "underlined":
                            return `[u]${children}[/u]`;
                        case "italic":
                            return `[i]${children}[/i]`;
                        case "strikethrough":
                            return `[strike]${children}[/strike]`;
                        default:
                            return;
                    }
                } else if (obj.object === "inline") {
                    let root = children.get(0).join("");
                    switch (obj.type) {
                        case "link":
                            return `[url=${obj.data.get("href")}]${root}[/url]`;
                        default:
                            return;
                    }
                }
            }
        }
    ]
};
