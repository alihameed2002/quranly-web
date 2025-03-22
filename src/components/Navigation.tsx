import { BookOpen, Search, Settings, BookText, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  
  const quranNavItems = [
    {
      name: "Reading",
      icon: BookOpen,
      path: "/quran/reading"
    },
    {
      name: "Explore",
      icon: Search,
      path: "/quran/explore"
    }
  ];
  
  const sunnahNavItems = [
    {
      name: "Reading",
      icon: BookText,
      path: "/sunnah/reading"
    },
    {
      name: "Explore",
      icon: Search,
      path: "/sunnah/explore"
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 glass-card border-t border-white/5 backdrop-blur-lg z-50">
      <div className="max-w-screen-md mx-auto h-full flex items-center justify-around">
        <div className="flex flex-col items-center">
          <span className="text-xs text-app-text-secondary mb-2">Quran</span>
          <div className="flex space-x-4">
            {quranNavItems.map((item) => {
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
        
        <div className="flex flex-col items-center">
          <span className="text-xs text-app-text-secondary mb-2">Sunnah</span>
          <div className="flex space-x-4">
            {sunnahNavItems.map((item) => {
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 px-3",
                    isActive ? "text-app-green" : "text-app-text-secondary"
                  )}
                >
                  <item.icon className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive && "text-app-green"
                  )} />
                  <span className={cn(
                    "text-xs transition-all duration-300",
                    isActive ? "text-app-green font-medium" : "text-app-text-secondary"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link
            to="/settings"
            className={cn(
              "flex flex-col items-center justify-center space-y-1 px-3",
              currentPath === "/settings" ? "text-app-purple" : "text-app-text-secondary"
            )}
          >
            <Settings className={cn(
              "h-6 w-6 transition-all duration-300",
              currentPath === "/settings" && "text-app-purple"
            )} />
            <span className={cn(
              "text-xs transition-all duration-300",
              currentPath === "/settings" ? "text-app-purple font-medium" : "text-app-text-secondary"
            )}>
              Settings
            </span>
          </Link>
          
          {user && (
            <Link
              to="/profile"
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3",
                currentPath === "/profile" ? "text-app-blue" : "text-app-text-secondary"
              )}
            >
              <User className={cn(
                "h-6 w-6 transition-all duration-300",
                currentPath === "/profile" && "text-app-blue"
              )} />
              <span className={cn(
                "text-xs transition-all duration-300",
                currentPath === "/profile" ? "text-app-blue font-medium" : "text-app-text-secondary"
              )}>
                Profile
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
