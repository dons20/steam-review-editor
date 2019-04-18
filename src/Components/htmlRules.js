import React from "react";

export default {
    rules: [
        {
            /**
             * @param {import('slate').Document} obj
             * @param {Array<import('immutable').List>} children
             */
            serialize(obj, children) {
                if (obj.object === "block") {
                    switch (obj.type) {
                        case "heading":
                            return React.createElement("h1", {}, children);
                        case "paragraph":
                            return React.createElement("p", {}, children);
                        default:
                            return;
                    }
                } else if (obj.object === "mark") {
                    switch (obj.type) {
                        case "bold":
                            return React.createElement("b", {}, children);
                        case "underlined":
                            return React.createElement("u", {}, children);
                        case "italic":
                            return React.createElement("i", {}, children);
                        case "strikethrough":
                            return React.createElement("s", {}, children);
                        default:
                            return;
                    }
                } else if (obj.object === "inline") {
                    switch (obj.type) {
                        case "link":
                            /** @type {String} */ let link = obj.data.get("href");
                            if (!link.startsWith("http://") && !link.startsWith("https://"))
                                link = "http://" + link;
                            return React.createElement(
                                "a",
                                { href: link, target: "_blank", rel: "noopener noreferrer" },
                                children
                            );
                        default:
                            return;
                    }
                }
            }
        }
    ]
};
