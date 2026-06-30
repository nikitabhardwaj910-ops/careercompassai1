import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopIn, ScrollReveal } from "@/components/AnimationComponents";

export const Route = createFileRoute("/dashboard/settings")({
  component: PlaceholderPage,
});

function PlaceholderPage() {
  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <ScrollReveal className="max-w-md w-full text-center">
        <PopIn>
          <div className="mx-auto h-20 w-20 rounded-3xl bg-muted grid place-items-center shadow-soft mb-6">
            <Settings className="h-10 w-10 text-foreground" />
          </div>
        </PopIn>
        
        <h1 className="font-display text-3xl font-black text-foreground">
          Control Panel
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          System settings and account preferences are being prepared for your command center.
        </p>

        <div className="mt-8">
          <Button asChild className="rounded-full gradient-bg text-white border-0 shadow-glow font-bold">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}
