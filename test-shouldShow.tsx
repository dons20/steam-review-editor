import React from "react";
import { BubbleMenu } from "@tiptap/react/menus";

export const TestMenu = () => {
  return (
    <BubbleMenu editor={undefined} shouldShow={({ editor }) => !editor.isActive("image")}>
      <div>content</div>
    </BubbleMenu>
  );
};
