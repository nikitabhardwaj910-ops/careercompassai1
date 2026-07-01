import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Github,
  User,
  GraduationCap,
  Linkedin,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AuthHero } from "@/components/auth/AuthHero";
import { usePopup } from "@/components/PopupSystem";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Authentication — CareerCompass AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const popup = usePopup();
  const { login, signup, googleSignIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [focusField, setFocusField] = useState<string | null>(null);
  const [adminPasskey, setAdminPasskey] = useState("");

  const ADMIN_PASSKEY = "MORNIK-2026";

  const verifyAdminAccess = () => {
    if (role === "admin") {
      if (adminPasskey.trim().toUpperCase() !== ADMIN_PASSKEY) {
        toast.error("❌ Access Denied: Incorrect Admin Passkey. Unauthorized access blocked.");
        return false;
      }
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin" && !verifyAdminAccess()) {
      return;
    }
    setLoading(true);
    try {
      await login(signInEmail, signInPassword);
      setLoading(false);
      localStorage.setItem("onboarding_completed", "true");
      
      if (role === "admin") {
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("admin_passkey_verified", "true");
        toast.success("Signed in to Admin Dashboard 🛡️");
        navigate({ to: "/admin" });
      } else {
        localStorage.setItem("user_role", "student");
        localStorage.removeItem("admin_passkey_verified");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Login failed");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin" && !verifyAdminAccess()) {
      return;
    }
    if (signUpPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup({ fullName, email: signUpEmail, password: signUpPassword });
      setLoading(false);
      localStorage.setItem("onboarding_completed", "true");

      if (role === "admin") {
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("admin_passkey_verified", "true");
        toast.success("Admin Portal account created successfully! 🛡️");
        navigate({ to: "/admin" });
      } else {
        localStorage.setItem("user_role", "student");
        localStorage.removeItem("admin_passkey_verified");
        popup.showWelcome();
        setTimeout(() => navigate({ to: "/onboarding" }), 1500);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Signup failed");
    }
  };

  const handleGoogleSignIn = async () => {
    if (role === "admin" && !verifyAdminAccess()) {
      return;
    }
    setLoading(true);
    await googleSignIn();
    setLoading(false);
    localStorage.setItem("onboarding_completed", "true");
    if (role === "admin") {
      localStorage.setItem("user_role", "admin");
      localStorage.setItem("admin_passkey_verified", "true");
      toast.success("Google Sign-In successful for Admin 🛡️");
      navigate({ to: "/admin" });
    } else {
      localStorage.setItem("user_role", "student");
      localStorage.removeItem("admin_passkey_verified");
      navigate({ to: "/dashboard" });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Left Side: Forms */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
          <Logo />
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 py-20 overflow-y-auto custom-scrollbar relative z-0">
          <div className="w-full max-w-[440px] mx-auto">
            
            {/* Role Switcher Pill */}
            <div className="flex p-1.5 rounded-2xl bg-muted/60 border border-border/80 mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === "student" ? "gradient-bg text-white shadow-soft scale-[1.02]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student / Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === "admin" ? "bg-amber-500 hover:bg-amber-600 text-white shadow-soft scale-[1.02]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" /> Admin Access
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "signin" ? (
                <motion.div
                  key="signin"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-display font-black text-foreground tracking-tight">
                        {role === "admin" ? "Admin Portal Sign In" : "Welcome back"}
                      </h1>
                      {role === "admin" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Admin access
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {role === "admin" 
                        ? "Enter admin portal credentials to manage jobs, internships, and student applications." 
                        : "Enter your credentials to access your student dashboard and roadmap."}
                    </p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</Label>
                      <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "signin-email" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                        <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "signin-email" ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          id="signin-email" 
                          type="email" 
                          required 
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder={role === "admin" ? "admin@careercompass.ai" : "you@university.edu"} 
                          className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocusField("signin-email")}
                          onBlur={() => setFocusField(null)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Password</Label>
                        <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                          Forgot password?
                        </button>
                      </div>
                      <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "signin-password" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                        <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "signin-password" ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          id="signin-password" 
                          type="password" 
                          required 
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocusField("signin-password")}
                          onBlur={() => setFocusField(null)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1 pb-2">
                      <input type="checkbox" id="remember" className="rounded border-border/80 text-primary focus:ring-primary h-4 w-4 bg-card/50" />
                      <label htmlFor="remember" className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Remember me
                      </label>
                    </div>

                    {role === "admin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-passkey-signin" className="text-xs font-bold text-amber-500 uppercase tracking-wide flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-500" /> Admin Secret Passkey
                          </Label>
                          <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Required</span>
                        </div>
                        <div className={`relative rounded-xl border transition-all duration-300 bg-background/80 ${focusField === "admin-passkey-signin" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-amber-500/40"}`}>
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                          <Input
                            id="admin-passkey-signin"
                            type="password"
                            required={role === "admin"}
                            value={adminPasskey}
                            onChange={(e) => setAdminPasskey(e.target.value)}
                            placeholder="Enter secret admin passkey"
                            className="h-10 pl-9 border-0 bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            onFocus={() => setFocusField("admin-passkey-signin")}
                            onBlur={() => setFocusField(null)}
                          />
                        </div>
                        <div className="flex items-center text-[11px] text-amber-500/90 pt-0.5 px-0.5">
                          <span>Protects admin portal access</span>
                        </div>
                      </motion.div>
                    )}

                    <Button type="submit" disabled={loading} className={`w-full h-11 rounded-xl text-white font-bold hover:opacity-95 shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden group ${role === "admin" ? "bg-amber-500 hover:bg-amber-600" : "gradient-bg"}`}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          Signing in...
                        </span>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          {role === "admin" ? "Sign In to Admin Portal" : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={loading} className="h-11 rounded-xl bg-card border-border/80 hover:bg-muted/50 hover:border-primary/45 transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.43C16.74 3.86 14.6 3 12.17 3 6.94 3 2.7 7.16 2.7 12.26S6.94 21.5 12.17 21.5c7.03 0 9.34-4.93 9.34-7.46 0-.5-.06-.88-.16-1.94Z"/></svg>
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl bg-card border-border/80 hover:bg-muted/50 hover:border-blue-500/45 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl bg-card border-border/80 hover:bg-muted/50 hover:border-secondary/45 transition-colors">
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground pt-4">
                    Don't have an {role === "admin" ? "Admin" : "Student"} account?{" "}
                    <button onClick={() => setMode("signup")} className="text-primary font-bold hover:underline transition-all">
                      Sign up as {role === "admin" ? "Admin" : "Student"}
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-display font-black text-foreground tracking-tight">
                        {role === "admin" ? "Create Admin Account" : "Create Account"}
                      </h1>
                      {role === "admin" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Admin Registration
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {role === "admin" 
                        ? "Register as an administrative portal manager to oversee talent workflows." 
                        : "Join the platform to discover your ideal career path."}
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullname" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                        <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "fullname" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                          <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "fullname" ? "text-primary" : "text-muted-foreground"}`} />
                          <Input 
                            id="fullname" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={role === "admin" ? "Admin Manager" : "John Doe"} 
                            className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            onFocus={() => setFocusField("fullname")}
                            onBlur={() => setFocusField(null)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</Label>
                        <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "signup-email" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                          <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "signup-email" ? "text-primary" : "text-muted-foreground"}`} />
                          <Input 
                            id="signup-email" 
                            type="email" 
                            required 
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            placeholder={role === "admin" ? "admin@careercompass.ai" : "you@university.edu"} 
                            className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            onFocus={() => setFocusField("signup-email")}
                            onBlur={() => setFocusField(null)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Password</Label>
                      <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "signup-password" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                        <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "signup-password" ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          required 
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocusField("signup-password")}
                          onBlur={() => setFocusField(null)}
                        />
                      </div>
                      <PasswordStrengthMeter password={signUpPassword} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Confirm Password</Label>
                      <div className={`relative rounded-xl border transition-all duration-300 bg-card/30 ${focusField === "confirm-password" ? "border-primary ring-2 ring-primary/20" : "border-border/80"}`}>
                        <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${focusField === "confirm-password" ? "text-primary" : "text-muted-foreground"}`} />
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          required 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="h-11 pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocusField("confirm-password")}
                          onBlur={() => setFocusField(null)}
                        />
                      </div>
                    </div>

                    {role === "admin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-passkey-signup" className="text-xs font-bold text-amber-500 uppercase tracking-wide flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-500" /> Admin Secret Passkey
                          </Label>
                          <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Required</span>
                        </div>
                        <div className={`relative rounded-xl border transition-all duration-300 bg-background/80 ${focusField === "admin-passkey-signup" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-amber-500/40"}`}>
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                          <Input
                            id="admin-passkey-signup"
                            type="password"
                            required={role === "admin"}
                            value={adminPasskey}
                            onChange={(e) => setAdminPasskey(e.target.value)}
                            placeholder="Enter secret admin passkey"
                            className="h-10 pl-9 border-0 bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            onFocus={() => setFocusField("admin-passkey-signup")}
                            onBlur={() => setFocusField(null)}
                          />
                        </div>
                        <div className="flex items-center text-[11px] text-amber-500/90 pt-0.5 px-0.5">
                          <span>Protects admin portal registration</span>
                        </div>
                      </motion.div>
                    )}

                    <Button type="submit" disabled={loading} className={`w-full h-11 mt-2 rounded-xl text-white font-bold hover:opacity-95 shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden group ${role === "admin" ? "bg-amber-500 hover:bg-amber-600" : "gradient-bg"}`}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          Creating Account...
                        </span>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          {role === "admin" ? "Create Admin Account" : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground pt-4">
                    Already have an {role === "admin" ? "Admin" : "Student"} account?{" "}
                    <button onClick={() => setMode("signin")} className="text-primary font-bold hover:underline transition-all">
                      Sign in as {role === "admin" ? "Admin" : "Student"}
                    </button>
                  </p>
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
