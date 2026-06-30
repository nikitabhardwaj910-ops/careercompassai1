import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Maximize2, Minimize2, Send, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function AetherChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Welcome to Aether Copilot! I'm here to help you navigate your career journey." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim() || isTyping) return;
    
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let response = "I've analyzed your profile against current market trends. Consider focusing on backend technologies to improve your match rate for your saved jobs.";
      
      if (text.toLowerCase().includes("python")) {
        response = "Based on your criteria, completing an API development project in Python (like FastAPI) will boost your match score significantly!";
      } else if (text.toLowerCase().includes("interview")) {
        response = "I can help you prepare! Navigate to the 'Mock Interview' tab to start a simulated session based on your target roles.";
      }

      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full gradient-bg shadow-glow hover:scale-110 transition-transform p-0 grid place-items-center"
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-card overflow-hidden transition-all duration-300 ${
              isExpanded ? "w-[800px] h-[80vh] max-h-[800px]" : "w-[380px] h-[550px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary grid place-items-center relative">
                  <Bot className="h-5 w-5" />
                  <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-display font-black text-foreground leading-none">Aether Advisor</h3>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-white rounded-br-sm" 
                      : "bg-muted/50 border border-border/70 text-foreground rounded-bl-sm shadow-soft"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-muted/50 border border-border/70 rounded-2xl rounded-bl-sm px-4 py-3 shadow-soft flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (only when not expanded and no typing) */}
            {!isExpanded && !isTyping && messages.length < 3 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => handleSend("Analyze my gap for ML Engineer")}
                  className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> ML Engineer gap
                </button>
                <button 
                  onClick={() => handleSend("Optimize my Python score")}
                  className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> Optimize Python
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-muted/10 border-t border-border/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Aether anything..."
                  className="w-full rounded-full bg-card border border-border/80 pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-soft"
                />
                <Button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon" 
                  className="absolute right-1.5 h-9 w-9 rounded-full gradient-bg border-0 text-white shadow-glow disabled:opacity-50 transition-transform hover:scale-105"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">Aether AI uses conversational vectors</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
