
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showBack?: boolean;
  className?: string;
  totalPoints?: number;
  totalVerses?: number;
  timeSpent?: string;
}

export default function Header({ 
  showBack = true, 
  className,
  totalPoints = 457.1,
  totalVerses = 75,
  timeSpent = "17:34"
}: HeaderProps) {
  return (
    <header className={cn("w-full px-5 py-4 flex items-center justify-between", className)}>
      {showBack ? (
        <Link 
          to="/" 
          className="h-12 w-12 rounded-full flex items-center justify-center glass-card transition-all duration-300 hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Link>
      ) : (
        <div className="w-12"></div> 
      )}
      
      <div className="flex items-center gap-4 px-6 py-3 rounded-full glass-card">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center">
            <span className="sr-only">Points</span>
          </div>
          <span className="text-white font-medium">{totalPoints}K</span>
        </div>
        
        <div className="w-px h-5 bg-white/20"></div>
        
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
            <span className="sr-only">Verses</span>
          </div>
          <span className="text-white font-medium">{totalVerses}</span>
        </div>
        
        <div className="w-px h-5 bg-white/20"></div>
        
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
            <span className="sr-only">Time</span>
          </div>
          <span className="text-white font-medium">{timeSpent}</span>
        </div>
      </div>
      
      <Link 
        to="/settings" 
        className="h-12 w-12 rounded-full flex items-center justify-center glass-card transition-all duration-300 hover:bg-white/10 active:scale-95"
      >
        <Settings className="h-5 w-5 text-white" />
      </Link>
    </header>
  );
}
