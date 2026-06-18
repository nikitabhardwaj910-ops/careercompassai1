import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
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
  { icon: Sparkles, title: "AI Job Matching", desc: "Personalized roles ranked by semantic resume + skill similarity." },
  { icon: FileSearch, title: "Resume Analyzer", desc: "Extracts skills, education, and experience in seconds." },
  { icon: TrendingUp, title: "Skill Gap Analysis", desc: "Compare your skills to target roles and get a learning roadmap." },
  { icon: Bot, title: "Career Chatbot", desc: "Always-on guidance for resumes, careers, and applications." },
  { icon: Mic, title: "Interview Practice", desc: "Speech-to-text, sentiment, and confidence scoring." },
  { icon: Target, title: "Match Score", desc: "Know exactly how well you fit each opportunity." },
];

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Drop your PDF — we'll handle the rest." },
  { icon: Brain, title: "AI Analysis", desc: "Resume parsing and embedding generation." },
  { icon: Target, title: "Personalized Matches", desc: "Roles ranked by fit, not keywords." },
  { icon: Send, title: "Apply with Confidence", desc: "Track applications and prep with AI." },
];

const stats = [
  { value: "25k+", label: "Jobs Posted" },
  { value: "120k+", label: "Students Registered" },
  { value: "3.4k", label: "Companies Hiring" },
  { value: "92%", label: "Match Accuracy" },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "CS Student, IIT Delhi",
    quote:
      "Landed an ML internship in 2 weeks. The skill gap report told me exactly what to learn first.",
  },
  {
    name: "Marcus T.",
    role: "Data Science, NYU",
    quote:
      "The interview practice module is wild — confidence scoring actually helped me improve.",
  },
  {
    name: "Aanya R.",
    role: "Recruiter, FinTech Co.",
    quote: "Candidate ranking cut our resume screening time by 70%. Game changer for our team.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Students</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="gradient-bg text-white border-0 hover:opacity-90">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full gradient-bg blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-accent)] blur-3xl opacity-30 animate-float-slow" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            Powered by intelligent resume matching
          </div>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Find your dream <br />
            internship with <span className="gradient-text">AI</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            CareerCompass AI matches students with internships and jobs using intelligent resume
            analysis and machine learning. Stop scrolling — start landing offers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gradient-bg text-white border-0 hover:opacity-90 h-12 px-6 text-base">
              <Link to="/signup">
                Get started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link to="/dashboard">Explore jobs</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["bg-primary", "bg-[var(--color-accent)]", "bg-[var(--color-secondary)]", "bg-chart-4"].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full border-2 border-background ${c}`} />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                ))}
                <span className="ml-1 font-semibold">4.9</span>
              </div>
              Loved by 120k+ students
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroDashboard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-3xl gradient-bg opacity-20 blur-2xl" />
      <div className="relative rounded-3xl glass card-shadow p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning)]/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]/70" />
          </div>
          <span className="text-xs text-muted-foreground">dashboard.careercompass.ai</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: "Match Score", value: "92%", trend: "+8%" },
            { label: "Applications", value: "14", trend: "+3" },
            { label: "Interviews", value: "5", trend: "+2" },
            { label: "Profile", value: "86%", trend: "↑" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border/60 bg-card/60 p-3">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-display">{m.value}</span>
                <span className="rounded-full bg-[var(--color-success)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-success)]">
                  {m.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Top match</span>
            <span>Today</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg gradient-bg text-white font-bold">G</div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">ML Engineer Intern · Globex</div>
              <div className="text-xs text-muted-foreground">Remote · ₹80k/mo</div>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              96% fit
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-full w-[96%] rounded-full gradient-bg" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 items-end gap-1.5 rounded-xl border border-border/60 bg-card/60 p-4">
          {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
            <div
              key={i}
              className="rounded-md gradient-bg opacity-90"
              style={{ height: `${h}%`, minHeight: 12 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="text-center"
          >
            <div className="font-display text-4xl font-extrabold gradient-text">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">Features</span>
        <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
          An AI co-pilot for your career
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything you need to discover, prepare for, and land the right role.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-border/60 bg-card p-6 card-shadow transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-bg text-white shadow-[var(--shadow-glow)]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="bg-muted/30 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-[var(--color-accent)]">How it works</span>
          <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            From resume to offer in 4 steps
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-border/60 bg-card p-6 card-shadow"
            >
              <div className="absolute -top-3 left-6 rounded-full gradient-bg px-2.5 py-0.5 text-xs font-bold text-white">
                Step {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-[var(--color-secondary)]">Testimonials</span>
        <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
          Students & recruiters love it
        </h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/60 bg-card p-6 card-shadow"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-[var(--color-warning)] text-[var(--color-warning)]" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-bg font-bold text-white">
                {t.name[0]}
              </div>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-10 text-center text-white sm:p-16">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
            Your next opportunity is one upload away.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Join thousands of students using CareerCompass AI to land internships faster.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base bg-white text-primary hover:bg-white/90">
              <Link to="/signup">Create free account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link to="/dashboard">View demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI-powered career platform built for students, recruiters and placement coordinators.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="icon"><Twitter className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Github className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Linkedin className="h-4 w-4" /></Button>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#how" className="hover:text-foreground">How it works</a></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Careers</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerCompass AI. All rights reserved.
      </div>
    </footer>
  );
}
