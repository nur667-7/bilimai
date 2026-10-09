"use client";
import React from "react";

const PIXEL_PALETTE = [
  "#355CFF",
  "#435DFF",
  "#535EFF",
  "#645FFF",
  "#755FF8",
  "#845EF2",
  "#7B6CF4",
  "#5D82F0",
  "#3B99E9",
  "#22AEE0",
  "#15B8C8",
  "#14B8A6"
] as const;

/**
 * Signature BilimAI logo mark: a 4x4 mosaic of crisp pixel blocks
 * transitioning from blue (#355CFF) -> lilac (#7C5CFC) -> teal (#14B8A6),
 * with the top-right block slightly offset to symbolize filling a knowledge gap.
 */
export function PixelBrandMark({ size = 28 }: { size?: number }) {
  const cells: Array<{ r: number; c: number; color: string; offset?: boolean }> = [
    { r: 0, c: 0, color: "#355CFF" },
    { r: 0, c: 1, color: "#4D5EFF" },
    { r: 0, c: 2, color: "#755FF8" },
    { r: 0, c: 3, color: "#14B8A6", offset: true },

    { r: 1, c: 0, color: "#355CFF" },
    { r: 1, c: 1, color: "#625FFF" },
    { r: 1, c: 2, color: "#845EF2" },
    { r: 1, c: 3, color: "#22AEE0" },

    { r: 2, c: 0, color: "#435DFF" },
    { r: 2, c: 1, color: "#755FF8" },
    { r: 2, c: 2, color: "#3B99E9" },
    { r: 2, c: 3, color: "#15B8C8" },

    { r: 3, c: 0, color: "#535EFF" },
    { r: 3, c: 1, color: "#5D82F0" },
    { r: 3, c: 2, color: "#15B8C8" },
    { r: 3, c: 3, color: "#14B8A6" }
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="pixel-brand-mark shrink-0"
    >
      {cells.map((cell, idx) => {
        const x = 2 + cell.c * 6 + (cell.offset ? 1 : 0);
        const y = 2 + cell.r * 6 - (cell.offset ? 1 : 0);
        return (
          <rect
            key={idx}
            x={x}
            y={y}
            width={5}
            height={5}
            rx={1.1}
            fill={cell.color}
          />
        );
      })}
    </svg>
  );
}

/**
 * Stepped pixel-block progress bar (blue -> lilac -> teal).
 * Used for topic mastery, 3-task practice progress, and exam completion.
 */
export function PixelProgressBar({
  value,
  max = 100,
  segments = 12,
  label,
  className = ""
}: {
  value: number;
  max?: number;
  segments?: number;
  label?: string;
  className?: string;
}) {
  const safeMax = Math.max(1, max);
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const activeBlocks = value > 0 ? Math.max(1, Math.round(ratio * segments)) : 0;

  return (
    <div
      className={`pixel-progress-track ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Прогресс"}
    >
      {Array.from({ length: segments }).map((_, idx) => {
        const isFilled = idx < activeBlocks;
        const colorIdx = Math.min(
          PIXEL_PALETTE.length - 1,
          Math.floor((idx / Math.max(1, segments - 1)) * (PIXEL_PALETTE.length - 1))
        );
        return (
          <span
            key={idx}
            className={`pixel-progress-cell ${isFilled ? "filled" : ""}`}
            style={
              isFilled
                ? ({ "--pixel-cell-color": PIXEL_PALETTE[colorIdx] } as React.CSSProperties)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

/**
 * First-screen pixel-mosaic illustration: individual pixel blocks (right)
 * assembling into a whole structured grid (left) — metaphor of filling gaps in knowledge.
 */
export function PixelKnowledgeMosaic({ className = "" }: { className?: string }) {
  // 14 cols x 4 rows of 10x10 pixel blocks with 3px gap
  const rows = 4;
  const cols = 14;
  const blocks: Array<{
    x: number;
    y: number;
    color: string;
    opacity: number;
  }> = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Create a "gap filling" pattern on the right columns
      const isGapHole =
        (r === 0 && (c === 9 || c === 11 || c === 12)) ||
        (r === 1 && (c === 10 || c === 13)) ||
        (r === 2 && c === 12) ||
        (r === 3 && (c === 11 || c === 13));

      const isFloatingBlock =
        (r === 0 && c === 13) ||
        (r === 1 && c === 11) ||
        (r === 2 && c === 13);

      const paletteIdx = Math.min(
        PIXEL_PALETTE.length - 1,
        Math.floor(((c + r * 0.6) / (cols + 1)) * PIXEL_PALETTE.length)
      );

      const dx = isFloatingBlock ? 3 : 0;
      const dy = isFloatingBlock ? -2 : 0;

      blocks.push({
        x: 6 + c * 13 + dx,
        y: 6 + r * 13 + dy,
        color: isGapHole ? "currentColor" : PIXEL_PALETTE[paletteIdx],
        opacity: isGapHole ? 0.11 : isFloatingBlock ? 0.85 : 0.95
      });
    }
  }

  return (
    <div className={`pixel-mosaic-banner ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 192 60"
        fill="none"
        className="pixel-mosaic-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={10}
            height={10}
            rx={2}
            fill={b.color}
            fillOpacity={b.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
