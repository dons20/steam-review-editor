import { code } from "./code";
import { heading } from "./heading";
import { image } from "./image";
import { link } from "./link";
import { list } from "./list";
import { bold, italic, strikethrough, underline } from "./inlineText";
import { paragraph } from "./paragraph";
import { noParse } from "./noParse";
import { spoiler } from "./spoiler";

export const parsers = {
  bold,
  code,
  heading,
  image,
  italic,
  link,
  list,
  noParse,
  paragraph,
  spoiler,
  strikethrough,
  underline,
};

export default parsers;
