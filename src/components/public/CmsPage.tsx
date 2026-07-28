import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ExternalLink, ImageIcon, Loader2, MapPin, Star } from "lucide-react";
import type { CollectionId } from "@/constants/collections";
import { ROUTES } from "@/constants/routes";
import { createRepository } from "@/services/appwrite/repository";
import { mediaService } from "@/services/appwrite/media.service";
import { formatAdminValue, type AdminRecord } from "@/utils/admin";

export interface PublicPageConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  collectionId: CollectionId;
  searchFields: string[];
  primaryField: string;
  descriptionField: string;
  imageField?: string;
  categoryField?: string;
  ctaLabel?: string;
  ctaPath?: string;
  fallback: AdminRecord[];
  variant?: "home" | "about" | "cards" | "portfolio" | "careers" | "testimonials" | "contact" | "legal";
}

export function CmsPage({ config }: { config: PublicPageConfig }) {
  const repository = createRepository<AdminRecord>(config.collectionId);
  const recordsQuery = useQuery({
    queryKey: ["public-cms", config.collectionId],
    queryFn: () =>
      repository.listPaginated({
        page: 1,
        pageSize: 48,
        sortBy: "sortOrder",
        sortDirection: "asc",
      }),
    retry: false,
  });

  const records = recordsQuery.data?.documents.length ? recordsQuery.data.documents : config.fallback;
  const featured = records[0] ?? config.fallback[0];

  return (
    <section className="overflow-hidden">
      <div className="relative border-b border-border/15 bg-panel">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{config.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {String(featured?.[config.primaryField] ?? config.title)}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-lg">
              {String(featured?.[config.descriptionField] ?? config.subtitle)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={config.ctaPath ?? ROUTES.QUOTE}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {config.ctaLabel ?? "Start a project"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={ROUTES.CONSULTATION}
                className="inline-flex items-center gap-2 rounded-full border border-border/25 px-5 py-3 text-sm font-bold text-foreground/80 hover:text-primary"
              >
                Book consultation
              </Link>
            </div>
          </div>

          <HeroVisual record={featured} imageField={config.imageField} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {recordsQuery.isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <PageBody config={config} records={records} />
        )}
      </div>
    </section>
  );
}

function HeroVisual({ record, imageField }: { record?: AdminRecord; imageField?: string }) {
  const imageId = imageField ? String(record?.[imageField] ?? "") : "";
  const imageUrl = imageId ? mediaService.previewUrl(imageId) : "";

  return (
    <div className="relative min-h-80">
      <div className="absolute inset-6 rounded-lg border border-border/20 bg-background shadow-2xl shadow-primary/10" />
      <div className="relative h-full min-h-80 overflow-hidden rounded-lg border border-border/15 bg-foreground text-background">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full min-h-80 w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-80 flex-col justify-between p-8">
            <ImageIcon className="h-12 w-12 opacity-70" />
            <div>
              <p className="font-display text-3xl font-bold">DAN Enterprise</p>
              <p className="mt-3 text-sm opacity-75">Software, automation, and growth systems for modern companies.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PageBody({ config, records }: { config: PublicPageConfig; records: AdminRecord[] }) {
  if (config.variant === "home") return <HomeBody records={records} config={config} />;
  if (config.variant === "about") return <AboutBody records={records} config={config} />;
  if (config.variant === "careers") return <CareersBody records={records} config={config} />;
  if (config.variant === "testimonials") return <TestimonialsBody records={records} config={config} />;
  if (config.variant === "contact") return <ContactBody />;
  if (config.variant === "legal") return <LegalBody records={records} config={config} />;
  return <CardGrid records={records} config={config} />;
}

function HomeBody({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  const stats = [
    ["50+", "Delivered systems"],
    ["12+", "Industries served"],
    ["99.9%", "Operational mindset"],
    ["24/7", "Support focus"],
  ];

  return (
    <div className="space-y-14">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-lg border border-border/15 bg-panel p-5">
            <p className="font-display text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-sm text-foreground/65">{label}</p>
          </div>
        ))}
      </div>
      <CardGrid records={records.slice(1)} config={config} />
    </div>
  );
}

function AboutBody({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-lg border border-border/15 bg-panel p-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Operating principles</p>
        <div className="mt-6 space-y-4">
          {["Clear communication", "Reliable engineering", "Measurable outcomes"].map((item) => (
            <div key={item} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <CardGrid records={records} config={config} />
    </div>
  );
}

function CareersBody({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  return (
    <div className="grid gap-4">
      {records.map((record) => (
        <article key={record.$id} className="rounded-lg border border-border/15 bg-panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{String(record[config.primaryField] ?? "Open role")}</h2>
              <p className="mt-2 text-sm text-foreground/65">{String(record[config.descriptionField] ?? "")}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-foreground/65">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/15 px-3 py-1">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {formatAdminValue(record.employmentType)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/15 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatAdminValue(record.location)}
                </span>
              </div>
            </div>
            <Link to={ROUTES.CONTACT} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              Apply now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function TestimonialsBody({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <article key={record.$id} className="rounded-lg border border-border/15 bg-panel p-6">
          <div className="flex gap-1 text-primary">
            {Array.from({ length: Number(record.rating ?? 5) }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-foreground/75">{String(record[config.descriptionField] ?? "")}</p>
          <p className="mt-5 font-display font-bold">{String(record[config.primaryField] ?? "Client")}</p>
          <p className="text-sm text-foreground/55">{formatAdminValue(record.clientCompany)}</p>
        </article>
      ))}
    </div>
  );
}

function ContactBody() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {[
        ["Email", "hello@danenterprise.com"],
        ["Phone", "+91 00000 00000"],
        ["Office", "Kerala, India"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border/15 bg-panel p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{label}</p>
          <p className="mt-3 font-display text-xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function LegalBody({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-border/15 bg-panel p-6">
      {records.map((record) => (
        <article key={record.$id} className="prose prose-slate max-w-none">
          <h2 className="font-display text-2xl font-bold">{String(record[config.primaryField] ?? config.title)}</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-foreground/75">
            {String(record[config.descriptionField] ?? config.subtitle)}
          </p>
        </article>
      ))}
    </div>
  );
}

function CardGrid({ records, config }: { records: AdminRecord[]; config: PublicPageConfig }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <article key={record.$id} className="group rounded-lg border border-border/15 bg-panel p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          {config.categoryField && record[config.categoryField] ? (
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {formatAdminValue(record[config.categoryField])}
            </p>
          ) : null}
          <h2 className="mt-3 font-display text-xl font-bold">{String(record[config.primaryField] ?? config.title)}</h2>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-foreground/68">
            {String(record[config.descriptionField] ?? config.subtitle)}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
            Explore
            <ExternalLink className="h-4 w-4" />
          </span>
        </article>
      ))}
    </div>
  );
}
