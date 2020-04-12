import React, { useState } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { insertLink, insertImage, insertTable } from "./";
import { Editor, Transforms } from "slate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/** @type {Array} */ const LIST_TYPES = ["OList", "UList"];

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type),
        split: true,
    });

    Transforms.setNodes(editor, {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    const handleClick = e => {
        e.preventDefault();
        toggleBlock(editor, format);
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div
            className={`tooltip custom`}
            data-active={isBlockActive(editor, format) || null}
            data-title={format}
            onMouseDown={handleClick}
        >
            {icon === "noparse" ? (
                <span className="fa-layers fa-fw static">
                    <FontAwesomeIcon icon="code" />
                    <FontAwesomeIcon icon="ban" color="rgba(255, 99, 71, 0.5)" size="2x" />
                </span>
            ) : (
                <FontAwesomeIcon icon={icon} />
            )}
        </div>
    );
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    const handleClick = e => {
        e.preventDefault();
        toggleMark(editor, format);
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div
            className={`tooltip custom`}
            data-active={isMarkActive(editor, format) || null}
            data-title={format}
            onMouseDown={handleClick}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );
};

const LinkButton = () => {
    const editor = useSlate();
    const handleClick = e => {
        e.preventDefault();
        insertLink(editor);

        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div
            className={`tooltip custom`}
            data-active={isLinkActive(editor) || null}
            data-title={"Link"}
            onMouseDown={handleClick}
        >
            <FontAwesomeIcon icon="link" />
        </div>
    );
};

const TableButton = ({ format, icon }) => {
    const editor = useSlate();
    const [showDropdown, enableDropdown] = useState(false);

    const showMenu = e => {
        e.preventDefault();
        if (!showDropdown) {
            enableDropdown(true);

            setTimeout(() => {
                document.addEventListener("click", hideMenu);
            }, 300);
        } else {
            enableDropdown(false);
        }
    };

    const hideMenu = () => {
        enableDropdown(false);
        document.removeEventListener("click", hideMenu);
    };

    const handleCreateTable = e => {
        e.preventDefault();
        const rows = window.prompt("Enter the number of rows:");
        if (!rows) return;
        const columns = window.prompt("Enter the number of columns:");
        if (!columns) return;
        insertTable(editor, rows, columns);
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div
            className={`tooltip custom table-button`}
            data-active={showDropdown || isBlockActive(editor, format) || undefined}
            data-title={format}
            onMouseDown={showMenu}
        >
            <FontAwesomeIcon icon={icon} />
            <div className={`table-dropdown${showDropdown ? " show" : ""}`}>
                <button type="button" className="size-selector" onClick={handleCreateTable}>
                    Choose custom size
                </button>
            </div>
        </div>
    );
};

const ImageButton = ({ format, icon }) => {
    const editor = useSlate();
    const handleClick = e => {
        e.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (!url) return;
        insertImage(editor, url);
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div
            className={`tooltip custom`}
            data-active={isBlockActive(editor, format) || null}
            data-title={format}
            onMouseDown={handleClick}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );
};

const EraseButton = ({ clearFunction }) => {
    const editor = useSlate();
    const handleClick = (e, clearFn) => {
        e.preventDefault();
        Transforms.select(
            editor,
            Editor.start(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [], offset: 1 } })
        );

        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            ReactEditor.focus(editor);
        }, 100);
    };

    return (
        <div className={`tooltip custom`} data-title={"Erase"} onMouseDown={e => handleClick(e, clearFunction)}>
            <FontAwesomeIcon icon="eraser" />
        </div>
    );
};

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === format,
    });

    return !!match;
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, { match: n => n.type === "link" });
    return !!link;
};

export { MarkButton, BlockButton, LinkButton, ImageButton, TableButton, EraseButton, toggleBlock, toggleMark };
