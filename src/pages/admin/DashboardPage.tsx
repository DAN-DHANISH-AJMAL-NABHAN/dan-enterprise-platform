import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminModulesById, dashboardCards, quickActionModuleIds } from "@/modules/admin/adminModules";
import { createRepository } from "@/services/appwrite/repository";
import { COLLECTIONS } from "@/constants/collections";
import { formatAdminValue, type AdminRecord } from "@/utils/admin";

const monthlyData = [
  { month: "Jan", visitors: 4200, leads: 78, projects: 7, applications: 22, traffic: 61 },
  { month: "Feb", visitors: 5100, leads: 96, projects: 9, applications: 30, traffic: 68 },
  { month: "Mar", visitors: 5700, leads: 121, projects: 12, applications: 38, traffic: 74 },
  { month: "Apr", visitors: 6300, leads: 144, projects: 14, applications: 44, traffic: 79 },
  { month: "May", visitors: 7100, leads: 158, projects: 18, applications: 57, traffic: 83 },
  { month: "Jun", visitors: 7800, leads: 176, projects: 21, applications: 63, traffic: 88 },
];

export function DashboardPage() {
  const metricsQuery = useQuery({
    queryKey: ["admin-dashboard", "metrics"],
    queryFn: async () => {
      const counts = await Promise.all(
        dashboardCards.map(async (card) => ({
          label: card.label,
          icon: card.icon,
          value: await createRepository(card.collectionId).count(),
        })),
      );
      return counts;
    },
  });

  const activityQuery = useQuery({
    queryKey: ["admin-dashboard", "activity"],
    queryFn: async () => {
      const repo = createRepository<AdminRecord>(COLLECTIONS.AUDIT_LOGS);
      return repo.listPaginated({
        page: 1,
        pageSize: 8,
        sortBy: "$createdAt",
        sortDirection: "desc",
        includeDeleted: true,
      });
    },
    retry: false,
  });

  const notificationsQuery = useQuery({
    queryKey: ["admin-dashboard", "notifications"],
    queryFn: async () => {
      const [quotes, contacts, applications] = await Promise.all([
        createRepository<AdminRecord>(COLLECTIONS.QUOTES).rawList([Query.limit(4), Query.orderDesc("$createdAt")]),
        createRepository<AdminRecord>(COLLECTIONS.CONTACT_REQUESTS).rawList([Query.limit(4), Query.orderDesc("$createdAt")]),
        createRepository<AdminRecord>(COLLECTIONS.APPLICATIONS).rawList([Query.limit(4), Query.orderDesc("$createdAt")]),
      ]);
      return [...quotes.documents, ...contacts.documents, ...applications.documents]
        .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
        .slice(0, 8);
    },
    retry: false,
  });

  const metrics = metricsQuery.data ?? [];
  const quickActions = quickActionModuleIds
    .map((id) => adminModulesById.get(id))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card, index) => {
          const metric = metrics.find((item) => item.label === card.label);
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <card.icon size={19} />
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 font-display text-3xl font-bold">
                {metricsQuery.isLoading ? "..." : metric?.value ?? 0}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Monthly Visitors & Leads</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Traffic and lead acquisition trend.</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#0f172a" fill="url(#visitors)" />
                <Line type="monotone" dataKey="leads" stroke="#16a34a" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="font-display text-lg font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((module) => (
              <Link
                key={module.id}
                to={module.route}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/10"
              >
                <span className="flex items-center gap-2">
                  <module.icon size={16} /> Manage {module.title}
                </span>
                <span>Open</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <ChartCard title="Projects Growth">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="projects" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Applications">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="applications" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Traffic Quality">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area dataKey="traffic" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Feed title="Recent Activities" loading={activityQuery.isLoading}>
          {(activityQuery.data?.documents ?? []).map((item) => (
            <li key={item.$id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <p className="font-medium">{formatAdminValue(item.action)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatAdminValue(item.actorName)} changed {formatAdminValue(item.entityType)}
              </p>
            </li>
          ))}
        </Feed>
        <Feed title="Latest Notifications" loading={notificationsQuery.isLoading}>
          {(notificationsQuery.data ?? []).map((item) => (
            <li key={item.$id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
              <p className="font-medium">
                {formatAdminValue(item.contactName ?? item.name ?? item.applicantName ?? item.email)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{formatAdminValue(item.$createdAt)}</p>
            </li>
          ))}
        </Feed>
      </div>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function Feed({ title, loading, children }: { title: string; loading: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-white/10" />
          ))
        ) : (
          children
        )}
      </ul>
    </div>
  );
}
