import { Badge } from "@/components/ui/badge";
import { getStatusTone } from "@/lib/utils";

export function StatusPill({
  label,
}: {
  label: Parameters<typeof getStatusTone>[0];
}) {
  const tone = getStatusTone(label);
  const variant =
    tone === "success" ? "success" : tone === "danger" ? "danger" : tone === "warning" ? "warning" : "neutral";

  return <Badge variant={variant}>{label}</Badge>;
}
