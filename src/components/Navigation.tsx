
import { Home, BookOpen, Search, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      name: "Reading",
      icon: BookOpen,
      path: "/reading"
    },
    {
      name: "Explore",
      icon: Search,
      path: "/explore"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 glass-card border-t border-white/5 backdrop-blur-lg z-50">
      <div className="max-w-screen-md mx-auto h-full flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3",
                isActive ? "text-app-purple" : "text-app-text-secondary"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-all duration-300",
                isActive && "text-app-purple"
              )} />
              <span className={cn(
                "text-xs transition-all duration-300",
                isActive ? "text-app-purple font-medium" : "text-app-text-secondary"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
