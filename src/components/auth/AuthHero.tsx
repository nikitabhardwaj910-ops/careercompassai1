import { motion } from "framer-motion";
import { FloatingParticles, ParallaxLayer } from "@/components/AnimationComponents";
import { Sparkles, Brain, Cpu, Globe, Rocket } from "lucide-react";

export function AuthHero() {
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center w-1/2 bg-background overflow-hidden border-l border-border/20">
      {/* Background gradients */}
      <ParallaxLayer speed={-0.15} className="absolute w-[600px] h-[600px] -top-32 -right-32 bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-70 animate-pulse" />
      <ParallaxLayer speed={0.2} className="absolute w-[500px] h-[500px] -bottom-32 -left-32 bg-secondary/20 rounded-full blur-[80px] mix-blend-screen opacity-60" />
      
      {/* Floating Particles */}
      <FloatingParticles count={25} />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Content Container */}
      <div className="relative z-10 max-w-lg px-8 text-center flex flex-col items-center">
        {/* Floating AI Illustration */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-12"
        >
          {/* Main Brain Icon with glassmorphism card */}
          <div className="relative w-48 h-48 rounded-[2rem] glass bg-card/20 border border-primary/30 shadow-glow flex items-center justify-center backdrop-blur-md">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
            <Brain className="w-24 h-24 text-primary" />
            
            {/* Orbital Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 rounded-xl glass bg-card/40 border border-border/50 shadow-soft">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 rounded-xl glass bg-card/40 border border-border/50 shadow-soft">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-xl glass bg-card/40 border border-border/50 shadow-soft">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 p-2 rounded-xl glass bg-card/40 border border-border/50 shadow-soft">
                <Rocket className="w-5 h-5 text-purple-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-display font-black text-foreground mb-4 leading-tight">
            Discover the right <span className="text-transparent bg-clip-text gradient-bg">career path</span> with AI-powered guidance.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of students and professionals who are shaping their future with Career Compass AI.
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Smart Matching", "Skill Analysis", "Interview Prep"].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full glass bg-card/30 border border-primary/20 text-sm font-semibold text-foreground/80 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
