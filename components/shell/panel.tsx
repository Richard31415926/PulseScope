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
        "surface-panel rounded-[28px] border border-white/10 p-5 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {title || description || action ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? <h2 className="font-display text-lg font-semibold text-white">{title}</h2> : null}
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-white/50">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
