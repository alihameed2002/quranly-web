import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import OfflinePrefetcher from "@/components/OfflinePrefetcher";
import { Settings as SettingsIcon, Download, Moon, Bell, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
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
        
        <div className="px-6 space-y-4">
          {/* Offline Data Section */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-app-green" />
                <CardTitle className="text-white">Offline Access</CardTitle>
              </div>
              <CardDescription>Download data for offline use</CardDescription>
            </CardHeader>
            <CardContent>
              <OfflinePrefetcher />
            </CardContent>
          </Card>
          
          {/* Appearance Settings */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Appearance</CardTitle>
              </div>
              <CardDescription>Customize the app's appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Dark Mode</Label>
                  <p className="text-xs text-app-text-secondary">Use dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Daily Reminders</Label>
                  <p className="text-xs text-app-text-secondary">Receive daily reminders</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          {/* Language */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Language</CardTitle>
              </div>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-app-text-secondary">Language settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Settings;
