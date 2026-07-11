import { z } from "zod";

export const quoteRequestSchema = z.object({
  projectType: z.string().min(1, "Select a project type"),
  budgetRange: z.string().min(1, "Select a budget range"),
  timeline: z.string().min(1, "Select a timeline"),
  requirements: z.string().min(20, "Please provide more detail (min. 20 characters)"),
  contactName: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

// Repeat this pattern per form: appointmentSchema, jobApplicationSchema,
// contactMessageSchema, etc. in sibling files in this folder.
