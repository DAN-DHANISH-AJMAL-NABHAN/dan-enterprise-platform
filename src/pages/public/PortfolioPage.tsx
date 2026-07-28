import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function PortfolioPage() {
  return <CmsPage config={publicPageConfigs.portfolio} />;
}
