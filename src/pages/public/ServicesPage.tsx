import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function ServicesPage() {
  return <CmsPage config={publicPageConfigs.services} />;
}
