import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function IndustriesPage() {
  return <CmsPage config={publicPageConfigs.industries} />;
}
