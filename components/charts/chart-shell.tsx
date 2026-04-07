import { cn } from "@/lib/utils";

interface ChartShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  headline: React.ReactNode;
  supporting?: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartShell({
  action,
  children,
  className,
  description,
  headline,
  supporting,
  title,
  ...props
}: ChartShellProps) {
  return (
    <section
      className={cn(
        "surface-panel min-w-0 rounded-[30px] border border-white/10 p-5 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <div className="mb-5 flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="font-display text-xl font-semibold tracking-[-0.03em] text-white">{title}</div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/48">{description}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
              {headline}
            </div>
            {supporting ? <div className="pb-1">{supporting}</div> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
