
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStatsProps {
  currentJuz?: number;
  versesLeft?: number;
  className?: string;
  goalProgress?: number;
  goalCompleted?: boolean;
}

export default function ProgressStats({
  currentJuz = 9,
  versesLeft = 119,
  className,
  goalProgress = 65,
  goalCompleted = false
}: ProgressStatsProps) {
  // Get current progress time in format 00:00 (hours:minutes)
  const timeDigits = "02:26".split("").map((digit, i) => (
    <div 
      key={i} 
      className={cn(
        "w-20 h-24 rounded-lg glass-card flex items-center justify-center text-5xl font-semibold text-white",
        i === 2 && "w-5 bg-transparent text-app-green" // Colon element
      )}
    >
      {digit}
    </div>
  ));

  return (
    <div className={cn("w-full space-y-4 px-6", className)}>
      <div className="flex items-center justify-center space-x-2 animate-fade-in">
        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <div className="h-12 w-12 rounded-md bg-gradient-to-br from-app-purple to-indigo-600 transform rotate-45"></div>
        </div>
        {timeDigits}
      </div>
      
      <div className="w-full rounded-full glass-card p-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center">
          <div className="py-2 px-3 bg-app-green/20 rounded-lg text-xl font-medium text-app-green">
            Goal
          </div>
          <div className="ml-3 text-app-text-primary font-medium">
            +{goalProgress}
          </div>
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300",
          goalCompleted ? "bg-app-green" : "glass-card"
        )}>
          <Check className={cn(
            "h-5 w-5 transition-all duration-300",
            goalCompleted ? "text-app-background-dark" : "text-app-green"
          )} />
        </div>
      </div>
      
      <div className="text-center text-xl font-medium text-app-text-secondary animate-fade-in">
        Juz {currentJuz} : {versesLeft} Verses left
      </div>
    </div>
  );
}
