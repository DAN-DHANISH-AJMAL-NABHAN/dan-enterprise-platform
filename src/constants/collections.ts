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
  PRODUCTS: "products",
  PROJECT_IMAGES: "project_images",
  PROJECT_VIDEOS: "project_videos",
  TECHNOLOGIES: "technologies",
  CLIENTS: "clients",
  TESTIMONIALS: "testimonials",
  TEAM_MEMBERS: "team_members",
  BLOGS: "blogs",
  GALLERY: "gallery",
  CONTACT_REQUESTS: "contact_requests",
  NEWSLETTER: "newsletter_subscribers",
  POLICIES: "policies",
  MENUS: "menus",
  USERS: "admin_users",
  AUDIT_LOGS: "audit_logs",
  LOGIN_HISTORY: "login_history",
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
