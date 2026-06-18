import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
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
  Settings,
  Bell,
  Search,
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerCompass AI" }] }),
  component: DashboardLayout,
});

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Applications", url: "/dashboard/applications", icon: Send },
  { title: "Recommendations", url: "/dashboard/recommendations", icon: Sparkles },
];
const aiNav = [
  { title: "Resume Analyzer", url: "/dashboard/resume", icon: FileSearch },
  { title: "Skill Gap", url: "/dashboard/skill-gap", icon: TrendingUp },
  { title: "Interview Practice", url: "/dashboard/interview", icon: Mic },
  { title: "AI Chatbot", url: "/dashboard/chatbot", icon: Bot },
];
const bottomNav = [{ title: "Settings", url: "/dashboard/settings", icon: Settings }];

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  const NavGroup = ({ label, items }: { label: string; items: typeof mainNav }) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="px-2 py-1.5">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Main" items={mainNav} />
        <NavGroup label="AI Tools" items={aiNav} />
        <NavGroup label="Account" items={bottomNav} />
      </SidebarContent>
    </Sidebar>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
            <SidebarTrigger />
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs, companies, skills..." className="pl-9 h-10 bg-muted/40 border-border/60" />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <div className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-card pl-2.5 pr-1 py-1">
                <span className="hidden text-sm font-medium sm:block">Jane S.</span>
                <div className="grid h-7 w-7 place-items-center rounded-full gradient-bg text-xs font-bold text-white">
                  JS
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
