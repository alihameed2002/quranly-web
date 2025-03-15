
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Settings as SettingsIcon, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginButton from "@/components/LoginButton";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
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
        
        <div className="px-6 space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-white">Account</h3>
            </div>
            
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium">{user.displayName || "User"}</h4>
                    <p className="text-app-text-secondary text-sm">{user.email}</p>
                  </div>
                </div>
                <LoginButton variant="outline" className="w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-app-text-secondary">Sign in to save your reading progress.</p>
                <LoginButton className="w-full" />
              </div>
            )}
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <p className="text-center text-app-text-secondary">More settings will be implemented in a future update.</p>
          </div>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Settings;
