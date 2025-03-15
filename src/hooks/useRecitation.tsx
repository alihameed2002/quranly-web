
import { useState, useEffect, useRef } from "react";

interface RecitationOptions {
  surahId?: number;
  verseId?: number;
  reciterId?: number;
}

export function useRecitation({ surahId = 1, verseId = 1, reciterId = 7 }: RecitationOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // In a real app, we would construct the URL based on parameters
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahId}:${verseId}.mp3`;
  
  useEffect(() => {
    // Clean up any existing audio element
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current.remove();
    }
    
    // Create new audio element
    const audio = new Audio();
    audioElementRef.current = audio;
    
    // Reset states
    setIsPlaying(false);
    setIsLoading(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    
    // Set the source
    audio.src = audioUrl;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });
    
    audio.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      setIsPlaying(false);
    });
    
    // Cleanup function
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      }
    };
  }, [audioUrl, surahId, verseId]);
  
  const togglePlay = () => {
    if (!audioElementRef.current) return;
    
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioElementRef.current.play().then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch(error => {
        console.error("Audio playback error:", error);
        setIsLoading(false);
      });
    }
  };
  
  const seekTo = (percent: number) => {
    if (!audioElementRef.current || !duration) return;
    
    const seekTime = (percent / 100) * duration;
    audioElementRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(percent);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return {
    isPlaying,
    isLoading,
    progress,
    duration,
    currentTime,
    togglePlay,
    seekTo,
    formatTime
  };
}
