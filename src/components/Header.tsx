import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showBack?: boolean;
  className?: string;
  totalVerses?: number;
  timeSpent?: string;
}

export default function Header({ 
  showBack = true, 
  className,
  totalVerses,
  timeSpent
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
      
      <div className="flex items-center space-x-2">
        <img src="/images/rushd-logo.png" alt="Rushd Logo" className="h-8 w-auto" />
        <h1 className="text-xl font-medium text-white">Rushd</h1>
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
