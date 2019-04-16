import React from "react";
import { Node } from "slate";

/**
 * A rule to (de)serialize text nodes. This is automatically added to the HTML
 * serializer so that users don't have to worry about text-level serialization.
 *
 * @type {Object}
 */

const TEXT_RULE = {
    deserialize(el) {
        if (el.tagName && el.tagName.toLowerCase() === "br") {
            return {
                object: "text",
                leaves: [
                    {
                        object: "leaf",
                        text: "\n"
                    }
                ]
            };
        }

        if (el.nodeName === "#text") {
            if (el.nodeValue && el.nodeValue.match(/<!--.*?-->/)) return;

            return {
                object: "text",
                leaves: [
                    {
                        object: "leaf",
                        text: el.nodeValue
                    }
                ]
            };
        }
    },

    serialize(obj, children) {
        if (obj.object === "string") {
            return children.split("\n").reduce((array, text, i) => {
                if (i !== 0) array.push(<br key={i} />);
                array.push(text);
                return array;
            }, []);
        }
    }
};

/**
 * A default `parseHtml` function that returns the `<body>` using `DOMParser`.
 *
 * @param {String} html
 * @return {Object}
 */

function defaultParseHtml(html) {
    if (typeof DOMParser == "undefined") {
        throw new Error(
            "The native `DOMParser` global which the `Html` serializer uses by default is not present in this environment. You must supply the `options.parseHtml` function instead."
        );
    }

    const parsed = new DOMParser().parseFromString(html, "text/html");
    const { body } = parsed;
    // COMPAT: in IE 11 body is null if html is an empty string
    return body || window.document.createElement("body");
}

class SteamMarkup {
    /**
     * Create a new serializer with rules
     *
     * @param {Object} options
     *  @property {Array} rules
     *  @property {String|Object|Block} defaultBlock
     *  @property {Function} parseHtml
     */
    constructor(options = {}) {
        let { defaultBlock = "paragraph", parseMarkup = defaultParseHtml, rules = [] } = options;

        defaultBlock = Node.createProperties(defaultBlock);

        this.rules = [...rules, TEXT_RULE];
        this.defaultBlock = defaultBlock;
        this.parseMarkup = parseMarkup;
    }

    /**
     * Serialize a `value` object into a pre-formatted string with steam markup.
     *
     * @param {Value} value
     * @param {Object} options
     *  @property {Boolean} render
     * @return {String|Array}
     */

    serialize = (value, options = {}) => {
        const { document } = value;
        const elements = document.nodes.map(this.serializeNode).filter(el => el);

        return elements;
    };

    /**
     * Serialize a `node`.
     *
     * @param {Node} node
     * @return {String}
     */

    serializeNode = node => {
        if (node.object === "text") {
            const leaves = node.getLeaves();
            return leaves.map(this.serializeLeaf);
        }

        const children = node.nodes.map(this.serializeNode);

        for (const rule of this.rules) {
            if (!rule.serialize) continue;
            const ret = rule.serialize(node, children);
            if (ret === null) return null;
            if (ret) return ret;
        }

        throw new Error(`No serializer defined for node of type "${node.type}".`);
    };

    /**
     * Serialize a `leaf`.
     *
     * @param {import('slate').Leaf} leaf
     * @return {String}
     */

    serializeLeaf = leaf => {
        const text = leaf.text;

        return leaf.marks.reduce((children, mark) => {
            for (const rule of this.rules) {
                if (!rule.serialize) continue;
                const ret = rule.serialize(mark, children);
                if (ret === null) return null;
                if (ret) return ret;
            }

            throw new Error(`No serializer defined for mark of type "${mark.type}".`);
        }, text);
    };
}

/**
 * Export.
 *
 * @type {SteamMarkup}
 */

export default SteamMarkup;
