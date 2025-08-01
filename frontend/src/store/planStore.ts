import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customStorage } from './persistence';

interface WorkoutPlan {
  goals: string[];
  duration: number;
  experienceLevel: number;
  exerciseStyles: string[];
  exerciseEquipment: { [exerciseId: string]: string[] };
  weeklySchedule: { [day: string]: string[] };
  commitmentLevel: string;
}

interface PlanStore {
  // Plan creation state
  step: number;
  workoutPlan: WorkoutPlan;
  
  // Drag and drop state
  activeId: string | null;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Plan modification actions
  toggleGoal: (goalId: string) => void;
  setExperienceLevel: (level: number) => void;
  setDuration: (weeks: number) => void;
  toggleExerciseStyle: (styleId: string) => void;
  toggleExerciseEquipment: (exerciseId: string, equipmentId: string) => void;
  setCommitmentLevel: (levelId: string) => void;
  
  // Weekly schedule actions
  setActiveId: (id: string | null) => void;
  addExerciseToDay: (dayId: string, exerciseId: string) => void;
  removeExerciseFromDay: (dayId: string, exerciseId: string) => void;
  
  // Plan management
  resetPlan: () => void;
  savePlan: () => void;
}

const initialWorkoutPlan: WorkoutPlan = {
  goals: [],
  duration: 4,
  experienceLevel: 1,
  exerciseStyles: [],
  exerciseEquipment: {},
  weeklySchedule: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  commitmentLevel: ''
};

export const usePlanStore = create<PlanStore>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      step: 1,
      workoutPlan: initialWorkoutPlan,
      activeId: null,
      
      // Navigation actions
      setStep: (step) => set({ step }),
      nextStep: () => {
        const { step } = get();
        if (step < 4) set({ step: step + 1 });
      },
      prevStep: () => {
        const { step } = get();
        if (step > 1) set({ step: step - 1 });
      },
      
      // Plan modification actions
      toggleGoal: (goalId) => {
        const { workoutPlan } = get();
        set({
          workoutPlan: {
            ...workoutPlan,
            goals: workoutPlan.goals.includes(goalId)
              ? workoutPlan.goals.filter(id => id !== goalId)
              : [...workoutPlan.goals, goalId]
          }
        });
      },
      
      setExperienceLevel: (level) => {
        const { workoutPlan } = get();
        set({
          workoutPlan: { ...workoutPlan, experienceLevel: level }
        });
      },
      
      setDuration: (weeks) => {
        const { workoutPlan } = get();
        set({
          workoutPlan: { ...workoutPlan, duration: weeks }
        });
      },
      
      toggleExerciseStyle: (styleId) => {
        const { workoutPlan } = get();
        const isAdding = !workoutPlan.exerciseStyles.includes(styleId);
        const updatedStyles = isAdding
          ? [...workoutPlan.exerciseStyles, styleId]
          : workoutPlan.exerciseStyles.filter(id => id !== styleId);

        // Auto-select all equipment when adding an exercise
        const updatedEquipment = { ...workoutPlan.exerciseEquipment };
        
        // Note: This would need to import exerciseEquipment from the plan page
        // For now, we'll just handle the basic case
        if (isAdding) {
          updatedEquipment[styleId] = [];
        } else {
          delete updatedEquipment[styleId];
        }

        set({
          workoutPlan: {
            ...workoutPlan,
            exerciseStyles: updatedStyles,
            exerciseEquipment: updatedEquipment
          }
        });
      },
      
      toggleExerciseEquipment: (exerciseId, equipmentId) => {
        const { workoutPlan } = get();
        const currentEquipment = workoutPlan.exerciseEquipment[exerciseId] || [];
        
        set({
          workoutPlan: {
            ...workoutPlan,
            exerciseEquipment: {
              ...workoutPlan.exerciseEquipment,
              [exerciseId]: currentEquipment.includes(equipmentId)
                ? currentEquipment.filter(id => id !== equipmentId)
                : [...currentEquipment, equipmentId]
            }
          }
        });
      },
      
      setCommitmentLevel: (levelId) => {
        const { workoutPlan } = get();
        set({
          workoutPlan: { ...workoutPlan, commitmentLevel: levelId }
        });
      },
      
      // Drag and drop actions
      setActiveId: (id) => set({ activeId: id }),
      
      addExerciseToDay: (dayId, exerciseId) => {
        const { workoutPlan } = get();
        const dayExercises = workoutPlan.weeklySchedule[dayId];
        
        if (!dayExercises.includes(exerciseId)) {
          set({
            workoutPlan: {
              ...workoutPlan,
              weeklySchedule: {
                ...workoutPlan.weeklySchedule,
                [dayId]: [...dayExercises, exerciseId]
              }
            }
          });
        }
      },
      
      removeExerciseFromDay: (dayId, exerciseId) => {
        const { workoutPlan } = get();
        set({
          workoutPlan: {
            ...workoutPlan,
            weeklySchedule: {
              ...workoutPlan.weeklySchedule,
              [dayId]: workoutPlan.weeklySchedule[dayId].filter(id => id !== exerciseId)
            }
          }
        });
      },
      
      // Plan management
      resetPlan: () => {
        set({
          step: 1,
          workoutPlan: initialWorkoutPlan,
          activeId: null
        });
      },
      
      savePlan: () => {
        const { workoutPlan } = get();
        console.log('Saving workout plan:', workoutPlan);
        // Here you would typically save to API or local storage
      }
    }),
    {
      name: 'begin-app-plan-store',
      storage: customStorage,
      partialize: (state) => ({
        // Persist the entire workout plan
        workoutPlan: state.workoutPlan,
        step: state.step
      })
    }
  ),
  { name: 'plan-store' }
  )
);