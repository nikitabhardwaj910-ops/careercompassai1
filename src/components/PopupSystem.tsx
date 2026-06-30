import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  X,
  Bell,
  CheckCircle2,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Context ─────────────────────────────────────────────── */
interface PopupContextType {
  showWelcome: () => void;
  showMatchNotification: () => void;
  showCelebration: () => void;
}

const PopupContext = createContext<PopupContextType | null>(null);

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within <PopupProvider>");
  return ctx;
}

/* ─── Provider ────────────────────────────────────────────── */
export function PopupProvider({ children }: { children: ReactNode }) {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  const showWelcome = useCallback(() => {
    const key = "cc-welcome-shown";
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      setTimeout(() => setWelcomeOpen(true), 800);
    }
  }, []);

  const showMatchNotification = useCallback(() => {
    setTimeout(() => setMatchOpen(true), 3000);
  }, []);

  const showCelebration = useCallback(() => {
    setCelebrationOpen(true);
  }, []);

  return (
    <PopupContext.Provider value={{ showWelcome, showMatchNotification, showCelebration }}>
      {children}

      <AnimatePresence>
        {welcomeOpen && <WelcomeModal onClose={() => setWelcomeOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {matchOpen && <MatchNotification onClose={() => setMatchOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {celebrationOpen && <CelebrationModal onClose={() => setCelebrationOpen(false)} />}
      </AnimatePresence>
    </PopupContext.Provider>
  );
}

/* ─── Welcome Modal ───────────────────────────────────────── */
function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative max-w-lg w-full rounded-3xl glass border border-border/80 bg-card/85 backdrop-blur-2xl p-8 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted grid place-items-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
            className="h-14 w-14 shrink-0 rounded-2xl gradient-bg grid place-items-center shadow-glow"
          >
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>

          <div className="min-w-0">
            <h3 className="font-display text-xl font-black text-foreground">
              Welcome to your command center! 🚀
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Your AI-powered dashboard is ready. Upload your resume to get personalized job matches,
              skill gap analysis, and interview preparation — all powered by Aether AI.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { emoji: "📄", label: "Upload Resume" },
            { emoji: "🎯", label: "View Matches" },
            { emoji: "💬", label: "Ask Aether" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl bg-muted/40 border border-border/50 p-3 text-center hover:bg-muted/60 hover:border-primary/30 transition-all cursor-pointer"
            >
              <span className="text-2xl">{item.emoji}</span>
              <p className="mt-1 text-[10px] font-bold text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5"
        >
          <Button onClick={onClose} className="w-full h-11 rounded-xl gradient-bg text-white border-0 hover:opacity-95 shadow-glow font-bold">
            Let&apos;s get started
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Match Notification (Slide-in Toast) ─────────────────── */
function MatchNotification({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="fixed top-20 right-4 z-[180] max-w-sm w-full"
    >
      <div className="rounded-2xl glass border border-primary/30 bg-card/90 backdrop-blur-2xl p-4 shadow-glow">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.15 }}
            className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center"
          >
            <Bell className="h-5 w-5 text-primary" />
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">New Matches Found!</h4>
              <button onClick={onClose} className="h-6 w-6 rounded-full hover:bg-muted/50 grid place-items-center">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Aether AI found <span className="text-primary font-bold">3 new job matches</span> since
              your last visit. Your top match is <span className="font-semibold">96%</span> fit!
            </p>
            <Button asChild size="sm" variant="ghost" className="mt-2 h-7 rounded-full text-primary hover:bg-primary/10 text-xs font-bold px-3">
              <Link to="/dashboard">
                View matches <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Auto-dismiss progress bar */}
        <motion.div
          className="mt-3 h-[2px] rounded-full gradient-bg origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 8, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Celebration Modal ───────────────────────────────────── */
function CelebrationModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: "-5%",
              backgroundColor: [
                "oklch(0.76 0.15 190)",
                "oklch(0.68 0.21 310)",
                "oklch(0.85 0.14 80)",
                "oklch(0.74 0.16 150)",
                "oklch(0.62 0.22 25)",
              ][i % 5],
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: "110vh",
              rotate: Math.random() * 720 - 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 1.5,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative max-w-md w-full rounded-3xl glass border border-border/80 bg-card/85 backdrop-blur-2xl p-8 shadow-glow text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className="mx-auto h-20 w-20 rounded-3xl gradient-bg grid place-items-center shadow-glow"
        >
          <PartyPopper className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 font-display text-3xl font-black gradient-text"
        >
          You&apos;re all set! 🎉
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto"
        >
          Your profile has been created successfully. Aether AI is already analyzing opportunities for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-bold text-emerald-500">Profile initialization complete</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5"
        >
          <Button asChild className="w-full h-11 rounded-xl gradient-bg text-white border-0 hover:opacity-95 shadow-glow font-bold">
            <Link to="/dashboard">
              Enter Dashboard
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
