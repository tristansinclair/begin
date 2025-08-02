import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customStorage } from './persistence';
import { Exercise, WorkoutSection, WorkoutTemplate } from '../data/workoutTemplates';
import { WeeklyWorkout } from '../data/workoutSchedule';
import { detectPersonalRecords, formatPersonalRecord, getMockExerciseHistory, PersonalRecord } from '../utils/personalRecords';

export interface SetRecord {
  reps: number;
  weight?: number;
  completed: boolean;
  restStartTime?: number;
}

export interface ExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  sets: SetRecord[];
  notes?: string;
  isSubstituted?: boolean;
  originalExercise?: string;
}

export interface SectionRecord {
  sectionId: string;
  sectionName: string;
  sectionType: WorkoutSection['type'];
  exercises: ExerciseRecord[];
  currentRound?: number;
  totalRounds?: number;
}

export interface WorkoutSession {
  sessionId: string;
  workoutId: string;
  templateId: string | null;
  originalTemplate?: WorkoutTemplate;
  startTime: number;
  endTime?: number;
  isPaused: boolean;
  pausedDuration: number;
  lastPauseStart?: number;
  sections: SectionRecord[];
  currentSectionIndex: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
  completedSections: number;
  totalSections: number;
  completedExercises: number;
  totalExercises: number;
  completedSets: number;
  totalSets: number;
  workoutNotes?: string;
  intensityRating?: number;
  enjoymentRating?: number;
  personalRecords: string[];
  deviceReminder?: boolean;
}

interface WorkoutSessionStore {
  // Active session
  activeSession: WorkoutSession | null;
  
  // Timer states
  restTimerEndTime: number | null;
  exerciseTimerEndTime: number | null;
  
  // Settings
  enableRestTimer: boolean;
  restTimerSound: boolean;
  defaultRestTime: number;
  autoProgressSets: boolean;
  
  // Actions
  startWorkout: (workout: WeeklyWorkout, template: WorkoutTemplate | null) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: (feedback?: { intensity: number; enjoyment: number; notes?: string }) => void;
  
  // Navigation
  goToSection: (sectionIndex: number) => void;
  goToExercise: (sectionIndex: number, exerciseIndex: number) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  
  // Set management
  completeSet: (reps: number, weight?: number) => void;
  updateSet: (setIndex: number, data: Partial<SetRecord>) => void;
  startRest: (duration?: number) => void;
  skipRest: () => void;
  
  // Exercise management
  substituteExercise: (newExercise: Exercise) => void;
  updateExerciseNotes: (notes: string) => void;
  
  // Timer management
  startExerciseTimer: (duration: number) => void;
  clearTimers: () => void;
  
  // Progress calculations
  getProgress: () => {
    overall: number;
    section: number;
    exercise: number;
  };
  
  // Session recovery
  recoverSession: () => WorkoutSession | null;
  clearRecoveredSession: () => void;
  
  // Settings
  updateSettings: (settings: Partial<{
    enableRestTimer: boolean;
    restTimerSound: boolean;
    defaultRestTime: number;
    autoProgressSets: boolean;
  }>) => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        activeSession: null,
        restTimerEndTime: null,
        exerciseTimerEndTime: null,
        enableRestTimer: true,
        restTimerSound: true,
        defaultRestTime: 60,
        autoProgressSets: true,
        
        // Start a new workout session
        startWorkout: (workout, template) => {
          const sessionId = `session_${Date.now()}`;
          const sections: SectionRecord[] = [];
          let totalExercises = 0;
          let totalSets = 0;
          
          if (template) {
            template.sections.forEach((section, sectionIndex) => {
              const exerciseRecords: ExerciseRecord[] = [];
              
              section.exercises.forEach((exercise, exerciseIndex) => {
                const sets: SetRecord[] = Array(exercise.sets).fill(null).map(() => ({
                  reps: 0,
                  weight: undefined,
                  completed: false
                }));
                
                exerciseRecords.push({
                  exerciseId: `${sectionIndex}_${exerciseIndex}`,
                  exerciseName: exercise.name,
                  sets,
                  notes: exercise.notes
                });
                
                totalExercises++;
                totalSets += exercise.sets;
              });
              
              sections.push({
                sectionId: `section_${sectionIndex}`,
                sectionName: section.name,
                sectionType: section.type,
                exercises: exerciseRecords,
                currentRound: section.rounds ? 1 : undefined,
                totalRounds: section.rounds
              });
            });
          }
          
          const session: WorkoutSession = {
            sessionId,
            workoutId: `${workout.year}-${workout.month}-${workout.date}`,
            templateId: workout.templateId,
            originalTemplate: template,
            startTime: Date.now(),
            isPaused: false,
            pausedDuration: 0,
            sections,
            currentSectionIndex: 0,
            currentExerciseIndex: 0,
            currentSetIndex: 0,
            completedSections: 0,
            totalSections: sections.length,
            completedExercises: 0,
            totalExercises,
            completedSets: 0,
            totalSets,
            personalRecords: [],
            deviceReminder: true
          };
          
          set({ activeSession: session });
        },
        
        // Pause/Resume workout
        pauseWorkout: () => {
          const { activeSession } = get();
          if (activeSession && !activeSession.isPaused) {
            set({
              activeSession: {
                ...activeSession,
                isPaused: true,
                lastPauseStart: Date.now()
              }
            });
          }
        },
        
        resumeWorkout: () => {
          const { activeSession } = get();
          if (activeSession && activeSession.isPaused && activeSession.lastPauseStart) {
            const pauseDuration = Date.now() - activeSession.lastPauseStart;
            set({
              activeSession: {
                ...activeSession,
                isPaused: false,
                pausedDuration: activeSession.pausedDuration + pauseDuration,
                lastPauseStart: undefined
              }
            });
          }
        },
        
        // End workout
        endWorkout: (feedback) => {
          const { activeSession } = get();
          if (activeSession) {
            const endTime = Date.now();
            const completedSession = {
              ...activeSession,
              endTime,
              intensityRating: feedback?.intensity,
              enjoymentRating: feedback?.enjoyment,
              workoutNotes: feedback?.notes
            };
            
            // Save completed session to workout history
            if (typeof window !== 'undefined') {
              // Import and use the history store
              import('./workoutHistoryStore').then(({ useWorkoutHistoryStore }) => {
                const historyStore = useWorkoutHistoryStore.getState();
                historyStore.addCompletedWorkout(completedSession, feedback);
              });
            }
            
            set({ 
              activeSession: null,
              restTimerEndTime: null,
              exerciseTimerEndTime: null
            });
          }
        },
        
        // Navigation
        goToSection: (sectionIndex) => {
          const { activeSession } = get();
          if (activeSession && sectionIndex >= 0 && sectionIndex < activeSession.sections.length) {
            set({
              activeSession: {
                ...activeSession,
                currentSectionIndex: sectionIndex,
                currentExerciseIndex: 0,
                currentSetIndex: 0
              }
            });
          }
        },
        
        goToExercise: (sectionIndex, exerciseIndex) => {
          const { activeSession } = get();
          if (activeSession) {
            const section = activeSession.sections[sectionIndex];
            if (section && exerciseIndex >= 0 && exerciseIndex < section.exercises.length) {
              set({
                activeSession: {
                  ...activeSession,
                  currentSectionIndex: sectionIndex,
                  currentExerciseIndex: exerciseIndex,
                  currentSetIndex: 0
                }
              });
            }
          }
        },
        
        nextExercise: () => {
          const { activeSession } = get();
          if (!activeSession) return;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          let nextExerciseIndex = activeSession.currentExerciseIndex + 1;
          let nextSectionIndex = activeSession.currentSectionIndex;
          
          if (nextExerciseIndex >= currentSection.exercises.length) {
            nextExerciseIndex = 0;
            nextSectionIndex++;
            
            if (nextSectionIndex >= activeSession.sections.length) {
              // Workout complete
              return;
            }
          }
          
          set({
            activeSession: {
              ...activeSession,
              currentSectionIndex: nextSectionIndex,
              currentExerciseIndex: nextExerciseIndex,
              currentSetIndex: 0
            }
          });
        },
        
        previousExercise: () => {
          const { activeSession } = get();
          if (!activeSession) return;
          
          let prevExerciseIndex = activeSession.currentExerciseIndex - 1;
          let prevSectionIndex = activeSession.currentSectionIndex;
          
          if (prevExerciseIndex < 0) {
            prevSectionIndex--;
            
            if (prevSectionIndex < 0) {
              return;
            }
            
            const prevSection = activeSession.sections[prevSectionIndex];
            prevExerciseIndex = prevSection.exercises.length - 1;
          }
          
          set({
            activeSession: {
              ...activeSession,
              currentSectionIndex: prevSectionIndex,
              currentExerciseIndex: prevExerciseIndex,
              currentSetIndex: 0
            }
          });
        },
        
        // Set management
        completeSet: (reps, weight) => {
          const { activeSession, autoProgressSets, startRest } = get();
          if (!activeSession) return;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          const currentExercise = currentSection.exercises[activeSession.currentExerciseIndex];
          const currentSet = currentExercise.sets[activeSession.currentSetIndex];
          
          // Update the set
          currentSet.reps = reps;
          currentSet.weight = weight;
          currentSet.completed = true;
          
          // Update completed sets count
          const completedSets = activeSession.completedSets + 1;
          
          // Check if exercise is complete
          let completedExercises = activeSession.completedExercises;
          const allSetsComplete = currentExercise.sets.every(s => s.completed);
          let personalRecords = [...activeSession.personalRecords];
          
          if (allSetsComplete) {
            completedExercises++;
            
            // Check for personal records when exercise is complete
            const exerciseHistory = getMockExerciseHistory();
            const newRecords = detectPersonalRecords(
              currentExercise.exerciseName,
              currentExercise.sets.filter(s => s.completed),
              exerciseHistory
            );
            
            // Add formatted PR messages
            newRecords.forEach(record => {
              personalRecords.push(formatPersonalRecord(record));
            });
          }
          
          // Update session
          const updatedSession = {
            ...activeSession,
            completedSets,
            completedExercises,
            personalRecords
          };
          
          set({ activeSession: updatedSession });
          
          // Auto-progress to next set or start rest
          if (autoProgressSets) {
            const nextSetIndex = activeSession.currentSetIndex + 1;
            if (nextSetIndex < currentExercise.sets.length) {
              set({
                activeSession: {
                  ...updatedSession,
                  currentSetIndex: nextSetIndex
                }
              });
              
              // Parse rest time from original template
              const originalExercise = activeSession.originalTemplate?.sections[activeSession.currentSectionIndex]?.exercises[activeSession.currentExerciseIndex];
              const restTime = originalExercise?.rest || '60s';
              const restMatch = restTime.match(/(\d+)s/) || restTime.match(/(\d+)\s*min/)?.map(m => (parseInt(m) * 60).toString());
              const restSeconds = restMatch ? parseInt(restMatch[1]) : get().defaultRestTime;
              startRest(restSeconds);
            }
          }
        },
        
        updateSet: (setIndex, data) => {
          const { activeSession } = get();
          if (!activeSession) return;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          const currentExercise = currentSection.exercises[activeSession.currentExerciseIndex];
          
          if (setIndex >= 0 && setIndex < currentExercise.sets.length) {
            currentExercise.sets[setIndex] = {
              ...currentExercise.sets[setIndex],
              ...data
            };
            
            set({ activeSession: { ...activeSession } });
          }
        },
        
        // Rest timer
        startRest: (duration) => {
          const { enableRestTimer, defaultRestTime } = get();
          if (enableRestTimer) {
            const restDuration = duration || defaultRestTime;
            set({ restTimerEndTime: Date.now() + (restDuration * 1000) });
          }
        },
        
        skipRest: () => {
          set({ restTimerEndTime: null });
        },
        
        // Exercise substitution
        substituteExercise: (newExercise) => {
          const { activeSession } = get();
          if (!activeSession) return;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          const currentExercise = currentSection.exercises[activeSession.currentExerciseIndex];
          
          currentExercise.isSubstituted = true;
          currentExercise.originalExercise = currentExercise.exerciseName;
          currentExercise.exerciseName = newExercise.name;
          currentExercise.notes = newExercise.notes;
          
          set({ activeSession: { ...activeSession } });
        },
        
        updateExerciseNotes: (notes) => {
          const { activeSession } = get();
          if (!activeSession) return;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          const currentExercise = currentSection.exercises[activeSession.currentExerciseIndex];
          
          currentExercise.notes = notes;
          
          set({ activeSession: { ...activeSession } });
        },
        
        // Timer management
        startExerciseTimer: (duration) => {
          set({ exerciseTimerEndTime: Date.now() + (duration * 1000) });
        },
        
        clearTimers: () => {
          set({ restTimerEndTime: null, exerciseTimerEndTime: null });
        },
        
        // Progress calculations
        getProgress: () => {
          const { activeSession } = get();
          if (!activeSession) return { overall: 0, section: 0, exercise: 0 };
          
          const overall = (activeSession.completedSets / activeSession.totalSets) * 100;
          
          const currentSection = activeSession.sections[activeSession.currentSectionIndex];
          const sectionTotalSets = currentSection.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const sectionCompletedSets = currentSection.exercises.reduce(
            (sum, ex) => sum + ex.sets.filter(s => s.completed).length, 
            0
          );
          const section = (sectionCompletedSets / sectionTotalSets) * 100;
          
          const currentExercise = currentSection.exercises[activeSession.currentExerciseIndex];
          const exerciseCompletedSets = currentExercise.sets.filter(s => s.completed).length;
          const exercise = (exerciseCompletedSets / currentExercise.sets.length) * 100;
          
          return { overall, section, exercise };
        },
        
        // Session recovery
        recoverSession: () => {
          const { activeSession } = get();
          return activeSession;
        },
        
        clearRecoveredSession: () => {
          set({ activeSession: null });
        },
        
        // Settings
        updateSettings: (settings) => {
          set(settings);
        }
      }),
      {
        name: 'begin-workout-session-store',
        storage: customStorage as any,
        partialize: (state) => ({
          activeSession: state.activeSession,
          enableRestTimer: state.enableRestTimer,
          restTimerSound: state.restTimerSound,
          defaultRestTime: state.defaultRestTime,
          autoProgressSets: state.autoProgressSets
        }) as any
      }
    ),
    { name: 'workout-session-store' }
  )
);