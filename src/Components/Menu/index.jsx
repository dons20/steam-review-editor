import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Contains a list of toolbar items to be displayed
 */
const items = [
    {
        name: "heading",
        type: "block",
        value: <FontAwesomeIcon icon="heading" />
    },
    {
        name: "bold",
        type: "mark",
        value: <FontAwesomeIcon icon="bold" />
    },
    {
        name: "underlined",
        type: "mark",
        value: <FontAwesomeIcon icon="underline" />
    },
    {
        name: "italic",
        type: "mark",
        value: <FontAwesomeIcon icon="italic" />
    },
    {
        name: "strikethrough",
        type: "mark",
        value: <FontAwesomeIcon icon="strikethrough" />
    },
    {
        name: "spoiler",
        type: "block",
        value: <FontAwesomeIcon icon="eye-slash" />
    },
    {
        name: "noparse",
        type: "block",
        value: (
            <span className="fa-layers fa-fw static">
                <FontAwesomeIcon icon="code" />
                <FontAwesomeIcon icon="ban" color="rgba(255, 99, 71, 0.5)" size="2x" />
            </span>
        )
    },
    {
        name: "link",
        type: "inline",
        value: <FontAwesomeIcon icon="link" />
    },
    {
        name: "unordered list",
        type: "block",
        value: <FontAwesomeIcon icon="list-ul" />
    },
    {
        name: "ordered list",
        type: "block",
        value: <FontAwesomeIcon icon="list-ol" />
    },
    {
        name: "quote",
        type: "block",
        value: <FontAwesomeIcon icon="comment" />
    },
    {
        name: "code",
        type: "block",
        value: <FontAwesomeIcon icon="code" />
    },
    {
        name: "table",
        type: "block",
        value: <FontAwesomeIcon icon="table" />
    },
    {
        name: "image",
        type: "block",
        value: <FontAwesomeIcon icon="image" />
    },
    {
        name: "reset to default",
        type: null,
        value: <FontAwesomeIcon icon="spinner" />
    }
];

/**
 * Renders a div with custom props to behave like a button
 *
 * @typedef {Object} Button
 * @property {Boolean=} reset - Object containing styles
 * @property {Boolean=} active - Denotes active state of button
 * @property {Object<string, any>} item - Reference to current item
 * @property {Object<string, any>} classes - Object containing styles
 * @property {(event: React.MouseEvent) => void} onClick - Click handler function
 */

/**
 * @param {Button} props
 */
export const Button = ({ item, active, onClick, classes, reset }) => {
    return (
        <div
            className={`${classes.tooltip} ${classes.custom}`}
            data-active={active || null}
            data-title={item.name}
            data-type={item.type}
            data-reset={reset ? "" : null}
            onClick={onClick}
        >
            {item.value}
        </div>
    );
};

/**
 * Populates editor toolbar buttons
 *
 * @typedef {Object} Menu
 * @property {import('slate').Editor} editor
 * @property {Object<string, any>} classes
 * @property {(value) => Boolean} hasMark
 * @property {(value) => Boolean} hasBlock
 * @property {(value) => Boolean} hasLinks
 * @property {Function} onClickBlock
 * @property {Function} onClickMark
 * @property {Function} onClickCustom
 */

/**
 * @param {Menu} props
 */
function Menu({ editor, classes, hasMark, hasBlock, hasLinks, onClickBlock, onClickMark, onClickCustom }) {
    const listItems = useMemo(
        () =>
            items.map(item => {
                let active;
                if (item.type === "block") {
                    active = hasBlock(item.name);

                    if (editor.current) {
                        const {
                            value: { document, blocks }
                        } = editor.current;

                        if (item.name === "table" && editor.current.isSelectionInTable()) {
                            active = true;
                        }

                        if (item.name === "ordered list" || item.name === "unordered list") {
                            if (blocks.size > 0) {
                                const parent = document.getParent(blocks.first().key);
                                active = hasBlock("list item") && parent && parent.type === item.name;
                            }
                        }
                    }

                    return (
                        <Button
                            key={item.name}
                            item={item}
                            active={active}
                            onClick={e => onClickBlock(e, item.name)}
                            classes={classes}
                        />
                    );
                } else if (item.type === "mark") {
                    active = hasMark(item.name);

                    return (
                        <Button
                            key={item.name}
                            item={item}
                            active={active}
                            onClick={e => onClickMark(e, item.name)}
                            classes={classes}
                        />
                    );
                } else if (item.type === "inline") {
                    active = hasLinks(item.name);

                    return (
                        <Button
                            key={item.name}
                            item={item}
                            active={active}
                            onClick={e => onClickCustom(e, item.name)}
                            classes={classes}
                        />
                    );
                } else {
                    return (
                        <Button
                            reset={true}
                            key={item.name}
                            item={item}
                            onClick={e => onClickCustom(e, item.name)}
                            classes={classes}
                        />
                    );
                }
            }),
        [editor, classes, hasMark, hasBlock, hasLinks, onClickBlock, onClickMark, onClickCustom]
    );

    return <>{listItems}</>;
}

export default Menu;
