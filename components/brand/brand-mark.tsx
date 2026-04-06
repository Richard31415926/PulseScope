import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "gap-2.5")}>
      <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-[18px] border border-white/12 bg-white/[0.065]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(120,138,255,0.55),transparent_42%),radial-gradient(circle_at_70%_70%,rgba(66,170,255,0.18),transparent_40%)]" />
        <div className="absolute inset-[1px] rounded-[17px] border border-white/6" />
        <Activity className="relative size-5 text-white" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="font-display text-[15px] font-semibold tracking-[0.14em] text-white uppercase">
          PulseScope
        </div>
        {!compact ? <div className="text-xs text-white/42">Observability cockpit</div> : null}
      </div>
    </div>
  );
}
