// Workout session types and simple activities

import { ExerciseBlock, ExerciseInstance, SetInstance, WeightSpecification, Weight } from "./structured-training";
import { RepetitionType } from "./exercise-definitions";

// Re-export imported types for backward compatibility
export type { ExerciseBlock, ExerciseInstance, SetInstance, WeightSpecification, Weight } from "./structured-training";
export type { RepetitionType } from "./exercise-definitions";

export enum TrainingSessionStatus {
  Completed = "Completed",
  InProgress = "In Progress",
  Upcoming = "Upcoming",
  Missed = "Missed",
  Cancelled = "Cancelled",
}

// Simple cardio activity (runs, bikes, swims, etc.)
export type CardioActivity = {
  id: string;
  type: CardioType;
  name?: string;
  
  // Planned parameters
  plannedTime?: number;       // in seconds
  plannedDistance?: number;   // in meters
  plannedPace?: number;       // seconds per meter
  
  // Actual performance
  actualTime?: number;
  actualDistance?: number;
  actualPace?: number;
  
  // Additional metrics
  heartRate?: {
    average?: number;
    max?: number;
  };
  calories?: number;
  elevation?: number;         // for runs/hikes
  
  notes?: string;
}

export enum CardioType {
  Run = "Run",
  Bike = "Bike",
  Swim = "Swim",
  Walk = "Walk",
  Hike = "Hike",
  Row = "Row",
  Elliptical = "Elliptical",
}

// A block that can contain different types of activities
export type ActivityBlock = {
  id: string;
  name?: string;
  type: ActivityBlockType;
  
  // Can contain structured training or simple cardio
  structuredTraining?: ExerciseBlock;
  cardioActivity?: CardioActivity;
  
  notes?: string;
}

export enum ActivityBlockType {
  Structured = "Structured",
  Cardio = "Cardio",
  Rest = "Rest",
}

// UTILITY TYPES - For backward compatibility and convenience

// Type alias for a planned training session (same as TrainingSession with only planned fields)
export type PlannedTrainingSession = Omit<TrainingSession, 
  'startedAt' | 'completedAt' | 'actualDuration' | 'pausedDuration' | 'lastPauseStart' | 
  'currentBlockIndex' | 'currentExerciseIndex' | 'currentSetIndex' | 
  'intensityRating' | 'enjoymentRating' | 'duration'
>;

// Type alias for an executed training session (TrainingSession with execution data)
export type ExecutedTrainingSession = Required<Pick<TrainingSession, 
  'id' | 'name' | 'dateTime' | 'status' | 'blocks' | 'startedAt' | 'completedAt'
>> & Omit<TrainingSession, 'id' | 'name' | 'dateTime' | 'status' | 'blocks' | 'startedAt' | 'completedAt'>;

// Legacy type alias for backward compatibility
export type WorkoutExecution = ExecutedTrainingSession;

// Enhanced TrainingSession - supports both planned and executed states
export type TrainingSession = {
  id: string;
  name?: string;
  dateTime: Date;
  status: TrainingSessionStatus;
  
  blocks: ActivityBlock[];
  
  // Planning metadata (always present)
  estimatedDuration?: number;  // estimated duration in minutes
  notes?: string;
  tags?: string[];
  
  // Execution metadata (populated when workout starts/completes)
  startedAt?: Date;
  completedAt?: Date;
  actualDuration?: number;     // actual duration in minutes (replaces legacy duration)
  pausedDuration?: number;     // total time paused in seconds
  lastPauseStart?: Date;
  
  // Progress tracking (for in-progress workouts)
  currentBlockIndex?: number;
  currentExerciseIndex?: number;
  currentSetIndex?: number;
  
  // Session feedback (for completed workouts)
  intensityRating?: number;    // 1-10
  enjoymentRating?: number;    // 1-10
  
  // Legacy field - keeping for backward compatibility
  duration?: number;           // actual duration in minutes (deprecated, use actualDuration)
}

// A workout plan containing multiple sessions
export type WorkoutPlan = {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;

  createdAt: Date;
  updatedAt: Date;
  
  sessions: TrainingSession[];
  
  // Plan metadata
  tags?: string[];
  createdBy?: string;
}

// WORKOUT LIFECYCLE UTILITIES
// Start a workout session (transition from planned to in-progress)
export function startWorkout(plannedSession: TrainingSession): TrainingSession {
  return {
    ...plannedSession,
    status: TrainingSessionStatus.InProgress,
    startedAt: new Date(),
    pausedDuration: 0,
    currentBlockIndex: 0,
    currentExerciseIndex: 0,
    currentSetIndex: 0
  };
}

// Complete a workout session
export function completeWorkout(
  inProgressSession: TrainingSession,
  feedback?: {
    intensityRating?: number;
    enjoymentRating?: number;
    notes?: string;
  }
): TrainingSession {
  const completedAt = new Date();
  const actualDuration = inProgressSession.startedAt 
    ? Math.round((completedAt.getTime() - inProgressSession.startedAt.getTime() - (inProgressSession.pausedDuration || 0) * 1000) / 60000)
    : undefined;

  return {
    ...inProgressSession,
    status: TrainingSessionStatus.Completed,
    completedAt,
    actualDuration,
    intensityRating: feedback?.intensityRating,
    enjoymentRating: feedback?.enjoymentRating,
    notes: feedback?.notes || inProgressSession.notes
  };
}

// Create a clean planned session (removes execution fields)
export function createPlannedSession(session: TrainingSession): PlannedTrainingSession {
  const { 
    startedAt, completedAt, actualDuration, pausedDuration, lastPauseStart,
    currentBlockIndex, currentExerciseIndex, currentSetIndex,
    intensityRating, enjoymentRating, duration,
    ...plannedFields 
  } = session;
  
  return {
    ...plannedFields,
    status: TrainingSessionStatus.Upcoming
  };
}

// PROGRESS TRACKING HELPERS
export function getWorkoutProgress(session: TrainingSession): {
  overall: number;
  currentBlock: number;
  currentExercise: number;
} {
  if (session.status === TrainingSessionStatus.Completed) {
    return { overall: 100, currentBlock: 100, currentExercise: 100 };
  }

  const totalSets = session.blocks.reduce((total, block) => {
    return total + getBlockTotalSets(block);
  }, 0);

  const completedSets = session.blocks.reduce((total, block) => {
    return total + getBlockCompletedSets(block);
  }, 0);

  const overall = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Current block progress
  const currentBlockIndex = session.currentBlockIndex ?? 0;
  const currentExerciseIndex = session.currentExerciseIndex ?? 0;
  
  const currentBlock = session.blocks[currentBlockIndex];
  const currentBlockTotal = currentBlock ? getBlockTotalSets(currentBlock) : 0;
  const currentBlockCompleted = currentBlock ? getBlockCompletedSets(currentBlock) : 0;
  const currentBlockProgress = currentBlockTotal > 0 ? (currentBlockCompleted / currentBlockTotal) * 100 : 0;

  // Current exercise progress
  let currentExerciseProgress = 0;
  if (currentBlock?.structuredTraining?.exercises) {
    const currentExercise = currentBlock.structuredTraining.exercises[currentExerciseIndex];
    if (currentExercise) {
      const totalSets = currentExercise.sets.length;
      const completedSets = currentExercise.sets.filter(s => s.completed).length;
      currentExerciseProgress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    }
  }

  return {
    overall,
    currentBlock: currentBlockProgress,
    currentExercise: currentExerciseProgress
  };
}

function getBlockTotalSets(block: ActivityBlock): number {
  if (block.structuredTraining) {
    return getExerciseBlockTotalSets(block.structuredTraining);
  }
  if (block.cardioActivity) {
    return 1; // Cardio activities count as 1 "set"
  }
  return 0;
}

function getBlockCompletedSets(block: ActivityBlock): number {
  if (block.structuredTraining) {
    return getExerciseBlockCompletedSets(block.structuredTraining);
  }
  if (block.cardioActivity && block.cardioActivity.actualTime) {
    return 1; // Cardio is "completed" if it has actual time
  }
  return 0;
}

function getExerciseBlockTotalSets(block: ExerciseBlock): number {
  let total = 0;
  if (block.exercises) {
    total += block.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  }
  if (block.blocks) {
    total += block.blocks.reduce((sum, b) => sum + getExerciseBlockTotalSets(b), 0);
  }
  return total * (block.rounds || 1);
}

function getExerciseBlockCompletedSets(block: ExerciseBlock): number {
  let completed = 0;
  if (block.exercises) {
    completed += block.exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(s => s.completed).length, 0
    );
  }
  if (block.blocks) {
    completed += block.blocks.reduce((sum, b) => sum + getExerciseBlockCompletedSets(b), 0);
  }
  return completed;
}

// Legacy alias for backward compatibility
export const createWorkoutExecution = startWorkout;