import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminAuthBoundary } from "@/routes/AdminAuthBoundary";

import { HomePage } from "@/pages/public/HomePage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { SolutionsPage } from "@/pages/public/SolutionsPage";
import { PortfolioPage } from "@/pages/public/PortfolioPage";
import { ProjectDetailPage } from "@/pages/public/ProjectDetailPage";
import { TechnologiesPage } from "@/pages/public/TechnologiesPage";
import { IndustriesPage } from "@/pages/public/IndustriesPage";
import { TestimonialsPage } from "@/pages/public/TestimonialsPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { CareersPage } from "@/pages/public/CareersPage";
import { JobDetailPage } from "@/pages/public/JobDetailPage";
import { QuotePage } from "@/pages/public/QuotePage";
import { ConsultationPage } from "@/pages/public/ConsultationPage";
import { FaqPage } from "@/pages/public/FaqPage";
import { PrivacyPage } from "@/pages/public/PrivacyPage";
import { TermsPage } from "@/pages/public/TermsPage";
import { LoginPage } from "@/pages/public/LoginPage";

import { DashboardPage } from "@/pages/admin/DashboardPage";
import { ServiceManagementPage } from "@/pages/admin/ServiceManagementPage";
import { SolutionManagementPage } from "@/pages/admin/SolutionManagementPage";
import { IndustryManagementPage } from "@/pages/admin/IndustryManagementPage";
import { PortfolioManagementPage } from "@/pages/admin/PortfolioManagementPage";
import { TechnologyManagementPage } from "@/pages/admin/TechnologyManagementPage";
import { QuoteManagementPage } from "@/pages/admin/QuoteManagementPage";
import { AppointmentManagementPage } from "@/pages/admin/AppointmentManagementPage";
import { CareerManagementPage } from "@/pages/admin/CareerManagementPage";
import { TestimonialManagementPage } from "@/pages/admin/TestimonialManagementPage";
import { MediaLibraryPage } from "@/pages/admin/MediaLibraryPage";
import { ContactManagementPage } from "@/pages/admin/ContactManagementPage";
import { AnalyticsPage } from "@/pages/admin/AnalyticsPage";
import { SeoManagementPage } from "@/pages/admin/SeoManagementPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.SERVICES, element: <ServicesPage /> },
      { path: ROUTES.SOLUTIONS, element: <SolutionsPage /> },
      { path: ROUTES.PORTFOLIO, element: <PortfolioPage /> },
      { path: ROUTES.PROJECT_DETAIL, element: <ProjectDetailPage /> },
      { path: ROUTES.TECHNOLOGIES, element: <TechnologiesPage /> },
      { path: ROUTES.INDUSTRIES, element: <IndustriesPage /> },
      { path: ROUTES.TESTIMONIALS, element: <TestimonialsPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
      { path: ROUTES.CAREERS, element: <CareersPage /> },
      { path: ROUTES.JOB_DETAIL, element: <JobDetailPage /> },
      { path: ROUTES.QUOTE, element: <QuotePage /> },
      { path: ROUTES.CONSULTATION, element: <ConsultationPage /> },
      { path: ROUTES.FAQ, element: <FaqPage /> },
      { path: ROUTES.PRIVACY, element: <PrivacyPage /> },
      { path: ROUTES.TERMS, element: <TermsPage /> },
      {
        element: <AdminAuthBoundary />,
        children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
      },
    ],
  },
  {
    element: <AdminAuthBoundary />,
    children: [
      {
        path: "/admin",
        element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
      },
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: ROUTES.ADMIN_DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.ADMIN_SERVICES, element: <ServiceManagementPage /> },
          { path: ROUTES.ADMIN_SOLUTIONS, element: <SolutionManagementPage /> },
          { path: ROUTES.ADMIN_INDUSTRIES, element: <IndustryManagementPage /> },
          { path: ROUTES.ADMIN_PORTFOLIO, element: <PortfolioManagementPage /> },
          { path: ROUTES.ADMIN_TECHNOLOGIES, element: <TechnologyManagementPage /> },
          { path: ROUTES.ADMIN_QUOTES, element: <QuoteManagementPage /> },
          { path: ROUTES.ADMIN_APPOINTMENTS, element: <AppointmentManagementPage /> },
          { path: ROUTES.ADMIN_CAREERS, element: <CareerManagementPage /> },
          { path: ROUTES.ADMIN_TESTIMONIALS, element: <TestimonialManagementPage /> },
          { path: ROUTES.ADMIN_MEDIA, element: <MediaLibraryPage /> },
          { path: ROUTES.ADMIN_CONTACT, element: <ContactManagementPage /> },
          { path: ROUTES.ADMIN_ANALYTICS, element: <AnalyticsPage /> },
          { path: ROUTES.ADMIN_SEO, element: <SeoManagementPage /> },
          { path: ROUTES.ADMIN_SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
]);