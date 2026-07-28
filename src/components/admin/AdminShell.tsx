import { Fragment, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { adminModules } from "@/modules/admin/adminModules";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

const groups = ["CMS", "Commerce", "People", "Inbox", "Dashboard", "System"] as const;

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    CMS: true,
    Inbox: true,
    System: true,
  });
  const [query, setQuery] = useState("");
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const activeModule = useMemo(
    () => adminModules.find((module) => module.route === location.pathname),
    [location.pathname],
  );

  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return adminModules;
    return adminModules.filter((module) =>
      [module.title, module.description, module.group].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [query]);

  const sidebar = (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-slate-200 bg-white/95 text-slate-900 shadow-xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 dark:text-slate-100",
        collapsed ? "w-20" : "w-80",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-white/10">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          D
        </Link>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">DAN Enterprise</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Admin Portal</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="ml-auto hidden h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10 lg:grid"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search admin modules"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
            />
          </label>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <NavLink
          to={ROUTES.ADMIN_DASHBOARD}
          className={({ isActive }) =>
            cn(
              "mb-2 flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
            )
          }
        >
          <Settings size={18} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {groups.map((group) => {
          const items = filteredModules.filter((module) => module.group === group);
          if (!items.length) return null;
          const open = collapsed || openGroups[group];
          return (
            <Fragment key={group}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setOpenGroups((state) => ({ ...state, [group]: !state[group] }))}
                  className="mt-4 flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {group}
                  <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
                </button>
              )}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {items.map((module) => (
                      <NavLink
                        key={module.id}
                        to={module.route}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "my-1 flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                            isActive
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                          )
                        }
                      >
                        <module.icon size={18} />
                        {!collapsed && <span className="truncate">{module.title}</span>}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{sidebar}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="relative w-80 max-w-[85vw]">
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("min-h-screen transition-all", collapsed ? "lg:pl-20" : "lg:pl-80")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 lg:hidden dark:border-white/10"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Admin / {activeModule?.group ?? "Dashboard"}</p>
            <h1 className="truncate font-display text-lg font-semibold">{activeModule?.title ?? "Dashboard"}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            <div className="group relative">
              <button className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-2 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                  {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-32 truncate text-sm md:block">{user?.name || user?.email}</span>
              </button>
              <div className="invisible absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 dark:border-white/10 dark:bg-slate-900">
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10">
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <button
        type="button"
        onClick={() => setMobileOpen(false)}
        className={cn("fixed right-4 top-4 z-[60] hidden h-10 w-10 place-items-center rounded-lg bg-white text-slate-900", mobileOpen && "grid lg:hidden")}
        aria-label="Close menu"
      >
        <X size={18} />
      </button>
    </div>
  );
}
