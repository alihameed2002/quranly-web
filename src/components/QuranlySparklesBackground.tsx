import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

interface QuranlySparklesBackgroundProps {
  children: React.ReactNode;
}

export const QuranlySparklesBackground: React.FC<QuranlySparklesBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative w-full bg-slate-950 overflow-hidden">
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="quranlySparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={0.8}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 