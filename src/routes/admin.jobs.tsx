import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Briefcase, CheckCircle2, XCircle, MoreHorizontal, Loader2, Plus, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobs,
});

function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("2026-07-31");

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    try {
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title, company, type, location, description, deadline,
          requiredSkills: skills.split(",").map(s => s.trim()).filter(Boolean),
          status: "Active"
        })
      });

      if (res.ok) {
        toast.success("Job created successfully!");
        setIsCreating(false);
        fetchJobs();
      } else {
        toast.error("Failed to create job");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setIsCreating(false)} className="gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Button>
        <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Job Post</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Job Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" placeholder="e.g. Senior AI Engineer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Company</label>
                <input required value={company} onChange={e => setCompany(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none" placeholder="e.g. Google" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Job Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Location</label>
                <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none" placeholder="e.g. Remote, Seattle WA" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Required Skills (comma separated)</label>
                <input value={skills} onChange={e => setSkills(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none" placeholder="Python, React, TypeScript" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Application Deadline</label>
                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Job Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full h-32 p-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none" placeholder="Job details here..." />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit" className="gradient-bg text-white font-bold border-0 shadow-glow">Post Job</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Job Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Approve listings, monitor expired jobs, and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsCreating(true)} className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" /> Create Job Post
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm overflow-hidden flex flex-col">
        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title & Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type & Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No jobs found. Click "Create Job Post" to add one.
                  </td>
                </tr>
              ) : jobs.map((job, index) => (
                <motion.tr 
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground shadow-soft">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{job.type}</div>
                    <div className="text-xs text-muted-foreground">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      <Calendar className="w-3 h-3" /> {job.deadline || "2026-07-31"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      job.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      job.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-muted/50 text-muted-foreground border-border/50'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-foreground">
                    {job.applicantsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
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
