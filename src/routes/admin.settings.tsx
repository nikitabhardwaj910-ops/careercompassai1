import { createFileRoute } from "@tanstack/react-router";
import { Settings, Shield, Key, BellRing, Database, Save, Server, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage global platform configurations, AI models, and security policies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gradient-bg text-white border-0 shadow-glow h-10 px-6 font-bold hover:opacity-90 gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {[
            { name: "General", icon: Settings, active: true },
            { name: "Security", icon: Shield, active: false },
            { name: "API Keys", icon: Key, active: false },
            { name: "Notifications", icon: BellRing, active: false },
            { name: "Database", icon: Database, active: false },
            { name: "AI Models", icon: Server, active: false },
            { name: "Billing", icon: CreditCard, active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                item.active 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_20px_rgba(var(--primary),0.05)]' 
                  : 'text-muted-foreground hover:bg-card/40 hover:text-foreground border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Platform Configuration</h3>
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="Career Compass AI"
                  className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@careercompass.ai"
                  className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Theme</label>
                <select className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground transition-all">
                  <option value="system">System Default</option>
                  <option value="dark" selected>Dark Mode (Default)</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Registration Settings</h3>
            <div className="space-y-4 max-w-2xl">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 cursor-pointer hover:border-border/60 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50" defaultChecked />
                <div>
                  <div className="text-sm font-bold text-foreground">Allow new student registrations</div>
                  <div className="text-xs text-muted-foreground">Open the platform to new student signups.</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 cursor-pointer hover:border-border/60 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50" defaultChecked />
                <div>
                  <div className="text-sm font-bold text-foreground">Require employer verification</div>
                  <div className="text-xs text-muted-foreground">Employers must be manually approved before posting jobs.</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 cursor-pointer hover:border-border/60 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50" defaultChecked />
                <div>
                  <div className="text-sm font-bold text-foreground">Enable AI Resume Parsing</div>
                  <div className="text-xs text-muted-foreground">Automatically extract skills and experience from uploaded PDFs.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">These actions can have permanent consequences.</p>
            <div className="flex gap-4">
              <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">Clear Cache</Button>
              <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">Maintenance Mode</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
