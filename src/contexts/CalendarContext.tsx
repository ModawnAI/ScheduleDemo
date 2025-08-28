"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DailySchedule, JobTicket, WeatherForecast } from '@/types';
import { mockDailySchedules, getJobsByDate, getWeatherByDate } from '@/data/mockData';

// Context state interface following established TypeScript patterns
interface CalendarContextState {
  selectedDate: string | null;
  selectedCrew: string | null;
  viewMode: 'yearly' | 'monthly' | 'daily';
  currentMonth: string;
  currentYear: number;
  isLoading: boolean;
  error: string | null;
}

// Context actions interface
interface CalendarContextActions {
  setSelectedDate: (date: string | null) => void;
  setSelectedCrew: (crewId: string | null) => void;
  setViewMode: (mode: 'yearly' | 'monthly' | 'daily') => void;
  setCurrentMonth: (month: string) => void;
  setCurrentYear: (year: number) => void;
  getDailySchedule: (date: string) => Promise<DailySchedule | null>;
  getJobsForDate: (date: string) => JobTicket[];
  getWeatherForDate: (date: string) => WeatherForecast | null;
  navigateToDate: (date: string) => void;
  clearError: () => void;
}

// Combined context interface
interface CalendarContextValue extends CalendarContextState, CalendarContextActions {}

// Create context with proper TypeScript typing
const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

// Context provider props
interface CalendarProviderProps {
  children: ReactNode;
}

// Context provider component following established patterns
export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  // State management with proper TypeScript typing
  const [state, setState] = useState<CalendarContextState>({
    selectedDate: null,
    selectedCrew: null,
    viewMode: 'monthly',
    currentMonth: new Date().toLocaleDateString('en-US', { month: 'long' }),
    currentYear: new Date().getFullYear(),
    isLoading: false,
    error: null
  });

  // Action implementations with proper error handling
  const setSelectedDate = useCallback((date: string | null) => {
    setState(prev => ({ ...prev, selectedDate: date, error: null }));
  }, []);

  const setSelectedCrew = useCallback((crewId: string | null) => {
    setState(prev => ({ ...prev, selectedCrew: crewId, error: null }));
  }, []);

  const setViewMode = useCallback((mode: 'yearly' | 'monthly' | 'daily') => {
    setState(prev => ({ ...prev, viewMode: mode, error: null }));
  }, []);

  const setCurrentMonth = useCallback((month: string) => {
    setState(prev => ({ ...prev, currentMonth: month, error: null }));
  }, []);

  const setCurrentYear = useCallback((year: number) => {
    setState(prev => ({ ...prev, currentYear: year, error: null }));
  }, []);

  // getDailySchedule with loading states using chart color variables
  const getDailySchedule = useCallback(async (date: string): Promise<DailySchedule | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const schedule = mockDailySchedules.find(s => s.date === date);
      
      if (!schedule) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: `No schedule found for ${date}` 
        }));
        return null;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return schedule;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load schedule' 
      }));
      return null;
    }
  }, []);

  // Helper functions for data access
  const getJobsForDate = useCallback((date: string): JobTicket[] => {
    try {
      return getJobsByDate(date);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load jobs' 
      }));
      return [];
    }
  }, []);

  const getWeatherForDate = useCallback((date: string): WeatherForecast | null => {
    try {
      return getWeatherByDate(date) || null;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load weather' 
      }));
      return null;
    }
  }, []);

  // Navigation helper with automatic view mode switching
  const navigateToDate = useCallback((date: string) => {
    setSelectedDate(date);
    setViewMode('daily');
    
    // Update current month and year based on selected date
    const dateObj = new Date(date);
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    
    setCurrentMonth(month);
    setCurrentYear(year);
  }, [setSelectedDate, setViewMode, setCurrentMonth, setCurrentYear]);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Context value with all state and actions
  const contextValue: CalendarContextValue = {
    // State
    ...state,
    // Actions
    setSelectedDate,
    setSelectedCrew,
    setViewMode,
    setCurrentMonth,
    setCurrentYear,
    getDailySchedule,
    getJobsForDate,
    getWeatherForDate,
    navigateToDate,
    clearError
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using the calendar context with proper error handling
export const useCalendar = (): CalendarContextValue => {
  const context = useContext(CalendarContext);
  
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  
  return context;
};

// Loading component with chart color variables
export const CalendarLoading: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 bg-chart-1 rounded-full animate-pulse" />
      <div className="w-4 h-4 bg-chart-2 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-4 h-4 bg-chart-3 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      <span className="text-muted-foreground ml-2">Loading schedule...</span>
    </div>
  </div>
);

// Error component with proper contrast ratios
export const CalendarError: React.FC<{ 
  error: string; 
  onRetry?: () => void; 
  className?: string; 
}> = ({ error, onRetry, className = "" }) => (
  <div className={`flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-lg ${className}`}>
    <p className="text-destructive text-sm font-medium mb-2">Error loading calendar data</p>
    <p className="text-muted-foreground text-xs mb-4">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-xs font-medium hover:bg-destructive/90 transition-colors duration-200"
      >
        Try Again
      </button>
    )}
  </div>
);

export default CalendarContext;
