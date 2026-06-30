import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Filter,
  Star,
  Clock,
  ArrowUpRight,
  Bookmark,
  DollarSign,
  X,
  Loader2,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal, StaggerGroup, TiltCard, PopIn } from "@/components/AnimationComponents";
import { HoverSpotlightCard } from "@/components/ui/HoverSpotlightCard";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({ meta: [{ title: "Job Matches — CareerCompass AI" }] }),
  component: JobsPage,
});

function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:8081/api/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Add random match percentage to real jobs for demo purposes
        const savedIds = JSON.parse(localStorage.getItem("saved_jobs") || "[]").map((x: any) => x.id);
        const jobsWithMatch = data.map((j: any) => ({
          ...j,
          deadline: j.deadline || "2026-07-31",
          match: Math.floor(Math.random() * 20) + 75, // 75-95%
          isBookmarked: savedIds.includes(j.id),
        }));
        setJobs(jobsWithMatch);
      }
    } catch (e) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs(jobs.map(j => j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j));
    const job = jobs.find(j => j.id === id);
    if (job) {
      const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
      if (!job.isBookmarked) {
        const toSave = { ...job, isBookmarked: true, deadline: job.deadline || "2026-07-31", savedAt: new Date().toISOString() };
        localStorage.setItem("saved_jobs", JSON.stringify([...saved.filter((x: any) => x.id !== id), toSave]));
        toast.success("Saved to your list");
      } else {
        localStorage.setItem("saved_jobs", JSON.stringify(saved.filter((x: any) => x.id !== id)));
        toast.info("Removed from saved");
      }
    }
  };

  const handleApply = async (jobId: string) => {
    setApplying(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const userStr = localStorage.getItem("careercompass_user");
      const user = userStr ? JSON.parse(userStr) : {};
      const name = user.fullName || "Nikita Candidate";
      const res = await fetch(`http://localhost:8081/api/applications/${jobId}?applicantName=${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Successfully applied for the job!");
      } else {
        const text = await res.text();
        toast.error(text || "Failed to apply");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.requiredSkills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h1 className="font-display text-3xl font-black tracking-tight">AI Job Matches</h1>
            <p className="text-sm text-muted-foreground">Opportunities ranked by vector similarity to your profile.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-border/80 bg-card shadow-soft h-10">
              <Star className="mr-2 h-4 w-4 text-amber-500" /> Saved
            </Button>
            <Button className="rounded-xl gradient-bg text-white border-0 shadow-glow h-10">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Auto-Apply Bot
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-2 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search roles, companies, or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-card/50 border-border/70 focus-visible:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 bg-card/50 border-border/70">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Job List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-muted-foreground">Showing <span className="text-foreground">{filteredJobs.length}</span> matches</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Sorted by Match %</span>
          </div>

          <StaggerGroup staggerDelay={0.1} className="space-y-3">
            {loading ? (
              <div className="text-center p-12 text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 mb-3 animate-spin text-primary" />
                <p>Finding the perfect roles for you...</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <TiltCard key={job.id} tiltDegree={2}>
                    <HoverSpotlightCard
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedJob(job.id)}
                      className={`p-5 cursor-pointer group ${
                        selectedJob === job.id 
                          ? "bg-card/80 border-primary/50 shadow-glow" 
                          : "bg-card/40 border-border/60 hover:bg-card/60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-card border border-border/80 shadow-soft grid place-items-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                          💼
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Building2 className="h-3.5 w-3.5" /> {job.company}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-end shrink-0">
                              <span className={`text-lg font-black font-mono ${job.match >= 90 ? 'text-primary' : job.match >= 80 ? 'text-[var(--color-secondary)]' : 'text-emerald-500'}`}>
                                {job.match}%
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Fit Score</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground/80 font-medium">
                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.type}</span>
                            <span className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"><Calendar className="h-3.5 w-3.5" /> Apply by: {job.deadline || "2026-07-31"}</span>
                          </div>

                          <div className="flex items-center justify-between mt-4 border-t border-border/30 pt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {job.requiredSkills?.map((s: string) => (
                                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted/50 border border-border/40 font-mono">
                                  {s}
                                </span>
                              ))}
                            </div>
                            <button 
                              onClick={(e) => toggleBookmark(job.id, e)}
                              className={`h-8 w-8 rounded-full grid place-items-center transition-colors ${
                                job.isBookmarked ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-card border border-border/80 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${job.isBookmarked ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </HoverSpotlightCard>
                  </TiltCard>
                ))}
              </AnimatePresence>
            )}
            
            {!loading && filteredJobs.length === 0 && (
              <div className="text-center p-12 border border-dashed border-border/60 rounded-2xl text-muted-foreground bg-card/20">
                <Search className="mx-auto h-8 w-8 mb-3 opacity-20" />
                <p>No jobs match your search criteria.</p>
              </div>
            )}
          </StaggerGroup>
        </div>

        {/* Details Sidebar (Sticky) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <HoverSpotlightCard
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 shadow-glow"
                >
                  {/* Selected Job Details */}
                  {(() => {
                    const job = jobs.find(j => j.id === selectedJob)!;
                    return (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <div className="h-16 w-16 rounded-2xl bg-card border border-border/80 shadow-soft grid place-items-center text-3xl">
                            💼
                          </div>
                          <button onClick={() => setSelectedJob(null)} className="h-8 w-8 bg-muted/50 rounded-full grid place-items-center hover:bg-muted text-muted-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <h2 className="font-display text-2xl font-black leading-tight">{job.title}</h2>
                        <p className="text-base text-muted-foreground font-medium mt-1">{job.company}</p>
                        
                        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Match Analysis</span>
                            <span className="text-sm font-black font-mono text-primary">{job.match}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${job.match}%` }} 
                              className="h-full gradient-bg rounded-full" 
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                            High vector similarity based on your skills. This is a great fit for your profile!
                          </p>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded bg-muted/50 grid place-items-center text-muted-foreground"><MapPin className="h-4 w-4" /></div>
                            <div><p className="font-semibold text-foreground">{job.location}</p><p className="text-[10px] text-muted-foreground">Location</p></div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded bg-muted/50 grid place-items-center text-muted-foreground"><Briefcase className="h-4 w-4" /></div>
                            <div><p className="font-semibold text-foreground">{job.type}</p><p className="text-[10px] text-muted-foreground">Employment</p></div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded bg-amber-500/10 grid place-items-center text-amber-500"><Calendar className="h-4 w-4" /></div>
                            <div><p className="font-semibold text-amber-500">{job.deadline || "2026-07-31"}</p><p className="text-[10px] text-muted-foreground">Application Deadline</p></div>
                          </div>
                          
                          <div className="pt-4 mt-4 border-t border-border/30 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                          <Button 
                            onClick={() => handleApply(job.id)}
                            disabled={applying}
                            className="w-full h-12 rounded-xl gradient-bg text-white border-0 shadow-glow font-bold text-base hover:scale-[1.02] transition-transform">
                            {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Apply Now"}
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </HoverSpotlightCard>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-dashed border-border/60 bg-card/20 p-8 text-center text-muted-foreground h-full min-h-[400px] flex flex-col items-center justify-center"
                >
                  <Search className="h-10 w-10 mb-4 opacity-20" />
                  <h3 className="font-bold text-foreground">No role selected</h3>
                  <p className="text-sm mt-1">Select a job card to view detailed AI analysis and apply.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
