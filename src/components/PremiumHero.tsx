import React, { useRef, useEffect } from 'react';
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react';

export function PremiumHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fade helper function
    const fadeTo = (targetOpacity: number, duration: number, onComplete?: () => void) => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Linear fade
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        video.style.opacity = currentOpacity.toString();
        
        if (progress < 1) {
          fadeFrameRef.current = requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      };
      
      fadeFrameRef.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      // Fade in on load
      video.style.opacity = '0';
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      
      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(console.error);
        fadingOutRef.current = false;
        fadeTo(1, 500);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Trigger initial fade in if already loaded
    if (video.readyState >= 3) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] z-0"
        style={{ opacity: 0 }}
      />
      
      {/* Navigation Bar */}
      <nav className="relative z-20 pl-6 pr-6 py-6">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Asme</span>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</a>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="text-white text-sm font-medium">Sign Up</button>
            <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>
        
        <div className="max-w-xl w-full space-y-4">
          {/* Email Input Bar */}
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base"
            />
            <button className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>
          
          <div className="pt-2">
            <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Read Manifesto
            </button>
          </div>
        </div>
      </main>

      {/* Social Icons Footer */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12 mt-auto">
        <button aria-label="Instagram" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram className="w-5 h-5" />
        </button>
        <button aria-label="Twitter" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter className="w-5 h-5" />
        </button>
        <button aria-label="Globe" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
