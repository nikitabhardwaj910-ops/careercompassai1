import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Building2, MapPin, DollarSign, Clock, ArrowRight, Trash2, Calendar, AlertTriangle, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/saved-jobs")({
  head: () => ({ meta: [{ title: "Saved Jobs & Internships — CareerCompass AI" }] }),
  component: SavedJobsPage,
});

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = () => {
    const list = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
    setSavedJobs(list);
  };

  const removeSaved = (id: string) => {
    const list = savedJobs.filter((item: any) => item.id !== id && item.title !== id);
    localStorage.setItem("saved_jobs", JSON.stringify(list));
    setSavedJobs(list);
    toast.info("Removed from saved opportunities");
  };

  const handleApply = async (job: any) => {
    if (!job.id || job.id.toString().includes("0. ")) {
      toast.success(`Application submitted for ${job.title || job.role} at ${job.company}!`);
      return;
    }
    setApplyingId(job.id);
    try {
      const token = localStorage.getItem("jwt_token");
      const userStr = localStorage.getItem("careercompass_user");
      const user = userStr ? JSON.parse(userStr) : {};
      const name = user.fullName || "Nikita Candidate";
      const res = await fetch(`http://localhost:8081/api/applications/${job.id}?applicantName=${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(`Application submitted for ${job.title || job.role} at ${job.company}!`);
      } else {
        toast.error("Failed or already applied");
      }
    } catch (e) {
      toast.error("Error submitting application");
    } finally {
      setApplyingId(null);
    }
  };

  // Check if any deadline is approaching (e.g. within 30 days)
  const approachingDeadlines = savedJobs.filter(job => {
    if (!job.deadline) return false;
    const diffTime = new Date(job.deadline).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 text-primary grid place-items-center shadow-soft">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-foreground">Saved Opportunities & Deadlines</h1>
            <p className="text-sm text-muted-foreground truncate">Track deadlines and apply to your bookmarked jobs and internships.</p>
          </div>
        </div>
      </motion.div>

      {approachingDeadlines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-500"
        >
          <AlertTriangle className="h-6 w-6 shrink-0 animate-bounce" />
          <div>
            <h4 className="font-bold text-sm">Approaching Application Deadlines!</h4>
            <p className="text-xs text-foreground/80 mt-0.5">
              You have {approachingDeadlines.length} saved {approachingDeadlines.length === 1 ? "opportunity" : "opportunities"} closing soon. Make sure to submit your application before the deadline!
            </p>
          </div>
        </motion.div>
      )}

      {savedJobs.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-border/80 bg-card/20 text-center space-y-3">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <h3 className="font-display text-xl font-bold text-foreground">No Saved Jobs or Internships</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Browse AI Recommended Jobs, Internships, or Discover listings and click the Bookmark icon to save them here and track application deadlines.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {savedJobs.map((job, i) => (
              <motion.div
                key={job.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row gap-6 p-5 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl hover:border-primary/40 hover:shadow-card transition-all group items-start sm:items-center"
              >
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-card border border-border/80 shadow-soft text-2xl font-bold text-primary grid place-items-center">
                  {(job.company || "C").charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">{job.title || job.role}</h3>
                    {job.matchScore && (
                      <Badge variant="outline" className="w-fit border-primary/30 text-primary bg-primary/5 font-bold uppercase tracking-wider text-[10px]">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {job.company}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location || "Remote"}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.type || "Opportunity"}</span>
                    <span className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      <Calendar className="h-3.5 w-3.5" /> Deadline: {job.deadline || "2026-07-31"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <Button 
                    onClick={() => removeSaved(job.id)}
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 rounded-full h-10 w-10 border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    disabled={applyingId === job.id}
                    onClick={() => handleApply(job)}
                    className="flex-1 sm:flex-none rounded-full gradient-bg font-bold shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    {applyingId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Apply Now <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
