import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function PrivacyPage() {
  return <CmsPage config={publicPageConfigs.privacy} />;
}
