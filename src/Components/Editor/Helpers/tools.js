import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Header from "@editorjs/header";
import Table from "@editorjs/table";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";

/**
 *
 */
export const EDITOR_JS_TOOLS = {
	list: List,
	image: {
		class: Image,
		inlineToolbar: true,
	},
	quote: Quote,
	table: {
		class: Table,
		inlineToolbar: true,
	},
	header: Header,
	underline: Underline,
	inlineCode: InlineCode,
};
