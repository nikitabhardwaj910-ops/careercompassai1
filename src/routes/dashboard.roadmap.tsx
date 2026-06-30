import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Map, CheckCircle2, Circle, Award, Sparkles, Code, ExternalLink, Terminal, Layers, Clock, Briefcase, BookOpen, Compass, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/roadmap")({
  head: () => ({ meta: [{ title: "Developer Career Roadmaps — CareerCompass AI" }] }),
  component: RoadmapPage,
});

type StatusType = "pending" | "in_progress" | "completed";

interface ModuleItem {
  name: string;
  status: StatusType;
  actionItem: string;
}

interface CareerTrack {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  desc: string;
  badge: string;
  phases: {
    id: string;
    title: string;
    duration: string;
    modules: Record<string, ModuleItem>;
  }[];
}

const ROADMAP_TRACKS: Record<string, CareerTrack> = {
  "java_dev": {
    title: "☕ Java Enterprise Developer",
    subtitle: "Backend & Microservices Track",
    icon: Layers,
    color: "text-amber-500",
    badge: "High Demand",
    desc: "Master robust backend development from Core Java fundamentals to Spring Boot microservices and cloud deployments.",
    phases: [
      {
        id: "java_p1",
        title: "Phase 1: Core Java Foundations & OOP",
        duration: "Weeks 1 - 3",
        modules: {
          "j1": { name: "Java Syntax, Memory Model & JVM Architecture", status: "pending", actionItem: "Understand stack vs heap allocations and garbage collection basics." },
          "j2": { name: "Object-Oriented Programming (Classes, Inheritance, Interfaces)", status: "pending", actionItem: "Build a modular banking system using encapsulation and polymorphism." },
          "j3": { name: "Java Collections Framework (Lists, Sets, Maps & Streams)", status: "pending", actionItem: "Master HashMap internals and Stream API functional transformations." },
          "j4": { name: "Exception Handling, Multithreading & Concurrency", status: "pending", actionItem: "Implement thread-safe executors and custom exception handlers." }
        }
      },
      {
        id: "java_p2",
        title: "Phase 2: Database Persistence & ORM Integration",
        duration: "Weeks 4 - 5",
        modules: {
          "j5": { name: "Relational SQL Mastery & Indexing (PostgreSQL/MySQL)", status: "pending", actionItem: "Write complex joins, subqueries, and analyze index execution plans." },
          "j6": { name: "JDBC & JPA / Hibernate ORM Architecture", status: "pending", actionItem: "Map bidirectional entities and solve the N+1 select performance problem." },
          "j7": { name: "Database Migrations & Transaction Management (@Transactional)", status: "pending", actionItem: "Implement ACID transactions and Flyway/Liquibase schema versioning." }
        }
      },
      {
        id: "java_p3",
        title: "Phase 3: Spring Boot Enterprise Engineering",
        duration: "Weeks 6 - 8",
        modules: {
          "j8": { name: "Spring Core Inversion of Control (IoC) & Dependency Injection", status: "pending", actionItem: "Configure application contexts and custom bean lifecycle callbacks." },
          "j9": { name: "Building Production RESTful APIs with Spring MVC", status: "pending", actionItem: "Design DTOs, global exception handlers (@ControllerAdvice), and swagger docs." },
          "j10": { name: "Spring Security 6 & JWT Stateless Authentication", status: "pending", actionItem: "Secure endpoints with OAuth2/JWT filters and role-based access control." }
        }
      },
      {
        id: "java_p4",
        title: "Phase 4: Distributed Microservices & Cloud System Design",
        duration: "Weeks 9+",
        modules: {
          "j11": { name: "Docker Containerization & Multi-stage Maven Builds", status: "pending", actionItem: "Containerize Spring Boot JARs with minimal memory footprint." },
          "j12": { name: "Asynchronous Event Driven Messaging (Kafka / RabbitMQ)", status: "pending", actionItem: "Build decoupled producer-consumer services for email/notification queues." },
          "j13": { name: "Spring Cloud Gateway & Distributed Tracing", status: "pending", actionItem: "Set up API rate-limiting, Eureka discovery, and Prometheus/Grafana monitoring." }
        }
      }
    ]
  },
  "fullstack_dev": {
    title: "🌐 Full Stack Web Developer",
    subtitle: "Modern Frontend & Backend Track",
    icon: Terminal,
    color: "text-indigo-500",
    badge: "Versatile Role",
    desc: "Complete end-to-end web architecture covering responsive React frontend UI, RESTful APIs, and full database integration.",
    phases: [
      {
        id: "fs_p1",
        title: "Phase 1: Modern Web Foundations & TypeScript",
        duration: "Weeks 1 - 3",
        modules: {
          "fs1": { name: "Semantic HTML5, Accessibility (a11y) & Modern CSS Layouts", status: "pending", actionItem: "Build responsive CSS Grid/Flexbox layouts without external UI libraries." },
          "fs2": { name: "JavaScript ES6+ Deep Dive (Closures, Event Loop & Promises)", status: "pending", actionItem: "Master async/await, prototypes, and browser DOM manipulation." },
          "fs3": { name: "TypeScript Strict Mode, Generics & Type Guards", status: "pending", actionItem: "Convert a complex JS project to type-safe TypeScript code." }
        }
      },
      {
        id: "fs_p2",
        title: "Phase 2: Frontend Engineering with React & Next.js",
        duration: "Weeks 4 - 6",
        modules: {
          "fs4": { name: "React 19 Component Architecture & Custom Hooks", status: "pending", actionItem: "Build reusable hooks for debounced search and localStorage sync." },
          "fs5": { name: "State Management & Server State (TanStack Query / Zustand)", status: "pending", actionItem: "Implement optimistic UI updates and background cache revalidation." },
          "fs6": { name: "Next.js App Router, SSR & Tailwind CSS Design Systems", status: "pending", actionItem: "Create SEO-optimized server-rendered pages with dark mode glassmorphism." }
        }
      },
      {
        id: "fs_p3",
        title: "Phase 3: Backend REST APIs & Server Logic",
        duration: "Weeks 7 - 8",
        modules: {
          "fs7": { name: "Node.js Express / Spring Boot Backend Server Setup", status: "pending", actionItem: "Construct modular route controllers and middleware request validators." },
          "fs8": { name: "Stateless Auth Flow (JWT Access + HTTP-only Refresh Tokens)", status: "pending", actionItem: "Secure cross-origin requests (CORS) and implement secure logout flows." },
          "fs9": { name: "Database Modeling with PostgreSQL & ORM (Prisma/JPA)", status: "pending", actionItem: "Design normalized database schemas with foreign key constraints." }
        }
      },
      {
        id: "fs_p4",
        title: "Phase 4: Production Deployment & CI/CD Pipelines",
        duration: "Weeks 9+",
        modules: {
          "fs10": { name: "Automated Testing (Vitest, Jest & Playwright E2E)", status: "pending", actionItem: "Write integration tests covering the complete user authentication lifecycle." },
          "fs11": { name: "Git Workflow, GitHub Actions CI/CD & Cloud Hosting", status: "pending", actionItem: "Configure automated preview deployments on Vercel and AWS EC2." }
        }
      }
    ]
  },
  "python_dev": {
    title: "🐍 Python & AI Developer",
    subtitle: "Automation, Web APIs & GenAI Track",
    icon: Sparkles,
    color: "text-emerald-500",
    badge: "AI Frontier",
    desc: "From Pythonic core programming and data manipulation to building lightning-fast FastAPI microservices and LLM integrations.",
    phases: [
      {
        id: "py_p1",
        title: "Phase 1: Pythonic Syntax & Core Architecture",
        duration: "Weeks 1 - 2",
        modules: {
          "py1": { name: "Python Variables, Data Structures & List Comprehensions", status: "pending", actionItem: "Write clean Pythonic idioms and generator functions for memory efficiency." },
          "py2": { name: "Decorators, Context Managers & Advanced OOP Concepts", status: "pending", actionItem: "Implement custom @retry decorators and resource-safe file handlers." },
          "py3": { name: "Virtual Environments, Poetry & Dependency Management", status: "pending", actionItem: "Package reusable Python modules with deterministic versioning." }
        }
      },
      {
        id: "py_p2",
        title: "Phase 2: Data Manipulation & High-Speed Scraping",
        duration: "Weeks 3 - 4",
        modules: {
          "py4": { name: "Data Processing with NumPy & Pandas DataFrames", status: "pending", actionItem: "Clean, aggregate, and analyze multi-gigabyte CSV/JSON datasets." },
          "py5": { name: "Asynchronous Web Scraping (BeautifulSoup & Playwright)", status: "pending", actionItem: "Extract live tech job listings and store them in structured SQLite tables." }
        }
      },
      {
        id: "py_p3",
        title: "Phase 3: High-Performance Web APIs with FastAPI",
        duration: "Weeks 5 - 7",
        modules: {
          "py6": { name: "FastAPI Asynchronous Architecture & Pydantic Validation", status: "pending", actionItem: "Build auto-documented OpenAPI endpoints with automatic type casting." },
          "py7": { name: "SQLAlchemy 2.0 Async ORM & PostgreSQL Integration", status: "pending", actionItem: "Manage async database connections and complex table relationships." },
          "py8": { name: "Background Tasks, Celery & Redis Caching", status: "pending", actionItem: "Offload compute-heavy PDF parsing jobs to asynchronous background workers." }
        }
      },
      {
        id: "py_p4",
        title: "Phase 4: GenAI & RAG Engineering Integration",
        duration: "Weeks 8+",
        modules: {
          "py9": { name: "LLM API Calling (Google Gemini 2.5 & OpenAI Structured Output)", status: "pending", actionItem: "Build structured resume analyzers using JSON response schemas." },
          "py10": { name: "Vector Databases (Pinecone / Qdrant) & Embeddings", status: "pending", actionItem: "Chunk documentation documents and perform semantic similarity searches." },
          "py11": { name: "Building Complete Retrieval-Augmented Generation (RAG) Apps", status: "pending", actionItem: "Deploy an intelligent chat agent capable of answering domain-specific queries." }
        }
      }
    ]
  },
  "dsa_start": {
    title: "🧠 How to Start DSA",
    subtitle: "Data Structures & Algorithms Mastery",
    icon: Code,
    color: "text-rose-500",
    badge: "Interview Core",
    desc: "A step-by-step algorithmic blueprint to develop strong problem-solving intuition and crack technical FAANG coding rounds.",
    phases: [
      {
        id: "dsa_p1",
        title: "Step 1: Complexity Analysis & Linear Foundations",
        duration: "Weeks 1 - 2",
        modules: {
          "d1": { name: "Big O Notation (Time & Space Complexity Analysis)", status: "pending", actionItem: "Learn to calculate worst-case bounds for nested loops and recursion trees." },
          "d2": { name: "Arrays, Static vs Dynamic Allocation & Hashing Basics", status: "pending", actionItem: "Solve Two Sum and Contains Duplicate using O(N) HashSets." },
          "d3": { name: "Two Pointers & Sliding Window Algorithmic Patterns", status: "pending", actionItem: "Solve Longest Substring Without Repeating Characters and 3Sum problems." }
        }
      },
      {
        id: "dsa_p2",
        title: "Step 2: Core Linear Structures & Searching",
        duration: "Weeks 3 - 5",
        modules: {
          "d4": { name: "Linked Lists (Singly, Doubly & Fast-Slow Pointer Tricks)", status: "pending", actionItem: "Detect cycles and reverse linked lists iteratively and recursively." },
          "d5": { name: "Stacks & Queues (Monotonic Stack & Valid Parentheses)", status: "pending", actionItem: "Solve Next Greater Element and Daily Temperatures problems." },
          "d6": { name: "Binary Search on Answer & Sorted Arrays", status: "pending", actionItem: "Master rotated sorted array search and capacity allocation bounds." }
        }
      },
      {
        id: "dsa_p3",
        title: "Step 3: Non-Linear Structures (Trees & Graphs)",
        duration: "Weeks 6 - 8",
        modules: {
          "d7": { name: "Binary Trees & BST Traversals (Pre/In/Post Order & Level Order)", status: "pending", actionItem: "Find lowest common ancestor and validate binary search tree invariants." },
          "d8": { name: "Graph Representation & Traversals (Breadth-First & Depth-First)", status: "pending", actionItem: "Count connected components and find shortest paths in unweighted grids." },
          "d9": { name: "Topological Sort & Disjoint Set Union (Union-Find)", status: "pending", actionItem: "Solve Course Schedule prerequisites and network connectivity problems." }
        }
      },
      {
        id: "dsa_p4",
        title: "Step 4: Advanced Problem Solving & Dynamic Programming",
        duration: "Weeks 9+",
        modules: {
          "d10": { name: "Dynamic Programming Foundations (Memoization vs Tabulation)", status: "pending", actionItem: "Solve Climbing Stairs, Coin Change, and Longest Increasing Subsequence." },
          "d11": { name: "Greedy Algorithms & Priority Queues (Min/Max Heaps)", status: "pending", actionItem: "Solve task scheduler and merge K sorted lists efficiently." },
          "d12": { name: "Mock Interview Timed Practice (LeetCode Medium Strategy)", status: "pending", actionItem: "Complete 45-minute timed coding runs explaining your trade-offs out loud." }
        }
      }
    ]
  },
  "job_hunting": {
    title: "🎯 How to Find Jobs",
    subtitle: "Recruiter Outreach & Interview Cracking",
    icon: Target,
    color: "text-blue-500",
    badge: "Career Blueprint",
    desc: "A proven strategy to optimize your resume, get direct recruiter referrals, build standout portfolios, and clear technical rounds.",
    phases: [
      {
        id: "jh_p1",
        title: "Step 1: Resume Optimization & ATS Vector Positioning",
        duration: "Week 1",
        modules: {
          "jh1": { name: "Quantifiable Impact Bullet Points (X by Y using Z formula)", status: "pending", actionItem: "Replace passive descriptions with numbers: e.g. 'Improved API latency by 45%'." },
          "jh2": { name: "Keyword Alignment with Target Job Descriptions", status: "pending", actionItem: "Use CareerCompass AI Resume Analyzer to ensure 90%+ skill match scoring." },
          "jh3": { name: "Clean Single-Column Formatting & Contact Hyperlinks", status: "pending", actionItem: "Ensure live GitHub and deployed portfolio links work seamlessly." }
        }
      },
      {
        id: "jh_p2",
        title: "Step 2: Building Standout Proof of Work (Projects)",
        duration: "Weeks 2 - 3",
        modules: {
          "jh4": { name: "Build 2 Production-Grade Fullstack Capstone Projects", status: "pending", actionItem: "Avoid generic to-do apps; build real tools with auth, databases, and AI features." },
          "jh5": { name: "Writing Professional README Documentation & Architecture Diagrams", status: "pending", actionItem: "Include system architecture flow diagrams and 1-minute video demos." },
          "jh6": { name: "Live Deployment (Vercel / Render / AWS Cloud)", status: "pending", actionItem: "Verify zero downtime and fast loading speeds for recruiter reviews." }
        }
      },
      {
        id: "jh_p3",
        title: "Step 3: LinkedIn SEO & Direct Recruiter Outreach",
        duration: "Weeks 4 - 5",
        modules: {
          "jh7": { name: "LinkedIn Profile Headline & Featured Section Optimization", status: "pending", actionItem: "Set headline to 'Java/Fullstack Developer | Building Scalable Cloud APIs'." },
          "jh8": { name: "Cold Outreach & Employee Referral Request Scripts", status: "pending", actionItem: "Message engineering leaders directly with concise 3-sentence project proofs." },
          "jh9": { name: "Leveraging CareerCompass Swipe Discovery & Job Board", status: "pending", actionItem: "Apply daily within 24 hours of job posting to maximize recruiter visibility." }
        }
      },
      {
        id: "jh_p4",
        title: "Step 4: Cracking the Interview Process",
        duration: "Weeks 6+",
        modules: {
          "jh10": { name: "Online Assessments (OA) & Live Technical Coding Rounds", status: "pending", actionItem: "Practice clarifying requirements before coding and dry-running edge cases." },
          "jh11": { name: "System Design & Architecture Discussion Round", status: "pending", actionItem: "Learn high-level scalability patterns: caching, load balancing, and sharding." },
          "jh12": { name: "STAR Behavioral Framework & Offer Negotiation", status: "pending", actionItem: "Prepare 5 core stories illustrating leadership, conflict resolution, and impact." }
        }
      }
    ]
  }
};

const studentProjects = [
  {
    id: "p1",
    title: "Enterprise E-Commerce Microservices Engine",
    track: "Java / Full Stack Track",
    difficulty: "Advanced",
    xp: "+750 XP",
    desc: "Build a distributed backend using Spring Boot, JPA, PostgreSQL, and JWT stateless security with clean REST architecture.",
    actionLink: "/dashboard/jobs"
  },
  {
    id: "p2",
    title: "AI Resume & Job Matching RAG Assistant",
    track: "Python & AI Track",
    difficulty: "Advanced",
    xp: "+800 XP",
    desc: "Create an intelligent candidate evaluator using FastAPI, Vector Embeddings, and Google Gemini LLM API integration.",
    actionLink: "/dashboard/discover"
  },
  {
    id: "p3",
    title: "Interactive Career Analytics Dashboard",
    track: "Frontend & UI/UX Track",
    difficulty: "Intermediate",
    xp: "+500 XP",
    desc: "Develop a high-performance React application with dark mode glassmorphism, Framer Motion transitions, and Recharts.",
    actionLink: "/dashboard/recommendations"
  }
];

function RoadmapPage() {
  const [activeTrackKey, setActiveTrackKey] = useState("java_dev");
  const [allTrackState, setAllTrackState] = useState<Record<string, Record<string, StatusType>>>({});
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);

  useEffect(() => {
    const savedState = localStorage.getItem("career_roadmap_state_v1");
    if (savedState) {
      try { setAllTrackState(JSON.parse(savedState)); } catch (e) {}
    } else {
      const initial: Record<string, Record<string, StatusType>> = {};
      Object.keys(ROADMAP_TRACKS).forEach(trackKey => {
        initial[trackKey] = {};
        ROADMAP_TRACKS[trackKey].phases.forEach(phase => {
          Object.keys(phase.modules).forEach(modKey => {
            initial[trackKey][modKey] = phase.modules[modKey].status;
          });
        });
      });
      setAllTrackState(initial);
    }

    const savedProjs = localStorage.getItem("roadmap_completed_projects_v1");
    if (savedProjs) {
      try { setCompletedProjects(JSON.parse(savedProjs)); } catch (e) {}
    }
  }, []);

  const currentTrack = ROADMAP_TRACKS[activeTrackKey];
  const trackStatuses = allTrackState[activeTrackKey] || {};

  const cycleModuleStatus = (modKey: string, modName: string) => {
    const currentStatus: StatusType = trackStatuses[modKey] || "pending";
    let nextStatus: StatusType = "in_progress";
    if (currentStatus === "pending") nextStatus = "in_progress";
    else if (currentStatus === "in_progress") nextStatus = "completed";
    else nextStatus = "pending";

    const updatedTrack = {
      ...trackStatuses,
      [modKey]: nextStatus
    };
    const updatedAll = {
      ...allTrackState,
      [activeTrackKey]: updatedTrack
    };
    setAllTrackState(updatedAll);
    localStorage.setItem("career_roadmap_state_v1", JSON.stringify(updatedAll));

    if (nextStatus === "in_progress") {
      toast.info(`Checkpoint marked: "${modName}" is now IN PROGRESS 🟡`);
    } else if (nextStatus === "completed") {
      toast.success(`Milestone mastered: "${modName}"! 🟢`);
    } else {
      toast("Checkpoint reset to Not Started ⚪");
    }
  };

  const completeProject = (pId: string, pTitle: string) => {
    if (completedProjects.includes(pId)) return;
    const updated = [...completedProjects, pId];
    setCompletedProjects(updated);
    localStorage.setItem("roadmap_completed_projects_v1", JSON.stringify(updated));
    toast.success(`🎉 Capstone project "${pTitle}" marked as built! Added to your developer portfolio.`);
  };

  // Calculate track progress
  let totalModsCount = 0;
  let completedCount = 0;
  let inProgressCount = 0;

  currentTrack?.phases.forEach(phase => {
    Object.keys(phase.modules).forEach(modKey => {
      totalModsCount++;
      const status = trackStatuses[modKey] || "pending";
      if (status === "completed") completedCount++;
      if (status === "in_progress") inProgressCount++;
    });
  });

  const progressPercent = totalModsCount > 0 
    ? Math.round(((completedCount + (inProgressCount * 0.5)) / totalModsCount) * 100) 
    : 0;

  const getRankBadge = (pct: number) => {
    if (pct >= 90) return { title: "Senior Architect Lead ⭐", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" };
    if (pct >= 60) return { title: "Proficient Developer 🚀", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" };
    if (pct >= 30) return { title: "Intermediate Engineer 📈", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" };
    return { title: "Junior Apprentice 🌱", color: "text-primary bg-primary/10 border-primary/20" };
  };

  const rank = getRankBadge(progressPercent);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-14 px-2">
      {/* Hero Header & Navigation Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl shadow-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary grid place-items-center shadow-soft">
              <Compass className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">Developer Career Roadmaps</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Structured step-by-step blueprints on how to become a top developer & land high-paying roles.</p>
            </div>
          </div>
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 shrink-0 ${rank.color}`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-mono font-bold text-xs sm:text-sm">{rank.title}</span>
          </div>
        </div>

        {/* Track Selector Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-border/40">
          {Object.keys(ROADMAP_TRACKS).map((key) => {
            const track = ROADMAP_TRACKS[key];
            const active = activeTrackKey === key;
            const IconComponent = track.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTrackKey(key)}
                type="button"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  active 
                    ? "gradient-bg text-white border-primary shadow-glow scale-[1.02]" 
                    : "bg-card/60 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{track.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Track Banner & Progress Indicator */}
        <div className="bg-background/60 p-5 rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {currentTrack?.badge}
              </span>
              <h2 className="text-lg font-black font-display text-foreground">{currentTrack?.title}</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{currentTrack?.desc}</p>
          </div>

          <div className="flex flex-col items-end shrink-0 w-full sm:w-56 space-y-1.5">
            <div className="flex items-center justify-between w-full text-xs font-bold font-mono">
              <span className="text-muted-foreground uppercase tracking-wider">Track Mastery</span>
              <span className="text-primary font-black">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2.5 rounded-full w-full" />
            <span className="text-[10px] text-muted-foreground font-mono">Click any milestone to advance progress</span>
          </div>
        </div>
      </motion.div>

      {/* Step-by-Step Roadmap Phases */}
      <div className="relative pl-4 sm:pl-8 mt-6">
        <div className="absolute left-[27px] sm:left-[43px] top-[40px] bottom-[40px] w-0.5 bg-border/50 rounded-full" />

        <div className="space-y-8">
          {currentTrack?.phases.map((phase, phaseIdx) => {
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: phaseIdx * 0.08 }}
                className="relative flex gap-5 sm:gap-8 items-start group"
              >
                {/* Timeline Node Badge */}
                <div className="relative z-10 shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border-2 border-primary/40 bg-card text-primary grid place-items-center shadow-soft font-black font-mono text-sm">
                  #{phaseIdx + 1}
                </div>

                {/* Phase Content Container */}
                <div className="flex-1 rounded-3xl border border-border/60 bg-card/45 backdrop-blur-xl p-5 sm:p-6 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-border/40 pb-3.5">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-black text-foreground group-hover:text-primary transition-colors">{phase.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono font-bold text-muted-foreground uppercase">{phase.duration}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {Object.keys(phase.modules).length} Essential Topics
                    </span>
                  </div>

                  {/* Topic Modules List */}
                  <div className="space-y-3">
                    {Object.keys(phase.modules).map((modKey) => {
                      const mod = phase.modules[modKey];
                      const status = trackStatuses[modKey] || "pending";
                      const isCompleted = status === "completed";
                      const isInProgress = status === "in_progress";

                      return (
                        <div 
                          key={modKey} 
                          onClick={() => cycleModuleStatus(modKey, mod.name)}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                            isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                            isInProgress ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-soft" :
                            "bg-card/50 border-border/50 text-foreground hover:bg-muted/40 hover:border-border"
                          }`}
                        >
                          <div className="flex items-start gap-3.5 flex-1">
                            <div className="mt-0.5 shrink-0">
                              {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                              {isInProgress && <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
                              {!isCompleted && !isInProgress && <Circle className="h-5 w-5 text-muted-foreground/50" />}
                            </div>
                            
                            <div className="space-y-1">
                              <h4 className={`text-sm font-bold leading-tight ${isCompleted ? "line-through opacity-80" : ""}`}>
                                {mod.name}
                              </h4>
                              <p className={`text-xs ${isCompleted ? "text-emerald-500/80" : isInProgress ? "text-amber-500/90" : "text-muted-foreground"}`}>
                                <span className="font-bold uppercase tracking-wider text-[10px] mr-1">Action Step:</span> 
                                {mod.actionItem}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <span className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                              isCompleted ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" :
                              isInProgress ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse" :
                              "bg-muted/80 text-muted-foreground border border-border/40"
                            }`}>
                              {isCompleted ? "Mastered ✅" : isInProgress ? "In Progress 🟡" : "Not Started ⚪"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recommended Capstone Projects Section */}
      <div className="pt-8 border-t border-border/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-black text-foreground flex items-center gap-2.5">
              <Code className="text-primary w-7 h-7" /> Real-World Capstone Project Lab
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Build concrete developer portfolio proof-of-work aligned with your career roadmap.</p>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full self-start sm:self-auto">
            +500 XP per project built
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {studentProjects.map((proj) => {
            const isDone = completedProjects.includes(proj.id);
            return (
              <div key={proj.id} className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl flex flex-col justify-between shadow-card hover:border-primary/40 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                      {proj.track}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-500">{proj.xp}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2 leading-snug">{proj.title}</h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{proj.desc}</p>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto">
                  <Button
                    onClick={() => completeProject(proj.id, proj.title)}
                    disabled={isDone}
                    className={`w-full rounded-full font-bold text-xs h-10 transition-all ${
                      isDone ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default" : "gradient-bg text-white hover:opacity-90 shadow-soft"
                    }`}
                  >
                    {isDone ? "Built & Added to Portfolio ⭐" : "Mark Project Built (+500 XP)"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
