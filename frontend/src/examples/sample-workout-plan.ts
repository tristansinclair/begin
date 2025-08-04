// Example workout plan showing different session types
import {
  WorkoutPlan,
  TrainingSession,
  TrainingSessionStatus,
  ActivityBlock,
  CardioActivity,
  ExerciseBlock,
  ExerciseInstance,
  SetInstance,
  WeightSpecification,
  ActivityBlockType,
  CardioType
} from "@/types";

import { threeMileRunSession, upperBodyStrengthSession, murphWorkoutSession, fullBodyStrengthSession, recoveryWalkSession } from "./sample-workout-sessions";

// Sample workout plan with various session types
export const sampleWorkoutPlan: WorkoutPlan = {
  id: "beginner-plan-2025",
  name: "Beginner Strength & Cardio Plan",
  description: "4-week plan combining weightlifting and cardiovascular fitness",
  startDate: new Date("2025-01-06"),
  endDate: new Date("2025-02-02"),
  tags: ["beginner", "strength", "cardio"],
  createdBy: "trainer-john",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),

  sessions: [
    threeMileRunSession,
    upperBodyStrengthSession,
    murphWorkoutSession,
    fullBodyStrengthSession,
    recoveryWalkSession
  ]
};

// Helper function to find a session by name
export function findSessionByName(plan: WorkoutPlan, name: string): TrainingSession | undefined {
  return plan.sessions.find(session => session.name === name);
}

// Helper function to get total planned workout time
export function getTotalPlannedTime(session: TrainingSession): number {
  let totalTime = 0;

  session.blocks.forEach(block => {
    if (block.cardioActivity?.plannedTime) {
      totalTime += block.cardioActivity.plannedTime;
    }

    if (block.structuredTraining) {
      // Estimate time for structured training
      const exercises = block.structuredTraining.exercises || [];
      exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.plannedTime) {
            totalTime += set.plannedTime;
          } else {
            // Estimate ~30 seconds per set + rest
            totalTime += 30 + (set.restAfter || 60);
          }
        });
      });

      // Add rounds multiplier
      const rounds = block.structuredTraining.rounds || 1;
      totalTime *= rounds;
    }
  });

  return totalTime;
}