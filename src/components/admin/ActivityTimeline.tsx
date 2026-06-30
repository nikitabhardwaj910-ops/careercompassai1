import { motion } from "framer-motion";
import { UserPlus, Briefcase, GraduationCap, FileText, Sparkles } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New User Registration",
    description: "Sarah Jenkins joined the platform.",
    time: "5 mins ago",
    icon: UserPlus,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "New Job Posted",
    description: "Google posted 'Senior AI Engineer'.",
    time: "12 mins ago",
    icon: Briefcase,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 3,
    title: "AI Recommendation Generated",
    description: "154 matches generated for 'Data Science'.",
    time: "1 hour ago",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 4,
    title: "Internship Approved",
    description: "Microsoft's Summer 2027 internship is live.",
    time: "2 hours ago",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: 5,
    title: "Resume Uploaded",
    description: "David Chen uploaded a new resume.",
    time: "3 hours ago",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function ActivityTimeline() {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative pl-8"
        >
          {/* Vertical Line */}
          {index !== activities.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border/40" />
          )}
          
          {/* Icon */}
          <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${activity.bg} border border-${activity.color}/20 flex items-center justify-center`}>
            <activity.icon className={`w-4 h-4 ${activity.color}`} />
          </div>

          <div className="bg-card/30 border border-border/40 rounded-xl p-4 hover:bg-card/50 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-foreground">{activity.title}</h4>
              <span className="text-[10px] font-medium text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border/40">
                {activity.time}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
