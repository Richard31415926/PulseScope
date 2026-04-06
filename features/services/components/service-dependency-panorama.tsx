import { ArrowRight } from "lucide-react";
import { HealthIndicator } from "@/components/shell/health-indicator";
import type { ServiceRecord } from "@/types/pulsescope";

export function ServiceDependencyPanorama({
  services,
}: {
  services: ServiceRecord[];
}) {
  const featured = [...services]
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "error" ? -1 : left.status === "slow" ? -1 : 1;
      }

      return right.dependencies.length - left.dependencies.length;
    })
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {featured.map((service) => (
        <div
          className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
          key={service.id}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-white">{service.name}</div>
              <div className="mt-1 text-sm text-white/42">{service.owner}</div>
            </div>
            <HealthIndicator compact status={service.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-black/16 px-3 py-2 text-xs text-white/74">
              {service.name}
            </div>
            {service.dependencies.map((dependency) => (
              <div className="flex items-center gap-2" key={`${service.id}-${dependency}`}>
                <ArrowRight className="size-3.5 text-white/24" />
                <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/56">
                  {dependency}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
