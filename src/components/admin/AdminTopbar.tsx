import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Bell, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

export function AdminTopbar() {
  const { user } = useAuth();
  const name = user?.fullName || "System Admin";
  const email = user?.email || "admin@careercompass.ai";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SA";
  return (
    <div className="h-16 border-b border-border/20 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users, employers, jobs..." 
            className="w-full h-10 pl-10 pr-4 rounded-full bg-card/30 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/60 bg-muted/30 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Quick Actions */}
        <Button variant="outline" className="hidden sm:flex h-9 rounded-full border-primary/30 text-primary hover:bg-primary/10 gap-2 text-xs font-bold font-mono">
          <Zap className="w-3.5 h-3.5" />
          Quick Actions
        </Button>

        {/* Notifications */}
        <Link to="/admin/notifications" className="relative p-2 rounded-full hover:bg-muted/50 transition-colors group flex items-center justify-center">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background animate-pulse" />
        </Link>

        {/* Profile Split Button */}
        <Link to="/admin/profile" className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/30 hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="text-sm font-bold leading-none text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-1">{email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold shadow-soft">
            {initials}
          </div>
        </Link>
      </div>
    </div>
  );
}
