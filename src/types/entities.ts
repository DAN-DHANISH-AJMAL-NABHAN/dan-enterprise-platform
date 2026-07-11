export type RecordStatus = "draft" | "published" | "archived";

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  schemaType?:
    | "Organization"
    | "WebSite"
    | "Service"
    | "Article"
    | "FAQPage"
    | "Project"
    | "BreadcrumbList";
  robots?: string;
}

/**
 * Every Appwrite collection in this project extends this shape.
 * $id/$createdAt/$updatedAt are provided natively by Appwrite documents;
 * slug/status/seo are the app-level fields the spec asks for on every entity.
 */
export interface BaseRecord {
  $id: string;
  slug: string;
  status: RecordStatus;
  seo?: SeoMeta;
  $createdAt: string;
  $updatedAt: string;
}

export interface Project extends BaseRecord {
  title: string;
  summary: string;
  clientId?: string;
  industryIds: string[];
  technologyIds: string[];
  liveUrl?: string;
  coverImageId?: string;
  rating?: number;
}

export interface Service extends BaseRecord {
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  iconId?: string;
  featured: boolean;
}

export interface Testimonial extends BaseRecord {
  clientName: string;
  clientCompany?: string;
  quote: string;
  rating: number;
  avatarId?: string;
  videoId?: string;
}

export interface QuoteRequest extends BaseRecord {
  projectType: string;
  budgetRange: string;
  timeline: string;
  requirements: string;
  attachmentIds: string[];
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface Appointment extends BaseRecord {
  contactName: string;
  contactEmail: string;
  meetingType: "video" | "phone" | "in-person";
  scheduledAt: string;
  durationMinutes: number;
  googleMeetLink?: string;
  notes?: string;
}

export interface JobPosting extends BaseRecord {
  title: string;
  department: string;
  location: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  description: string;
}
