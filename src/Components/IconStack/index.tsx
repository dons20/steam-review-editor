import React, { SVGProps, ComponentType, ReactElement } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Layer = {
  Icon: IconComponent;
  // Scale relative to 24x24 viewBox
  scale?: number; // e.g. 0.85
  // Optional pixel offsets in the 24x24 space (applied after scaling)
  offsetX?: number;
  offsetY?: number;
  // Override per-layer stroke/fill if desired
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  // Additional props to spread onto the inner <g>
  gProps?: React.SVGProps<SVGGElement>;
};

type StackProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number; // convenience width/height
  viewBox?: string; // default "0 0 24 24"
  // First layer is rendered first (behind)
  layers: [Layer, Layer] | Layer[]; // supports 2+ if needed
  // Default styling inherited by all layers unless overridden
  defaultStroke?: string;
  defaultFill?: string;
  defaultStrokeWidth?: number;
};

/**
 * Stacks Tabler icons (or any 24x24 SVG icons) inside a single SVG.
 * Each layer is centered, scaled, and offset in the same 24x24 coordinate system.
 */
export function IconStack({
  layers,
  size = 24,
  viewBox = "0 0 24 24",
  defaultStroke = "currentColor",
  defaultFill = "none",
  defaultStrokeWidth = 2,
  width,
  height,
  ...svgProps
}: StackProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox={viewBox}
      fill="none"
      stroke={defaultStroke}
      strokeWidth={defaultStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgProps}
    >
      {layers.map(({ Icon, scale = 1, offsetX = 0, offsetY = 0, stroke, fill, strokeWidth, gProps }, idx) => {
        // Center -> scale -> uncenter, then apply translation offsets
        // translate(12,12) scale(s) translate(-12,-12) translate(offsetX, offsetY)
        const transform = `translate(${12 + offsetX} ${12 + offsetY}) scale(${scale}) translate(-12 -12)`;
        return (
          <g
            key={idx}
            transform={transform}
            stroke={stroke ?? defaultStroke}
            fill={fill ?? defaultFill}
            strokeWidth={strokeWidth ?? defaultStrokeWidth}
            {...gProps}
          >
            {/* Render the icon's inner content by cloning and stripping outer size */}
            <Icon width={24} height={24} />
          </g>
        );
      })}
    </svg>
  );
}

export default IconStack;
