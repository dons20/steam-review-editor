import React from "react";
import { useSelected, useFocused } from "slate-react";

export default function Element({ attributes, children, element }) {
  const selected = useSelected();
  const focused = useFocused();

  switch (element.type) {
    case "heading":
      return <h1 {...attributes}>{children}</h1>;
    case "quote":
      return (
        <blockquote
          className={`quote${selected && focused ? " isFocused" : ""}`}
          data-author={element.author}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "UList":
      return <ul {...attributes}>{children}</ul>;
    case "OList":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "code":
      return (
        <pre className={`code${selected && focused ? " isFocused" : ""}`} {...attributes}>
          {children}
        </pre>
      );
    case "noparse":
      return (
        <pre className={`noparse${selected && focused ? " isFocused" : ""}`} {...attributes}>
          {children}
        </pre>
      );
    case "spoiler":
      return (
        <div className={`spoiler${selected && focused ? " isFocused" : ""}`} {...attributes}>
          {children}
        </div>
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
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    }
    case "image": {
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <img
              src={element.url}
              alt={"Image Link: " + element.url}
              className={`image ${selected && focused ? "isFocused" : undefined}`}
            />
          </div>
          {children}
        </div>
      );
    }
    default:
      return <p {...attributes}>{children}</p>;
  }
}
