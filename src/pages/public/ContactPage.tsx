import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function ContactPage() {
  return <CmsPage config={publicPageConfigs.contact} />;
}
