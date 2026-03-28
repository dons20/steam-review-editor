/**
 * Icon re-exports
 *
 * All standard icons use lucide-react v1.
 * Brand icons (GitHub, X/Twitter) are custom SVGs since Lucide v1 removed brand icons.
 * Table-specific row/column icons are also custom since Lucide doesn't have exact equivalents.
 */
import React from "react";
import type { SVGProps } from "react";

// ── Lucide re-exports (aliased to old project names for backwards compat) ──
export {
  Bold as IconBold,
  Italic as IconItalic,
  Underline as IconUnderline,
  Strikethrough as IconStrikethrough,
  Heading1 as IconH1,
  Heading2 as IconH2,
  Heading3 as IconH3,
  List as IconList,
  ListOrdered as IconListNumbers,
  Link as IconLink,
  Image as IconPhoto,
  Table as IconTable,
  Code as IconCode,
  TextQuote as IconQuote,
  EyeOff as IconEyeOff,
  Minus as IconMinus,
  CircleOff as IconCircleOff,
  RemoveFormatting as IconClearFormatting,
  Trash2 as IconTrash,
  CircleHelp as IconHelpCircle,
  CircleX as IconCircleX,
  ClipboardList as IconClipboardList,
  Sun as IconSun,
  Moon as IconMoon,
  Circle as IconCircle,
  Columns3 as IconTablePlus,
  Rows3 as IconTableMinus,
  ArrowDown as IconTableDown,
  ArrowUp as IconTableUp,
} from "lucide-react";

// ── Brand icons (custom SVGs — Lucide v1 removed brand icons) ──

export function IconBrandGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
      ></path>
    </svg>
  );
}

export function IconBrandX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
      ></path>
    </svg>
  );
}
