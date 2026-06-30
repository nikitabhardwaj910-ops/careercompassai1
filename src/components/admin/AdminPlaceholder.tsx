import { motion } from "framer-motion";
import { Hammer } from "lucide-react";

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 rounded-3xl bg-card/40 border border-border/50 flex items-center justify-center shadow-glow mb-6 backdrop-blur-md"
      >
        <Hammer className="w-10 h-10 text-primary" />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-display font-black text-foreground mb-4"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-lg max-w-lg"
      >
        This module is currently under construction. Check back soon for updates to the premium admin experience.
      </motion.p>
    </div>
  );
}
