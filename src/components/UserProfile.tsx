
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  name: string;
  greeting: string;
  avatarInitials: string;
  className?: string;
  notifications?: number;
}

export default function UserProfile({
  name,
  greeting,
  avatarInitials,
  className,
  notifications = 0
}: UserProfileProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  const adjustedToday = today === 0 ? 6 : today - 1; // Convert to our array index (0 is Monday)
  
  return (
    <div className={cn("w-full px-6 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-app-green/30 flex items-center justify-center text-app-green text-xl font-medium">
            {avatarInitials}
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">{greeting},</h2>
            <p className="text-lg text-white">{name}</p>
          </div>
        </div>
        
        {notifications > 0 && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFA500" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-app-purple text-white text-xs flex items-center justify-center">
                {notifications}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Goal</h3>
          <button className="h-8 w-8 rounded-full flex items-center justify-center neo-blur hover:bg-white/10 transition-all duration-300">
            <Pencil className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-app-text-secondary">7 Al-Araf | 128/206</p>
          <div className="h-10 w-10 rounded-lg bg-app-green/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#4ED8B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <button className="w-full p-3 rounded-lg glass-card text-white font-medium hover:bg-white/10 transition-all duration-300">
          Read More
        </button>
      </div>
      
      <div className="flex items-center justify-between space-x-3">
        {days.map((day, i) => {
          const isToday = i === adjustedToday;
          const isActive = Math.random() > 0.5; // Randomly active for demo
          
          return (
            <div 
              key={`day-${i}`} 
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                isToday ? "bg-app-purple text-white" : "glass-card",
                isActive && !isToday && "border border-app-purple/50 text-app-purple"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
