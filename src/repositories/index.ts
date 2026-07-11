import { COLLECTIONS } from "@/constants/collections";
import { createRepository } from "@/services/appwrite/repository";
import type {
  Project,
  Service,
  Testimonial,
  QuoteRequest,
  Appointment,
  JobPosting,
} from "@/types/entities";

export const projectsRepo = createRepository<Project>(COLLECTIONS.PROJECTS);
export const servicesRepo = createRepository<Service>(COLLECTIONS.SERVICES);
export const testimonialsRepo = createRepository<Testimonial>(COLLECTIONS.TESTIMONIALS);
export const quotesRepo = createRepository<QuoteRequest>(COLLECTIONS.QUOTES);
export const appointmentsRepo = createRepository<Appointment>(COLLECTIONS.APPOINTMENTS);
export const jobsRepo = createRepository<JobPosting>(COLLECTIONS.JOBS);

// Add the remaining collections (about, pricing, solutions, industries,
// technologies, clients, reviews, faqs, applications, media, seo, settings,
// navigation, footer, analytics) the same way as each entity type is needed.
