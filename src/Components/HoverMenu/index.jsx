import React from "react";
import ReactDOM from "react-dom";

function HoverMenu(props) {
    const { className, innerRef, editor } = props;
    const root = window.document.getElementById("root");
    const showTableOptions = editor.isSelectionInTable();

    /**
     * Render a mark-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {JSX.Element}
     */

    const renderMarkButton = (type, icon) => {
        const { editor } = props;
        const { value } = editor;
        const isActive = value.activeMarks.some(mark => mark.type === type);
        return (
            <Button reversed active={isActive} onMouseDown={event => onClickMark(event, type)}>
                <Icon>{icon}</Icon>
            </Button>
        );
    };

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {MouseEvent} event
     * @param {String} type
     */

    const onClickMark = (event, type) => {
        const { editor } = props;
        event.preventDefault();
        editor.toggleMark(type);
    };

    /**
     * Render.
     *
     * TODO: Remove innerRef if unnecessary
     * @return {Element}
     */
    return ReactDOM.createPortal(
        <div className={className} ref={innerRef}>
            {renderMarkButton("bold", "bold")}
            {renderMarkButton("italic", "italic")}
            {renderMarkButton("underlined", "underlined")}
            {showTableOptions && renderMarkButton("table-header", "bold")}
            {showTableOptions && renderMarkButton("table-row", "bold")}
            {showTableOptions && renderMarkButton("table-row", "bold")}
            {showTableOptions && renderMarkButton("table-column", "bold")}
            {showTableOptions && renderMarkButton("table-column", "bold")}
        </div>,
        root
    );
}

export default HoverMenu;
