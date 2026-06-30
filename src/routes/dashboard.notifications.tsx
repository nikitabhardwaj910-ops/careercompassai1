import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Briefcase, Bot, Calendar, Settings, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — CareerCompass AI" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("http://localhost:8081/api/notifications/mark-all-read", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("All notifications marked as read!");
    } catch (e) {
      toast.error("Failed to mark notifications read");
    }
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case "internship":
      case "job":
        return { icon: Briefcase, color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/20" };
      case "match":
        return { icon: Briefcase, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/20" };
      case "ai":
        return { icon: Bot, color: "text-amber-500", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" };
      case "interview":
        return { icon: Calendar, color: "text-[var(--color-secondary)]", bgColor: "bg-[var(--color-secondary)]/10", borderColor: "border-[var(--color-secondary)]/20" };
      default:
        return { icon: Settings, color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" };
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-foreground/5 border border-border text-foreground grid place-items-center shadow-soft shrink-0">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated on new job posts, AI matches, and interviews.</p>
          </div>
        </div>
        <Button onClick={markAllRead} variant="outline" className="shrink-0 rounded-full border-border/80 text-foreground hover:bg-muted/40 font-bold transition-colors">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {notifications.map((notif, i) => {
            const config = getIconConfig(notif.type);
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id || i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative flex gap-4 p-5 rounded-3xl border backdrop-blur-xl transition-all shadow-sm ${
                  notif.read ? "bg-card/30 border-border/40 opacity-80" : "glass border-primary/30 bg-card/60 shadow-card"
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
                
                <div className={`h-12 w-12 shrink-0 rounded-2xl border grid place-items-center ${config.bgColor} ${config.borderColor} ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className={`font-bold text-base mb-1 truncate ${notif.read ? "text-foreground/80" : "text-foreground"}`}>
                    {notif.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 font-bold">
                    {notif.time || "Recently"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
