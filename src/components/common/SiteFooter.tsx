import { Link } from "react-router-dom";
import { Linkedin, Github, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FOOTER_COLUMNS } from "@/constants/navigation";

const SOCIAL_LINKS = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "X", icon: Twitter, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/15 bg-panel">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-card bg-primary text-primary-foreground">
                E
              </span>
              Enterprise
            </Link>
            <p className="mt-3 max-w-xs text-sm text-foreground/65">
              Websites, applications, and AI solutions built for companies that need
              software to actually work.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/20 text-foreground/60 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/50">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/15 pt-6 text-xs text-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Enterprise Software Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to={ROUTES.PRIVACY} className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to={ROUTES.TERMS} className="hover:text-primary">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
