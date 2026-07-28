import { CmsPage } from "@/components/public/CmsPage";
import { publicPageConfigs } from "@/modules/public/publicPages";

export function TestimonialsPage() {
  return <CmsPage config={publicPageConfigs.testimonials} />;
}
