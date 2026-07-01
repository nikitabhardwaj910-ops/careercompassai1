import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, GraduationCap, Plus, Loader2, Calendar, MapPin, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/internships")({
  component: AdminInternships,
});

function AdminInternships() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Remote");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("2026-07-31");

  const fetchInternships = async () => {
    try {
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs/all");
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((j: any) => j.type && j.type.toLowerCase().includes("intern"));
        setInternships(filtered);
      }
    } catch (e) {
      toast.error("Failed to fetch internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://careercompassai1.onrender.com/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          type: "Internship",
          location,
          description,
          deadline,
          requiredSkills: skills.split(",").map(s => s.trim()).filter(Boolean),
          status: "Active"
        })
      });
      if (res.ok) {
        toast.success("Internship created successfully!");
        setShowModal(false);
        setTitle("");
        setCompany("");
        setDescription("");
        setSkills("");
        fetchInternships();
      } else {
        toast.error("Failed to create internship");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    }
  };

  const filteredList = internships.filter(j =>
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Internship Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Post new internship openings and monitor candidate interest.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowModal(true)} className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Internship
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Internships', value: internships.length },
          { label: 'Active Listings', value: internships.filter(i => i.status === 'Active').length },
          { label: 'Total Applicants', value: internships.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0) },
          { label: 'Remote Positions', value: internships.filter(i => i.location?.toLowerCase().includes('remote')).length }
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
              placeholder="Search internships or companies..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Title & Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading internships...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No internship openings found. Click "Create Internship" to post one!
                  </td>
                </tr>
              ) : filteredList.map((job, index) => (
                <motion.tr 
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-soft">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {job.location || "Remote"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      <Calendar className="w-3 h-3" /> {job.deadline || "2026-07-31"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                      {job.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-foreground">
                    {job.applicantsCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Today"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl glass border border-border bg-card shadow-2xl space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-display text-xl font-black text-foreground">Post New Internship</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Internship Role Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Machine Learning Research Intern"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Company</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Globex AI"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Remote / San Francisco"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Required Skills</label>
                    <input
                      required
                      type="text"
                      placeholder="Python, PyTorch, ML"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Application Deadline</label>
                    <input
                      required
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full h-10 px-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Role Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe internship responsibilities and mentorship opportunities..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 mt-1 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-full font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-full gradient-bg text-white font-bold shadow-glow">
                    Post Internship
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
