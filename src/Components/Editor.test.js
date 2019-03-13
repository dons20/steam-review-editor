import "./__mocks__/getSelection";

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
    const toSteam = new SteamMarkup({
        rules: [
            {
                /**
                 * @param {import('slate').Document} obj
                 * @param {Array} children
                 */
                serialize(obj, children) {
                    if (obj.object === "block") {
                        switch (obj.type) {
                            case "heading":
                                return "[h1]" + children + "[/h1]";
                        }
                    }
                }
            }
        ]
    });
    const newVal = toSteam.serialize(Value.fromJSON(EditorValue));
    console.log(newVal);
    expect(newVal).toMatchSnapshot();
});
