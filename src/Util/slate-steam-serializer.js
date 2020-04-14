import { Text } from "slate";

const serialize = value => {
    if (Text.isText(value)) {
        console.log(value, "TEXT");
        let markValue = value.text;
        if (value.hasOwnProperty("strikethrough")) {
            markValue = `[strike]${markValue}[/strike]`;
        }
        if (value.hasOwnProperty("underline")) {
            markValue = `[u]${markValue}[/u]`;
        }
        if (value.hasOwnProperty("italic")) {
            markValue = `[i]${markValue}[/i]`;
        }
        if (value.hasOwnProperty("bold")) {
            markValue = `[b]${markValue}[/b]`;
        }

        //return escapeHtml(value.text);
        return markValue;
    }

    console.log(value);

    let children = value;
    if (value.children) {
        children = value.children.map(n => serialize(n)).join("");
    } else if (Array.isArray(value)) {
        children = value.map(n => serialize(n)).join("\n");
    }

    switch (value.type) {
        case "heading":
            return `[h1]${children}[/h1]`;
        case "spoiler":
            return `[spoiler]${children}[/spoiler]`;
        case "noparse":
            return `[noparse]${children}[/noparse]`;
        case "link":
            return `[url=${value.url}]${children}[/url]`;
        case "code":
            return `[code]${children}[/code]`;
        case "quote":
            return `[quote${value.author ? `=${value.author}` : ""}]${children}[/quote]`;
        case "OList":
            return `[olist]${children}\n[/olist]`;
        case "UList":
            return `[list]${children}\n[/list]`;
        case "list-item":
            return `\n\t[*] ${children}`;
        case "image":
            return `[img]${value.url}[/img]`;
        default:
            return children;
    }
};

export default serialize;
