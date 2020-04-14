import { Range, Editor, Point, Transforms } from "slate";

const insertTable = (editor, rows, columns) => {
    if (editor.selection) {
        wrapTable(editor, rows, columns);
    }
};

const isTableActive = editor => {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === "table",
    });

    return !!match;
};

const unwrapTable = editor => {
    const isActive = isTableActive(editor);

    Transforms.unwrapNodes(editor, {
        match: n => n.type === "table",
        split: true,
    });

    Transforms.setNodes(editor, {
        type: isActive ? "paragraph" : "table",
    });
};

const wrapTable = (editor, rows, columns) => {
    if (isTableActive(editor)) {
        unwrapTable(editor);
        return;
    }

    const text = { text: "" };
    const cell = { type: "table-cell", children: [{ text: text }] };
    const row = { type: "table-row", children: [{ text: Array(columns).fill(cell, 0) }] };
    const table = { type: "table", children: [{ text: Array(rows).fill(row, 0) }] };
    Transforms.insertNodes(editor, table);
};

const withTables = editor => {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = unit => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: n => n.type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const start = Editor.start(editor, cellPath);

                if (Point.equals(selection.anchor, start)) {
                    return;
                }
            }
        }

        deleteBackward(unit);
    };

    editor.deleteForward = unit => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: n => n.type === "table-cell",
            });

            if (cell) {
                const [, cellPath] = cell;
                const end = Editor.end(editor, cellPath);

                if (Point.equals(selection.anchor, end)) {
                    return;
                }
            }
        }

        deleteForward(unit);
    };

    editor.insertBreak = () => {
        const { selection } = editor;

        if (selection) {
            const [table] = Editor.nodes(editor, { match: n => n.type === "table" });

            if (table) {
                return;
            }
        }

        insertBreak();
    };

    return editor;
};

export default withTables;
export { insertTable };
