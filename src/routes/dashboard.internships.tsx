import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Banknote, ArrowUpRight, Bookmark, Loader2, CheckCircle2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/internships")({
  head: () => ({ meta: [{ title: "Internships — CareerCompass AI" }] }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [aiMode, setAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs/all");
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((j: any) => j.type && j.type.toLowerCase().includes("intern"));
        setInternships(filtered);
      }
    } catch (e) {
      toast.error("Failed to fetch internships");
    } finally {
      setLoading(false);
    }
  };

  const fetchAiRecommendations = async () => {
    const savedResume = localStorage.getItem("parsed_resume");
    if (!savedResume) {
      toast.error("Please upload your resume in the Resume Scanner first to get AI recommendations!");
      return;
    }
    try {
      setAiLoading(true);
      const parsed = JSON.parse(savedResume);
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: parsed.skills || [],
          resumeText: JSON.stringify(parsed),
          typeFilter: "Internship"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
        setAiMode(true);
        toast.success("Gemini AI has tailored internship matches based on your resume!");
      } else {
        toast.error("Failed to generate recommendations");
      }
    } catch (e) {
      toast.error("Error connecting to recommendation service");
    } finally {
      setAiLoading(false);
    }
  };

  const fetchAppliedStatus = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const userStr = localStorage.getItem("careercompass_user");
      const user = userStr ? JSON.parse(userStr) : {};
      const name = user.fullName || "Nikita Candidate";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`https://careercompassai1.onrender.com/api/applications/me?applicantName=${encodeURIComponent(name)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAppliedIds(data.map((app: any) => app.job?.id).filter(Boolean));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchInternships();
    fetchAppliedStatus();
  }, []);

  const handleApply = async (jobId: string) => {
    if (appliedIds.includes(jobId)) {
      toast.info("You have already applied to this internship!");
      return;
    }
    setApplyingId(jobId);
    try {
      const token = localStorage.getItem("jwt_token");
      const userStr = localStorage.getItem("careercompass_user");
      const user = userStr ? JSON.parse(userStr) : {};
      const name = user.fullName || "Nikita Candidate";
      const res = await fetch(`https://careercompassai1.onrender.com/api/applications/${jobId}?applicantName=${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Successfully submitted application! Track it under Application Review.");
        setAppliedIds(prev => [...prev, jobId]);
      } else {
        const err = await res.text();
        toast.error(err || "Failed to apply");
      }
    } catch (e) {
      toast.error("Error submitting application");
    } finally {
      setApplyingId(null);
    }
  };

  const toggleBookmark = (internship: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
    const exists = saved.some((x: any) => x.id === internship.id);
    if (!exists) {
      const toSave = { ...internship, isBookmarked: true, deadline: internship.deadline || "2026-07-31", savedAt: new Date().toISOString() };
      localStorage.setItem("saved_jobs", JSON.stringify([...saved, toSave]));
      toast.success("Saved to your list");
      setInternships([...internships]);
    } else {
      localStorage.setItem("saved_jobs", JSON.stringify(saved.filter((x: any) => x.id !== internship.id)));
      toast.info("Removed from saved");
      setInternships([...internships]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl shadow-card"
      >
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary grid place-items-center shadow-soft shrink-0">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-black text-foreground">Internship Dashboard</h1>
              {aiMode && <Badge className="bg-primary text-white font-bold animate-bounce">Gemini AI Active</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Discover live internship openings or get personalized AI recommendations tailored to your resume.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {aiMode ? (
            <Button variant="outline" onClick={() => { setAiMode(false); fetchInternships(); }} className="rounded-full font-bold border-border">
              Show All Internships
            </Button>
          ) : (
            <Button onClick={fetchAiRecommendations} disabled={aiLoading} className="rounded-full gradient-bg text-white font-bold shadow-glow hover:scale-[1.02] transition-transform flex items-center gap-2">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              AI Recommend by Resume
            </Button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground font-medium">Loading live internship opportunities...</p>
        </div>
      ) : internships.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-border/80 bg-card/20 p-8 space-y-3">
          <p className="text-lg font-bold text-foreground">No active internship openings posted yet.</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">When an admin posts a new internship, it will appear here instantly with live notifications!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {internships.map((internship, i) => {
            const isApplied = appliedIds.includes(internship.id);
            const matchScore = internship.matchScore || Math.floor(85 + (i % 14));
            const savedIds = JSON.parse(localStorage.getItem("saved_jobs") || "[]").map((x: any) => x.id);
            const isSaved = savedIds.includes(internship.id);
            return (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl p-6 shadow-card flex flex-col hover:border-primary/40 hover:shadow-glow transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black font-display text-xl grid place-items-center shadow-soft">
                    {internship.company?.charAt(0) || "💼"}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-display text-primary">{matchScore}%</span>
                    <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider font-bold">Match</p>
                  </div>
                </div>

                <div className="min-w-0 flex-1 mb-3">
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors leading-tight">{internship.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{internship.company} • {internship.location || "Remote"}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    <Calendar className="w-3.5 h-3.5" /> Apply by: {internship.deadline || "2026-07-31"}
                  </div>
                </div>

                {internship.aiReasoning && (
                  <div className="mb-4 p-3 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-foreground/90 italic leading-relaxed">
                    ✨ "{internship.aiReasoning}"
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(internship.requiredSkills || ["Python", "Machine Learning", "Remote"]).slice(0, 4).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-muted/80 text-[10px] uppercase tracking-wider font-mono px-2.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border/40 flex items-center gap-3">
                  <Button 
                    disabled={isApplied || applyingId === internship.id}
                    onClick={() => handleApply(internship.id)}
                    className={`flex-1 rounded-full font-bold transition-all ${
                      isApplied ? "bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20 shadow-none" : "gradient-bg text-white shadow-glow hover:scale-[1.02]"
                    }`}
                  >
                    {applyingId === internship.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : isApplied ? (
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Applied</span>
                    ) : (
                      <span className="flex items-center gap-1">Apply Now <ArrowUpRight className="h-4 w-4" /></span>
                    )}
                  </Button>
                  <button 
                    onClick={(e) => toggleBookmark(internship, e)}
                    className={`h-10 w-10 rounded-full grid place-items-center transition-colors shrink-0 ${
                      isSaved ? "bg-amber-500/10 text-amber-500 border border-amber-500/30" : "bg-card border border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
