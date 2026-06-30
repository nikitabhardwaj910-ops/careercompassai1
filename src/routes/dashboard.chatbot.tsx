import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/chatbot")({
  component: ChatbotPage,
});

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: `Hi ${user?.fullName?.split(" ")[0] || "there"}! I'm Aether, your CareerCompass AI Copilot. I can help you with career advice, resume reviews, interview prep, and job searching. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      
      // Prepare history format for Gemini
      const history = messages.filter(m => m.id !== "welcome").map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("http://localhost:8081/api/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: history
        })
      });

      if (!res.ok) throw new Error("Failed to get response");
      
      const data = await res.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.reply || "I'm sorry, I couldn't process that request right now."
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "Sorry, I encountered an error connecting to the AI brain. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: `Hi ${user?.fullName?.split(" ")[0] || "there"}! I'm Aether, your CareerCompass AI Copilot. I can help you with career advice, resume reviews, interview prep, and job searching. How can I help you today?`
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-card/30 rounded-3xl border border-border/50 shadow-soft overflow-hidden backdrop-blur-sm relative">
      {/* Chat Header */}
      <div className="h-16 border-b border-border/40 bg-card/50 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background"></span>
            </span>
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">Aether AI Copilot</h2>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Powered by Gemini</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-foreground h-8 gap-2">
          <RefreshCcw className="w-3.5 h-3.5" /> Reset Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar relative z-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                msg.role === "user" 
                  ? "gradient-bg text-white shadow-glow" 
                  : "bg-card border border-border/50 text-primary shadow-soft"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border/50 text-foreground rounded-tl-sm shadow-soft"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 flex-row"
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-card border border-border/50 text-primary shadow-soft flex items-center justify-center mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card border border-border/50 p-4 shadow-soft flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium animate-pulse">Aether is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/30 border-t border-border/40 backdrop-blur-md z-10 shrink-0">
        <form 
          onSubmit={handleSend}
          className="relative max-w-4xl mx-auto flex items-end gap-2 bg-background/50 border border-border/50 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-soft"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Aether about your career, resume, or upcoming interviews..."
            className="w-full max-h-32 min-h-[44px] bg-transparent border-0 resize-none px-3 py-3 text-sm focus:outline-none focus:ring-0 custom-scrollbar"
            rows={1}
            style={{ height: "44px" }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 shrink-0 rounded-xl gradient-bg text-white shadow-glow hover:opacity-90 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-muted-foreground font-medium">
            AI can make mistakes. Verify important career advice.
          </p>
        </div>
      </div>
    </div>
  );
}
