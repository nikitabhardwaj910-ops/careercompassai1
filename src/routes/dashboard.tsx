import { createFileRoute, Link, Outlet, useRouterState, Navigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Send,
  Sparkles,
  FileSearch,
  TrendingUp,
  Mic,
  Bot,
  Bell,
  Search,
  Menu,
  Map,
  Bookmark,
  Award,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { AetherChatWidget } from "@/components/AetherChatWidget";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerCompass AI" }] }),
  component: DashboardLayout,
});
const mainNav = [
  { title: "Dashboard Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Swipe Discovery", url: "/dashboard/discover", icon: Sparkles },
  { title: "Job Recommendations", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Internship Recommendations", url: "/dashboard/internships", icon: Sparkles },
  { title: "Applications Tracker", url: "/dashboard/applications", icon: Send },
  { title: "Saved Jobs", url: "/dashboard/saved-jobs", icon: Bookmark },
];
const aiNav = [
  { title: "AI Career Assistant", url: "/dashboard/chatbot", icon: Bot },
  { title: "Mock Interview Simulator", url: "/dashboard/interview", icon: Mic },
  { title: "Resume Analyzer", url: "/dashboard/resume", icon: FileSearch },
  { title: "Skill Gap Analysis", url: "/dashboard/skill-gap", icon: TrendingUp },
  { title: "Learning Roadmap", url: "/dashboard/roadmap", icon: Map },
];
const bottomNav = [
  { title: "Certifications", url: "/dashboard/certifications", icon: Award },
  { title: "Profile Settings", url: "/dashboard/profile", icon: User },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
];

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  const NavGroup = ({ label, items }: { label: string; items: typeof mainNav }) => (
    <SidebarGroup className="px-3">
      <SidebarGroupLabel className="text-[10px] font-extrabold tracking-wider text-muted-foreground/60 uppercase font-mono px-3 py-2">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={active}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 font-medium ${
                    active 
                      ? "bg-primary/10 text-primary border-l-2 border-primary shadow-soft" 
                      : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link to={item.url}>
                    <item.icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${active ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"}`} />
                    <span className="text-sm">{item.title}</span>
                    {active && (
                      <motion.span 
                        layoutId="sidebar-active-indicator"
                        className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-sidebar/55 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 py-4 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4 space-y-4">
        <NavGroup label="Main Space" items={mainNav} />
        <NavGroup label="AI Analytics" items={aiNav} />
        <NavGroup label="Control Panel" items={bottomNav} />
      </SidebarContent>
    </Sidebar>
  );
}

function DashboardLayout() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const onboardingDone = localStorage.getItem("onboarding_completed") === "true" || user.termsAccepted || (user.profileCompletion && user.profileCompletion >= 50);
  if (!onboardingDone) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
        <AppSidebar />
        
        <div className="flex min-w-0 flex-1 flex-col z-10">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/50 px-4 backdrop-blur-xl sm:px-6">
            <SidebarTrigger className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted/50" />
            
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${searchFocused ? "text-primary" : "text-muted-foreground"}`} />
              <Input 
                placeholder="Search matching opportunities, skills, companies..." 
                className={`pl-10 h-10 rounded-full bg-card/40 border transition-all duration-300 ${
                  searchFocused 
                    ? "border-primary ring-1 ring-primary/20 w-full" 
                    : "border-border/60 hover:border-border/80 w-full"
                }`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              
              <Link to="/dashboard/notifications">
                <Button variant="outline" size="icon" className="rounded-full relative h-9 w-9 bg-card border-border/80 hover:bg-muted/40" title="View Notifications">
                  <Bell className="h-4 w-4 text-foreground/80" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </Button>
              </Link>

              <Link to="/dashboard/profile" className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-card/85 p-1 pr-3 shadow-soft hover:border-primary/45 transition-colors cursor-pointer group">
                <div className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-bg text-xs font-bold text-white shadow-soft">
                  {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : "JS"}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div className="hidden text-left sm:block min-w-0 shrink-0">
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-none truncate">{user?.fullName || "Student"}</div>
                  <span className="text-[9px] font-semibold text-muted-foreground/80 tracking-wide font-mono">{user?.degree || "Student"}</span>
                </div>
              </Link>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem("jwt_token");
                  localStorage.removeItem("onboarding_completed");
                  localStorage.removeItem("careercompass_user");
                  window.location.href = "/";
                }}
                className="rounded-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold h-9 px-3 flex items-center gap-1.5 shadow-soft"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex-1">
              <Outlet />
            </div>

            <footer className="mt-12 pt-6 pb-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground/80">
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="hover:text-primary transition-colors">Help Center</Link>
                <Link to="/dashboard" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/dashboard" className="hover:text-primary transition-colors">Contact Support</Link>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider">
                &copy; 2026 Career Compass AI. System Online.
              </div>
            </footer>
          </main>
        </div>
        
        <AetherChatWidget />
      </div>
    </SidebarProvider>
  );
}
