import { motion } from "framer-motion";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  delay?: number;
  gradient?: string;
}

export function StatCard({ title, value, trend, trendUp, icon: Icon, delay = 0, gradient = "from-primary/20 to-transparent" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="relative p-6 rounded-2xl bg-card/40 border border-border/40 overflow-hidden group hover:border-border/80 transition-colors"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`} />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-display font-black text-foreground mb-1">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );
}
