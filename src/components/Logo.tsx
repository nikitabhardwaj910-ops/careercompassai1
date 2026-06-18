import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display font-bold ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl gradient-bg text-white shadow-[var(--shadow-glow)]">
        <Compass className="h-5 w-5" />
      </span>
      <span className="text-lg tracking-tight">
        CareerCompass <span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}
