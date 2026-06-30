import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Send,
  Calendar,
  Target,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Bot,
  Zap,
  FileSearch,
  Activity,
  Trophy,
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
import { HoverSpotlightCard } from "@/components/ui/HoverSpotlightCard";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — CareerCompass AI" }] }),
  component: DashboardHome,
});

const stats = [
  { label: "Total Jobs Matched", value: 142, trend: "+24 this week", icon: Briefcase, color: "text-primary border-primary/20 bg-primary/5 shadow-primary/5", glow: "from-primary/10 to-transparent" },
  { label: "Internship Matches", value: 38, trend: "+12 this week", icon: Sparkles, color: "text-[var(--color-secondary)] border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 shadow-secondary/5", glow: "from-[var(--color-secondary)]/10 to-transparent" },
  { label: "Resume Score", value: "92%", trend: "Top 5%", icon: FileSearch, color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5", glow: "from-emerald-500/10 to-transparent" },
  { label: "Skills Completed", value: 18, trend: "+3 new", icon: CheckCircle2, color: "text-amber-500 border-amber-500/20 bg-amber-500/5 shadow-amber-500/5", glow: "from-amber-500/10 to-transparent" },
  { label: "Applications Submitted", value: 24, trend: "+5 this week", icon: Send, color: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5", glow: "from-indigo-500/10 to-transparent" },
  { label: "Interview Invites", value: 6, trend: "+2 new", icon: Calendar, color: "text-rose-500 border-rose-500/20 bg-rose-500/5 shadow-rose-500/5", glow: "from-rose-500/10 to-transparent" },
];

const trendData = [
  { month: "Jan", applications: 3, interviews: 0 },
  { month: "Feb", applications: 5, interviews: 1 },
  { month: "Mar", applications: 4, interviews: 1 },
  { month: "Apr", applications: 8, interviews: 2 },
  { month: "May", applications: 12, interviews: 3 },
  { month: "Jun", applications: 18, interviews: 6 },
];

const skillsData = [
  { 
    name: "Python", 
    level: 92, 
    jobs: ["Globex AI - Machine Learning Intern", "Pied Piper - Data Engineer"], 
    recommendations: ["Advanced Python Design Patterns (Course)", "Build an API with FastAPI (Project)"] 
  },
  { 
    name: "Machine Learning", 
    level: 78, 
    jobs: ["Globex AI - Machine Learning Intern", "Initech Analytics - DS Associate"], 
    recommendations: ["Introduction to PyTorch & Neural Nets (Course)", "Train a Custom CNN Classifier (Project)"] 
  },
  { 
    name: "React & TypeScript", 
    level: 70, 
    jobs: ["Hooli Web Labs - Frontend UI/UX Intern"], 
    recommendations: ["TanStack Router State Management (Course)", "Build a custom shadcn component dashboard (Project)"] 
  },
  { 
    name: "SQL & Databases", 
    level: 65, 
    jobs: ["Initech Analytics - DS Associate", "Pied Piper - Data Engineer"], 
    recommendations: ["Database Optimization and Indexing (Course)", "Design an E-Commerce relational schema (Project)"] 
  },
  { 
    name: "System Design", 
    level: 48, 
    jobs: ["Pied Piper - AI Research Intern"], 
    recommendations: ["System Design Fundamentals: Scaling APIs (Course)", "Implement a Redis caching layer (Project)"] 
  },
];

const statusData = [
  { name: "Applied", value: 12, color: "oklch(0.76 0.15 190)" }, // primary
  { name: "Interview", value: 6, color: "oklch(0.68 0.21 310)" }, // secondary
  { name: "Offer", value: 2, color: "oklch(0.74 0.16 150)" }, // success
  { name: "Rejected", value: 4, color: "oklch(0.65 0.015 240)" }, // muted-foreground
];

const matches = [
  { company: "Globex AI", role: "ML Engineer Intern", match: 96, location: "Remote · Full-time", logo: "🤖", skillsMatched: ["Python", "Machine Learning", "PyTorch"] },
  { company: "Initech Analytics", role: "Data Science Associate", match: 91, location: "Bangalore · Hybrid", logo: "📊", skillsMatched: ["Python", "SQL", "Pandas"] },
  { company: "Hooli Web Labs", role: "Frontend UI/UX Intern", match: 87, location: "Delhi NCR · On-site", logo: "🌐", skillsMatched: ["React & TypeScript", "Tailwind CSS"] },
  { company: "Pied Piper", role: "AI Research Intern", match: 84, location: "Remote · Part-time", logo: "💚", skillsMatched: ["Python", "System Design", "Docker"] },
];

function DashboardHome() {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<typeof skillsData[0] | null>(null);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const name = user?.fullName || JSON.parse(localStorage.getItem("careercompass_user") || "{}").fullName || "Nikita Candidate";
        const appsRes = await fetch(`http://localhost:8081/api/applications/me?applicantName=${encodeURIComponent(name)}`, { headers });
        if (appsRes.ok) setMyApplications(await appsRes.json());
        
        // Fetch jobs
        const jobsRes = await fetch("http://localhost:8081/api/jobs", { headers });
        if (jobsRes.ok) setActiveJobs(await jobsRes.json());
      } catch (e) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  // Update dynamic stats
  const dynamicStats = [
    { label: "Total Jobs Matched", value: activeJobs.length, trend: "+12% this week", icon: Target, color: "text-primary border-primary/20 bg-primary/5 shadow-primary/5", glow: "from-primary/10 to-transparent" },
    { label: "Internship Matches", value: activeJobs.filter(j => j.type === "Internship").length, trend: "+5 new", icon: UserCheck, color: "text-[var(--color-secondary)] border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 shadow-[var(--color-secondary)]/5", glow: "from-[var(--color-secondary)]/10 to-transparent" },
    { label: "Resume Score", value: "92%", trend: "Top 5%", icon: FileSearch, color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5", glow: "from-emerald-500/10 to-transparent" },
    { label: "Skills Completed", value: user?.skills?.length || 0, trend: "+3 new", icon: CheckCircle2, color: "text-amber-500 border-amber-500/20 bg-amber-500/5 shadow-amber-500/5", glow: "from-amber-500/10 to-transparent" },
    { label: "Applications Submitted", value: myApplications.length, trend: "+1 this week", icon: Send, color: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/5", glow: "from-indigo-500/10 to-transparent" },
    { label: "Interview Invites", value: myApplications.filter(a => a.status === 'Interview').length, trend: "+2 new", icon: Calendar, color: "text-rose-500 border-rose-500/20 bg-rose-500/5 shadow-rose-500/5", glow: "from-rose-500/10 to-transparent" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Panel */}
      <HoverSpotlightCard
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6"
      >
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-widest text-primary font-mono uppercase">System Vector Online</span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, <span className="gradient-text font-black">{user?.fullName?.split(" ")[0] || "there"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-none">
            Aether AI detected <span className="text-primary font-bold">3 new job matches</span> and <span className="text-[var(--color-secondary)] font-bold">1 interview coordinate</span> since your last session.
          </p>
        </div>
        <Button asChild className="shrink-0 rounded-full gradient-bg text-white border-0 hover:opacity-95 shadow-glow hover:scale-[1.02] transition-transform">
          <Link to="/dashboard">
            <Sparkles className="mr-1.5 h-4 w-4" /> Analyze Fit Metrics
          </Link>
        </Button>
      </HoverSpotlightCard>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dynamicStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border ${s.color} p-5 bg-card/30 backdrop-blur shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all`}
          >
            {/* Soft Glow Card Accent */}
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl bg-gradient-to-tr ${s.glow} opacity-60 pointer-events-none`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider text-muted-foreground/80 uppercase">{s.label}</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-card border border-border/80 shadow-soft">
                <s.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-3xl font-black text-foreground">{s.value}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                {s.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <h2 className="font-display text-base font-black text-foreground">Application Activity</h2>
              <p className="text-xs text-muted-foreground">Historical coordination timeline of applications and interview steps</p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary flex items-center gap-1">
              <TrendingUp className="h-3 w-3 animate-pulse" /> +28% Activity Spike
            </span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.76 0.15 190)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.76 0.15 190)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="secondaryGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.68 0.21 310)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.68 0.21 310)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={10} className="font-mono font-bold" />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} className="font-mono font-bold" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "var(--shadow-soft)"
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="oklch(0.76 0.15 190)" fill="url(#primaryGlow)" strokeWidth={2.5} name="Applications" />
                <Area type="monotone" dataKey="interviews" stroke="oklch(0.68 0.21 310)" fill="url(#secondaryGlow)" strokeWidth={2.5} name="Interviews" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </HoverSpotlightCard>

        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 flex flex-col justify-between"
        >
          <div className="border-b border-border/40 pb-4">
            <h2 className="font-display text-base font-black text-foreground">Pipeline Breakdown</h2>
            <p className="text-xs text-muted-foreground">Vector status partition</p>
          </div>
          <div className="h-48 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={4}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 11
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold bg-muted/30 p-2.5 rounded-xl border border-border/45 font-mono">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground truncate">{s.name}</span>
                <span className="ml-auto text-foreground font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </HoverSpotlightCard>
      </div>

      {/* Main interactive section: Matches and Skill Panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Matches list */}
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="font-display text-base font-black text-foreground">Top AI Recommendations</h2>
              <p className="text-xs text-muted-foreground">Matches ranked by vector resume embedding alignment</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="rounded-full text-primary hover:text-primary hover:bg-primary/10">
              <Link to="/dashboard">
                View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 divide-y divide-border/30">
            {matches.map((m, idx) => (
              <div key={m.role} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3.5 group hover:bg-muted/10 px-2 rounded-xl transition-colors">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card border border-border/80 shadow-soft text-xl">
                  {m.logo}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{m.role}</h4>
                  <p className="text-xs text-muted-foreground truncate">{m.company} · <span className="font-semibold text-muted-foreground/80">{m.location}</span></p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {m.skillsMatched.map((sk) => (
                      <span key={sk} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted border border-border/40 text-muted-foreground/90 font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-primary font-mono">{m.match}% Match</span>
                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden mt-1 ml-auto">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${m.match}%` }} />
                    </div>
                  </div>
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-card border-border/80 hover:bg-primary hover:text-white transition-all shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </HoverSpotlightCard>

        {/* Skill progress with interactive expand panel */}
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 flex flex-col justify-between"
        >
          <div className="border-b border-border/40 pb-4">
            <h2 className="font-display text-base font-black text-foreground">Interactive Skill Matrix</h2>
            <p className="text-xs text-muted-foreground">Select a skill to explore matches & roadmaps</p>
          </div>
          
          <div className="mt-4 space-y-3.5">
            {skillsData.map((s) => (
              <div 
                key={s.name} 
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSkill?.name === s.name 
                    ? "bg-primary/5 border-primary shadow-soft" 
                    : "bg-card/30 border-border/70 hover:border-primary/40"
                }`}
                onClick={() => setSelectedSkill(selectedSkill?.name === s.name ? null : s)}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{s.name}</span>
                  <span className="font-mono text-muted-foreground text-[10px]">{s.level}% Embedding Strength</span>
                </div>
                <Progress value={s.level} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>

          {/* Interactive Slide-down details */}
          <div className="mt-4 min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {selectedSkill ? (
                <motion.div
                  key={selectedSkill.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="w-full text-xs space-y-3 bg-muted/40 p-3 rounded-xl border border-border/50"
                >
                  <div>
                    <h5 className="font-bold text-primary flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> Matched Roles ({selectedSkill.jobs.length})
                    </h5>
                    <ul className="mt-1 list-disc pl-4 text-muted-foreground space-y-0.5">
                      {selectedSkill.jobs.map((j) => <li key={j} className="truncate">{j}</li>)}
                    </ul>
                  </div>
                  <div className="border-t border-border/30 pt-2">
                    <h5 className="font-bold text-[var(--color-secondary)] flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Learn & Skill Up
                    </h5>
                    <ul className="mt-1 list-disc pl-4 text-muted-foreground space-y-0.5">
                      {selectedSkill.recommendations.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground p-4 bg-muted/20 border border-dashed border-border/60 rounded-xl w-full"
                >
                  <HelpCircle className="h-5 w-5 mx-auto text-muted-foreground/60 mb-2" />
                  Click any skill bar to query matched jobs and custom roadmap tasks
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </HoverSpotlightCard>
      </div>

      {/* Analytics, Profile Widget, and Recent Activities Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile Completion Widget */}
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle className="text-muted/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
              <circle className="text-primary stroke-current drop-shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset="45.2"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-display text-foreground">82%</span>
            </div>
          </div>
          <h3 className="mt-4 font-display text-lg font-black text-foreground">Profile Completion</h3>
          <p className="text-xs text-muted-foreground mt-1 px-4">Add your latest certification to reach 100% and unlock premium AI matching.</p>
          <Button className="mt-5 rounded-full gradient-bg w-full" asChild>
            <Link to="/dashboard/profile">Complete Profile</Link>
          </Button>
        </HoverSpotlightCard>

        {/* Recent Activities Feed */}
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 lg:col-span-2 flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="font-display text-base font-black text-foreground">Recent Activities</h2>
              <p className="text-xs text-muted-foreground">Your latest interactions and AI recommendations</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-4 flex-1 overflow-y-auto max-h-48 custom-scrollbar pr-2">
            {myApplications.length > 0 ? (
              myApplications.map((app, index) => (
                <div key={app.id} className={`flex gap-4 items-start relative ${index !== myApplications.length - 1 ? 'before:absolute before:left-[19px] before:top-8 before:bottom-[-16px] before:w-[2px] before:bg-border/50' : ''}`}>
                  <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 grid place-items-center">
                    <Send className="h-4 w-4" />
                  </div>
                  <div className="pt-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Applied for <span className="text-primary">{app.job?.title}</span> at {app.job?.company}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Application status: {app.status}</p>
                    <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">{new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No recent activity. Head over to the Jobs tab to start applying!
              </div>
            )}
          </div>
        </HoverSpotlightCard>
      </div>

      {/* Peer Benchmarking / Leaderboards */}
      <div className="grid gap-4">
        <HoverSpotlightCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-6"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 grid place-items-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-black text-foreground">Peer Benchmarking</h2>
                <p className="text-xs text-muted-foreground">Compare your vector score against your cohort</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-border/80">University</Button>
              <Button size="sm" className="rounded-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90">Global ML</Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative h-12 bg-muted/30 rounded-full border border-border/50 overflow-hidden flex items-center px-4">
              {/* Scale marks */}
              <div className="absolute inset-0 w-full h-full flex justify-between px-6 pointer-events-none opacity-20">
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="h-full w-px bg-foreground" />
                ))}
              </div>
              
              {/* Highlight area */}
              <div className="absolute left-[70%] right-[5%] h-full bg-emerald-500/10 border-x border-emerald-500/30" />
              
              {/* Competitors */}
              <div className="absolute left-[75%] h-6 w-6 rounded-full bg-card border border-border/80 shadow-soft grid place-items-center text-[8px] font-bold z-10 hover:scale-150 transition-transform cursor-pointer">#12</div>
              <div className="absolute left-[82%] h-6 w-6 rounded-full bg-card border border-border/80 shadow-soft grid place-items-center text-[8px] font-bold z-10 hover:scale-150 transition-transform cursor-pointer">#8</div>
              <div className="absolute left-[92%] h-6 w-6 rounded-full bg-card border border-border/80 shadow-soft grid place-items-center text-[8px] font-bold z-10 hover:scale-150 transition-transform cursor-pointer">#2</div>
              
              {/* You */}
              <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: "86%" }}
                transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
                className="absolute h-8 w-8 rounded-full gradient-bg border-2 border-background shadow-glow grid place-items-center text-white z-20"
              >
                <span className="text-[10px] font-black">#4</span>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold px-2">
              <span>Novice (0-40)</span>
              <span>Intermediate (41-70)</span>
              <span className="text-emerald-500">Top Tier (71-100)</span>
            </div>
            
            <p className="mt-4 text-center text-sm text-foreground/90 font-medium">
              You are currently ranked <span className="font-black text-primary">#4</span> out of 842 ML engineering students in your cohort. 
              <span className="text-muted-foreground block mt-1 text-xs">Completing the 'Mock Interview' module will likely bump you to the Top 3!</span>
            </p>
          </div>
        </HoverSpotlightCard>
      </div>
    </div>
  );
}
