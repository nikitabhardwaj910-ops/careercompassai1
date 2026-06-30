import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare,
  FileSearch,
  Loader2,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/AnimationComponents";
import { toast } from "sonner";
import { usePopup } from "@/components/PopupSystem";

export const Route = createFileRoute("/dashboard/applications")({
  head: () => ({ meta: [{ title: "Applications — CareerCompass AI" }] }),
  component: ApplicationsPage,
});

const COLUMNS: { id: string; label: string; icon: any; color: string; border: string }[] = [
  { id: "Applied", label: "Applied", icon: Clock, color: "text-blue-500", border: "border-blue-500/30 bg-blue-500/5" },
  { id: "Under Review", label: "Under Review", icon: FileSearch, color: "text-amber-500", border: "border-amber-500/30 bg-amber-500/5" },
  { id: "Interview", label: "Interview", icon: MessageSquare, color: "text-purple-500", border: "border-purple-500/30 bg-purple-500/5" },
  { id: "Selected", label: "Selected", icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/30 bg-emerald-500/5" },
  { id: "Rejected", label: "Rejected", icon: XCircle, color: "text-muted-foreground", border: "border-border/60 bg-muted/20" },
];

function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const popup = usePopup();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const userStr = localStorage.getItem("careercompass_user");
      const user = userStr ? JSON.parse(userStr) : {};
      const name = user.fullName || "Nikita Candidate";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`http://localhost:8081/api/applications/me?applicantName=${encodeURIComponent(name)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (e) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl shadow-card"
      >
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-3xl font-black tracking-tight text-foreground">Application Review</h1>
          <p className="text-sm text-muted-foreground">Track live applications and scheduled interview dates set by hiring teams.</p>
        </div>
        <Button onClick={fetchApplications} className="shrink-0 rounded-full gradient-bg text-white border-0 shadow-glow hover:scale-[1.02] transition-transform font-bold">
          <Calendar className="mr-2 h-4 w-4" /> Refresh Pipeline
        </Button>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground font-medium">Loading your job & internship applications...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-border/80 bg-card/20 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-bold text-foreground">No submitted applications yet.</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Explore the Job or Internship Dashboards and click "Apply Now" to start tracking your applications!</p>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start pb-10 overflow-x-auto min-w-full">
          {COLUMNS.map((col, colIdx) => {
            const colApps = apps.filter(a => (a.status || "Applied") === col.id);
            return (
              <ScrollReveal key={col.id} delay={colIdx * 0.1} direction="up" className="space-y-4">
                {/* Column Header */}
                <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${col.border} backdrop-blur-sm shadow-soft`}>
                  <div className="flex items-center gap-2">
                    <col.icon className={`h-4 w-4 ${col.color}`} />
                    <h3 className="font-bold text-sm text-foreground">{col.label}</h3>
                  </div>
                  <span className={`text-xs font-black font-mono bg-background/60 rounded-md px-2 py-0.5 border border-border/40 ${col.color}`}>
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 min-h-[150px]">
                  <AnimatePresence mode="popLayout">
                    {colApps.map((app) => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="p-5 rounded-2xl glass border border-border/80 bg-card/60 shadow-card group hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary font-black text-lg shrink-0 shadow-soft">
                            {app.job?.company?.charAt(0) || "💼"}
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
                            {app.job?.type || "Job"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors">{app.job?.title || "Role"}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5 font-medium">
                            <Building2 className="h-3.5 w-3.5 text-primary/70" /> {app.job?.company || "Company"}
                          </p>
                        </div>

                        {col.id === "Interview" && app.interviewDate && (
                          <div className="mt-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-2 shadow-soft">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Scheduled: {app.interviewDate}</span>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>Applied</span>
                          <span>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
