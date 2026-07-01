import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  BrainCircuit,
  FileText,
  Target,
  FileCheck,
  CalendarDays,
  Award,
  Bell,
  BarChart3,
  Settings,
  UserCircle,
  LogOut
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const name = user?.fullName || "System Admin";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SA";

  const navigation = [
    { title: "Overview", items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BrainCircuit },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ]},
    { title: "Management", items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
      { name: "Internships", href: "/admin/internships", icon: GraduationCap },
    ]},
    { title: "Operations", items: [
      { name: "Applications", href: "/admin/applications", icon: FileCheck },
      { name: "Interviews", href: "/admin/interviews", icon: CalendarDays },
      { name: "Resumes", href: "/admin/resumes", icon: FileText },
      { name: "Skills Tracker", href: "/admin/skills", icon: Target },
      { name: "Certifications", href: "/admin/certifications", icon: Award },
    ]},
    { title: "System", items: [
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Admin Profile", href: "/admin/profile", icon: UserCircle },
    ]},
  ];

  return (
    <div className="w-64 h-screen border-r border-border/20 bg-card/10 backdrop-blur-3xl flex flex-col overflow-hidden shrink-0 z-20">
      <div className="p-6">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
        {navigation.map((group, i) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 mb-3 px-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-sidebar-active"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover effect for non-active items */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-muted/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}

                    <item.icon className={`w-4 h-4 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                    <span className={`text-sm font-medium relative z-10 ${isActive ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/20 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card/30 border border-border/40">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-glow shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono truncate">{user?.email || "Access Level: 0"}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/auth" });
            }}
            title="Sign Out of Admin Portal"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
