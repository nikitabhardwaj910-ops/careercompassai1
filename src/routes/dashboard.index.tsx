import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Send,
  Calendar,
  Target,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — CareerCompass AI" }] }),
  component: DashboardHome,
});

const stats = [
  { label: "Applications Sent", value: 24, trend: "+12%", icon: Send, color: "text-primary", bg: "bg-primary/10" },
  { label: "Interviews Scheduled", value: 6, trend: "+3", icon: Calendar, color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
  { label: "Avg Match Score", value: "87%", trend: "+5%", icon: Target, color: "text-[var(--color-secondary)]", bg: "bg-[var(--color-secondary)]/10" },
  { label: "Profile Completion", value: "82%", trend: "↑", icon: UserCheck, color: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning)]/15" },
];

const trendData = [
  { month: "Jan", applications: 3, interviews: 0 },
  { month: "Feb", applications: 5, interviews: 1 },
  { month: "Mar", applications: 4, interviews: 1 },
  { month: "Apr", applications: 8, interviews: 2 },
  { month: "May", applications: 12, interviews: 3 },
  { month: "Jun", applications: 18, interviews: 6 },
];

const skills = [
  { name: "Python", level: 92 },
  { name: "Machine Learning", level: 78 },
  { name: "React", level: 70 },
  { name: "SQL", level: 65 },
  { name: "System Design", level: 48 },
];

const statusData = [
  { name: "Applied", value: 12, color: "var(--color-primary)" },
  { name: "Interview", value: 6, color: "var(--color-accent)" },
  { name: "Offer", value: 2, color: "var(--color-secondary)" },
  { name: "Rejected", value: 4, color: "var(--color-muted-foreground)" },
];

const matches = [
  { company: "Globex", role: "ML Engineer Intern", match: 96, location: "Remote", logo: "G" },
  { company: "Initech", role: "Data Science Intern", match: 91, location: "Bangalore", logo: "I" },
  { company: "Hooli", role: "Frontend Intern", match: 88, location: "Hybrid", logo: "H" },
  { company: "Pied Piper", role: "AI Research Intern", match: 84, location: "Remote", logo: "P" },
];

function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between"
      >
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, <span className="gradient-text">Jane</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have 3 new matches and 1 interview this week.
          </p>
        </div>
        <Button asChild className="shrink-0 gradient-bg text-white border-0 hover:opacity-90">
          <Link to="/dashboard">
            <Sparkles className="h-4 w-4" /> Find new matches
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border/60 bg-card p-5 card-shadow transition-all hover:-translate-y-0.5 hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`grid h-9 w-9 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold">{s.value}</span>
              <span className="rounded-full bg-[var(--color-success)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-success)]">
                {s.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/60 bg-card p-5 card-shadow lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Application Activity</h2>
              <p className="text-xs text-muted-foreground">Applications and interviews over time</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="inline h-3 w-3" /> +28% this month
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="interviews" stroke="var(--color-accent)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/60 bg-card p-5 card-shadow"
        >
          <h2 className="font-display text-lg font-bold">Application Status</h2>
          <p className="text-xs text-muted-foreground">Current pipeline breakdown</p>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/60 bg-card p-5 card-shadow lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Top AI Matches</h2>
              <p className="text-xs text-muted-foreground">Ranked by resume + skill similarity</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {matches.map((m) => (
              <div key={m.role} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-bg font-bold text-white">
                  {m.logo}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{m.role}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {m.company} · {m.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-muted sm:block">
                    <div className="h-full gradient-bg" style={{ width: `${m.match}%` }} />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {m.match}%
                  </span>
                  <Button size="icon" variant="ghost" className="hidden sm:flex">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border/60 bg-card p-5 card-shadow"
        >
          <h2 className="font-display text-lg font-bold">Skill Progress</h2>
          <p className="text-xs text-muted-foreground">Based on resume + projects</p>
          <div className="mt-4 space-y-4">
            {skills.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.level}%</span>
                </div>
                <Progress value={s.level} className="mt-1.5 h-2" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
