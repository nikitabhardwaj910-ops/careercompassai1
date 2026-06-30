import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Award, CheckCircle2, XCircle, ShieldCheck, FileKey } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/certifications")({
  component: AdminCertifications,
});

const mockCertifications: any[] = [];

function AdminCertifications() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Certification Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">Review student uploads, verify credential authenticity, and approve/reject claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['Total Uploads', 'Pending Review', 'Verified', 'Rejected'].map((stat, i) => (
          <div key={stat} className="bg-card/20 border border-border/40 p-4 rounded-2xl backdrop-blur-sm">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat}</h4>
            <div className="text-2xl font-black text-foreground mt-2">{[0, 0, 0, 0][i]}</div>
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
              placeholder="Search by student or certification..." 
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Certification details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Uploaded</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {mockCertifications.map((cert, index) => (
                <motion.tr 
                  key={cert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-soft">
                        {cert.student.charAt(0)}
                      </div>
                      <div className="text-sm font-bold text-foreground">{cert.student}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      {cert.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-6">{cert.issuer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-muted/30 px-2 py-1 rounded border border-border/50 text-muted-foreground">
                      <FileKey className="w-3 h-3" />
                      {cert.verificationId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      cert.status === 'Verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      cert.status === 'Pending review' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      cert.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-muted/50 text-muted-foreground border-border/50'
                    }`}>
                      {cert.status === 'Verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : null}
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {cert.uploaded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {cert.status === 'Pending review' ? (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-500/10">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          View Details
                        </Button>
                      )}
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
