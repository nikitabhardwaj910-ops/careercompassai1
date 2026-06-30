import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-display font-bold group ${className}`}>
      <span className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-card border border-border/80 shadow-soft overflow-hidden shrink-0">
        {/* Animated active background gradient */}
        <span className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute inset-[1.5px] rounded-[12px] bg-card z-0 group-hover:bg-card/90 transition-colors" />
        
        {/* Glowing aura */}
        <span className="absolute -inset-1 rounded-[14px] bg-gradient-to-tr from-primary via-secondary to-accent opacity-20 blur-sm group-hover:opacity-60 transition-opacity" />

        <motion.div 
          className="relative z-10 text-primary group-hover:text-foreground transition-colors"
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
        >
          <Compass className="h-5.5 w-5.5" />
        </motion.div>
      </span>
      <span className="text-[19px] tracking-tight text-foreground transition-colors group-hover:text-primary font-bold">
        CareerCompass <span className="gradient-text font-extrabold">AI</span>
      </span>
    </Link>
  );
}
