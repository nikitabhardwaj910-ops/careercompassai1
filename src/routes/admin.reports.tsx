import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, PieChart, Users, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users': return Users;
    case 'TrendingUp': return TrendingUp;
    case 'PieChart': return PieChart;
    case 'FileText': return FileText;
    default: return FileText;
  }
};

function AdminReports() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const reportTemplates = data?.reportTemplates || [];
  const scheduledReports = data?.scheduledReports || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Reports & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate, view, and export comprehensive platform analytics reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90">
            Create Custom Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reportTemplates.map((report: any, i: number) => {
          const Icon = getIcon(report.iconName);
          return (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-border/80 transition-colors flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${report.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{report.title}</h3>
              <p className="text-xs text-muted-foreground flex-1 mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground font-mono">Last: {report.lastGenerated}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm overflow-hidden flex flex-col p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Scheduled Reports</h3>
        
        <div className="space-y-4">
          {scheduledReports.map((report: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30">
              <div>
                <h4 className="text-sm font-bold text-foreground">{report.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${report.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted/10 text-muted-foreground border-muted/20'}`}>{report.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
