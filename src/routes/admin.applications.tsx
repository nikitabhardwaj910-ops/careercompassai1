import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Briefcase, FileCheck, Eye, Download, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({
  component: AdminApplications,
});

function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("https://careercompassai1.onrender.com/api/applications/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    let interviewDate = null;
    if (newStatus === "Interview") {
      interviewDate = window.prompt("Enter Interview Date & Time (e.g. July 15, 2026 at 2:00 PM EST):", "Next Monday at 10:00 AM");
      if (interviewDate === null) return; // cancelled prompt
    }
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`https://careercompassai1.onrender.com/api/applications/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus, interviewDate })
      });
      if (res.ok) {
        toast.success(`Application marked as ${newStatus}`);
        fetchApplications();
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const filteredApps = applications.filter(app => 
    app.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Applications Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track candidate applications across all employers and job postings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card/40 border-border/50 hover:bg-muted/50 gap-2 h-10">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Applied', value: applications.length, color: 'text-foreground' },
          { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, color: 'text-blue-500' },
          { label: 'Interview', value: applications.filter(a => a.status === 'Interview').length, color: 'text-purple-500' },
          { label: 'Selected', value: applications.filter(a => a.status === 'Selected').length, color: 'text-green-500' },
          { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, color: 'text-red-500' }
        ].map((stat, i) => (
          <div key={stat.label} className="bg-card/20 border border-border/40 p-4 rounded-2xl backdrop-blur-sm text-center">
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</h4>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 bg-background/50 border-border/50 gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role & Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applied Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No applications found.
                  </td>
                </tr>
              ) : filteredApps.map((app, index) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-soft">
                        {app.user?.fullName?.charAt(0) || '?'}
                      </div>
                      <div className="text-sm font-bold text-foreground">{app.user?.fullName || 'Unknown User'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{app.job?.title}</div>
                    <div className="text-xs text-muted-foreground">{app.job?.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border outline-none ${
                        app.status === 'Selected' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        app.status === 'Interview' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        app.status === 'Under Review' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-muted/50 text-muted-foreground border-border/50'
                      }`}
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                    >
                      <option className="bg-background text-foreground" value="Applied">Applied</option>
                      <option className="bg-background text-foreground" value="Under Review">Under Review</option>
                      <option className="bg-background text-foreground" value="Interview">Interview</option>
                      <option className="bg-background text-foreground" value="Selected">Selected</option>
                      <option className="bg-background text-foreground" value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
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
