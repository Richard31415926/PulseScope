import type { ReadonlyURLSearchParams } from "next/navigation";

export function getSelectedSpanId(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) {
  return searchParams.get("span");
}

export function buildTraceDetailSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  spanId: string | null,
) {
  const next = new URLSearchParams(searchParams.toString());

  if (!spanId) {
    next.delete("span");
  } else {
    next.set("span", spanId);
  }

  return next.toString();
}
