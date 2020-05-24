import React from "react";
import classes from "./Preview/preview.module.scss";

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
						case "spoiler":
							return React.createElement("div", { className: classes.spoiler }, children);
						case "noparse":
							return React.createElement("pre", { className: classes.noparse }, children);
						case "quote":
							let author = obj.data.get("author");
							return React.createElement("blockquote", { className: classes.quote, "data-author": author }, children);
						case "code":
							return React.createElement("pre", { className: classes.code }, children);
						case "image":
							let img = obj.data.get("img");
							return React.createElement("img", { src: img });
						case "ordered list":
							return React.createElement("ol", {}, children);
						case "unordered list":
							return React.createElement("ul", {}, children);
						case "list item":
							return React.createElement("li", {}, children);
						case "table":
							return React.createElement("table", {}, children);
						case "table-header":
							return React.createElement("th", {}, children);
						case "table-row":
							return React.createElement("tr", { className: classes.code }, children);
						case "table-cell":
							return React.createElement("td", {}, children);
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
							if (!link.startsWith("http://") && !link.startsWith("https://")) link = "http://" + link;
							return React.createElement("a", { href: link, target: "_blank", rel: "noopener noreferrer" }, children);
						default:
							return;
					}
				}
			},
		},
	],
};
