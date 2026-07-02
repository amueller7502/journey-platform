import { FeatureRouteGuard } from "@/components/FeatureRouteGuard";
import { TvDashboard } from "@/components/tv/TvDashboard";

export default function TvPage() {
  return (
    <FeatureRouteGuard featureId="tv_display">
      <TvDashboard />
    </FeatureRouteGuard>
  );
}
