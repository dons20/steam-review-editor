import React, { Fragment } from "react";
import escapeHtml from "escape-html";
import { Text } from "slate";

const serialize = (value, index = -1) => {
    if (Text.isText(value)) {
        let markValue = <Fragment key={`${value.text}-${index}`}>{value.text}</Fragment>;
        if (value.hasOwnProperty("strikethrough")) {
            markValue = <s key={index}>{markValue}</s>;
        }
        if (value.hasOwnProperty("underline")) {
            markValue = <u key={index}>{markValue}</u>;
        }
        if (value.hasOwnProperty("italic")) {
            markValue = <i key={index}>{markValue}</i>;
        }
        if (value.hasOwnProperty("bold")) {
            markValue = <strong key={index}>{markValue}</strong>;
        }

        return markValue;
    }

    let children = value;
    if (value.children) {
        children = value.children.map((n, i) => serialize(n, i));
    } else if (Array.isArray(value)) {
        children = value.map((n, i) => serialize(n, i));
    }

    switch (value.type) {
        case "heading":
            return <h1 key={`${value.children.length}-${index}`}>{children}</h1>;
        case "paragraph":
            return <p key={`${value.children.length}-${index}`}>{children}</p>;
        case "spoiler":
            return (
                <div key={`${value.children.length}-${index}`} className="spoiler">
                    {children}
                </div>
            );
        case "noparse":
            return (
                <pre key={`${value.children.length}-${index}`} className="noparse">
                    {children}
                </pre>
            );
        case "quote":
            return (
                <blockquote data-author={value.author} key={`${value.children.length}-${index}`}>
                    <p>{children}</p>
                </blockquote>
            );
        case "link":
            return (
                <a href={escapeHtml(value.url)} key={`${value.children.length}-${index}`}>
                    {children}
                </a>
            );
        case "OList":
            return React.createElement("ol", { key: `${value.children.length}-${index}` }, children);
        case "UList":
            return React.createElement("ul", { key: `${value.children.length}-${index}` }, children);
        case "list-item":
            return React.createElement("li", { key: `${value.children.length}-${index}` }, children);
        case "table":
            return React.createElement("table", { key: `${value.children.length}-${index}` }, children);
        case "table-header":
            return React.createElement("th", { key: `${value.children.length}-${index}` }, children);
        case "table-row":
            return React.createElement("tr", { className: "code", key: `${value.children.length}-${index}` }, children);
        case "table-cell":
            return React.createElement("td", { key: `${value.children.length}-${index}` }, children);
        case "image":
            return React.createElement("img", {
                className: "max-width",
                src: value.url,
                key: `${value.children.length}-${index}`,
            });
        default:
            return children;
    }
};

export default serialize;
