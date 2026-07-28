import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function TechnologiesPage() {
  return <CmsPage config={publicPageConfigs.technologies} />;
}
