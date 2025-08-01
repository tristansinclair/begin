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
        const today = new Date(2025, 6, 31); // July 31st, 2025
        const month = today.toLocaleDateString('en-US', { month: 'long' });
        return `${today.getFullYear()}-${month}-${today.getDate()}`;
      },
      
      getResponsiveWeekRanges: () => {
        const { viewingWeekData, workouts } = get();
        
        if (!viewingWeekData || workouts.length === 0) return {
          mobile: '',
          medium: '',
          large: '',
          xl: '',
          full: ''
        };
        
        const firstDay = workouts[0];
        const getEndDay = (count: number) => workouts[Math.min(count - 1, workouts.length - 1)];
        
        return {
          mobile: `${firstDay.month} ${firstDay.date} - ${getEndDay(3).date}`,
          medium: `${firstDay.month} ${firstDay.date} - ${getEndDay(4).date}`,
          large: `${firstDay.month} ${firstDay.date} - ${getEndDay(5).date}`,
          xl: viewingWeekData.weekOf,
          full: viewingWeekData.weekOf
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
        const { viewingWeekIndex, allWeeksData } = get();
        
        if (viewingWeekIndex > 0) {
          get().setViewingWeekIndex(viewingWeekIndex - 1);
        } else {
          // Generate more past weeks - unlimited navigation
          const firstWeekStart = allWeeksData[0].startDate;
          const additionalWeeks = generateAdditionalWeeks(firstWeekStart, 'past', 4, userDataLookup);
          
          set({ 
            allWeeksData: [...additionalWeeks, ...allWeeksData],
            viewingWeekIndex: 3 // Move to one of the newly added weeks
          });
          get().updateComputedValues();
        }
      },
      
      goToNextWeek: () => {
        const { viewingWeekIndex, allWeeksData } = get();
        
        if (viewingWeekIndex < allWeeksData.length - 1) {
          get().setViewingWeekIndex(viewingWeekIndex + 1);
        } else {
          // Generate more future weeks - unlimited navigation
          const lastWeekStart = allWeeksData[allWeeksData.length - 1].startDate;
          const additionalWeeks = generateAdditionalWeeks(lastWeekStart, 'future', 4, userDataLookup);
          
          set({ 
            allWeeksData: [...allWeeksData, ...additionalWeeks],
            viewingWeekIndex: viewingWeekIndex + 1
          });
          get().updateComputedValues();
        }
      },
      
      goBackToToday: () => {
        const { currentWeekIndex, getTodayDateKey } = get();
        get().setViewingWeekIndex(currentWeekIndex);
        get().setSelectedDate(getTodayDateKey());
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
      
      // Initialize the store
      initialize: () => {
        // Use the workout schedule data (June 8 - August 19)
        const currentWeekIndex = getCurrentWeekIndex(workoutScheduleData);
        
        set({
          allWeeksData: workoutScheduleData,
          currentWeekIndexOffset: 0,
          viewingWeekIndex: currentWeekIndex,
          currentWeekIndex,
          todayDateKey: get().getTodayDateKey()
        });
        
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