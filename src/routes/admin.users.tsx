import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Edit2, ShieldBan, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://careercompassai1.onrender.com/api/users/all");
        let list = [];
        if (res.ok) {
          list = await res.json();
        }
        const localUserStr = localStorage.getItem("careercompass_user");
        if (localUserStr) {
          try {
            const localU = JSON.parse(localUserStr);
            if (localU && localU.fullName && !list.some((u: any) => u.email === localU.email || u.id === localU.id)) {
              list.push(localU);
            }
          } catch (e) {}
        }
        if (list.length === 0) {
          list = [
            { id: "1", fullName: "Nikita Candidate", email: "nikita@careercompass.ai", currentRole: "Software Engineer", status: "Active", profileCompletion: 100, skills: ["React", "Java", "AI"], createdAt: new Date().toISOString() }
          ];
        }
        setUsers(list);
      } catch (e) {
        const localUserStr = localStorage.getItem("careercompass_user");
        if (localUserStr) {
          try { setUsers([JSON.parse(localUserStr)]); } catch (err) {}
        }
      }
    };
    fetchUsers();
  }, []);

  const formattedUsers = users.map(u => ({
    id: u.id || Math.random().toString(),
    name: u.fullName || u.name || "Real Candidate",
    email: u.email || "user@careercompass.ai",
    role: u.currentRole || u.preferredRole || "Student",
    status: u.status || "Active",
    score: u.profileCompletion || 85,
    skills: Array.isArray(u.skills) ? u.skills.slice(0, 3).join(", ") : (u.skills || "AI, Full-Stack"),
    joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
  }));

  const filteredUsers = formattedUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users, view resume scores, and track skill progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card/40 border-border/50 hover:bg-muted/50 gap-2 h-10">
            <Download className="w-4 h-4" /> Export Data
          </Button>
          <Button className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90">
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/40 flex flex-wrap gap-4 justify-between items-center bg-card/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name, email, or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Skills</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredUsers.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-soft">
                        {user.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-500">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
                        <ShieldBan className="w-3.5 h-3.5" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${user.score >= 80 ? 'bg-green-500' : user.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, user.score)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono">{user.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    {user.skills}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                        <ShieldBan className="w-4 h-4" />
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
        
        <div className="p-4 border-t border-border/40 bg-card/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1 to {filteredUsers.length} of {filteredUsers.length} real users</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
