import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function FaqPage() {
  return <CmsPage config={publicPageConfigs.faq} />;
}
