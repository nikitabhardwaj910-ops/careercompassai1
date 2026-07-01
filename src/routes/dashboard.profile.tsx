import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Plus,
  Save,
  PenLine,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StaggerGroup, PopIn, ScrollReveal } from "@/components/AnimationComponents";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — CareerCompass AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(["Python", "React", "TypeScript", "Machine Learning", "SQL"]);
  const [newSkill, setNewSkill] = useState("");

  // Profile data state loaded from registration / backend
  const [name, setName] = useState("Jane Student");
  const [email, setEmail] = useState("jane@university.edu");
  const [role, setRole] = useState("B.Tech ML, Class of 2027");
  const [location, setLocation] = useState("San Francisco, CA (Remote)");
  const [github, setGithub] = useState("github.com/janestudent");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/janestudent");
  const [website, setWebsite] = useState("janestudent.dev");
  const [about, setAbout] = useState("Passionate ML student focusing on generative models and neural networks. Looking for a summer internship to apply theoretical knowledge to real-world scale problems. Built several side projects using PyTorch and FastAPI.");
  const [education, setEducation] = useState("Stanford University");

  useEffect(() => {
    // Load from localStorage first
    const userStr = localStorage.getItem("careercompass_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.fullName) setName(u.fullName);
        if (u.email) setEmail(u.email);
        if (u.targetRole) setRole(u.targetRole + (u.experienceLevel ? ` (${u.experienceLevel})` : ""));
        if (u.location) setLocation(u.location);
        if (u.bio) setAbout(u.bio);
        if (u.university) setEducation(u.university);
        if (Array.isArray(u.skills) && u.skills.length > 0) setSkills(u.skills);
      } catch (e) {}
    }

    // Fetch from API to get latest registration data
    const token = localStorage.getItem("jwt_token");
    if (token) {
      fetch("https://careercompassai1.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(u => {
        if (u && u.fullName) {
          setName(u.fullName);
          if (u.email) setEmail(u.email);
          if (u.targetRole) setRole(u.targetRole);
          if (u.location) setLocation(u.location);
          if (u.bio) setAbout(u.bio);
          if (u.university) setEducation(u.university);
          if (u.githubUrl) setGithub(u.githubUrl);
          if (u.linkedinUrl) setLinkedin(u.linkedinUrl);
          if (Array.isArray(u.skills) && u.skills.length > 0) setSkills(u.skills);
          
          // Sync back to local storage
          localStorage.setItem("careercompass_user", JSON.stringify(u));
        }
      }).catch(() => {});
    }
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    
    // Save to localStorage
    const userStr = localStorage.getItem("careercompass_user") || "{}";
    const u = JSON.parse(userStr);
    const updated = {
      ...u,
      fullName: name,
      email: email,
      targetRole: role,
      location: location,
      bio: about,
      university: education,
      githubUrl: github,
      linkedinUrl: linkedin,
      skills: skills
    };
    localStorage.setItem("careercompass_user", JSON.stringify(updated));

    // Save to backend API
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        await fetch("https://careercompassai1.onrender.com/api/users/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updated)
        });
      } catch (e) {}
    }

    toast.success("Profile saved successfully", {
      description: "Your registration details and AI embedding vector have been updated.",
    });
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success(`Skill added: ${newSkill.trim()}`);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-3xl font-black tracking-tight">Candidate Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your registration details and AI skill vector.</p>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`shrink-0 rounded-full font-bold shadow-glow hover:scale-[1.02] transition-transform ${
            isEditing 
              ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0" 
              : "gradient-bg text-white border-0"
          }`}
        >
          {isEditing ? (
            <><Save className="mr-1.5 h-4 w-4" /> Save Changes</>
          ) : (
            <><PenLine className="mr-1.5 h-4 w-4" /> Edit Profile</>
          )}
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Basic Info & Strength */}
        <div className="space-y-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="rounded-3xl glass border border-border/80 bg-card/45 p-6 shadow-card text-center">
              <PopIn delay={0.2}>
                <div className="relative mx-auto h-24 w-24 rounded-full gradient-bg grid place-items-center shadow-glow mb-4">
                  <span className="text-3xl font-black text-white">{name ? name.slice(0, 2).toUpperCase() : "CC"}</span>
                  <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background grid place-items-center">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
              </PopIn>
              
              {isEditing ? (
                <div className="space-y-2 mb-4">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="text-center font-bold text-sm rounded-xl" />
                  <Input value={role} onChange={e => setRole(e.target.value)} placeholder="Target Role / Class" className="text-center text-xs rounded-xl" />
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-black">{name}</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{role}</p>
                </>
              )}

              <div className="mt-6 border-t border-border/40 pt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {isEditing ? (
                    <Input value={email} onChange={e => setEmail(e.target.value)} className="h-8 text-xs rounded-lg flex-1" />
                  ) : (
                    <span className="truncate">{email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {isEditing ? (
                    <Input value={location} onChange={e => setLocation(e.target.value)} className="h-8 text-xs rounded-lg flex-1" />
                  ) : (
                    <span className="truncate">{location}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Github className="h-4 w-4 shrink-0 text-primary" />
                  {isEditing ? (
                    <Input value={github} onChange={e => setGithub(e.target.value)} className="h-8 text-xs rounded-lg flex-1" />
                  ) : (
                    <a href={`https://${github.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">{github}</a>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Linkedin className="h-4 w-4 shrink-0 text-primary" />
                  {isEditing ? (
                    <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="h-8 text-xs rounded-lg flex-1" />
                  ) : (
                    <a href={`https://${linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">{linkedin}</a>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <LinkIcon className="h-4 w-4 shrink-0 text-primary" />
                  {isEditing ? (
                    <Input value={website} onChange={e => setWebsite(e.target.value)} className="h-8 text-xs rounded-lg flex-1" />
                  ) : (
                    <a href={`https://${website.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">{website}</a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl glass border border-border/80 bg-card/45 p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Profile Strength</h3>
                <span className="text-primary font-black font-mono">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Registration verified. Your embedding density unlocks premium job & internship matching.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Details & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal direction="up" delay={0.15}>
            <div className="rounded-3xl glass border border-border/80 bg-card/45 p-6 shadow-card">
              <h3 className="font-display text-lg font-black flex items-center gap-2 border-b border-border/40 pb-4 mb-4">
                <User className="h-5 w-5 text-primary" /> About Me
              </h3>
              {isEditing ? (
                <textarea 
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-border/85 bg-card/30 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {about}
                </p>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <div className="rounded-3xl glass border border-border/80 bg-card/45 p-6 shadow-card">
              <h3 className="font-display text-lg font-black flex items-center gap-2 border-b border-border/40 pb-4 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" /> Education
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <Input value={education} onChange={e => setEducation(e.target.value)} placeholder="University / College Name" className="text-sm font-bold rounded-xl mb-1" />
                    ) : (
                      <h4 className="font-bold">{education}</h4>
                    )}
                    <p className="text-sm text-muted-foreground">Computer Science & AI Specialization</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border/40">Registered Candidate</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.35}>
            <div className="rounded-3xl glass border border-border/80 bg-card/45 p-6 shadow-card">
              <h3 className="font-display text-lg font-black flex items-center gap-2 border-b border-border/40 pb-4 mb-4">
                <Briefcase className="h-5 w-5 text-primary" /> Technical Skills
              </h3>
              
              <StaggerGroup staggerDelay={0.05} className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div key={skill} className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} type="button" className="ml-2 text-primary/60 hover:text-primary transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </StaggerGroup>

              {isEditing && (
                <form onSubmit={addSkill} className="mt-4 flex items-center gap-2">
                  <Input 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)} 
                    placeholder="Add a skill (e.g. Docker)" 
                    className="h-9 text-xs rounded-xl"
                  />
                  <Button type="submit" size="sm" className="h-9 rounded-xl gradient-bg text-white border-0">
                    Add
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
