import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function HomePage() {
  return <CmsPage config={publicPageConfigs.home} />;
}
