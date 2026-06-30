import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Building2, CheckCircle2, XCircle, MoreVertical, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/employers")({
  component: AdminEmployers,
});

const mockEmployers = [
  { id: "1", name: "Google", industry: "Technology", status: "Verified", jobs: 45, joined: "2025-01-15", contact: "hr@google.com" },
  { id: "2", name: "Stripe", industry: "Fintech", status: "Verified", jobs: 12, joined: "2025-03-22", contact: "careers@stripe.com" },
  { id: "3", name: "Acme Corp", industry: "Manufacturing", status: "Pending", jobs: 3, joined: "2026-06-20", contact: "admin@acmecorp.com" },
  { id: "4", name: "Meta", industry: "Technology", status: "Verified", jobs: 38, joined: "2025-02-10", contact: "recruiting@meta.com" },
  { id: "5", name: "Global Tech LLC", industry: "IT Services", status: "Rejected", jobs: 0, joined: "2026-06-18", contact: "info@globaltech.com" },
];

function AdminEmployers() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Employer Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Verify companies, approve registrations, and manage employer profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90">
            Invite Employer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['Total Employers', 'Pending Verification', 'Active Jobs'].map((stat, i) => (
          <div key={stat} className="bg-card/20 border border-border/40 p-4 rounded-2xl backdrop-blur-sm flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat}</h4>
              <div className="text-2xl font-black text-foreground mt-2">{[842, 15, 3850][i]}</div>
            </div>
            <div className={`p-3 rounded-xl ${['bg-primary/10 text-primary', 'bg-yellow-500/10 text-yellow-500', 'bg-secondary/10 text-secondary'][i]}`}>
              <Building2 className="w-5 h-5" />
            </div>
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
              placeholder="Search companies..." 
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Industry</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Jobs</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {mockEmployers.map((company, index) => (
                <motion.tr 
                  key={company.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-primary shadow-soft font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{company.name}</div>
                        <div className="text-xs text-muted-foreground">{company.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {company.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : company.status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-foreground">
                    {company.jobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {company.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {company.status === 'Pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-500/10">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
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
