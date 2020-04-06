import React from "react";

export default function Element({ attributes, children, element }) {
    switch (element.type) {
        case "heading":
            return <h1 {...attributes}>{children}</h1>;
        case "quote":
            const { data } = element;
            const author = data.get("author");
            return (
                <blockquote className="quote" data-author={author} {...attributes}>
                    {children}
                </blockquote>
            );
        case "unordered list":
            return <ul {...attributes}>{children}</ul>;
        case "ordered list":
            return <ol {...attributes}>{children}</ol>;
        case "list item":
            return <li {...attributes}>{children}</li>;
        case "code":
            return (
                <pre className="code" {...attributes}>
                    {children}
                </pre>
            );
        case "spoiler":
            return (
                <div className="spoiler" {...attributes}>
                    {children}
                </div>
            );
        case "noparse":
            return (
                <pre className="noparse" {...attributes}>
                    {children}
                </pre>
            );
        case "table":
            return (
                <table className="table">
                    <tbody {...attributes}>{children}</tbody>
                </table>
            );
        case "table-row":
            return <tr {...attributes}>{children}</tr>;
        case "table-cell":
            return <td {...attributes}>{children}</td>;
        case "link": {
            const { data } = element;
            const href = data.get("href");
            return (
                <a {...attributes} href={href}>
                    {children}
                </a>
            );
        }
        case "image": {
            const { data } = element;
            const img = data.get("img");
            return (
                <div {...attributes}>
                    <img src={img} alt={"Image Link: " + img} />
                    {children}
                </div>
            );
        }
        default:
            return <p {...attributes}>{children}</p>;
    }
}
