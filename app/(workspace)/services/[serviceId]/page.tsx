import { ServiceDetailShell } from "@/features/services/components/service-detail-shell";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  return <ServiceDetailShell serviceId={serviceId} />;
}
