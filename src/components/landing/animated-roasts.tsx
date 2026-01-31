"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const ROASTS = [
  "This code has more bugs than a rainforest. Did you write this with your eyes closed?",
  "I've seen better error handling in a toddler's first HTML page.",
  "This function is so long, it needs its own zip code.",
  "Your variable names are so bad, even your IDE is confused.",
  "This code is like a horror movie - I'm scared to scroll down.",
  "Did you copy this from Stack Overflow with your monitor turned off?",
  "I've seen spaghetti more organized than this code structure.",
  "This null check is about as useful as a screen door on a submarine.",
  "Your indentation is giving me trust issues.",
  "This code doesn't just have technical debt, it has a mortgage.",
];

export function AnimatedRoasts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROASTS.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-32 flex items-center justify-center">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-background/80 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 max-w-2xl mx-4 shadow-lg shadow-orange-500/10">
          <div className="flex items-start gap-3">
            <Quote className="h-6 w-6 text-orange-500 shrink-0 mt-1" />
            <p className="text-lg md:text-xl italic text-foreground">
              &ldquo;{ROASTS[currentIndex]}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
