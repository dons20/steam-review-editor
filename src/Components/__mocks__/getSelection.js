window.getSelection = jest.fn().mockImplementation(() => {
    return {
        anchorNode: Node,
        anchorOffset: Number,
        focusNode: Node,
        focusOffset: Number,
        isCollapsed: true,
        rangeCount: 0,
        type: null
    };
});
