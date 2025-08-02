import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customStorage } from './persistence';
import { WorkoutSession } from './workoutSessionStore';
import { WeeklyWorkout, WorkoutStatus, workoutScheduleData, getWorkoutTemplateById } from '../data/workoutSchedule';
import { fakeUserProfile } from '../data/fakeUserData';

export interface WorkoutHistoryEntry extends WorkoutSession {
  completedAt: number;
  actualDuration: number; // in minutes
  totalVolume?: number; // total weight lifted
  averageIntensity?: number;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalVolume: number; // total weight lifted
  averageIntensity: number;
  favoriteWorkoutType: string;
  currentStreak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
}

interface WorkoutHistoryStore {
  // History data
  workoutHistory: WorkoutHistoryEntry[];
  
  // Actions
  addCompletedWorkout: (session: WorkoutSession, feedback?: { intensity: number; enjoyment: number; notes?: string }) => void;
  getWorkoutById: (sessionId: string) => WorkoutHistoryEntry | undefined;
  getWorkoutsByDateRange: (startDate: Date, endDate: Date) => WorkoutHistoryEntry[];
  getWorkoutsByType: (type: string) => WorkoutHistoryEntry[];
  deleteWorkout: (sessionId: string) => void;
  
  // Statistics
  getWorkoutStats: () => WorkoutStats;
  getRecentWorkouts: (limit?: number) => WorkoutHistoryEntry[];
  getWorkoutsByMonth: (year: number, month: number) => WorkoutHistoryEntry[];
  
  // Filtering and search
  searchWorkouts: (query: string) => WorkoutHistoryEntry[];
  filterWorkouts: (filters: {
    type?: string;
    intensity?: 'low' | 'medium' | 'high';
    dateRange?: { start: Date; end: Date };
    minDuration?: number;
    maxDuration?: number;
  }) => WorkoutHistoryEntry[];
}

// Convert WeeklyWorkout to WorkoutHistoryEntry
const convertWeeklyWorkoutToHistoryEntry = (workout: WeeklyWorkout): WorkoutHistoryEntry | null => {
  if (workout.status !== WorkoutStatus.Completed || !workout.completedStats) {
    return null;
  }

  const template = workout.templateId ? getWorkoutTemplateById(workout.templateId) : null;
  const workoutDate = new Date(workout.year, new Date(`${workout.month} 1, ${workout.year}`).getMonth(), workout.date);
  
  // Create a basic session structure from the weekly workout data
  const sessionId = `session_${workoutDate.getTime()}`;
  const startTime = workoutDate.getTime() + (9 * 60 * 60 * 1000); // Assume 9 AM start
  const endTime = startTime + (parseInt(workout.completedStats.actualDuration) * 60 * 1000);
  
  // Create sections from template if available
  const sections = template ? template.sections.map((section, sectionIndex) => ({
    sectionId: `section_${sectionIndex}`,
    sectionName: section.name,
    sectionType: section.type as any,
    exercises: section.exercises.map((exercise, exerciseIndex) => ({
      exerciseId: `${sectionIndex}_${exerciseIndex}`,
      exerciseName: exercise.name,
      sets: Array(exercise.sets).fill(null).map(() => ({
        reps: 10, // Mock completed reps
        weight: 135, // Mock weight
        completed: true
      })),
      notes: exercise.notes
    })),
    currentRound: section.rounds ? section.rounds : undefined,
    totalRounds: section.rounds
  })) : [];

  const totalSets = workout.completedStats.totalSets;
  const totalExercises = template ? template.sections.reduce((sum, section) => sum + section.exercises.length, 0) : 0;
  
  return {
    sessionId,
    workoutId: `${workout.year}-${workout.month}-${workout.date}`,
    templateId: workout.templateId,
    originalTemplate: template,
    startTime,
    endTime,
    completedAt: endTime,
    actualDuration: parseInt(workout.completedStats.actualDuration),
    isPaused: false,
    pausedDuration: 0,
    sections,
    currentSectionIndex: 0,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    completedSections: sections.length,
    totalSections: sections.length,
    completedExercises: totalExercises,
    totalExercises,
    completedSets: totalSets,
    totalSets,
    personalRecords: workout.completedStats.personalRecords > 0 ? 
      [`New PR: ${workout.name}`] : [],
    totalVolume: totalSets * 135, // Mock volume calculation
    intensityRating: workout.intensity === 'high' ? 8 : workout.intensity === 'medium' ? 6 : 4,
    enjoymentRating: 8, // Mock rating
    workoutNotes: `Completed ${workout.name} workout`
  };
};

// Convert fakeUserProfile workout history to WorkoutHistoryEntry format
const convertUserWorkoutToHistoryEntry = (userWorkout: any): WorkoutHistoryEntry | null => {
  if (userWorkout.status !== WorkoutStatus.Completed || userWorkout.duration === 0) {
    return null;
  }

  const workoutDate = new Date(userWorkout.date);
  const sessionId = `session_${workoutDate.getTime()}`;
  const startTime = workoutDate.getTime() + (9 * 60 * 60 * 1000); // Assume 9 AM start
  const endTime = startTime + (userWorkout.duration * 60 * 1000);
  
  // Find matching template if possible
  const template = userWorkout.name ? getWorkoutTemplateById(userWorkout.name.toLowerCase().replace(/\s+/g, '-')) : null;
  
  // Create sections from user workout exercises
  const sections = userWorkout.exercises ? [{
    sectionId: 'main_section',
    sectionName: 'Main Workout',
    sectionType: 'main' as any,
    exercises: userWorkout.exercises.map((exercise: any, index: number) => ({
      exerciseId: `exercise_${index}`,
      exerciseName: exercise.name,
      sets: exercise.sets ? Array(exercise.sets).fill(null).map((_, setIndex) => ({
        reps: exercise.reps ? (Array.isArray(exercise.reps) ? exercise.reps[setIndex] || 10 : exercise.reps) : 10,
        weight: exercise.weight ? (Array.isArray(exercise.weight) ? exercise.weight[setIndex] || 135 : exercise.weight) : undefined,
        completed: true
      })) : [{
        reps: 10,
        weight: exercise.weight || undefined,
        completed: true
      }],
      notes: exercise.notes
    })),
    totalRounds: 1
  }] : [];

  const totalSets = sections.reduce((sum, section) => 
    sum + section.exercises.reduce((exSum, ex) => exSum + ex.sets.length, 0), 0
  );
  const totalExercises = sections.reduce((sum, section) => sum + section.exercises.length, 0);
  const totalVolume = sections.reduce((sum, section) => 
    sum + section.exercises.reduce((exSum, ex) => 
      exSum + ex.sets.reduce((setSum, set) => 
        setSum + (set.weight ? set.reps * set.weight : 0), 0
      ), 0
    ), 0
  );

  // Extract personal records from notes
  const personalRecords: string[] = [];
  if (userWorkout.notes && userWorkout.notes.toLowerCase().includes('pr')) {
    personalRecords.push(`${userWorkout.name}: ${userWorkout.notes}`);
  }

  return {
    sessionId,
    workoutId: workoutDate.toISOString().split('T')[0],
    templateId: template?.id || null,
    originalTemplate: template,
    startTime,
    endTime,
    completedAt: endTime,
    actualDuration: userWorkout.duration,
    isPaused: false,
    pausedDuration: 0,
    sections,
    currentSectionIndex: 0,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    completedSections: sections.length,
    totalSections: sections.length,
    completedExercises: totalExercises,
    totalExercises,
    completedSets: totalSets,
    totalSets,
    personalRecords,
    totalVolume,
    intensityRating: userWorkout.workoutType === 'strength' ? 8 : 
                     userWorkout.workoutType === 'cardio' ? 7 : 5,
    enjoymentRating: Math.floor(Math.random() * 3) + 7, // Random 7-9
    workoutNotes: userWorkout.notes || `Completed ${userWorkout.name} workout`
  };
};

// Generate workout history from fake user profile data
const generateWorkoutHistoryFromUserData = (): WorkoutHistoryEntry[] => {
  const history: WorkoutHistoryEntry[] = [];
  
  fakeUserProfile.workoutHistory.forEach(userWorkout => {
    if (userWorkout.status === WorkoutStatus.Completed) {
      const historyEntry = convertUserWorkoutToHistoryEntry(userWorkout);
      if (historyEntry) {
        history.push(historyEntry);
      }
    }
  });
  
  return history.sort((a, b) => b.completedAt - a.completedAt);
};

// Get workout history from real data
const getInitialWorkoutHistory = (): WorkoutHistoryEntry[] => {
  return generateWorkoutHistoryFromUserData();
};

export const useWorkoutHistoryStore = create<WorkoutHistoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state with real workout data
        workoutHistory: getInitialWorkoutHistory(),
        
        // Add completed workout to history
        addCompletedWorkout: (session, feedback) => {
          const completedAt = Date.now();
          const actualDuration = Math.round((session.endTime! - session.startTime - session.pausedDuration) / 60000);
          
          // Calculate total volume for strength workouts
          const totalVolume = session.sections.reduce((total, section) => {
            return total + section.exercises.reduce((sectionTotal, exercise) => {
              return sectionTotal + exercise.sets.reduce((exerciseTotal, set) => {
                return exerciseTotal + (set.completed && set.weight ? set.reps * set.weight : 0);
              }, 0);
            }, 0);
          }, 0);
          
          const historyEntry: WorkoutHistoryEntry = {
            ...session,
            completedAt,
            actualDuration,
            totalVolume,
            intensityRating: feedback?.intensity,
            enjoymentRating: feedback?.enjoyment,
            workoutNotes: feedback?.notes
          };
          
          set(state => ({
            workoutHistory: [historyEntry, ...state.workoutHistory]
          }));
        },
        
        // Get workout by ID
        getWorkoutById: (sessionId) => {
          return get().workoutHistory.find(workout => workout.sessionId === sessionId);
        },
        
        // Get workouts by date range
        getWorkoutsByDateRange: (startDate, endDate) => {
          const start = startDate.getTime();
          const end = endDate.getTime();
          return get().workoutHistory.filter(workout => 
            workout.completedAt >= start && workout.completedAt <= end
          );
        },
        
        // Get workouts by type
        getWorkoutsByType: (type) => {
          return get().workoutHistory.filter(workout => 
            workout.originalTemplate?.type === type
          );
        },
        
        // Delete workout
        deleteWorkout: (sessionId) => {
          set(state => ({
            workoutHistory: state.workoutHistory.filter(workout => workout.sessionId !== sessionId)
          }));
        },
        
        // Get workout statistics
        getWorkoutStats: () => {
          const history = get().workoutHistory;
          const now = new Date();
          const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const totalWorkouts = history.length;
          const totalDuration = history.reduce((sum, w) => sum + w.actualDuration, 0);
          const totalVolume = history.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
          const avgIntensity = history.reduce((sum, w) => sum + (w.intensityRating || 0), 0) / totalWorkouts;
          
          // Find most common workout type
          const typeCount: Record<string, number> = {};
          history.forEach(w => {
            const type = w.originalTemplate?.type || 'Unknown';
            typeCount[type] = (typeCount[type] || 0) + 1;
          });
          const favoriteWorkoutType = Object.keys(typeCount).reduce((a, b) => 
            typeCount[a] > typeCount[b] ? a : b, 'None'
          );
          
          // Calculate streaks and recent activity
          const thisWeekWorkouts = history.filter(w => w.completedAt >= thisWeekStart.getTime()).length;
          const thisMonthWorkouts = history.filter(w => w.completedAt >= thisMonthStart.getTime()).length;
          
          // Simple streak calculation (consecutive days with workouts)
          const sortedDates = [...new Set(history.map(w => 
            new Date(w.completedAt).toDateString()
          ))].sort().reverse();
          
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          
          for (let i = 0; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i]);
            const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
            
            if (!prevDate || (prevDate.getTime() - currentDate.getTime()) === 86400000) {
              tempStreak++;
              if (i === 0) currentStreak = tempStreak;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          
          return {
            totalWorkouts,
            totalDuration,
            totalVolume,
            averageIntensity: Math.round(avgIntensity * 10) / 10,
            favoriteWorkoutType,
            currentStreak,
            longestStreak,
            thisWeekWorkouts,
            thisMonthWorkouts
          };
        },
        
        // Get recent workouts
        getRecentWorkouts: (limit = 10) => {
          return get().workoutHistory
            .sort((a, b) => b.completedAt - a.completedAt)
            .slice(0, limit);
        },
        
        // Get workouts by month
        getWorkoutsByMonth: (year, month) => {
          return get().workoutHistory.filter(workout => {
            const date = new Date(workout.completedAt);
            return date.getFullYear() === year && date.getMonth() === month;
          });
        },
        
        // Search workouts
        searchWorkouts: (query) => {
          const lowerQuery = query.toLowerCase();
          return get().workoutHistory.filter(workout =>
            workout.originalTemplate?.name.toLowerCase().includes(lowerQuery) ||
            workout.originalTemplate?.type.toLowerCase().includes(lowerQuery) ||
            workout.workoutNotes?.toLowerCase().includes(lowerQuery) ||
            workout.personalRecords.some(pr => pr.toLowerCase().includes(lowerQuery))
          );
        },
        
        // Filter workouts
        filterWorkouts: (filters: {
          type?: string;
          intensity?: 'low' | 'medium' | 'high';
          dateRange?: { start: Date; end: Date };
          minDuration?: number;
          maxDuration?: number;
        }) => {
          let filtered = get().workoutHistory;
          
          if (filters.type) {
            filtered = filtered.filter(w => w.originalTemplate?.type === filters.type);
          }
          
          if (filters.intensity) {
            filtered = filtered.filter(w => w.originalTemplate?.intensity === filters.intensity);
          }
          
          if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            filtered = filtered.filter(w => 
              w.completedAt >= start.getTime() && w.completedAt <= end.getTime()
            );
          }
          
          if (filters.minDuration) {
            filtered = filtered.filter(w => w.actualDuration >= filters.minDuration!);
          }
          
          if (filters.maxDuration) {
            filtered = filtered.filter(w => w.actualDuration <= filters.maxDuration!);
          }
          
          return filtered;
        }
      }),
      {
        name: 'begin-workout-history-store',
        storage: customStorage,
        partialize: (state) => ({
          workoutHistory: state.workoutHistory
        })
      }
    ),
    { name: 'workout-history-store' }
  )
);