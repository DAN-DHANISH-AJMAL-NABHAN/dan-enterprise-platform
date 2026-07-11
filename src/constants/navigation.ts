import { ROUTES } from "@/constants/routes";

/**
 * Placeholder nav data. Once the `navigation` collection is wired up
 * (see repositories/index.ts), replace this with a query — the shape
 * below matches what that collection returns, so the swap is a 1:1 change
 * in SiteHeader/SiteFooter, not a redesign.
 */
export const PRIMARY_NAV = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About", path: ROUTES.ABOUT },
  { label: "Services", path: ROUTES.SERVICES },
  { label: "Solutions", path: ROUTES.SOLUTIONS },
  { label: "Portfolio", path: ROUTES.PORTFOLIO },
  { label: "Technologies", path: ROUTES.TECHNOLOGIES },
  { label: "Industries", path: ROUTES.INDUSTRIES },
  { label: "Testimonials", path: ROUTES.TESTIMONIALS },
  { label: "Careers", path: ROUTES.CAREERS },
  { label: "Contact", path: ROUTES.CONTACT },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", path: ROUTES.ABOUT },
      { label: "Careers", path: ROUTES.CAREERS },
      { label: "Contact", path: ROUTES.CONTACT },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "Services", path: ROUTES.SERVICES },
      { label: "Solutions", path: ROUTES.SOLUTIONS },
      { label: "Portfolio", path: ROUTES.PORTFOLIO },
      { label: "Industries", path: ROUTES.INDUSTRIES },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", path: ROUTES.FAQ },
      { label: "Testimonials", path: ROUTES.TESTIMONIALS },
      { label: "Get a Quote", path: ROUTES.QUOTE },
      { label: "Book a Consultation", path: ROUTES.CONSULTATION },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", path: ROUTES.PRIVACY },
      { label: "Terms & Conditions", path: ROUTES.TERMS },
    ],
  },
] as const;
