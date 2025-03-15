
import { Volume2, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecitation } from "@/hooks/useRecitation";
import { useState } from "react";

interface AudioPlayerProps {
  surahId?: number;
  verseId?: number;
  className?: string;
  minimized?: boolean;
}

export default function AudioPlayer({
  surahId = 7,
  verseId = 128,
  className,
  minimized = false
}: AudioPlayerProps) {
  const { 
    isPlaying, 
    isLoading, 
    progress, 
    togglePlay, 
    seekTo,
    formatTime,
    currentTime,
    duration
  } = useRecitation({ surahId, verseId });
  
  const [volume, setVolume] = useState(80);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    seekTo(value);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };
  
  if (minimized) {
    return (
      <div className={cn("w-full glass-card rounded-lg p-3 flex items-center justify-between", className)}>
        <div className="flex items-center space-x-3">
          <Volume2 className="h-5 w-5 text-white" />
          <div>
            <p className="text-sm text-white">Currently playing</p>
            <p className="text-xs text-app-text-secondary">Surah Al-Araf - Verse 128</p>
          </div>
        </div>
        <button 
          onClick={togglePlay}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-app-green text-app-background-dark hover:bg-app-green-light transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full space-y-4 glass-card rounded-lg p-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Audio Recitation</h3>
        <p className="text-sm text-app-text-secondary">Sheikh Mishary Rashid Al-Afasy</p>
      </div>
      
      <div className="relative w-full h-1 bg-white/20 rounded-full">
        <div 
          className="absolute left-0 top-0 h-full bg-app-green rounded-full" 
          style={{ width: `${progress}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={handleSeek}
          className="absolute left-0 top-1/2 w-full h-5 -translate-y-1/2 appearance-none bg-transparent cursor-pointer opacity-0"
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-app-text-secondary">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-6">
        <button className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300">
          <SkipBack className="h-5 w-5 text-white" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="h-14 w-14 rounded-full flex items-center justify-center bg-app-green text-app-background-dark hover:bg-app-green-light transition-all duration-300"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-app-background-dark border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </button>
        
        <button className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300">
          <SkipForward className="h-5 w-5 text-white" />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <Volume2 className="h-4 w-4 text-app-text-secondary" />
        
        <div className="relative flex-1 h-1 bg-white/20 rounded-full">
          <div 
            className="absolute left-0 top-0 h-full bg-app-text-secondary rounded-full" 
            style={{ width: `${volume}%` }}
          />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={handleVolumeChange}
            className="absolute left-0 top-1/2 w-full h-5 -translate-y-1/2 appearance-none bg-transparent cursor-pointer opacity-0"
          />
        </div>
      </div>
    </div>
  );
}
