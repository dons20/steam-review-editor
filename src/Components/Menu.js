import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Contains a list of toolbar items to be displayed
 *
 * @type {Array(Object)}
 * @property {String} name
 * @property {String} type
 * @property {FontAwesomeIcon} value
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
        name: "reset to default",
        value: <FontAwesomeIcon icon="spinner" />
    }
];

/**
 * Renders a div with custom props to behave like a button
 *
 * @param {Object} props
 *   @property {Object} item - Reference to current item
 *   @property {Boolean} active - Denotes active state of button
 *   @property {Function} onClick - Click handler function
 *   @property {Object} classes - Object containing styles
 */

const Button = ({ item, active, onClick, classes, reset }) => {
    return (
        <div
            className={`${classes.tooltip} ${classes.custom}`}
            data-active={active || null}
            data-title={item.name}
            data-type={item.type}
            onClick={onClick}
            reset={reset ? "" : null}
        >
            {item.value}
        </div>
    );
};

/**
 * Populates editor toolbar buttons
 *
 * @type {React.Component}
 */
export default function Menu(props) {
    const {
        editor,
        classes,
        hasMark,
        hasBlock,
        hasLinks,
        onClickBlock,
        onClickMark,
        onClickCustom
    } = props;

    const listItems = useMemo(() =>
        items.map(item => {
            if (item.type === "block") {
                let active = hasBlock(item.name);

                if (editor.current) {
                    const {
                        value: { document, blocks }
                    } = editor.current;

                    if (["ordered list", "unordered list"].includes(item.name)) {
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
                let active = hasMark(item.name);
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
                let active = hasLinks(item.name);
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
        })
    );

    return listItems;
}
