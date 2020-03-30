import "../../__mocks__/getSelection";

import React from "react";
import ReactDOM from "react-dom";
import { Value } from "slate";

import Editor from ".";
import EditorValue from "./testValue.json";
import SteamMarkup from "../../Util/slate-steam-serializer";
import rules from "./rules.js";

it("renders the editor", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Editor />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("converts an editor value to steam markup", () => {
    const toSteamMarkup = new SteamMarkup(rules);
    const newVal = toSteamMarkup.serialize(Value.fromJSON(EditorValue));
    expect(
        newVal.reduce((text, child) => {
            return text + child.toString();
        })
    ).toMatchSnapshot();
});
