import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function TermsPage() {
  return <CmsPage config={publicPageConfigs.terms} />;
}
