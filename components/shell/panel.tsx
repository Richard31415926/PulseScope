import { cn } from "@/lib/utils";

interface SurfacePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function SurfacePanel({
  className,
  title,
  description,
  action,
  children,
  ...props
}: SurfacePanelProps) {
  return (
    <section
      className={cn(
        "surface-panel min-w-0 rounded-[28px] border border-white/10 p-5 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {title || description || action ? (
        <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            {title ? (
              <h2 className="pl-0.5 font-display text-[1.1rem] font-semibold leading-snug tracking-[-0.03em] text-white [overflow-wrap:anywhere]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-white/50 [overflow-wrap:anywhere]">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="min-w-0 shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
