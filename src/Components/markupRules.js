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

                    switch (obj.type) {
                        case "heading":
                            return `[h1]${root}[/h1]\n`;
                        case "paragraph":
                            return `${root}\n` || null;
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
