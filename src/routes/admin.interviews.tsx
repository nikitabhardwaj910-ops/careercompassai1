import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, CalendarDays, Video, Users, CheckCircle2, XCircle, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/interviews")({
  component: AdminInterviews,
});

function AdminInterviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInterviews = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/applications/all");
      if (res.ok) {
        const data = await res.json();
        const interviewApps = data.filter((app: any) => app.status === "Interview");
        setInterviews(interviewApps);
      }
    } catch (e) {
      toast.error("Failed to load interview schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleReschedule = async (app: any) => {
    const newDate = window.prompt("Enter new Interview Date & Time:", app.interviewDate || "Next Monday at 10:00 AM");
    if (newDate === null) return;
    try {
      const res = await fetch(`http://localhost:8081/api/applications/${app.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Interview", interviewDate: newDate })
      });
      if (res.ok) {
        toast.success("Interview rescheduled and candidate notified!");
        fetchInterviews();
      }
    } catch (e) {
      toast.error("Failed to reschedule");
    }
  };

  const filteredList = interviews.filter(i =>
    i.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Interview Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor scheduled candidate interviews across all internship and job roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchInterviews} className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Refresh Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Scheduled Interviews', value: interviews.length },
          { label: 'Pending Feedback', value: interviews.length },
          { label: 'Completion Rate', value: '100%' }
        ].map((stat, i) => (
          <div key={stat.label} className="bg-card/20 border border-border/40 p-4 rounded-2xl backdrop-blur-sm">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</h4>
            <div className="text-2xl font-black text-foreground mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/40 flex flex-wrap gap-4 justify-between items-center bg-card/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate, role, or company..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role & Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Scheduled Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading interview schedule...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No scheduled interviews found. Mark an application as "Interview" to schedule one!
                  </td>
                </tr>
              ) : filteredList.map((app, index) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-soft font-bold">
                        {app.user?.fullName?.charAt(0) || "👤"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{app.user?.fullName || "Candidate"}</div>
                        <div className="text-xs text-muted-foreground">{app.user?.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-foreground">{app.job?.title || "Role"}</div>
                    <div className="text-xs text-muted-foreground">{app.job?.company || "Company"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      <CalendarDays className="w-4 h-4 shrink-0" />
                      {app.interviewDate || "Date TBD"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                      Confirmed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" onClick={() => handleReschedule(app)} className="rounded-full font-bold text-xs h-8 border-purple-500/30 hover:bg-purple-500/10">
                      Reschedule
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
