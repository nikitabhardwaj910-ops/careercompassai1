import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserCircle, Mail, Key, Shield, Clock, Edit2, Check, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfile,
});

function AdminProfile() {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("https://careercompassai1.onrender.com/api/admin/profile", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    }
  });

  const name = user?.fullName || profile?.name || "System Admin";
  const email = user?.email || profile?.email || "admin@careercompass.ai";
  const phone = user?.phone || profile?.phone || "+1 (555) 019-2834";
  const role = user?.currentRole || profile?.role || "Super Admin";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SA";
  const recentLogins = profile?.recentLogins || [
    { id: "1", ip: "127.0.0.1", location: "Local Workstation", time: "Just now", status: "Success" }
  ];

  const handleStartEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setEditRole(role);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (updateAuthProfile) {
        await updateAuthProfile({
          fullName: editName,
          email: editEmail,
          phone: editPhone,
          currentRole: editRole
        });
      }
      const token = localStorage.getItem("jwt_token");
      await fetch("https://careercompassai1.onrender.com/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          fullName: editName,
          email: editEmail,
          phone: editPhone,
          currentRole: editRole
        })
      });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      setIsEditing(false);
      toast.success("Admin Profile updated successfully! ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to update admin profile");
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Admin Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account details, security credentials, and view login history.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm overflow-hidden">
        {/* Profile Header Gradient */}
        <div className="h-32 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl gradient-bg border-4 border-background flex items-center justify-center text-white font-bold text-3xl shadow-glow">
            {initials}
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-black text-foreground">{name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" /> {email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-secondary" /> {phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    <Shield className="w-4 h-4" /> {role}
                  </span>
                </div>
              </div>
              <Button onClick={handleStartEdit} variant="outline" className="border-border/50 bg-background/50 hover:bg-muted/50 gap-2 shrink-0">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background/80 border border-border/50 text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background/80 border border-border/50 text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background/80 border border-border/50 text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background/80 border border-border/50 text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="gradient-bg text-white font-bold rounded-xl gap-2 h-10">
                  <Check className="w-4 h-4" /> Save Changes
                </Button>
                <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="rounded-xl gap-2 h-10">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> Security Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <span className="text-sm font-mono tracking-widest text-foreground">••••••••••••</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">Change</Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Admin Passkey Verification</label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <span className="text-sm font-bold text-green-500">Verified</span>
                <span className="text-xs text-muted-foreground font-mono">Active Session</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card/20 border border-border/40 backdrop-blur-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" /> Recent Login Activity
          </h3>
          <div className="space-y-3">
            {recentLogins.map((login: any, index: number) => (
              <div key={login.id || index} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div>
                  <div className="text-sm font-bold text-foreground">{login.location}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{login.ip} • {login.time}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${login.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {login.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
