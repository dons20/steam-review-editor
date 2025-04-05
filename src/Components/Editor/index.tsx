import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Helpers/tools";
import { AppContext, type AppContextType } from "Components/Content";

import type { OutputData } from "@editorjs/editorjs";
import type { EditorCore } from "@react-editor-js/core";

import "./editor.scss";

const EditorJs = createReactEditorJS();

const starterValue = JSON.parse(localStorage.getItem("content")) as OutputData;

/** Hook to trigger a timeout that saves the editor content after a delay */
function useTimeout(closeTimer: Function, saveEditor: Function, value: OutputData, delay: number, active: boolean) {
  // Set up the interval.
  useEffect(() => {
    function save() {
      saveEditor(value);
      closeTimer();
    }
    if (delay !== null && active) {
      let id = setTimeout(save, delay);
      return () => clearInterval(id);
    }
  }, [active, delay, closeTimer, saveEditor, value]);
}

/** Defines the core editor component */
function ReviewEditor() {
  const editorRef = useRef<EditorCore | null>(null);
  const [data] = useState<OutputData>(starterValue);
  const [timerActive, setTimerActive] = useState(true);
  const { setHTMLContent, notify } = useContext<AppContextType>(AppContext);

  const currentValue = useRef(data);

  /** Saves the content of the editor to localStorage */
  const saveEditor = useCallback(async () => {
    const savedData = await editorRef.current.save();
    const content = JSON.stringify(savedData);
    localStorage.setItem("content", content);
    setHTMLContent(data);
    console.log(savedData);
    setTimerActive(false);
    notify("Latest changes saved ✅");
    currentValue.current = data;
  }, [data, notify]);

  /** Adds event listener to save editor content before refreshes/navigation changes */
  useEffect(() => {
    function runBeforeExit() {
      saveEditor();
    }

    setHTMLContent(data);

    window.addEventListener("beforeunload", runBeforeExit);

    return function cleanup() {
      window.removeEventListener("beforeunload", runBeforeExit);
    };
  }, [saveEditor, setHTMLContent, data]);

  /** Auto-saves editor content after delay */
  useTimeout(() => setTimerActive(false), saveEditor, data, 3000, timerActive);

  /** On change, save the new `value` */
  const onChange = () => {
    setTimerActive(true);
  };

  const handleInitialize = React.useCallback((instance: EditorCore) => {
    editorRef.current = instance;
  }, []);

  return (
    <div className="editor__root">
      <div className="header">
        <span>Editor</span>
      </div>
      <EditorJs
        defaultValue={data}
        placeholder="Type your review here..."
        onInitialize={handleInitialize}
        onChange={onChange}
        autofocus={true}
        tools={EDITOR_JS_TOOLS}
        inlineToolbar={["link", "bold", "italic", "underline"]}
      />
    </div>
  );
}

export default ReviewEditor;
