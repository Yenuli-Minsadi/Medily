import React, { useState, useEffect } from "react";

export function useMasonryColumns(
  containerRef: React.RefObject<HTMLDivElement | null>,
  colWidth = 260,
  gap = 14
): number {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCols(Math.max(1, Math.floor((w + gap) / (colWidth + gap))));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, colWidth, gap]);

  return cols;
}