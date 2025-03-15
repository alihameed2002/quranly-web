
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showBack?: boolean;
  className?: string;
}

export default function Header({ 
  showBack = true, 
  className
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
      
      <h1 className="text-xl font-medium text-white">Quran App</h1>
      
      <Link 
        to="/settings" 
        className="h-12 w-12 rounded-full flex items-center justify-center glass-card transition-all duration-300 hover:bg-white/10 active:scale-95"
      >
        <Settings className="h-5 w-5 text-white" />
      </Link>
    </header>
  );
}
