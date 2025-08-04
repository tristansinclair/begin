import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customStorage } from './persistence';
import { fakeUserProfile } from '../data/fakeUserData';
import { getTodaysWorkout, getWorkoutTemplateById } from '../data/workoutSchedule';

interface WorkoutStats {
  duration: string;
  exercisesCompleted: number;
  totalSets: number;
  averageWeight: string;
  caloriesBurned: number;
  personalRecords: number;
}

interface DashboardStore {
  // User data
  userProfile: typeof fakeUserProfile;
  
  // Workout completion state
  isWorkoutCompleted: boolean;
  todaysWorkout: ReturnType<typeof getTodaysWorkout>;
  workoutStats: WorkoutStats;
  
  // Actions
  setIsWorkoutCompleted: (completed: boolean) => void;
  setUserProfile: (profile: typeof fakeUserProfile) => void;
  refreshTodaysWorkout: () => void;
  
  // Computed getters
  getTodaysWorkout: () => ReturnType<typeof getTodaysWorkout>;
  getWorkoutStats: () => WorkoutStats;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        userProfile: fakeUserProfile,
      isWorkoutCompleted: false,
      todaysWorkout: getTodaysWorkout(),
      workoutStats: {
        duration: '48m',
        exercisesCompleted: 6,
        totalSets: 16,
        averageWeight: '185lbs',
        caloriesBurned: 420,
        personalRecords: 2
      },
      
      // Actions
      setIsWorkoutCompleted: (completed) => {
        set({ isWorkoutCompleted: completed });
        // Update workout stats when completion changes
        const workoutStats = get().getWorkoutStats();
        set({ workoutStats });
      },
      
      setUserProfile: (profile) => {
        set({ userProfile: profile });
      },
      
      refreshTodaysWorkout: () => {
        const todaysWorkout = getTodaysWorkout();
        set({ todaysWorkout });
        // Update workout stats when today's workout changes
        const workoutStats = get().getWorkoutStats();
        set({ workoutStats });
      },
      
      // Computed getters
      getTodaysWorkout: () => {
        return getTodaysWorkout();
      },
      
      getWorkoutStats: () => {
        const { todaysWorkout, isWorkoutCompleted } = get();
        
        // If workout is completed and has stats, use those
        if (isWorkoutCompleted && todaysWorkout?.completedStats) {
          return {
            duration: todaysWorkout.completedStats.actualDuration,
            exercisesCompleted: typeof todaysWorkout.exercises === 'number' ? todaysWorkout.exercises : 6,
            totalSets: todaysWorkout.completedStats.totalSets,
            averageWeight: todaysWorkout.completedStats.averageWeight,
            caloriesBurned: todaysWorkout.completedStats.caloriesBurned,
            personalRecords: todaysWorkout.completedStats.personalRecords
          };
        }
        
        // Otherwise return default stats
        return {
          duration: '48m',
          exercisesCompleted: 6,
          totalSets: 16,
          averageWeight: '185lbs',
          caloriesBurned: 420,
          personalRecords: 2
        };
      }
    }),
    {
      name: 'begin-app-dashboard-store',
      storage: customStorage as any,
      partialize: (state) => ({
        // Persist user profile and completion states
        userProfile: state.userProfile,
        isWorkoutCompleted: state.isWorkoutCompleted
      }) as any
    }
  ),
  { name: 'dashboard-store' }
  )
);