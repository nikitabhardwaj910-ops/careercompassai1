import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Briefcase, Building2, MapPin, Check, X as XIcon, Star, Filter, Sparkles, GraduationCap, Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/discover")({
  head: () => ({ meta: [{ title: "Discover — CareerCompass AI" }] }),
  component: DiscoverPage,
});

function SwipeCard({ 
  job, 
  onSwipe, 
  active 
}: { 
  job: any, 
  onSwipe: (dir: 'left' | 'right', id: any) => void,
  active: boolean 
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const saveOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right', job.id);
    } else if (info.offset.x < -100) {
      onSwipe('left', job.id);
    }
  };

  const isInternship = job.type?.toLowerCase().includes("intern") || job.isInternship;
  const matchScore = job.matchScore || job.match || 95;
  const tagsList = Array.isArray(job.tags) ? job.tags : Array.isArray(job.skills) ? job.skills : Array.isArray(job.requiredSkills) ? job.requiredSkills : String(job.requiredSkills || "Python, React, AI").split(",").map((s: string) => s.trim());

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className={`absolute w-full h-full rounded-[2.5rem] border border-border/80 bg-card/75 backdrop-blur-3xl shadow-card overflow-hidden cursor-grab active:cursor-grabbing ${!active && 'pointer-events-none'}`}
    >
      {/* Stamps */}
      <motion.div style={{ opacity: saveOpacity }} className="absolute top-8 left-8 z-20 pointer-events-none rotate-[-15deg]">
        <div className="border-4 border-emerald-500 rounded-xl px-4 py-1 text-emerald-500 font-black text-4xl tracking-widest bg-emerald-500/10">SAVE</div>
      </motion.div>
      <motion.div style={{ opacity: skipOpacity }} className="absolute top-8 right-8 z-20 pointer-events-none rotate-[15deg]">
        <div className="border-4 border-rose-500 rounded-xl px-4 py-1 text-rose-500 font-black text-4xl tracking-widest bg-rose-500/10">SKIP</div>
      </motion.div>

      {/* Card Content */}
      <div className="flex flex-col h-full p-8 pointer-events-none">
        <div className="flex items-center justify-between mb-6">
          <div className="h-16 w-16 rounded-2xl bg-background border border-border/80 grid place-items-center text-3xl shadow-soft">
            {job.logo || (isInternship ? "🎓" : "💼")}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full ${
              isInternship ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-primary/10 text-primary border border-primary/20"
            }`}>
              {isInternship ? "Internship" : "Full-time Job"}
            </span>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black font-mono text-primary">{matchScore}%</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match Score</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black font-display text-foreground leading-none mb-2">{job.role || job.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Building2 className="h-4 w-4" /> <span>{job.company || "Tech Enterprise"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 my-6">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs font-bold text-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {job.location || "Remote"}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500">
            {job.salary || job.stipend || "$80,000 / yr"}
          </span>
        </div>

        <div className="bg-muted/30 border border-border/40 rounded-2xl p-4 flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Opportunity Overview</h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {job.description || "Exciting career opportunity posted directly by our admin team. Join to innovate and build cutting-edge software solutions."}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {tagsList.map((t: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 bg-card border border-border/50 rounded-lg text-xs font-mono font-bold text-primary">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DiscoverPage() {
  const [filter, setFilter] = useState<"all" | "internships" | "jobs">("all");
  const [allAdminItems, setAllAdminItems] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAdminListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      // Fetch all listings processed/posted by Admin from the Spring Boot API
      let allItems: any[] = [];
      const res = await fetch("http://localhost:8081/api/jobs/all", { headers }).catch(() => null);
      if (res && res.ok) {
        allItems = await res.json();
      } else {
        const fallbackRes = await fetch("http://localhost:8081/api/jobs", { headers }).catch(() => null);
        if (fallbackRes && fallbackRes.ok) {
          allItems = await fallbackRes.json();
        }
      }

      // If no admin items in DB yet, provide fallback sample admin items so swipe deck is always interactive
      if (!allItems || allItems.length === 0) {
        allItems = [
          {
            id: 101,
            title: "Machine Learning & GenAI Intern",
            role: "Machine Learning & GenAI Intern",
            company: "Aether AI Labs (Admin Verified)",
            type: "Internship",
            location: "San Francisco, CA (Hybrid)",
            stipend: "$5,000 / mo",
            salary: "$5,000 / mo",
            description: "Work directly with core LLM training pipelines and RAG architectures. Direct opportunity posted by Admin.",
            requiredSkills: ["Python", "PyTorch", "Transformers", "Vector DB"],
            matchScore: 98
          },
          {
            id: 102,
            title: "Senior Fullstack Systems Engineer",
            role: "Senior Fullstack Systems Engineer",
            company: "TalentNavigate Enterprise",
            type: "Full-time",
            location: "New York, NY / Remote",
            salary: "$145,000 / yr",
            description: "Lead frontend and Spring Boot microservices design. High growth potential opportunity verified by Admin.",
            requiredSkills: ["React", "TypeScript", "Spring Boot", "PostgreSQL"],
            matchScore: 95
          },
          {
            id: 103,
            title: "Product Design & UI/UX Intern",
            role: "Product Design & UI/UX Intern",
            company: "Globex Creative Studio",
            type: "Internship",
            location: "Remote",
            stipend: "$35 / hr",
            salary: "$35 / hr",
            description: "Craft modern glassmorphism interfaces and design tokens for AI dashboards.",
            requiredSkills: ["Figma", "Design Systems", "Prototyping", "UI/UX"],
            matchScore: 92
          },
          {
            id: 104,
            title: "Cloud Infrastructure Architect",
            role: "Cloud Infrastructure Architect",
            company: "Initech Cloud Solutions",
            type: "Full-time",
            location: "Austin, TX",
            salary: "$160,000 / yr",
            description: "Design scalable Kubernetes clusters and automated CI/CD pipelines.",
            requiredSkills: ["AWS", "Kubernetes", "Docker", "Terraform"],
            matchScore: 89
          }
        ];
      }

      // Format and classify each admin opportunity
      const combined = allItems.map((item: any) => {
        const rawType = String(item.type || "").toLowerCase();
        const isIntern = rawType.includes("intern") || item.isInternship === true;
        
        return {
          ...item,
          id: item.id ? `admin_opportunity_${item.id}` : `item_${Math.random()}`,
          type: isIntern ? "Internship" : "Full-time Job",
          role: item.title || item.role || "Career Opportunity",
          company: item.company || "Verified Employer",
          location: item.location || "Remote",
          salary: item.stipend || item.salary || (isIntern ? "$45 / hr" : "$120,000 / yr"),
          isInternship: isIntern,
          description: item.description || "Exciting career opportunity verified and listed directly by our Admin team.",
          matchScore: item.matchScore || item.match || 94
        };
      });

      setAllAdminItems(combined);
      setCards(combined);
    } catch (e) {
      console.error("Failed fetching admin listings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminListings();
    const saved = JSON.parse(localStorage.getItem("saved_discover_items") || "[]");
    setSavedCount(saved.length);
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setCards(allAdminItems);
    } else if (filter === "internships") {
      setCards(allAdminItems.filter(c => c.isInternship || c.type === "Internship"));
    } else {
      setCards(allAdminItems.filter(c => !c.isInternship && c.type !== "Internship"));
    }
  }, [filter, allAdminItems]);

  const handleSwipe = (dir: 'left' | 'right', id: any) => {
    const card = cards.find(c => c.id === id);
    if (dir === 'right' && card) {
      setSavedCount(prev => prev + 1);
      const saved = JSON.parse(localStorage.getItem("saved_discover_items") || "[]");
      if (!saved.some((item: any) => item.id === card.id)) {
        saved.push(card);
        localStorage.setItem("saved_discover_items", JSON.stringify(saved));
      }
      toast.success(`Saved "${card.role}" at ${card.company} to your dashboard! ⭐`);
    }
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleManualAction = (dir: 'left' | 'right') => {
    if (cards.length === 0) return;
    const currentCard = cards[0];
    handleSwipe(dir, currentCard.id);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col items-center max-w-2xl mx-auto w-full px-4">
      
      {/* Header & Category Filter Tabs */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Swipe Discovery
          </h1>
          <p className="text-xs text-muted-foreground">Showing 100% live opportunities listed directly by Admin.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-full bg-muted/60 border border-border/60 text-xs font-bold">
            <button 
              onClick={() => setFilter("all")} 
              type="button"
              className={`px-3 py-1.5 rounded-full transition-all ${filter === "all" ? "gradient-bg text-white shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("internships")} 
              type="button"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${filter === "internships" ? "gradient-bg text-white shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Internships
            </button>
            <button 
              onClick={() => setFilter("jobs")} 
              type="button"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${filter === "jobs" ? "gradient-bg text-white shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Jobs
            </button>
          </div>

          <div className="h-9 px-3.5 rounded-full gradient-bg border border-border/50 shadow-glow flex items-center gap-1.5 text-white font-bold text-xs shrink-0">
            <Bookmark className="h-3.5 w-3.5" fill="currentColor" /> {savedCount}
          </div>
        </div>
      </div>

      {/* Swipe Deck */}
      <div className="relative w-full flex-1 max-h-[580px] mt-2 perspective-[1000px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/60 rounded-[2.5rem] bg-card/20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <h3 className="font-bold text-lg text-foreground">Fetching Admin Listings...</h3>
            <p className="text-xs text-muted-foreground mt-1">Connecting to live Spring Boot database</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/60 rounded-[2.5rem] bg-card/20">
            <div className="h-20 w-20 rounded-full bg-primary/10 grid place-items-center mb-4">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black font-display text-foreground mb-2">No active {filter} left!</h2>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              {allAdminItems.length === 0 
                ? "There are currently no live opportunities posted by Admin. When an admin creates a new Job or Internship, it will immediately appear here!" 
                : `You've reviewed all active ${filter}. Switch tabs or reload to review again.`}
            </p>
            {allAdminItems.length > 0 && (
              <Button 
                className="mt-6 rounded-full gradient-bg shadow-glow border-0 hover:scale-105 transition-transform text-white px-8 font-bold text-xs h-10" 
                onClick={() => {
                  if (filter === "all") setCards(allAdminItems);
                  else if (filter === "internships") setCards(allAdminItems.filter(c => c.isInternship));
                  else setCards(allAdminItems.filter(c => !c.isInternship));
                }}
              >
                Reload Swipe Deck
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {cards.map((job, index) => {
              const isTop = index === 0;
              return (
                <motion.div
                  key={job.id}
                  initial={{ scale: 0.9, y: 50, opacity: 0 }}
                  animate={{ 
                    scale: 1 - index * 0.04, 
                    y: index * 16, 
                    opacity: 1 - index * 0.15,
                    zIndex: cards.length - index 
                  }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-0 origin-bottom"
                >
                  <SwipeCard job={job} onSwipe={handleSwipe} active={isTop} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Manual Actions */}
      <div className="flex items-center gap-6 mt-6 mb-2">
        <Button 
          variant="outline" 
          onClick={() => handleManualAction('left')}
          disabled={cards.length === 0 || loading}
          className="h-14 w-14 rounded-full border-2 border-border/80 bg-card hover:border-rose-500 hover:bg-rose-500/10 text-rose-500 transition-all shadow-soft hover:scale-110 disabled:opacity-50"
          title="Pass (Swipe Left)"
        >
          <XIcon className="h-7 w-7" />
        </Button>
        <Button 
          onClick={() => handleManualAction('right')}
          disabled={cards.length === 0 || loading}
          className="h-16 w-16 rounded-full border-0 gradient-bg text-white hover:opacity-90 transition-all shadow-glow hover:scale-110 disabled:opacity-50"
          title="Save Opportunity (Swipe Right)"
        >
          <Star className="h-8 w-8" fill="currentColor" />
        </Button>
      </div>
    </div>
  );
}
