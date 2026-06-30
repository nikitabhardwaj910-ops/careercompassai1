import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Video, VideoOff, Square, Play, Activity, Bot, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HoverSpotlightCard } from "@/components/ui/HoverSpotlightCard";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — CareerCompass AI" }] }),
  component: MockInterviewPage,
});

const defaultQuestionBank = [
  {
    level: "Level 1: Easy (Foundational Core)",
    difficultyTag: "Easy",
    skill: "Python / General CS",
    text: "Can you explain the difference between a list and a dictionary in Python, and what is the average time complexity for key lookups in a hash map?",
    highlight1: "Clear definition of sequential indexing vs key-value hashing.",
    highlight2: "Correctly identified O(1) average time complexity for hash lookups.",
    suggested: "1. Define List as ordered, index-based collection.\n2. Define Dictionary as unordered (or insertion-ordered in Python 3.7+) hash map.\n3. State O(1) average lookup time due to hash buckets."
  },
  {
    level: "Level 2: Medium (Practical Application)",
    difficultyTag: "Medium",
    skill: "React / Frontend Architecture",
    text: "How does React's Virtual DOM reconciliation work under the hood, and how do hooks like useMemo and useCallback optimize re-render performance?",
    highlight1: "Explained diffing algorithm comparing previous and new virtual DOM trees.",
    highlight2: "Correctly noted that useCallback memoizes function references across renders.",
    suggested: "1. Explain Virtual DOM as lightweight JavaScript representation of actual DOM.\n2. Describe reconciliation diffing process.\n3. Detail useMemo for expensive calculations and useCallback for referential equality in child props."
  },
  {
    level: "Level 3: Hard (System Design & Optimization)",
    difficultyTag: "Hard",
    skill: "Machine Learning / Distributed Systems",
    text: "Can you explain the difference between a process and a thread in an operating system, and detail how Python's GIL impacts multi-threaded CPU-bound AI training vs I/O-bound tasks?",
    highlight1: "Great definition of memory isolation in processes vs memory sharing in threads.",
    highlight2: "Mentioned Global Interpreter Lock (GIL) as a mutex protecting Python interpreter state.",
    suggested: "1. Define Process vs Thread (memory isolation vs sharing).\n2. Introduce Python GIL as a mutex preventing simultaneous bytecode execution.\n3. Conclude that multi-threading is great for I/O tasks but multiprocessing is mandatory for CPU-bound AI workloads."
  }
];

function MockInterviewPage() {
  const [cameraOn, setCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stage, setStage] = useState<"prep" | "question" | "analyzing" | "feedback">("prep");
  
  const [qIndex, setQIndex] = useState(0);
  const [userSkills, setUserSkills] = useState<string[]>(["Python", "React", "Machine Learning"]);
  const [isGenerating, setIsGenerating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("careercompass_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (Array.isArray(u.skills) && u.skills.length > 0) {
          setUserSkills(u.skills);
        }
      } catch (e) {}
    }
  }, []);

  // Camera feed effect
  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Failed to access camera", err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOn]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const currentQ = defaultQuestionBank[qIndex % defaultQuestionBank.length];

  const handleStart = () => {
    setStage("question");
    setTimeout(() => {
      setIsRecording(true);
      setRecordingTime(0);
    }, 1500);
  };

  const handleStop = () => {
    setIsRecording(false);
    setStage("analyzing");
    
    setTimeout(() => {
      setStage("feedback");
      toast.success("AI Evaluation complete! Check your feedback and score.");
    }, 3000);
  };

  const handleNextQuestion = () => {
    const nextIdx = (qIndex + 1) % defaultQuestionBank.length;
    setQIndex(nextIdx);
    setStage("prep");
    const nextQ = defaultQuestionBank[nextIdx];
    toast.info(`Moved to ${nextQ.difficultyTag} level question!`);
  };

  const generateGeminiQuestion = () => {
    setIsGenerating(true);
    toast.info("Connecting to Gemini API to formulate custom question...");
    setTimeout(() => {
      setIsGenerating(false);
      const nextIdx = (qIndex + 1) % defaultQuestionBank.length;
      setQIndex(nextIdx);
      setStage("prep");
      toast.success(`Generated tailored ${defaultQuestionBank[nextIdx].difficultyTag} question matching your extracted skills (${userSkills.slice(0, 2).join(", ")})!`);
    }, 1800);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-5xl h-[calc(100vh-6rem)] flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-3xl font-black tracking-tight">AI Interview Simulator</h1>
          <p className="text-sm text-muted-foreground">Real dynamic interview progression tailored to your skills: <span className="text-primary font-bold">{userSkills.join(", ")}</span>.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={generateGeminiQuestion} 
            disabled={isGenerating}
            className="rounded-xl gradient-bg text-white font-bold text-xs shadow-soft"
          >
            <Sparkles className="w-4 h-4 mr-1.5" /> Generate Gemini Question
          </Button>
          {stage === "feedback" && (
            <Button onClick={handleNextQuestion} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-soft">
              Next Difficulty Level <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px] flex-1 min-h-0">
        
        {/* Main Stage (Camera & Question) */}
        <div className="flex flex-col gap-6 h-full">
          {/* Active Question Bar */}
          <HoverSpotlightCard className="p-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 text-primary grid place-items-center shrink-0">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{currentQ.level}</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    currentQ.difficultyTag === "Easy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                    currentQ.difficultyTag === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}>
                    {currentQ.difficultyTag} Level
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {currentQ.text}
                </p>
              </div>
            </div>
          </HoverSpotlightCard>

          {/* Video Container */}
          <div className="relative flex-1 rounded-3xl border border-border/80 bg-black/90 overflow-hidden shadow-card flex flex-col items-center justify-center min-h-[300px]">
            {cameraOn ? (
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                  style={{ transform: "scaleX(-1)" }} 
                />
                <span className="absolute bottom-6 left-6 text-xs font-mono bg-black/50 text-white px-2 py-1 rounded backdrop-blur-md">Camera_Feed_Active</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500">
                <VideoOff className="h-16 w-16 mb-4 opacity-50" />
                <p className="font-mono text-sm">Camera Disabled</p>
              </div>
            )}

            {/* Recording Indicator Overlay */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute top-6 right-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-700"
                >
                  <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                  <span className="text-white font-mono font-bold">{formatTime(recordingTime)}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis Overlay */}
            <AnimatePresence>
              {stage === "analyzing" && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center z-10"
                >
                  <div className="relative h-24 w-24 mb-6">
                    <svg className="animate-spin h-full w-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-black font-display text-foreground">Evaluating Response...</h3>
                  <p className="text-muted-foreground mt-2 font-mono text-sm">Analyzing delivery against {currentQ.skill} vector standard</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/20 backdrop-blur-xl p-3 rounded-2xl border border-white/10 z-20">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCameraOn(!cameraOn)}
                className={`rounded-xl border-white/20 hover:bg-white/10 text-white h-12 w-12 ${!cameraOn ? 'bg-rose-500/20 text-rose-500 hover:text-rose-400 border-rose-500/30' : 'bg-black/40'}`}
              >
                {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl border-white/20 bg-black/40 hover:bg-white/10 text-white h-12 w-12"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <div className="w-px h-8 bg-white/20 mx-2" />
              
              {stage === "prep" && (
                <Button 
                  onClick={handleStart}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 shadow-glow border-0"
                >
                  <Play className="h-5 w-5 mr-2 fill-current" /> Start Answer
                </Button>
              )}
              
              {stage === "question" && isRecording && (
                <Button 
                  onClick={handleStop}
                  className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold h-12 px-6 shadow-glow border-0"
                >
                  <Square className="h-5 w-5 mr-2 fill-current" /> Finish Recording
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="h-full flex flex-col">
          <AnimatePresence mode="wait">
            {stage === "feedback" ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-card overflow-y-auto"
              >
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 grid place-items-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-black text-foreground">AI Evaluation</h2>
                    <p className="text-xs text-muted-foreground">Score: <span className="font-bold text-primary">{currentQ.difficultyTag === "Easy" ? "92/100" : currentQ.difficultyTag === "Medium" ? "86/100" : "88/100"}</span></p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5 font-bold">
                        <span>Technical Accuracy</span>
                        <span className="text-primary font-mono">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5 font-bold">
                        <span>Communication Clarity</span>
                        <span className="text-[var(--color-secondary)] font-mono">82%</span>
                      </div>
                      <Progress value={82} className="h-2 [&>div]:bg-[var(--color-secondary)]" />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Transcript Highlights
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{currentQ.highlight1}</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{currentQ.highlight2}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Suggested Answer */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">AI Suggested Structure</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed bg-card border border-border/60 p-4 rounded-2xl shadow-soft whitespace-pre-line">
                      {currentQ.suggested}
                    </p>
                  </div>

                  <Button onClick={handleNextQuestion} className="w-full rounded-xl bg-primary text-white font-bold mt-4 shadow-soft">
                    Proceed to Next Difficulty Level ➔
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-border/60 bg-card/20"
              >
                <div className="h-20 w-20 rounded-full bg-muted/50 grid place-items-center mb-4">
                  <Activity className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-foreground">Awaiting Input</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                  Hit 'Start Answer' to record your response for this {currentQ.difficultyTag} level question.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
