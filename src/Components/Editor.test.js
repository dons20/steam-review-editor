import "../__mocks__/getSelection";

import React from "react";
import ReactDOM from "react-dom";
import { Value } from "slate";

import Editor from "./Editor";
import EditorValue from "./testValue.json";
import SteamMarkup from "../Util/slate-steam-serializer";

it("renders the editor", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Editor />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("converts an editor value to steam markup", () => {
    const toSteamMarkup = new SteamMarkup({
        rules: [
            {
                /**
                 * @param {import('slate').Document} obj
                 * @param {Array<Object>} children
                 */
                serialize(obj, children) {
                    if (obj.object === "block") {
                        switch (obj.type) {
                            case "heading":
                                return `[h1]${obj.text}[/h1]`;
                            default:
                                return;
                        }
                    }
                }
            }
        ]
    });
    const newVal = toSteamMarkup.serialize(Value.fromJSON(EditorValue));
    expect(
        newVal.reduce((text, child) => {
            return text + child.toString();
        })
    ).toMatchSnapshot();
});
