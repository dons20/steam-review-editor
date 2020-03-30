import escapeHtml from "escape-html";
import { Text } from "slate";

const serialize = node => {
    if (Text.isText(node)) {
        return escapeHtml(node.text);
    }

    const children = node.children.map(n => serialize(n)).join("");

    switch (node.type) {
        case "quote":
            return `<blockquote><p>${children}</p></blockquote>`;
        case "paragraph":
            return `<p>${children}</p>`;
        case "link":
            return `<a href="${escapeHtml(node.url)}">${children}</a>`;
        default:
            return children;
    }
};

export default serialize;
