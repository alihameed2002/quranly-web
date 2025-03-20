import { useState, useEffect } from "react";

interface UserProgress {
  totalVerses: number;
  currentStreak: number;
  timeSpent: number; // In seconds
  lastReadDate: Date | null;
  completedSurahs: number[];
  completedVerses: { [surahId: number]: number[] };
  dailyGoal: number; // Number of verses to read per day
  dailyProgress: number; // Number of verses read today
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({
    totalVerses: 75,
    currentStreak: 7,
    timeSpent: 1054, // 17 minutes and 34 seconds
    lastReadDate: new Date(),
    completedSurahs: [],
    completedVerses: {},
    dailyGoal: 10,
    dailyProgress: 6
  });
  
  const formatTimeSpent = () => {
    const minutes = Math.floor(progress.timeSpent / 60);
    const seconds = progress.timeSpent % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const markVerseAsRead = (surahId: number, verseId: number) => {
    setProgress(prev => {
      // Create a copy of the completed verses
      const completedVerses = { ...prev.completedVerses };
      
      // Initialize array for this surah if it doesn't exist
      if (!completedVerses[surahId]) {
        completedVerses[surahId] = [];
      }
      
      // Add verse to completed if not already there
      if (!completedVerses[surahId].includes(verseId)) {
        completedVerses[surahId] = [...completedVerses[surahId], verseId];
      }
      
      // Update progress
      return {
        ...prev,
        totalVerses: prev.totalVerses + 1,
        timeSpent: prev.timeSpent + 15, // Add 15 seconds per verse read
        lastReadDate: new Date(),
        completedVerses,
        dailyProgress: prev.dailyProgress + 1
      };
    });
  };
  
  const calculateStreak = () => {
    // In a real app, we would calculate the streak based on the user's reading history
    // For demo purposes, we'll just return the current streak
    return progress.currentStreak;
  };
  
  const resetDailyProgress = () => {
    setProgress(prev => ({
      ...prev,
      dailyProgress: 0
    }));
  };
  
  const getDailyGoalProgress = () => {
    return Math.min((progress.dailyProgress / progress.dailyGoal) * 100, 100);
  };
  
  const getTimeSpentFormatted = () => {
    const hours = Math.floor(progress.timeSpent / 3600);
    const minutes = Math.floor((progress.timeSpent % 3600) / 60);
    const seconds = progress.timeSpent % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return {
    progress,
    formatTimeSpent,
    markVerseAsRead,
    calculateStreak,
    resetDailyProgress,
    getDailyGoalProgress,
    getTimeSpentFormatted
  };
}
