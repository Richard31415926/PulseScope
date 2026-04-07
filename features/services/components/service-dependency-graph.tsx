import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServiceDependencyGraph({
  dependencies,
  dependents,
  serviceName,
}: {
  dependencies: string[];
  dependents: string[];
  serviceName: string;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px_minmax(0,1fr)] xl:items-center">
      <DependencyColumn align="right" items={dependents} title="Dependents" />

      <div className="relative mx-auto flex min-h-[220px] w-full items-center justify-center">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/8" />
        <div className="absolute top-6 bottom-6 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <div className="surface-elevated relative z-10 flex h-44 w-full max-w-[240px] flex-col items-center justify-center rounded-[32px] border border-white/12 p-6 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/54">
            <ArrowRightLeft className="size-5" />
          </div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
            Service node
          </div>
          <div className="mt-3 break-words font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            {serviceName}
          </div>
        </div>
      </div>

      <DependencyColumn items={dependencies} title="Dependencies" />
    </div>
  );
}

function DependencyColumn({
  align = "left",
  items,
  title,
}: {
  align?: "left" | "right";
  items: string[];
  title: string;
}) {
  return (
    <div className={cn("space-y-3", align === "right" && "xl:text-right")}>
      <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
        {title}
      </div>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            className={cn(
              "relative rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-4 py-4 text-sm text-white/74",
              align === "right" && "xl:mr-8",
              align === "left" && "xl:ml-8",
            )}
            key={`${title}-${item}`}
          >
            <div
              className={cn(
                "absolute top-1/2 hidden h-px w-8 -translate-y-1/2 bg-white/10 xl:block",
                align === "right" ? "-right-8" : "-left-8",
              )}
            />
            {item}
          </div>
        ))
      ) : (
        <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-white/42">
          No linked services in this direction.
        </div>
      )}
    </div>
  );
}
