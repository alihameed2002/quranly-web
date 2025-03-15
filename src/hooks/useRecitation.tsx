
import { useState, useEffect } from "react";

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
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // In a real app, we would construct the URL based on parameters
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseId}.mp3`;
  
  useEffect(() => {
    const audio = new Audio(audioUrl);
    setAudioElement(audio);
    
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
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.remove();
    };
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      setIsLoading(true);
      audioElement.play().then(() => {
        setIsLoading(false);
      }).catch(error => {
        console.error("Audio playback error:", error);
        setIsLoading(false);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const seekTo = (percent: number) => {
    if (!audioElement || !duration) return;
    
    const seekTime = (percent / 100) * duration;
    audioElement.currentTime = seekTime;
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
