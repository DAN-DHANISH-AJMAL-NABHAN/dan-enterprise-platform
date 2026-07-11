/**
 * Collection ID constants. Keep this in sync with appwrite/schema.json —
 * that file is the source of truth for attributes/indexes, this is the
 * source of truth for the ID strings used in application code.
 */
export const COLLECTIONS = {
  COMPANY: "company",
  HOME: "home",
  ABOUT: "about",
  SERVICES: "services",
  PRICING: "pricing",
  SOLUTIONS: "solutions",
  INDUSTRIES: "industries",
  PORTFOLIO: "portfolio",
  PROJECTS: "projects",
  PROJECT_IMAGES: "project_images",
  PROJECT_VIDEOS: "project_videos",
  TECHNOLOGIES: "technologies",
  CLIENTS: "clients",
  TESTIMONIALS: "testimonials",
  REVIEWS: "reviews",
  FAQS: "faqs",
  CAREER: "career",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  QUOTES: "quotes",
  APPOINTMENTS: "appointments",
  MEDIA: "media",
  SEO: "seo",
  SETTINGS: "settings",
  NAVIGATION: "navigation",
  FOOTER: "footer",
  ANALYTICS: "analytics",
} as const;

export type CollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
