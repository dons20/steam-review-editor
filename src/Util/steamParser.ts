import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import parsers from "./steamParsers";

type Plugins = (props: OutputBlockData) => {};

const parseInlineText = (block: OutputBlockData) => {
  const { data } = block;
  return data;
};

const parse = ({ blocks }: OutputData, parsers: Record<string, Plugins>) => {
  return blocks.reduce((acc: string, block: OutputBlockData) => {
    if (block.type in parsers) {
      // const parsedBlock = parseInlineText(block);
      acc += parsers[block.type](block);
      return acc;
    }

    const error = `[steamParser]: Parser function for ${block.type} does not exist`;
    console.error(error);

    return acc;
  }, "");
};

const parseBlock = (block: OutputBlockData, parsers: Record<string, Plugins>) => {
  if (block.type in parsers) {
    return parsers[block.type](block);
  }

  const error = `[steamParser]: Parser function for ${block.type} does not exist`;
  console.error(error);
};

const parser = (plugins: Record<string, Plugins> = {}) => {
  const combinedParsers = { ...parsers, ...plugins };

  return {
    parse: (blocks: OutputData) => parse(blocks, combinedParsers),
    parseBlock: (block: OutputBlockData) => parseBlock(block, combinedParsers),
  };
};

export default parser;
