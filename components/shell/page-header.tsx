import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between", className)}>
      <div className="space-y-4">
        <Badge className="w-fit" variant="info">
          {eyebrow}
        </Badge>
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-balance text-base leading-7 text-white/56 md:text-lg">
            {description}
          </p>
        </div>
        {meta ? <div className="flex flex-wrap gap-3">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
