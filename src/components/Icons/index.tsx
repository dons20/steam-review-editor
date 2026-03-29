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
  Star as IconStar,
  TableProperties as IconTableHeader,
} from "lucide-react";

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

export function IconRecommended(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      id="Layer_2"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="256px"
      height="256px"
      viewBox="0 0 256 256"
      fill="#61b7e9"
      style={{ backgroundColor: "#174766" }}
      {...props}
    >
      <title>Recommended</title>
      <path
        d="M126.16,44c-0.18-1.38-0.8-3.93-2.71-4.15c0,0-16.02-1.85-18.59,12.29c0,0-5.13,18.82,9.41,46.21l-15.08,0.64
			H68.51c-10.2,0-18.45,10.81-18.51,24.16h44.89c1.87,0,3.38,1.51,3.38,3.38c0,1.86-1.51,3.38-3.38,3.38H51.86l5.43,19.22h43.68
			c1.86,0,3.38,1.51,3.38,3.38c0,1.86-1.52,3.37-3.38,3.37H59.2l5.43,19.23h33.45c1.86,0,3.38,1.51,3.38,3.37
			c0,1.86-1.51,3.38-3.38,3.38H67.09c5.27,11.59,13.82,20.4,23.03,20.4h68.13l21.34-62.23C174.13,134.96,132.53,92.42,126.16,44z
			 M208.44,154.04c-1.8-3.64-4.9-6.36-8.74-7.67l-7.55-2.57L170.86,206l7.56,2.59c3.84,1.32,7.99,1.05,11.64-0.74
			c3.65-1.79,6.36-4.89,7.67-8.73l11.45-33.45C210.49,161.82,210.23,157.69,208.44,154.04z"
      ></path>
    </svg>
  );
}

export function IconNotRecommended(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      id="Layer_2"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="256px"
      height="256px"
      viewBox="0 0 256 256"
      fill="#e06363"
      transform="rotate(180)"
      style={{ backgroundColor: "#602f35" }}
      {...props}
    >
      <title>Not Recommended</title>
      <path
        d="M126.16,44c-0.18-1.38-0.8-3.93-2.71-4.15c0,0-16.02-1.85-18.59,12.29c0,0-5.13,18.82,9.41,46.21l-15.08,0.64
			H68.51c-10.2,0-18.45,10.81-18.51,24.16h44.89c1.87,0,3.38,1.51,3.38,3.38c0,1.86-1.51,3.38-3.38,3.38H51.86l5.43,19.22h43.68
			c1.86,0,3.38,1.51,3.38,3.38c0,1.86-1.52,3.37-3.38,3.37H59.2l5.43,19.23h33.45c1.86,0,3.38,1.51,3.38,3.37
			c0,1.86-1.51,3.38-3.38,3.38H67.09c5.27,11.59,13.82,20.4,23.03,20.4h68.13l21.34-62.23C174.13,134.96,132.53,92.42,126.16,44z
			 M208.44,154.04c-1.8-3.64-4.9-6.36-8.74-7.67l-7.55-2.57L170.86,206l7.56,2.59c3.84,1.32,7.99,1.05,11.64-0.74
			c3.65-1.79,6.36-4.89,7.67-8.73l11.45-33.45C210.49,161.82,210.23,157.69,208.44,154.04z"
      ></path>
    </svg>
  );
}
