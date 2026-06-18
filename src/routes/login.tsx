import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — CareerCompass AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const titles: Record<typeof mode, string> = {
    login: "Welcome back",
    signup: "Create your account",
    forgot: "Reset your password",
  };
  const subtitles: Record<typeof mode, string> = {
    login: "Sign in to continue your career journey.",
    signup: "Start matching with internships in seconds.",
    forgot: "Enter your email and we'll send you a reset link.",
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode !== "forgot") navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full gradient-bg blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[var(--color-accent)] blur-3xl opacity-25 animate-float-slow" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Logo />
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl glass card-shadow p-8"
          >
            <h1 className="font-display text-3xl font-extrabold">{titles[mode]}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitles[mode]}</p>

            {mode !== "forgot" && (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11">
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.43C16.74 3.86 14.6 3 12.17 3 6.94 3 2.7 7.16 2.7 12.26S6.94 21.5 12.17 21.5c7.03 0 9.34-4.93 9.34-7.46 0-.5-.06-.88-.16-1.94Z"/></svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-11">
                    <Github className="h-4 w-4" /> GitHub
                  </Button>
                </div>
                <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or with email
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Jane Student" className="h-11" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" required placeholder="you@university.edu" className="h-11 pl-9" />
                </div>
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" type="password" required placeholder="••••••••" className="h-11 pl-9" />
                  </div>
                </div>
              )}

              <Button type="submit" disabled={loading} className="h-11 w-full gradient-bg text-white border-0 hover:opacity-90">
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign in"
                  : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" && (<>New to CareerCompass? <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link></>)}
              {mode === "signup" && (<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></>)}
              {mode === "forgot" && (<><Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></>)}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
