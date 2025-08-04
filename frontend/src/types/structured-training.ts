// Structured training types - sets, reps, circuits, supersets, etc.

import { RepetitionType } from "./exercise-definitions";

export type Weight = {
  weight: number;
  unit: "kg" | "lbs";
}

export type WeightSpecification = 
  | { type: "absolute"; weight: Weight }
  | { type: "percentage"; percentage: number; maxType: "1RM" | "3RM" | "bodyweight" }
  | { type: "bodyweight"; multiplier?: number }

// A single set within an exercise
export type SetInstance = {
  id: string;
  setNumber: number;
  
  // Planned parameters
  plannedReps?: number;
  plannedWeight?: WeightSpecification;
  plannedTime?: number;      // in seconds
  plannedDistance?: number;  // in meters
  restAfter?: number;        // seconds of rest after this set
  
  // Actual performance
  actualReps?: number;
  actualWeight?: Weight;
  actualTime?: number;
  actualDistance?: number;
  
  notes?: string;
}

// Set-based exercise (weightlifting, calisthenics)
export type ExerciseInstance = {
  id: string;
  exerciseDefinitionId: string; // references ExerciseDefinition.id
  variationId: string;          // references ExerciseVariation.id
  repetitionType: RepetitionType;
  
  sets: SetInstance[];
  
  notes?: string;
}

// A block that can contain exercises and/or other blocks (recursive)
export type ExerciseBlock = {
  id: string;
  name?: string;
  type: "exercise" | "superset" | "circuit" | "rest";
  
  // Can contain exercises or other blocks
  exercises?: ExerciseInstance[];
  blocks?: ExerciseBlock[];
  
  // Block-level parameters
  rounds?: number;      // how many times to repeat this block
  restBetweenRounds?: number; // seconds
  timeLimit?: number;   // seconds (for timed circuits)
  
  notes?: string;
}