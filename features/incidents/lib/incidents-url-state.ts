import type { ReadonlyURLSearchParams } from "next/navigation";

export function getSelectedIncidentId(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) {
  return searchParams.get("incident");
}

export function buildIncidentSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  incidentId: string | null,
) {
  const next = new URLSearchParams(searchParams.toString());

  if (!incidentId) {
    next.delete("incident");
  } else {
    next.set("incident", incidentId);
  }

  return next.toString();
}
