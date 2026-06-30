import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Upload, Download, CheckCircle2, Clock, ShieldCheck, PlayCircle, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/certifications")({
  head: () => ({ meta: [{ title: "Certifications — CareerCompass AI" }] }),
  component: CertificationsPage,
});

const defaultCertifications = [
  {
    id: 1,
    name: "AWS Certified Machine Learning – Specialty",
    issuer: "Amazon Web Services",
    date: "Aug 2025",
    status: "verified",
    credentialId: "AWS-ML-12345",
  },
  {
    id: 2,
    name: "Deep Learning Specialization",
    issuer: "Coursera (DeepLearning.AI)",
    date: "May 2025",
    status: "verified",
    credentialId: "DL-987654321",
  },
  {
    id: 3,
    name: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    date: "Pending",
    status: "pending",
    credentialId: "GCP-DE-PENDING",
  }
];

const availableCourses = [
  { id: "c1", title: "Google Gemini AI Professional Course", issuer: "Google Cloud Training", duration: "10 hours", level: "Advanced", desc: "Master generative AI, prompt engineering, and Gemini API integration.", url: "https://www.cloudskillsboost.google/paths/118" },
  { id: "c2", title: "Full Stack Web Architecture & React", issuer: "Meta Career Academy", duration: "15 hours", level: "Intermediate", desc: "Build enterprise scalable applications using React, TanStack, and Node.", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
  { id: "c3", title: "Cloud Native DevOps & Kubernetes", issuer: "CNCF Foundation", duration: "12 hours", level: "Advanced", desc: "Deploy containerized microservices and manage automated CI/CD pipelines.", url: "https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes" },
  { id: "c4", title: "Harvard CS50: Introduction to Computer Science", issuer: "HarvardX Free", duration: "20 hours", level: "Beginner", desc: "An entry-level course taught by David J. Malan CS50x teaches students how to think algorithmically and solve problems efficiently.", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science" },
  { id: "c5", title: "FreeCodeCamp Scientific Computing with Python", issuer: "freeCodeCamp", duration: "30 hours", level: "Intermediate", desc: "Learn Python fundamentals, data structures, algorithms, and OOP principles with interactive projects.", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }
];

function CertificationsPage() {
  const [myCerts, setMyCerts] = useState<any[]>(defaultCertifications);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("completed_courses") || "[]");
    if (saved.length > 0) {
      setMyCerts([...defaultCertifications, ...saved]);
      setCompletedCourseIds(saved.map((c: any) => c.courseId).filter(Boolean));
    }
  }, []);

  const handleCompleteCourse = async (course: any) => {
    if (completedCourseIds.includes(course.id)) return;

    const newCert = {
      id: Date.now(),
      courseId: course.id,
      name: course.title,
      issuer: course.issuer,
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      status: "verified",
      credentialId: "CERT-" + Math.floor(100000 + Math.random() * 900000)
    };

    const updatedSaved = [...JSON.parse(localStorage.getItem("completed_courses") || "[]"), newCert];
    localStorage.setItem("completed_courses", JSON.stringify(updatedSaved));

    setMyCerts([...defaultCertifications, ...updatedSaved]);
    setCompletedCourseIds([...completedCourseIds, course.id]);
    toast.success(`🎉 Completed "${course.title}"! Certification added.`);

    // Try updating user profile in backend if token exists
    try {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const userStr = localStorage.getItem("careercompass_user");
        const user = userStr ? JSON.parse(userStr) : {};
        const currentCerts = user.certifications ? user.certifications + ", " + course.title : course.title;
        user.certifications = currentCerts;
        localStorage.setItem("careercompass_user", JSON.stringify(user));

        await fetch("http://localhost:8081/api/users/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(user)
        });
      }
    } catch (e) {}
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl glass border border-border/80 bg-card/45 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 grid place-items-center shadow-soft shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-foreground">Certifications Hub</h1>
            <p className="text-sm text-muted-foreground">Manage and verify your credentials to boost your AI matching score.</p>
          </div>
        </div>
        <Button className="shrink-0 rounded-full gradient-bg text-white border-0 shadow-glow hover:scale-[1.02] transition-transform font-bold">
          <Sparkles className="mr-2 h-4 w-4" /> Upload Certificate
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 rounded-3xl border border-dashed border-primary/50 bg-primary/5 p-8 text-center flex flex-col items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer group shadow-soft"
        >
          <div className="h-16 w-16 rounded-full bg-primary/20 text-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg text-foreground mb-2">Verify New Credential</h3>
          <p className="text-xs text-muted-foreground mb-6 px-4">Upload a PDF or link a Credly badge. Aether will verify it and add +5% to your profile score.</p>
          <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/20 w-full">
            Connect Credly / Upload
          </Button>
        </motion.div>

        {/* Certifications List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <span>My Verified Credentials</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{myCerts.length}</span>
          </h2>
          {myCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl hover:border-primary/40 transition-colors shadow-card"
            >
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-card border border-border/80 shadow-soft text-2xl grid place-items-center">
                🏆
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-foreground truncate">{cert.name}</h3>
                  {cert.status === "verified" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground/80">
                  <span>Issued: {cert.date}</span>
                  <span>•</span>
                  <span>ID: {cert.credentialId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center mt-3 sm:mt-0">
                <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-full border-border/80 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Certification Courses Section */}
      <div className="pt-6 border-t border-border/40 space-y-4">
        <div>
          <h2 className="font-display text-xl font-black text-foreground flex items-center gap-2">
            <PlayCircle className="text-primary w-6 h-6" /> Recommended Certification Courses
          </h2>
          <p className="text-sm text-muted-foreground">Complete industry-recognized AI and engineering courses to instantly add verified credentials to your dashboard.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {availableCourses.map((course) => {
            const isDone = completedCourseIds.includes(course.id);
            return (
              <div key={course.id} className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl flex flex-col justify-between shadow-card hover:border-primary/40 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {course.level}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{course.duration}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1 leading-snug">{course.title}</h3>
                  <p className="text-xs text-primary font-medium mb-3">{course.issuer}</p>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{course.desc}</p>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto">
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center h-10 px-4 rounded-full border border-primary/40 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Start Free Course Link ↗
                  </a>
                  <Button
                    onClick={() => handleCompleteCourse(course)}
                    disabled={isDone}
                    className={`w-full rounded-full font-bold text-xs h-10 shadow-soft transition-all ${
                      isDone 
                        ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default" 
                        : "gradient-bg text-white hover:opacity-90"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Certified ✓
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-1.5" /> Mark Completed & Add Badge
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
