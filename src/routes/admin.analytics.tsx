import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { BrainCircuit, Target, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

function AdminAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const avgScore = data?.averageResumeScore || 0;
  const resumeScores = data?.resumeScores || [];
  const popularSkills = data?.popularSkills || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">AI Analytics Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform intelligence, skill gap analysis, and AI performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
          <BrainCircuit className="w-8 h-8 text-primary mb-4" />
          <h4 className="text-sm font-bold text-muted-foreground">AI Recommendation Accuracy</h4>
          <div className="text-3xl font-black text-foreground mt-1">{data?.recommendationAccuracy || "0"}%</div>
          <p className="text-xs text-green-500 mt-2 font-medium">+2.1% from last month</p>
        </div>
        
        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl group-hover:bg-secondary/20 transition-colors" />
          <Target className="w-8 h-8 text-secondary mb-4" />
          <h4 className="text-sm font-bold text-muted-foreground">Average Skill Match</h4>
          <div className="text-3xl font-black text-foreground mt-1">{data?.averageSkillMatch || "0"}%</div>
          <p className="text-xs text-green-500 mt-2 font-medium">+5.4% from last month</p>
        </div>

        <div className="bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors" />
          <TrendingUp className="w-8 h-8 text-orange-500 mb-4" />
          <h4 className="text-sm font-bold text-muted-foreground">Average Resume Score</h4>
          <div className="text-3xl font-black text-foreground mt-1">{avgScore}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Real platform metric</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart for Skills */}
        <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">Skills Demand vs Supply</h3>
          <p className="text-xs text-muted-foreground mb-6">Comparing market demand against student skill levels.</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularSkills} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="demand" name="Market Demand" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Student Supply" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Resume Scores */}
        <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">Resume Score Distribution</h3>
          <p className="text-xs text-muted-foreground mb-6">Overall ATS score spread across all users.</p>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resumeScores}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {resumeScores.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
