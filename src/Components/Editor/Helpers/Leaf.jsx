import React from "react";

export default function Leaf({ attributes, children, leaf }) {
    if (leaf.bold) children = <strong {...attributes}>{children}</strong>;
    if (leaf.italic) children = <em {...attributes}>{children}</em>;
    if (leaf.underline) children = <u {...attributes}>{children}</u>;
    if (leaf.strikethrough) children = <s {...attributes}>{children}</s>;
    /* if (leaf.noparse) {
        children = (
            <pre className="noparse" {...attributes}>
                {children}
            </pre>
        );
    } */
    /* if (leaf.image) {
        children = (
            <img alt="" {...attributes}>
                {children}
            </img>
        );
    } */

    return <span {...attributes}>{children}</span>;
}
