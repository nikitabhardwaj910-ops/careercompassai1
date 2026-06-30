import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type Variants,
} from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ─── ScrollReveal ─────────────────────────────────────────────── */
type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: boolean;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const directionOffset = (dir: Direction, distance: number) => {
  switch (dir) {
    case "up":
      return { y: distance, x: 0 };
    case "down":
      return { y: -distance, x: 0 };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  blur = true,
  distance = 40,
  className = "",
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "-50px",
  });

  const offset = directionOffset(direction, distance);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...offset,
        filter: blur ? "blur(8px)" : "blur(0px)",
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : {
              opacity: 0,
              ...offset,
              filter: blur ? "blur(8px)" : "blur(0px)",
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── ParallaxLayer ────────────────────────────────────────────── */
interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // -1 to 1; negative = slower, positive = faster
  className?: string;
  style?: CSSProperties;
}

export function ParallaxLayer({
  children,
  speed = 0.3,
  className = "",
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -120, speed * 120]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── CountUp ──────────────────────────────────────────────────── */
interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 60,
    damping: 25,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionVal.set(end);
    }
  }, [isInView, end, motionVal]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      if (decimals > 0) {
        setDisplay(v.toFixed(decimals));
      } else {
        setDisplay(Math.round(v).toLocaleString());
      }
    });
    return unsub;
  }, [springVal, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ─── StaggerGroup ─────────────────────────────────────────────── */
interface StaggerGroupProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  direction?: Direction;
  distance?: number;
  blur?: boolean;
}

export function StaggerGroup({
  children,
  staggerDelay = 0.08,
  className = "",
  direction = "up",
  distance = 30,
  blur = true,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const offset = directionOffset(direction, distance);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      filter: blur ? "blur(6px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/* ─── PopIn ────────────────────────────────────────────────────── */
interface PopInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function PopIn({ children, delay = 0, className = "" }: PopInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── TextReveal ───────────────────────────────────────────────── */
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  mode?: "word" | "character";
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  mode = "word",
  tag: Tag = "span",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const units = mode === "word" ? text.split(" ") : text.split("");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: mode === "word" ? 0.06 : 0.025,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      aria-label={text}
    >
      <Tag className={className}>
        {units.map((unit, i) => (
          <motion.span
            key={`${unit}-${i}`}
            variants={child}
            className="inline-block"
          >
            {unit}
            {mode === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}

/* ─── FloatingParticles ────────────────────────────────────────── */
interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({
  count = 24,
  className = "",
}: FloatingParticlesProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.35 + 0.08,
    })));
    setMounted(true);
  }, [count]);

  if (!mounted) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 0.5, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── ScrollProgress ───────────────────────────────────────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left gradient-bg"
      style={{ scaleX }}
    />
  );
}

/* ─── TiltCard ─────────────────────────────────────────────────── */
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
}

export function TiltCard({
  children,
  className = "",
  tiltDegree = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((y - centerY) / centerY) * -tiltDegree);
    rotateY.set(((x - centerX) / centerX) * tiltDegree);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 800,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
