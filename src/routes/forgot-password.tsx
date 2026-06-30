import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthHero } from "@/components/auth/AuthHero";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — CareerCompass AI" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [focusField, setFocusField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
          <Logo />
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 py-20 overflow-y-auto custom-scrollbar relative z-0">
          <div className="w-full max-w-[440px] mx-auto">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="forgot"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl font-display font-black text-foreground tracking-tight">Reset Password</h1>
                    <p className="text-muted-foreground text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</Label>
                      <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "email" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                        <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "email" ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@university.edu" 
                          className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocusField("email")}
                          onBlur={() => setFocusField(null)}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 mt-4 rounded-xl gradient-bg text-white font-bold hover:opacity-95 shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden group">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="text-center pt-4">
                    <Link to="/auth" className="inline-flex items-center text-sm font-bold text-primary hover:underline transition-all">
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Sign In
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-4 p-8 rounded-3xl glass bg-card/40 border border-primary/20 shadow-glow"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-2">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-display font-black text-foreground tracking-tight">Check your email</h2>
                  <p className="text-muted-foreground text-sm">We've sent a password reset link to <br/><strong>{email}</strong></p>
                  
                  <Button onClick={() => navigate({ to: "/auth" })} variant="outline" className="mt-4 w-full h-11 rounded-xl">
                    Back to Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Right Side: Hero Section */}
      <AuthHero />
    </div>
  );
}
