import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function AboutPage() {
  return <CmsPage config={publicPageConfigs.about} />;
}
