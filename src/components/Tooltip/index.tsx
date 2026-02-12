import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.scss";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** The content to display in the tooltip */
  content: string | React.ReactNode;

  /** The element that triggers the tooltip */
  children: React.ReactElement;

  /** Preferred position of the tooltip relative to the trigger element */
  position?: TooltipPosition;

  /** Delay in milliseconds before showing the tooltip */
  delay?: number;

  /** Distance in pixels between the tooltip and the trigger element */
  offset?: number;

  /** Whether the tooltip is disabled */
  disabled?: boolean;

  /** Additional CSS class for custom styling */
  className?: string;
}

interface TooltipCoordinates {
  top: number;
  left: number;
  position: TooltipPosition;
}

/**
 * Unified Tooltip component using React Portal
 *
 * Renders tooltips outside the normal DOM hierarchy to avoid clipping issues
 * with overflow containers. Automatically adjusts position based on viewport boundaries.
 *
 * @example
 * <Tooltip content="Click to save" position="top">
 *   <button>Save</button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 100, // Faster default - more reactive
  offset = 8,
  disabled = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoordinates | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Calculate tooltip position based on trigger element and preferred position
   * Automatically adjusts if tooltip would go off-screen
   */
  const calculatePosition = (): TooltipCoordinates | null => {
    if (!triggerRef.current || !tooltipRef.current) return null;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let finalPosition = position;

    // Calculate position based on preference
    switch (position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Check if tooltip goes above viewport
        if (top < 0) {
          finalPosition = "bottom";
          top = triggerRect.bottom + offset;
        }
        break;

      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Check if tooltip goes below viewport
        if (top + tooltipRect.height > viewportHeight) {
          finalPosition = "top";
          top = triggerRect.top - tooltipRect.height - offset;
        }
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - offset;

        // Check if tooltip goes left of viewport
        if (left < 0) {
          finalPosition = "right";
          left = triggerRect.right + offset;
        }
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + offset;

        // Check if tooltip goes right of viewport
        if (left + tooltipRect.width > viewportWidth) {
          finalPosition = "left";
          left = triggerRect.left - tooltipRect.width - offset;
        }
        break;
    }

    // Ensure tooltip doesn't overflow horizontally
    if (left < 0) {
      left = 8; // 8px padding from edge
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    // Ensure tooltip doesn't overflow vertically
    if (top < 0) {
      top = 8;
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    return { top, left, position: finalPosition };
  };

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Attach event handlers to trigger element using ref callback
  const attachHandlers = useCallback(
    (node: HTMLElement | null) => {
      // Remove event listeners from previous node
      if (triggerRef.current) {
        triggerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        triggerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      // Attach event listeners to new node
      if (node) {
        triggerRef.current = node;
        node.addEventListener("mouseenter", handleMouseEnter);
        node.addEventListener("mouseleave", handleMouseLeave);
      } else {
        triggerRef.current = null;
      }
    },
    [handleMouseEnter, handleMouseLeave]
  );

  // Update tooltip position when it becomes visible or window resizes
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const newCoords = calculatePosition();
      setCoords(newCoords);

      // Recalculate on scroll or resize
      const handleUpdate = () => {
        const newCoords = calculatePosition();
        setCoords(newCoords);
      };

      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isVisible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone children and attach ref + event handlers
  const childProps = children.props as Record<string, any>;
  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    ...childProps,
    ref: attachHandlers,
  });

  // Always render tooltip but position it off-screen initially to measure it
  const tooltipElement = (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${coords ? styles[`tooltip--${coords.position}`] : ""} ${className}`}
      style={{
        top: coords ? `${coords.top}px` : "-9999px",
        left: coords ? `${coords.left}px` : "-9999px",
        opacity: isVisible && coords ? 1 : 0,
        pointerEvents: "none",
      }}
      role="tooltip"
    >
      <div className={styles.tooltipContent}>{content}</div>
    </div>
  );

  return (
    <>
      {trigger}
      {createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip;
