import React, { useRef, useEffect } from 'react';

export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeTo = (targetOpacity: number, duration: number, onComplete?: () => void) => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
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
    <video
      ref={videoRef}
      src="/hero-bg.mp4"
      autoPlay
      muted
      playsInline
      className="fixed inset-0 w-screen h-screen object-cover translate-y-[17%] z-0"
      style={{ opacity: 0 }}
    />
  );
}
