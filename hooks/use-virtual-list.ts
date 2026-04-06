"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface VirtualMeasurement {
  index: number;
  start: number;
  end: number;
  size: number;
}

function findStartIndex(measurements: VirtualMeasurement[], value: number) {
  let low = 0;
  let high = measurements.length - 1;
  let result = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const measurement = measurements[middle];

    if (measurement.end >= value) {
      result = middle;
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  return result;
}

function findEndIndex(measurements: VirtualMeasurement[], value: number) {
  let low = 0;
  let high = measurements.length - 1;
  let result = measurements.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const measurement = measurements[middle];

    if (measurement.start <= value) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return result;
}

export function useVirtualList<T>({
  estimateSize,
  items,
  overscan = 8,
}: {
  estimateSize: (item: T, index: number) => number;
  items: T[];
  overscan?: number;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const element = parentRef.current;

    if (!element) {
      return;
    }

    const scrollElement: HTMLDivElement = element;

    function handleScroll() {
      setScrollTop(scrollElement.scrollTop);
    }

    function handleResize() {
      setViewportHeight(scrollElement.clientHeight);
    }

    handleScroll();
    handleResize();

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const measurements = useMemo(() => {
    return items.reduce<VirtualMeasurement[]>((accumulator, item, index) => {
      const previousEnd = accumulator[accumulator.length - 1]?.end ?? 0;
      const size = estimateSize(item, index);

      accumulator.push({
        index,
        start: previousEnd,
        end: previousEnd + size,
        size,
      });

      return accumulator;
    }, []);
  }, [estimateSize, items]);

  const totalSize = measurements[measurements.length - 1]?.end ?? 0;

  const virtualItems = useMemo(() => {
    if (measurements.length === 0) {
      return [];
    }

    const visibleStart = findStartIndex(measurements, scrollTop);
    const visibleEnd = findEndIndex(measurements, scrollTop + viewportHeight);
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(measurements.length - 1, visibleEnd + overscan);

    return measurements.slice(startIndex, endIndex + 1);
  }, [measurements, overscan, scrollTop, viewportHeight]);

  return {
    measurements,
    parentRef,
    totalSize,
    virtualItems,
  };
}
