import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  density?: "comfortable" | "compact" | "tight";
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
  density = "compact",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "grid border-b border-white/8 2xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)] 2xl:items-end",
        density === "comfortable" && "gap-6 pb-6",
        density === "compact" && "gap-4 pb-4",
        density === "tight" && "gap-3 pb-3",
        className,
      )}
    >
      <div
        className={cn(
          "min-w-0",
          density === "comfortable" && "space-y-4",
          density === "compact" && "space-y-3",
          density === "tight" && "space-y-2.5",
        )}
      >
        <Badge className="w-fit" variant="info">
          {eyebrow}
        </Badge>
        <div
          className={cn(
            "min-w-0",
            density === "comfortable" && "space-y-3",
            density === "compact" && "space-y-2.5",
            density === "tight" && "space-y-2",
          )}
        >
          <h1
            className={cn(
              "max-w-4xl font-display font-semibold tracking-[-0.055em] text-white",
              density === "comfortable" && "text-[clamp(2.8rem,4vw,4.6rem)]",
              density === "compact" && "text-[clamp(2.35rem,3.3vw,3.6rem)]",
              density === "tight" && "text-[clamp(2rem,3vw,3rem)]",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "max-w-3xl text-balance text-white/58",
              density === "comfortable" && "text-base leading-7 md:text-[1.05rem]",
              density === "compact" && "text-[0.97rem] leading-6 md:text-base",
              density === "tight" && "text-sm leading-6 md:text-[0.97rem]",
            )}
          >
            {description}
          </p>
        </div>
        {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="min-w-0 2xl:justify-self-end">
          <div className="min-w-0">{actions}</div>
        </div>
      ) : null}
    </header>
  );
}
