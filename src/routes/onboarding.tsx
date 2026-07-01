import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, GraduationCap, Briefcase, FileText, Target, Award,
  CheckCircle2, ChevronRight, ChevronLeft, Upload, FileUp, Sparkles, MapPin, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { usePopup } from "@/components/PopupSystem";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Complete Profile — CareerCompass AI" }] }),
  beforeLoad: () => {
    // We cannot easily use hooks here directly in beforeLoad for context in this mock,
    // so we handle redirect in component mount if no user.
  },
  component: OnboardingWizard,
});

const availableSkills = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Machine Learning", "Data Science", "AWS", "Docker", "Git", "C++", "Java"];
const availableDomains = ["Software Engineering", "AI/ML", "Data Science", "Product Management", "Design", "Cybersecurity"];
const availableIndustries = ["Fintech", "Healthtech", "Edtech", "E-commerce", "SaaS", "Web3"];

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Education", icon: GraduationCap },
  { id: 3, title: "Skills", icon: Briefcase },
  { id: 4, title: "Resume Upload", icon: FileText },
  { id: 5, title: "Preferences", icon: Target },
  { id: 6, title: "AI Goals", icon: Sparkles },
];

function OnboardingWizard() {
  const { user, updateProfile } = useAuth();
  const { showCelebration } = usePopup();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    phone: "",
    preferredLocation: "",
    college: "",
    degree: "",
    specialization: "",
    currentYear: "",
    graduationYear: "",
    cgpa: "",
    currentRole: "",
    skills: [],
    experienceLevel: "",
    portfolio: "",
    github: "",
    linkedin: "",
    resumeUrl: "",
    jobPreference: "internship",
    workMode: "hybrid",
    expectedStipend: "",
    expectedSalary: "",
    careerGoal: "",
    interestedDomains: [],
    preferredIndustries: [],
    termsAccepted: false,
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      navigate({ to: "/auth" });
    } else {
      setFormData((prev: any) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(c => c + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleSubmit = () => {
    localStorage.setItem("onboarding_completed", "true");
    updateProfile({ ...formData, termsAccepted: true });
    showCelebration();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("https://careercompassai1.onrender.com/api/resume/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      
      setFormData((prev: any) => ({
        ...prev,
        resumeUrl: file.name,
        skills: data.skills && data.skills.length > 0 ? [...new Set([...prev.skills, ...data.skills])] : prev.skills,
        college: data.college || prev.college,
        degree: data.degree || prev.degree,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!formData.resumeUrl && !isExtracting && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i: string) => i !== item) : [...arr, item]
      };
    });
  };

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <header className="px-8 py-6 flex items-center justify-between z-10 border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0">
        <Logo />
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col z-10">
        {/* Progress Tracker */}
        <div className="mb-8 mt-4">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center gap-2 ${currentStep === step.id ? 'text-primary' : currentStep > step.id ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep === step.id ? 'border-primary bg-primary/10' : currentStep > step.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-muted/30'}`}>
                  {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-center mt-2 text-xs font-semibold text-muted-foreground">
            Step {currentStep} of 6: {steps[currentStep - 1].title}
          </div>
        </div>

        {/* Wizard Form Area */}
        <div className="flex-1 bg-card/40 border border-border/60 rounded-3xl p-6 sm:p-10 shadow-soft backdrop-blur-md flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">Personal Details</h2>
                      <p className="text-sm text-muted-foreground">Let's start with your basic contact info.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="+1 (555) 000-0000" value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Current Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="San Francisco, CA" value={formData.preferredLocation || ""} onChange={e => setFormData({...formData, preferredLocation: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Education */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">Academic Information</h2>
                      <p className="text-sm text-muted-foreground">Tell us about your educational background.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>College / University</Label>
                        <Input placeholder="Stanford University" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Degree</Label>
                        <Input placeholder="B.S. Computer Science" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Current Year</Label>
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" value={formData.currentYear} onChange={e => setFormData({...formData, currentYear: e.target.value})}>
                          <option value="">Select Year</option>
                          <option value="1">Freshman (1st Year)</option>
                          <option value="2">Sophomore (2nd Year)</option>
                          <option value="3">Junior (3rd Year)</option>
                          <option value="4">Senior (4th Year)</option>
                          <option value="grad">Graduate Student</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Expected Graduation Year</Label>
                        <Input placeholder="2025" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>CGPA / Percentage (Optional)</Label>
                        <Input placeholder="3.8" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Skills */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">Professional Profile</h2>
                      <p className="text-sm text-muted-foreground">What do you know and what have you built?</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Current Role</Label>
                      <Input placeholder="Student / Fresher / Intern" value={formData.currentRole} onChange={e => setFormData({...formData, currentRole: e.target.value})} />
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label>Top Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map(s => (
                          <button
                            key={s}
                            onClick={() => toggleArrayItem("skills", s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.skills.includes(s) ? "bg-primary/20 border-primary/50 text-primary" : "bg-card border-border/80 text-muted-foreground hover:border-primary/40"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label>GitHub Profile</Label>
                        <Input placeholder="https://github.com/..." value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>LinkedIn Profile</Label>
                        <Input placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Resume */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">Smart Resume Upload</h2>
                      <p className="text-sm text-muted-foreground">Upload your resume and our AI will automatically extract your data.</p>
                    </div>
                    
                    <div 
                      className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all ${formData.resumeUrl ? 'border-emerald-500 bg-emerald-500/5' : 'border-border/80 bg-card/50 hover:border-primary/50 cursor-pointer'}`}
                      onClick={triggerFileInput}
                    >
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                      />
                      {isExtracting ? (
                        <>
                          <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles className="h-8 w-8 text-primary animate-spin-slow" />
                          </div>
                          <h3 className="font-bold text-lg">Extracting Data using AI...</h3>
                          <p className="text-sm text-muted-foreground mt-2">Parsing education, skills, and experience...</p>
                        </>
                      ) : formData.resumeUrl ? (
                        <>
                          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                          </div>
                          <h3 className="font-bold text-lg">Resume Uploaded Successfully</h3>
                          <p className="text-sm text-muted-foreground mt-2">AI extracted {formData.skills.length} skills and your education background.</p>
                          <Button variant="outline" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); setFormData({...formData, resumeUrl: ""}) }}>
                            Replace Resume
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileUp className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-bold text-lg">Click or Drag & Drop</h3>
                          <p className="text-sm text-muted-foreground mt-2">PDF or DOCX (Max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Preferences */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">Job Preferences</h2>
                      <p className="text-sm text-muted-foreground">What kind of opportunities are you looking for?</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Opportunity Type</Label>
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" value={formData.jobPreference} onChange={e => setFormData({...formData, jobPreference: e.target.value})}>
                          <option value="internship">Internship</option>
                          <option value="fulltime">Full-Time</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Work Mode</Label>
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})}>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="onsite">On-site</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Preferred Role</Label>
                        <Input placeholder="e.g. Frontend Engineer" value={formData.preferredRole} onChange={e => setFormData({...formData, preferredRole: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Expected Stipend/Salary</Label>
                        <Input placeholder="e.g. $5k/mo or $100k/yr" value={formData.expectedSalary} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: AI Goals */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight">AI Match Setup</h2>
                      <p className="text-sm text-muted-foreground">Help our AI recommend the perfect opportunities.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Interested Domains</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableDomains.map(d => (
                          <button
                            key={d}
                            onClick={() => toggleArrayItem("interestedDomains", d)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.interestedDomains.includes(d) ? "bg-accent/20 border-accent/50 text-accent" : "bg-card border-border/80 text-muted-foreground hover:border-accent/40"}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label>Preferred Industries</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableIndustries.map(i => (
                          <button
                            key={i}
                            onClick={() => toggleArrayItem("preferredIndustries", i)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.preferredIndustries.includes(i) ? "bg-secondary/20 border-secondary/50 text-secondary" : "bg-card border-border/80 text-muted-foreground hover:border-secondary/40"}`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-6 border-t border-border/40 mt-6">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="mt-1 rounded border-border/80 text-primary focus:ring-primary h-4 w-4 bg-card/50"
                        checked={formData.termsAccepted}
                        onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>. I consent to having my profile analyzed by CareerCompass AI.
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-border/40 z-10">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 1 || isExtracting}
              className="rounded-full bg-card/50 px-6 font-bold"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {currentStep < 6 ? (
              <Button 
                onClick={handleNext} 
                disabled={isExtracting || (currentStep === 4 && !formData.resumeUrl)}
                className="rounded-full gradient-bg text-white px-8 font-bold shadow-glow hover:scale-105 transition-all"
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.termsAccepted}
                className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 font-bold shadow-glow hover:scale-105 transition-all"
              >
                Complete Profile <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
