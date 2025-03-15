
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useProgress } from "@/hooks/useProgress";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { progress, getTimeSpentFormatted } = useProgress();
  
  // Format timeSpent for Header component
  const formattedTimeSpent = getTimeSpentFormatted();
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header
        totalPoints={progress.points / 1000}
        totalVerses={progress.totalVerses}
        timeSpent={formattedTimeSpent}
        showBack={false}
      />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="text-app-text-secondary">Customize your experience</p>
          </div>
        </div>
        
        <div className="px-6">
          <div className="glass-card rounded-xl p-4">
            <p className="text-center text-app-text-secondary">Settings will be implemented in a future update.</p>
          </div>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Settings;
