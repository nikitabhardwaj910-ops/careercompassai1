import { createFileRoute } from "@tanstack/react-router";
import { Users, Building2, Briefcase, FileCheck, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardIndex,
});

function AdminDashboardIndex() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const revenueData = stats?.revenueData || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening on Career Compass AI today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-card/40 border border-border/50 text-sm rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents?.toLocaleString() || "0"} trend="+12.5%" trendUp={true} icon={Users} delay={0.1} />
        <StatCard title="Active Employers" value={stats?.activeEmployers?.toLocaleString() || "0"} trend="+5.2%" trendUp={true} icon={Building2} delay={0.2} gradient="from-secondary/20 to-transparent" />
        <StatCard title="Total Jobs Posted" value={stats?.totalJobs?.toLocaleString() || "0"} trend="+18.4%" trendUp={true} icon={Briefcase} delay={0.3} gradient="from-blue-500/20 to-transparent" />
        <StatCard title="Applications Submitted" value={stats?.totalApplications?.toLocaleString() || "0"} trend="+24.1%" trendUp={true} icon={FileCheck} delay={0.4} gradient="from-purple-500/20 to-transparent" />
        
        {/* Extended metrics visible on larger screens */}
        <div className="hidden xl:contents">
          <StatCard title="Platform Revenue" value={stats?.platformRevenue || "$0"} trend="+8.4%" trendUp={true} icon={DollarSign} delay={0.5} gradient="from-green-500/20 to-transparent" />
          <StatCard title="Monthly Growth" value={stats?.monthlyGrowth || "0%"} trend="-1.2%" trendUp={false} icon={TrendingUp} delay={0.6} gradient="from-orange-500/20 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Growth Analytics</h3>
              <p className="text-xs text-muted-foreground">User registrations and activity over time.</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl bg-card/20 border border-border/40 p-6 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Real-time platform events.</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
