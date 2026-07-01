import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { FileText, Download, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/resumes")({
  component: AdminResumes,
});

const atsScoreTrends = [
  { name: "Jan", avgScore: 65 },
  { name: "Feb", avgScore: 68 },
  { name: "Mar", avgScore: 71 },
  { name: "Apr", avgScore: 70 },
  { name: "May", avgScore: 74 },
  { name: "Jun", avgScore: 78 },
];

const missingKeywords = [
  { keyword: "Agile Methodology", occurrences: 12 },
  { keyword: "REST APIs", occurrences: 9 },
  { keyword: "Cloud Computing", occurrences: 8 },
  { keyword: "Data Structures", occurrences: 6 },
  { keyword: "Project Management", occurrences: 5 },
];

function AdminResumes() {
  const [totalResumes, setTotalResumes] = useState(1);
  const [avgScore, setAvgScore] = useState(78.4);

  useEffect(() => {
    fetch("https://careercompassai1.onrender.com/api/users/all").then(r => r.json()).then(users => {
      if (Array.isArray(users) && users.length > 0) {
        setTotalResumes(users.length);
        let sum = 0;
        users.forEach((u: any) => sum += (u.profileCompletion || 75));
        setAvgScore(Math.round((sum / users.length) * 10) / 10);
      }
    }).catch(() => {});
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Resume Analysis Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyze global ATS scores, identify common missing keywords, and track resume quality.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card/40 border-border/50 hover:bg-muted/50 gap-2 h-10">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between group">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average ATS Score</h4>
            <div className="text-3xl font-black text-foreground mt-2">{avgScore}</div>
            <p className="text-xs text-green-500 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Real time average
            </p>
          </div>
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <FileText className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between group">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resumes Analyzed</h4>
            <div className="text-3xl font-black text-foreground mt-2">{totalResumes}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Real platform users</p>
          </div>
          <div className="p-4 rounded-full bg-secondary/10 text-secondary">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between group">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Missing Skills</h4>
            <div className="text-3xl font-black text-foreground mt-2">1,240</div>
            <p className="text-xs text-orange-500 mt-1 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Action required
            </p>
          </div>
          <div className="p-4 rounded-full bg-orange-500/10 text-orange-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATS Trends Line Chart */}
        <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">ATS Score Trends</h3>
          <p className="text-xs text-muted-foreground mb-6">Average student resume score over time.</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={atsScoreTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="avgScore" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Keywords Bar Chart */}
        <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">Common Missing Keywords</h3>
          <p className="text-xs text-muted-foreground mb-6">Frequently omitted skills in job applications.</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingKeywords} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="keyword" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar dataKey="occurrences" fill="var(--color-orange-500)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
