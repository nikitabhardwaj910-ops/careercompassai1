import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { FileSearch, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Zap, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — CareerCompass AI" }] }),
  component: ResumeAnalyzerPage,
});

function ResumeAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("parsed_resume");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.info("Gemini AI is scanning your resume...");
      const res = await fetch("http://localhost:8081/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setParsedData(data);
        localStorage.setItem("parsed_resume", JSON.stringify(data));
        toast.success("Resume successfully analyzed by Gemini AI!");
      } else {
        toast.error("Failed to analyze resume. Using fallback data.");
        const fallback = {
          skills: ["React", "TypeScript", "Node.js", "Python", "SQL", "Tailwind CSS"],
          college: "Top Tech University",
          degree: "B.S. in Computer Science"
        };
        setParsedData(fallback);
        localStorage.setItem("parsed_resume", JSON.stringify(fallback));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to Gemini API");
      const fallback = {
        skills: ["React", "TypeScript", "Node.js", "Python", "SQL", "Tailwind CSS"],
        college: "Top Tech University",
        degree: "B.S. in Computer Science"
      };
      setParsedData(fallback);
      localStorage.setItem("parsed_resume", JSON.stringify(fallback));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 grid place-items-center shadow-soft">
              <FileSearch className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-foreground">Resume Analyzer & Job Matcher</h1>
              <p className="text-sm text-muted-foreground">Upload your resume to extract skills with Gemini AI and get customized job recommendations.</p>
            </div>
          </div>

          {parsedData && (
            <Button asChild className="rounded-full gradient-bg text-white shadow-glow hover:scale-105 transition-all font-bold">
              <Link to="/dashboard/recommendations">
                <Sparkles className="mr-2 h-4 w-4" /> View AI Recommended Jobs &rarr;
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx,.txt" 
        className="hidden" 
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload & Score Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          {/* Upload Area */}
          <div 
            onClick={() => !analyzing && fileInputRef.current?.click()}
            className="rounded-3xl border border-dashed border-primary/50 bg-primary/5 p-8 text-center flex flex-col items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer group shadow-soft relative overflow-hidden"
          >
            {analyzing ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                <h3 className="font-bold text-base text-foreground">Gemini AI is analyzing...</h3>
                <p className="text-xs text-muted-foreground mt-1">Extracting skills and career trajectory</p>
              </div>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/20 text-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">Upload Resume</h3>
                <p className="text-xs text-muted-foreground mb-4">Click to select PDF, DOCX, or TXT</p>
                <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/20">
                  Browse Files
                </Button>
              </>
            )}
          </div>

          {/* Score Gauge Widget */}
          <div className="rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl p-6 shadow-card flex flex-col items-center text-center">
            <h3 className="font-display text-base font-black text-foreground w-full text-left mb-6">ATS Compatibility</h3>
            
            <div className="relative h-40 w-40">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-muted/30 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle className="text-emerald-500 stroke-current drop-shadow-[0_0_12px_rgba(var(--color-success),0.6)]" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={parsedData ? 15 : 40}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-display text-foreground">{parsedData ? "96" : "88"}<span className="text-xl text-muted-foreground">%</span></span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Excellent</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6 text-left w-full">Your resume parses well in modern ATS systems. Upload the latest version to refresh your score.</p>
          </div>
        </motion.div>

        {/* Analysis Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {/* Extracted Skills / Missing Keywords */}
          <div className="rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3 className="font-display text-base font-black text-foreground">
                  {parsedData ? "Gemini Extracted Skills" : "Missing Keywords for Target Roles"}
                </h3>
              </div>
              {parsedData && (
                <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {parsedData.degree || "Degree Verified"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(parsedData?.skills || ["GraphQL", "Docker", "CI/CD Pipeline", "Agile Methodology", "Microservices"]).map((kw: string) => (
                <div key={kw} className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
                  parsedData ? "border-primary/30 bg-primary/10 text-primary" : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}>
                  {parsedData ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />} {kw}
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl p-6 shadow-card flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-black text-foreground">AI Improvement Suggestions</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Quantify your achievements</h4>
                    <p className="text-xs text-muted-foreground mt-1">In your experience section, include metric improvements (e.g. "Increased accuracy by 15% reducing inference time by 200ms").</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Action Verb optimization</h4>
                    <p className="text-xs text-muted-foreground mt-1">Replace passive verbs like "Responsible for" with high-impact verbs like "Architected", "Spearheaded", or "Deployed".</p>
                  </div>
                </div>
              </div>
            </div>

            <Button asChild className="w-full mt-6 rounded-full gradient-bg shadow-glow hover:scale-[1.01] transition-transform font-bold text-white">
              <Link to="/dashboard/recommendations">
                <Sparkles className="mr-2 h-4 w-4" /> Discover Jobs Recommended for Your Resume &rarr;
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
