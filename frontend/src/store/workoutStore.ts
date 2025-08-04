import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customStorage } from './persistence';
import { 
  workoutScheduleData, 
  getCurrentWeekIndex,
  WeeklyWorkout,
  WeekData,
  WorkoutStatus,
  generateAdditionalWeeks,
  userDataLookup
} from '../data/workoutSchedule';

interface WorkoutStore {
  // Core data
  allWeeksData: WeekData[];
  currentWeekIndexOffset: number;
  viewingWeekIndex: number;
  selectedDate: string | null;
  cardStartIndex: number;
  visibleCardsCount: number;
  
  // Computed values
  currentWeekIndex: number;
  viewingWeekData: WeekData | null;
  workouts: WeeklyWorkout[];
  isViewingCurrentWeek: boolean;
  todayIndex: number;
  selectedWorkoutIndex: number;
  todayDateKey: string;
  
  // Actions
  setAllWeeksData: (data: WeekData[]) => void;
  setCurrentWeekIndexOffset: (offset: number) => void;
  setViewingWeekIndex: (index: number) => void;
  setSelectedDate: (date: string | null) => void;
  
  // Navigation actions
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goBackToToday: () => void;
  updateVisibleCardsCount: () => void;
  getVisibleWorkouts: () => WeeklyWorkout[];
  
  // Workout actions
  selectWorkout: (workout: WeeklyWorkout) => void;
  updateWorkoutStatus: (workoutId: string, status: WorkoutStatus) => void;
  
  // Utility functions
  getDateKey: (workout: WeeklyWorkout) => string;
  getTodayDateKey: () => string;
  getResponsiveWeekRanges: () => {
    mobile: string;
    medium: string;
    large: string;
    xl: string;
    full: string;
  };
  
  // Initialize store
  initialize: () => void;
  
  // Helper functions
  updateComputedValues: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      allWeeksData: [],
      currentWeekIndexOffset: 0,
      viewingWeekIndex: 0,
      selectedDate: null,
      cardStartIndex: 0,
      visibleCardsCount: 3,
      
      // Computed values (will be updated by actions)
      currentWeekIndex: 0,
      viewingWeekData: null,
      workouts: [],
      isViewingCurrentWeek: false,
      todayIndex: -1,
      selectedWorkoutIndex: 0,
      todayDateKey: '',
      
      // Utility functions
      getDateKey: (workout: WeeklyWorkout) => {
        return `${workout.year}-${workout.month}-${workout.date}`;
      },
      
      getTodayDateKey: () => {
        const today = new Date(); // July 31st, 2025
        const month = today.toLocaleDateString('en-US', { month: 'long' });
        return `${today.getFullYear()}-${month}-${today.getDate()}`;
      },
      
      getResponsiveWeekRanges: () => {
        const { viewingWeekData } = get();
        const visibleWorkouts = get().getVisibleWorkouts();
        
        if (!viewingWeekData || visibleWorkouts.length === 0) return {
          mobile: '',
          medium: '',
          large: '',
          xl: '',
          full: ''
        };
        
        const firstDay = visibleWorkouts[0];
        const lastDay = visibleWorkouts[visibleWorkouts.length - 1];
        const dateRange = `${firstDay.month} ${firstDay.date} - ${lastDay.date}`;
        
        return {
          mobile: dateRange,
          medium: dateRange,
          large: dateRange,
          xl: dateRange,
          full: dateRange
        };
      },
      
      // Core actions
      setAllWeeksData: (data) => {
        set({ allWeeksData: data });
        get().updateComputedValues();
      },
      
      setCurrentWeekIndexOffset: (offset) => {
        set({ currentWeekIndexOffset: offset });
        get().updateComputedValues();
      },
      
      setViewingWeekIndex: (index) => {
        set({ viewingWeekIndex: index });
        get().updateComputedValues();
      },
      
      setSelectedDate: (date) => {
        set({ selectedDate: date });
        get().updateComputedValues();
      },
      
      // Navigation actions
      goToPreviousWeek: () => {
        const { cardStartIndex, visibleCardsCount, workouts, viewingWeekIndex, allWeeksData } = get();
        
        // Try to navigate within current week first
        const newStartIndex = cardStartIndex - visibleCardsCount;
        if (newStartIndex >= 0) {
          set({ cardStartIndex: newStartIndex });
        } else {
          // Need to go to previous week
          if (viewingWeekIndex > 0) {
            get().setViewingWeekIndex(viewingWeekIndex - 1);
            get().updateComputedValues(); // Update workouts for new week
            
            // Position at the end of the previous week to show the last visibleCardsCount days
            const newWorkouts = get().workouts;
            const endStartIndex = Math.max(0, newWorkouts.length - visibleCardsCount);
            set({ cardStartIndex: endStartIndex });
          } else {
            // Generate more past weeks
            const firstWeekStart = allWeeksData[0].startDate;
            const additionalWeeks = generateAdditionalWeeks(firstWeekStart, 'past', 4, userDataLookup);
            
            set({ 
              allWeeksData: [...additionalWeeks, ...allWeeksData],
              viewingWeekIndex: 3,
              cardStartIndex: 0
            });
            get().updateComputedValues();
          }
        }
      },
      
      goToNextWeek: () => {
        const { cardStartIndex, visibleCardsCount, workouts, viewingWeekIndex, allWeeksData } = get();
        
        // Try to navigate within current week first
        const newStartIndex = cardStartIndex + visibleCardsCount;
        if (newStartIndex + visibleCardsCount <= workouts.length) {
          set({ cardStartIndex: newStartIndex });
        } else {
          // Need to go to next week
          if (viewingWeekIndex < allWeeksData.length - 1) {
            get().setViewingWeekIndex(viewingWeekIndex + 1);
            set({ cardStartIndex: 0 });
            get().updateComputedValues();
          } else {
            // Generate more future weeks
            const lastWeekStart = allWeeksData[allWeeksData.length - 1].startDate;
            const additionalWeeks = generateAdditionalWeeks(lastWeekStart, 'future', 4, userDataLookup);
            
            set({ 
              allWeeksData: [...allWeeksData, ...additionalWeeks],
              viewingWeekIndex: viewingWeekIndex + 1,
              cardStartIndex: 0
            });
            get().updateComputedValues();
          }
        }
      },
      
      goBackToToday: () => {
        const { currentWeekIndex, getTodayDateKey, todayIndex, visibleCardsCount } = get();
        get().setViewingWeekIndex(currentWeekIndex);
        get().setSelectedDate(getTodayDateKey());
        // Set cardStartIndex to show today's workout
        if (todayIndex >= 0) {
          const startIndex = Math.max(0, Math.floor(todayIndex / visibleCardsCount) * visibleCardsCount);
          set({ cardStartIndex: startIndex });
        } else {
          set({ cardStartIndex: 0 });
        }
      },
      
      // Workout actions
      selectWorkout: (workout) => {
        const { getDateKey } = get();
        get().setSelectedDate(getDateKey(workout));
      },
      
      updateWorkoutStatus: (workoutId, status) => {
        const { allWeeksData, getDateKey } = get();
        const updatedData = allWeeksData.map(week => ({
          ...week,
          workouts: week.workouts.map(workout => 
            getDateKey(workout) === workoutId 
              ? { ...workout, status }
              : workout
          )
        }));
        get().setAllWeeksData(updatedData);
      },
      
      updateVisibleCardsCount: () => {
        if (typeof window === 'undefined') return;
        
        const width = window.innerWidth;
        let count = 3; // Default mobile
        
        if (width >= 1024) {
          count = 7; // Desktop
        } else if (width >= 768) {
          count = 5; // Tablet
        }
        
        const { visibleCardsCount, cardStartIndex, workouts } = get();
        if (count !== visibleCardsCount) {
          // Adjust cardStartIndex to maintain similar view but don't go beyond bounds
          const newStartIndex = Math.max(0, Math.min(
            Math.floor(cardStartIndex / visibleCardsCount) * count,
            workouts.length - count
          ));
          set({ 
            visibleCardsCount: count,
            cardStartIndex: newStartIndex >= 0 ? newStartIndex : 0
          });
        }
      },
      
      getVisibleWorkouts: () => {
        const { workouts, cardStartIndex, visibleCardsCount } = get();
        
        // Always ensure we show the exact number of cards expected
        const availableWorkouts = workouts.slice(cardStartIndex, cardStartIndex + visibleCardsCount);
        
        // If we don't have enough workouts, adjust the start index to fill all cards
        if (availableWorkouts.length < visibleCardsCount && workouts.length >= visibleCardsCount) {
          const adjustedStartIndex = Math.max(0, workouts.length - visibleCardsCount);
          return workouts.slice(adjustedStartIndex, adjustedStartIndex + visibleCardsCount);
        }
        
        return availableWorkouts;
      },
      
      // Initialize the store
      initialize: () => {
        // Use the workout schedule data (June 8 - August 19)
        const currentWeekIndex = getCurrentWeekIndex(workoutScheduleData);
        
        set({
          allWeeksData: workoutScheduleData,
          currentWeekIndexOffset: 0,
          viewingWeekIndex: currentWeekIndex,
          currentWeekIndex,
          todayDateKey: get().getTodayDateKey(),
          cardStartIndex: 0
        });
        
        get().updateVisibleCardsCount();
        get().updateComputedValues();
        
        // Initialize selected date
        const { workouts, isViewingCurrentWeek, todayIndex } = get();
        if (workouts.length > 0) {
          if (isViewingCurrentWeek && todayIndex >= 0) {
            get().setSelectedDate(get().getDateKey(workouts[todayIndex]));
          } else {
            const firstWorkoutIndex = workouts.findIndex(w => w.workoutType !== 'rest');
            const targetIndex = firstWorkoutIndex >= 0 ? firstWorkoutIndex : 0;
            get().setSelectedDate(get().getDateKey(workouts[targetIndex]));
          }
        }
      },
      
      // Add the missing updateComputedValues function to the interface
      updateComputedValues: () => {
        const { 
          allWeeksData, 
          viewingWeekIndex, 
          currentWeekIndexOffset, 
          selectedDate,
          getDateKey,
          getTodayDateKey
        } = get();
        
        const currentWeekIndex = getCurrentWeekIndex(allWeeksData) + currentWeekIndexOffset;
        const viewingWeekData = allWeeksData[viewingWeekIndex] || null;
        const workouts = viewingWeekData?.workouts || [];
        const isViewingCurrentWeek = viewingWeekIndex === currentWeekIndex;
        const todayDateKey = getTodayDateKey();
        
        // Calculate today's index
        const todayIndex = workouts.findIndex(workout => getDateKey(workout) === todayDateKey);
        const finalTodayIndex = todayIndex >= 0 ? todayIndex : -1;
        
        // Calculate selected workout index
        let selectedWorkoutIndex = 0;
        if (selectedDate) {
          const index = workouts.findIndex(workout => getDateKey(workout) === selectedDate);
          selectedWorkoutIndex = index >= 0 ? index : 0;
        }
        
        set({
          currentWeekIndex,
          viewingWeekData,
          workouts,
          isViewingCurrentWeek,
          todayIndex: finalTodayIndex,
          selectedWorkoutIndex,
          todayDateKey
        });
      }
    }),
    {
      name: 'begin-app-workout-store',
      storage: customStorage as any,
      partialize: (state) => ({
        // Only persist essential data
        allWeeksData: state.allWeeksData,
        currentWeekIndexOffset: state.currentWeekIndexOffset,
        viewingWeekIndex: state.viewingWeekIndex,
        selectedDate: state.selectedDate
      }) as any
    }
  ),
  { name: 'workout-store' }
  )
);

// Helper function to get date key (exported for use in components)
export const getDateKey = (workout: WeeklyWorkout): string => {
  return `${workout.year}-${workout.month}-${workout.date}`;
};