import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function SolutionsPage() {
  return <CmsPage config={publicPageConfigs.solutions} />;
}
