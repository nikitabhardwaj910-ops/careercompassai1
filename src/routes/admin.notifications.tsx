import { createFileRoute } from "@tanstack/react-router";
import { Send, Bell, UserPlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

type NotificationFormData = {
  targetAudience: string;
  type: string;
  title: string;
  message: string;
};

function AdminNotifications() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<NotificationFormData>({
    defaultValues: {
      targetAudience: "All Users",
      type: "System Announcement",
      title: "",
      message: ""
    }
  });

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/admin/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: NotificationFormData & { status: string }) => {
      const res = await fetch("http://localhost:8081/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create notification");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      reset();
      toast.success("Notification successfully processed!");
    },
    onError: () => {
      toast.error("Failed to process notification.");
    }
  });

  const onSubmit = (data: NotificationFormData, status: string) => {
    mutation.mutate({ ...data, status });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const sentToday = notifications.filter((n: any) => n.status === "Sent" && new Date(n.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Notification Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Send platform announcements, targeted job alerts, and manage automated emails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Notification Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" /> Compose Notification
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Audience</label>
                  <select {...register("targetAudience")} className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground transition-all">
                    <option value="All Users">All Users</option>
                    <option value="All Students">All Students</option>
                    <option value="All Employers">All Employers</option>
                    <option value="Specific Skill Matches">Specific Skill Matches</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notification Type</label>
                  <select {...register("type")} className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground transition-all">
                    <option value="System Announcement">System Announcement</option>
                    <option value="Job Alert">Job Alert</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject Title</label>
                <input 
                  type="text" 
                  {...register("title", { required: true })}
                  placeholder="Enter notification title..." 
                  className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Content</label>
                <textarea 
                  rows={5}
                  {...register("message", { required: true })}
                  placeholder="Type your message here..." 
                  className="w-full p-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none custom-scrollbar"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button variant="outline" type="button" onClick={handleSubmit((d) => onSubmit(d, "Draft"))} disabled={mutation.isPending} className="h-10 px-6 border-border/50 bg-background/50">Save Draft</Button>
                <Button type="button" onClick={handleSubmit((d) => onSubmit(d, "Sent"))} disabled={mutation.isPending} className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90 gap-2">
                  <Send className="w-4 h-4" /> {mutation.isPending ? "Sending..." : "Send Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Analytics & History Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Notification Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Bell className="w-4 h-4" /></div>
                  <span className="text-sm font-medium">Sent Today</span>
                </div>
                <span className="text-lg font-bold font-mono">{sentToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><UserPlus className="w-4 h-4" /></div>
                  <span className="text-sm font-medium">Open Rate</span>
                </div>
                <span className="text-lg font-bold font-mono">68%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent History</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Filter className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-3">
              {notifications.map((notif: any, index: number) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-background/50 border border-border/30 hover:border-border/60 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-foreground truncate pr-2">{notif.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${notif.status === 'Active' || notif.status === 'Sent' ? 'bg-green-500/10 text-green-500' : 'bg-muted/50 text-muted-foreground'}`}>
                      {notif.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Target: {notif.targetAudience}</span>
                    <span>•</span>
                    <span>{notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Unknown'}</span>
                  </div>
                </motion.div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground">No recent notifications.</div>
              )}
            </div>
            {notifications.length > 0 && (
              <Button variant="outline" className="w-full mt-4 h-9 text-xs border-border/50 bg-background/30">View All History</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
