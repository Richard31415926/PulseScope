import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class PointerEventMock extends MouseEvent {}

globalThis.ResizeObserver = ResizeObserverMock;
globalThis.PointerEvent = PointerEventMock as typeof PointerEvent;
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
HTMLElement.prototype.releasePointerCapture = vi.fn();
HTMLElement.prototype.setPointerCapture = vi.fn();

afterEach(() => {
  cleanup();
});
