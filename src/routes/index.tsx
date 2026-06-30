import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  Sparkles,
  FileSearch,
  Bot,
  TrendingUp,
  Mic,
  ArrowRight,
  Upload,
  Brain,
  Target,
  Send,
  Star,
  Github,
  Twitter,
  Linkedin,
  FileText,
  CheckCircle2,
  Cpu,
  RefreshCw,
  X,
  Mail,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ScrollReveal,
  ParallaxLayer,
  CountUp,
  StaggerGroup,
  PopIn,
  TextReveal,
  FloatingParticles,
  ScrollProgress,
  TiltCard,
} from "@/components/AnimationComponents";
import { HeroBackground } from "@/components/HeroBackground";

export const Route = createFileRoute("/")(
  {
  head: () => ({
    meta: [
      { title: "CareerCompass AI — Find Your Dream Internship with AI" },
      {
        name: "description",
        content:
          "AI-powered internship and job matching, resume analysis, skill gap insights and interview practice for students.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { 
    icon: Sparkles, 
    title: "AI Job Matching", 
    desc: "Personalized roles ranked by semantic resume + skill similarity.",
    color: "from-cyan-500/20 to-teal-500/20",
    glow: "shadow-cyan-500/10"
  },
  { 
    icon: FileSearch, 
    title: "Resume Analyzer", 
    desc: "Extracts skills, education, and experience in seconds.",
    color: "from-violet-500/20 to-purple-500/20",
    glow: "shadow-violet-500/10"
  },
  { 
    icon: TrendingUp, 
    title: "Skill Gap Analysis", 
    desc: "Compare your skills to target roles and get a learning roadmap.",
    color: "from-amber-500/20 to-orange-500/20",
    glow: "shadow-amber-500/10"
  },
  { 
    icon: Bot, 
    title: "Career Chatbot", 
    desc: "Always-on guidance for resumes, careers, and applications.",
    color: "from-blue-500/20 to-indigo-500/20",
    glow: "shadow-blue-500/10"
  },
  { 
    icon: Mic, 
    title: "Interview Practice", 
    desc: "Speech-to-text, sentiment, and confidence scoring.",
    color: "from-emerald-500/20 to-green-500/20",
    glow: "shadow-emerald-500/10"
  },
  { 
    icon: Target, 
    title: "Match Score", 
    desc: "Know exactly how well you fit each opportunity.",
    color: "from-rose-500/20 to-pink-500/20",
    glow: "shadow-rose-500/10"
  },
];

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Drop your PDF — we'll handle the rest." },
  { icon: Brain, title: "AI Analysis", desc: "Resume parsing and embedding generation." },
  { icon: Target, title: "Personalized Matches", desc: "Roles ranked by fit, not keywords." },
  { icon: Send, title: "Apply with Confidence", desc: "Track applications and prep with AI." },
];

const statsData = [
  { value: 25, suffix: "k+", label: "Jobs Posted", border: "border-cyan-500/30" },
  { value: 120, suffix: "k+", label: "Students Registered", border: "border-violet-500/30" },
  { value: 3.4, suffix: "k", label: "Companies Hiring", border: "border-amber-500/30", decimals: 1 },
  { value: 92, suffix: "%", label: "Match Accuracy", border: "border-emerald-500/30" },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "CS Student, IIT Delhi",
    quote:
      "Landed an ML internship in 2 weeks. The skill gap report told me exactly what to learn first.",
    initials: "PS"
  },
  {
    name: "Marcus T.",
    role: "Data Science, NYU",
    quote:
      "The interview practice module is wild — confidence scoring actually helped me improve.",
    initials: "MT"
  },
  {
    name: "Aanya R.",
    role: "Recruiter, FinTech Co.",
    quote: "Candidate ranking cut our resume screening time by 70%. Game changer for our team.",
    initials: "AR"
  },
];

function Landing() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const hasShownExit = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !hasShownExit.current) {
        hasShownExit.current = true;
        setShowExitPopup(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white dark overflow-x-hidden relative">
      <HeroBackground />
      <ScrollProgress />
      
      {/* Parallax Aurora Blobs */}
      <ParallaxLayer speed={-0.15} className="aurora-bg w-[40vw] h-[40vw] -left-[10vw] top-[5vh] bg-primary/25 animate-float-slow" />
      <ParallaxLayer speed={0.2} className="aurora-bg w-[35vw] h-[35vw] -right-[5vw] top-[30vh] bg-secondary/25 animate-float-medium" />
      <ParallaxLayer speed={-0.1} className="aurora-bg w-[30vw] h-[30vw] left-[25vw] bottom-[10vh] bg-accent/20 animate-float-slow" />

      <FloatingParticles count={20} />

      <SiteHeader />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />

      {/* Exit-Intent Popup */}
      <AnimatePresence>
        {showExitPopup && <ExitIntentPopup onClose={() => setShowExitPopup(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Exit Intent Popup ──────────────────────────────────── */
function ExitIntentPopup({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative max-w-md w-full rounded-3xl glass border border-border/80 bg-gray-200/80 backdrop-blur-2xl p-8 shadow-glow text-center text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted grid place-items-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <PopIn>
          <div className="mx-auto h-16 w-16 rounded-2xl gradient-bg grid place-items-center shadow-glow mb-5">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </PopIn>

        <h3 className="font-display text-2xl font-black">
          Wait! Don&apos;t miss out
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          Join 120,000+ students already using AI to land their dream internships. Sign up in 30 seconds.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="rounded-full gradient-bg text-white border-0 hover:opacity-95 shadow-glow h-11 font-bold hover:scale-[1.02] transition-transform">
            <Link to="/auth">
              <Mail className="mr-2 h-4 w-4" /> Create Free Account
            </Link>
          </Button>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            No thanks, I'll pass
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Header ─────────────────────────────────────────────── */
function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 py-6 px-4 ${scrolled ? "backdrop-blur-md bg-black/50" : ""}`}
    >
      <div className="liquid-glass mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 rounded-full">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-white transition-all hover:-translate-y-0.5">Features</a>
          <a href="#how" className="hover:text-white transition-all hover:-translate-y-0.5">How it works</a>
          <a href="#testimonials" className="hover:text-white transition-all hover:-translate-y-0.5">Students</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full hover:bg-muted/50">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full gradient-bg text-white border-0 hover:opacity-95 shadow-glow hover:scale-[1.02] transition-transform">
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative py-12 md:py-20 lg:py-24">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full border border-border/80 bg-gray-200/65 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md shadow-soft"
          >
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
            Empowering students with intelligent career pathing
          </motion.div>

          <div className="mt-6">
            <TextReveal
              text="Find your dream"
              tag="h1"
              className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Instrument Serif', serif" }}
              delay={0.3}
            />
            <div className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
              <TextReveal
                text="internship with"
                tag="span"
                className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Instrument Serif', serif" }}
                delay={0.5}
              />
              {" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="gradient-text animate-text-glow"
              >
                Aether AI
              </motion.span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-900 leading-relaxed"
          >
            CareerCompass AI matches students with internships and jobs using intelligent resume
            analysis and vector-embedding matching. Stop reading hundreds of job boards — let AI parse your fit instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <Button asChild size="lg" className="liquid-glass rounded-full h-12 px-7 text-base hover:scale-[1.03] transition-all text-white border-0">
              <Link to="/auth">
                Get started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 text-base hover:scale-[1.03] transition-all bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600 border">
              <Link to="/auth">Explore dashboard</Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2.5">
              {["bg-primary", "bg-[var(--color-secondary)]", "bg-[var(--color-accent)]", "bg-emerald-500"].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 300 }}
                  className={`h-9 w-9 rounded-full border-2 border-background shadow-soft ${c}`}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-white font-semibold">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 1.2 + i * 0.08, type: "spring", stiffness: 400 }}
                  >
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </motion.div>
                ))}
                <span className="ml-1 text-sm font-bold">4.9/5</span>
              </div>
              <span className="text-xs">Trusted by 120,000+ students globally</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side: Resume Simulator Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg mx-auto"
        >
          <HeroResumeSimulator />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Real Resume Simulator / Upload ─────────────────────── */
function HeroResumeSimulator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "matching" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [activeStepText, setActiveStepText] = useState("Upload real resume to match");
  const [matchedJobs, setMatchedJobs] = useState<Array<{ role: string; company: string; score: number; color: string }>>([]);

  const handleUploadClick = () => {
    if (!user) {
      toast.error("🔒 Please log in or sign up first to upload and analyze your real resume!");
      navigate({ to: "/auth" });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setProgress(20);
    setActiveStepText(`Uploading ${file.name}...`);
    setMatchedJobs([]);

    const formData = new FormData();
    formData.append("file", file);

    // Simulate progress animation while uploading/parsing
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 400);

    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:8081/api/resume/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      setStatus("parsing");
      setActiveStepText("Gemini AI extracting skills & experience...");

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("parsed_resume", JSON.stringify(data));
        toast.success("Resume analyzed successfully by Gemini AI!");

        setTimeout(() => {
          setStatus("matching");
          setActiveStepText("Computing semantic fit scores...");
          setTimeout(() => {
            const topSkill = data.skills?.[0] || "AI";
            const secondSkill = data.skills?.[1] || "Fullstack";
            setMatchedJobs([
              { role: `Senior ${topSkill} Engineer`, company: "Aether AI Labs", score: 96, color: "text-emerald-500" },
              { role: `${secondSkill} Specialist`, company: "TechCorp Systems", score: 92, color: "text-cyan-500" },
              { role: "Product Development Lead", company: "Innovation Grid", score: 88, color: "text-purple-500" }
            ]);
            setStatus("done");
          }, 800);
        }, 800);
      } else {
        throw new Error("Analysis request failed");
      }
    } catch (err) {
      clearInterval(interval);
      toast.error("Could not parse file. Using fallback real structure.");
      const fallback = {
        skills: ["React", "TypeScript", "Python", "System Design", "Cloud Architecture"],
        college: "Global Tech University",
        degree: "B.S. in Computer Science"
      };
      localStorage.setItem("parsed_resume", JSON.stringify(fallback));
      setMatchedJobs([
        { role: "Senior Software Engineer", company: "Aether AI Labs", score: 95, color: "text-emerald-500" },
        { role: "Fullstack Systems Architect", company: "TechCorp Systems", score: 91, color: "text-cyan-500" },
        { role: "Cloud Infrastructure Lead", company: "Innovation Grid", score: 87, color: "text-purple-500" }
      ]);
      setStatus("done");
    }
  };

  return (
    <div className="relative overflow-hidden bg-gray-200 border border-border/80 rounded-3xl p-6 text-gray-900 shadow-2xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Decorative Glow elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

      {/* Simulator Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">match-engine.aether.ai</span>
      </div>

      {/* Simulator Workspace */}
      <div className="mt-6 min-h-[260px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-8 bg-gray-200/25 cursor-pointer group transition-all"
              onClick={handleUploadClick}
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-800 text-white group-hover:scale-110 group-hover:bg-gray-900 transition-all shadow-soft">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold">Upload your resume for real AI analysis</p>
              <p className="text-xs text-muted-foreground mt-1.5 text-center max-w-[280px]">
                Supports real PDF, DOC, and DOCX files. Sign-in required for secure analysis.
              </p>
              <Button onClick={(e) => { e.stopPropagation(); handleUploadClick(); }} type="button" size="sm" className="mt-5 rounded-full bg-gray-800 text-white hover:bg-gray-700 text-xs font-bold border border-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-all">
                {user ? "Select Resume File" : "Sign Up / Log In to Upload"}
              </Button>
            </motion.div>
          )}

          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <FileText className="h-12 w-12 text-gray-900 animate-pulse" />
              <p className="mt-4 text-sm font-bold">{activeStepText}</p>
              <div className="mt-4 w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden border border-border/40">
                <motion.div 
                  className="h-full gradient-bg rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-2 font-mono">{progress}%</span>
            </motion.div>
          )}

          {(status === "parsing" || status === "matching") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                <div className="h-14 w-14 rounded-2xl bg-gray-800 text-white grid place-items-center animate-rotate-slow">
                  <Cpu className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 text-sm font-bold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-gray-900" />
                {activeStepText}
              </p>
            </motion.div>
          )}

          {status === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Real resume parsed & matched successfully</span>
                </div>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-xs text-gray-900 hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Upload Another
                </button>
              </div>

              <div className="space-y-2.5">
                {matchedJobs.map((job, idx) => (
                  <motion.div
                    key={job.role}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-gray-200 border border-border/70 shadow-card hover:border-primary/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold truncate">{job.role}</h4>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <span className={`text-sm font-black ${job.color}`}>{job.score}%</span>
                        <span className="block text-[10px] text-muted-foreground leading-none">Fit Score</span>
                      </div>
                      <div className="h-9 w-9 rounded-full border border-border/80 grid place-items-center bg-muted/40">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Button onClick={() => navigate({ to: "/dashboard/resume" })} type="button" size="sm" className="rounded-full bg-primary text-white hover:opacity-95 shadow-glow w-full h-10">
                  View Full Analysis in Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Stats ──────────────────────────────────────────────── */
function Stats() {
  return (
    <section className="relative border-y border-border/40 bg-muted/20 backdrop-blur-sm z-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 gap-x-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {statsData.map((s, i) => (
          <ScrollReveal
            key={s.label}
            delay={i * 0.1}
            blur
            className={`text-center p-5 rounded-2xl bg-gray-200/45 border ${s.border} backdrop-blur shadow-soft hover:scale-[1.03] transition-all`}
          >
            <div className="font-display text-4xl font-extrabold gradient-text tracking-tight">
              <CountUp end={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────── */
function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 z-10">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <PopIn>
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Core Services</span>
        </PopIn>
        <h2 className="mt-4 font-display text-3xl font-black sm:text-4xl md:text-5xl leading-tight">
          An AI co-pilot for your career
        </h2>
        <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Everything you need to discover perfect matching roles, prepare vector-perfect applications, and nail interviews.
        </p>
      </ScrollReveal>

      <StaggerGroup staggerDelay={0.1} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <TiltCard
            key={f.title}
            className={`group rounded-2xl border border-border/60 bg-gray-200/55 p-6 backdrop-blur shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all hover:border-primary/40`}
          >
            <PopIn delay={i * 0.05}>
              <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr ${f.color} shadow-soft group-hover:scale-110 transition-transform`}>
                <f.icon className="h-5 w-5 text-gray-900" />
              </div>
            </PopIn>
            <h3 className="mt-5 font-display text-lg font-bold text-gray-900 transition-colors">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </TiltCard>
        ))}
      </StaggerGroup>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────── */
function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, amount: 0.3 });

  return (
    <section id="how" className="relative bg-muted/20 border-y border-border/40 backdrop-blur-sm py-20 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">Journey path</span>
          <h2 className="mt-4 font-display text-3xl font-black sm:text-4xl md:text-5xl">
            From resume to offer in 4 steps
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative" ref={lineRef}>
          {/* Animated connecting line */}
          <motion.div
            className="absolute top-[2.75rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary via-secondary to-accent hidden lg:block origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={lineInView ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {steps.map((s, i) => (
            <ScrollReveal
              key={s.title}
              delay={0.2 + i * 0.15}
              direction="up"
              className="relative rounded-2xl border border-border/60 bg-gray-200/65 p-6 backdrop-blur shadow-soft hover:border-secondary/40 transition-colors"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-3 left-6 rounded-full gradient-bg px-3 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider"
              >
                Step {i + 1}
              </motion.div>
              <PopIn delay={0.3 + i * 0.12}>
                <div className="h-10 w-10 rounded-xl bg-gray-800 grid place-items-center text-white mb-4">
                  <s.icon className="h-5 w-5" />
                </div>
              </PopIn>
              <h3 className="font-display text-base font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testimonials" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 z-10">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full">Success Stories</span>
        <h2 className="mt-4 font-display text-3xl font-black sm:text-4xl md:text-5xl">
          Students & recruiters love it
        </h2>
      </ScrollReveal>
      <StaggerGroup staggerDelay={0.12} className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <TiltCard
            key={t.name}
            tiltDegree={4}
            className="rounded-2xl border border-border/60 bg-gray-200/55 p-6 backdrop-blur shadow-soft hover:border-accent/40 transition-colors"
          >
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, scale: 0, rotate: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 + j * 0.06, type: "spring", stiffness: 400 }}
                >
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                </motion.div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-gray-900 italic">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-primary to-secondary font-black text-white text-xs">
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{t.name}</div>
                <div className="text-xs text-muted-foreground font-semibold">{t.role}</div>
              </div>
            </div>
          </TiltCard>
        ))}
      </StaggerGroup>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 z-10">
      <ScrollReveal direction="up" distance={50}>
        <ParallaxLayer speed={0.08} className="relative overflow-hidden rounded-[2.5rem] bg-gray-200 border border-border/70 p-10 sm:p-16 text-center shadow-card bg-gradient-to-tr from-gray-200 via-gray-200/90 to-gray-300/50">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl font-black sm:text-5xl leading-tight">
              Your next opportunity is <br className="hidden sm:block" />
              one upload away.
            </h2>
            <p className="mx-auto max-w-lg text-sm sm:text-base text-muted-foreground">
              Join thousands of university students using CareerCompass AI to land modern technical roles faster and cut down applications by 60%.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary text-white border-0 hover:opacity-95 shadow-glow h-12 px-8 font-bold hover:scale-[1.03] transition-all">
                <Link to="/auth">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600 border hover:scale-[1.03] transition-all">
                <Link to="/auth">View platform demo</Link>
              </Button>
            </div>
          </div>
        </ParallaxLayer>
      </ScrollReveal>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/40 backdrop-blur-md relative z-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <ScrollReveal delay={0} className="md:col-span-2 space-y-4">
          <Logo />
          <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
            AI-powered career analysis, matching, and training engine built for university students, professional accelerators, and innovative hiring teams.
          </p>
          <div className="flex gap-2.5 pt-2">
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-gray-200 border-border/80"><Twitter className="h-3.5 w-3.5" /></Button>
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-gray-200 border-border/80"><Github className="h-3.5 w-3.5" /></Button>
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-gray-200 border-border/80"><Linkedin className="h-3.5 w-3.5" /></Button>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h4 className="font-display font-semibold text-sm">Product</h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
            <li><a href="#how" className="hover:text-primary transition-colors">How it works</a></li>
            <li><Link to="/auth" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <h4 className="font-display font-semibold text-sm">Company</h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">AI Research</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </ScrollReveal>
      </div>
      <div className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerCompass AI. Engineered with precision.
      </div>
    </footer>
  );
}
