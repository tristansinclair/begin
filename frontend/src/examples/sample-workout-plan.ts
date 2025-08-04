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

// Sample workout plan with various session types
export const sampleWorkoutPlan: WorkoutPlan = {
  id: "beginner-plan-2025",
  name: "Beginner Strength & Cardio Plan",
  description: "4-week plan combining strength training and cardiovascular fitness",
  startDate: new Date("2025-01-06"),
  endDate: new Date("2025-02-02"),
  tags: ["beginner", "strength", "cardio"],
  createdBy: "trainer-john",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),

  sessions: [
    // Session 1: Simple 3 Mile Run
    {
      id: "session-1",
      name: "Easy 3 Mile Run",
      dateTime: new Date("2025-01-06T07:00:00"),
      status: TrainingSessionStatus.Upcoming,
      blocks: [
        {
          id: "block-1",
          name: "Main Run",
          type: ActivityBlockType.Cardio,
          cardioActivity: {
            id: "run-1",
            type: CardioType.Run,
            name: "Morning 3 Mile",
            plannedDistance: 4828, // 3 miles in meters
            plannedTime: 1800,     // 30 minutes
            plannedPace: 10,       // 10 min/mile pace
            notes: "Keep easy pace, focus on form"
          }
        } as ActivityBlock
      ],
      tags: ["cardio", "easy"]
    } as TrainingSession,

    // Session 2: Full Strength Training Session
    {
      id: "session-2",
      name: "Upper Body Strength",
      dateTime: new Date("2025-01-07T18:00:00"),
      status: TrainingSessionStatus.Upcoming,
      blocks: [
        // Warm-up
        {
          id: "warmup-block",
          name: "Warm-up",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "warmup",
            name: "Dynamic Warm-up",
            type: "circuit",
            rounds: 2,
            restBetweenRounds: 60,
            exercises: [
              {
                id: "pushups-warmup",
                exerciseDefinitionId: "pushup",
                variationId: "standard-pushup",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "set-1",
                    setNumber: 1,
                    plannedReps: 10,
                    restAfter: 30
                  } as SetInstance
                ]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock,

        // Main Lifting
        {
          id: "main-lift-block",
          name: "Main Lifts",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "main-lifts",
            name: "Compound Movements",
            type: "exercise",
            exercises: [
              // Bench Press
              {
                id: "bench-press-1",
                exerciseDefinitionId: "bench-press",
                variationId: "barbell-bench",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "bench-set-1",
                    setNumber: 1,
                    plannedReps: 8,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 135, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 180
                  },
                  {
                    id: "bench-set-2",
                    setNumber: 2,
                    plannedReps: 6,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 155, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 180
                  },
                  {
                    id: "bench-set-3",
                    setNumber: 3,
                    plannedReps: 4,
                    plannedWeight: {
                      type: "percentage",
                      percentage: 85,
                      maxType: "1RM"
                    } as WeightSpecification,
                    restAfter: 180
                  }
                ] as SetInstance[]
              } as ExerciseInstance,

              // Bent-over Rows
              {
                id: "rows-1",
                exerciseDefinitionId: "bent-over-row",
                variationId: "barbell-row",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "row-set-1",
                    setNumber: 1,
                    plannedReps: 10,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 95, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 120
                  },
                  {
                    id: "row-set-2",
                    setNumber: 2,
                    plannedReps: 10,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 105, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 120
                  },
                  {
                    id: "row-set-3",
                    setNumber: 3,
                    plannedReps: 8,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 115, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 120
                  }
                ] as SetInstance[]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock
      ],
      tags: ["strength", "upper-body"]
    } as TrainingSession,

    // Session 3: Murph Workout (Run + Lift + Run)
    {
      id: "session-3",
      name: "Murph Workout",
      dateTime: new Date("2025-01-08T10:00:00"),
      status: TrainingSessionStatus.Upcoming,
      blocks: [
        // Opening Run
        {
          id: "murph-run-1",
          name: "Opening Mile",
          type: ActivityBlockType.Cardio,
          cardioActivity: {
            id: "murph-run-start",
            type: CardioType.Run,
            name: "1 Mile Run",
            plannedDistance: 1609, // 1 mile in meters
            plannedTime: 480,      // 8 minutes
            notes: "Start strong but controlled pace"
          } as CardioActivity
        } as ActivityBlock,

        // Main Calisthenics Block
        {
          id: "murph-calisthenics",
          name: "The Murph Calisthenics",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "murph-main",
            name: "100-200-300 Circuit",
            type: "circuit",
            rounds: 20, // Break into 20 rounds of 5-10-15
            restBetweenRounds: 60,
            exercises: [
              // Pull-ups (5 per round)
              {
                id: "pullups-murph",
                exerciseDefinitionId: "pullup",
                variationId: "standard-pullup",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "pullup-set",
                    setNumber: 1,
                    plannedReps: 5,
                    plannedWeight: {
                      type: "bodyweight"
                    } as WeightSpecification,
                    restAfter: 15
                  } as SetInstance
                ]
              } as ExerciseInstance,

              // Push-ups (10 per round) 
              {
                id: "pushups-murph",
                exerciseDefinitionId: "pushup",
                variationId: "standard-pushup",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "pushup-set",
                    setNumber: 1,
                    plannedReps: 10,
                    plannedWeight: {
                      type: "bodyweight"
                    } as WeightSpecification,
                    restAfter: 15
                  } as SetInstance
                ]
              } as ExerciseInstance,

              // Air Squats (15 per round)
              {
                id: "squats-murph",
                exerciseDefinitionId: "squat",
                variationId: "air-squat",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "squat-set",
                    setNumber: 1,
                    plannedReps: 15,
                    plannedWeight: {
                      type: "bodyweight"
                    } as WeightSpecification,
                    restAfter: 30
                  } as SetInstance
                ]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock,

        // Closing Run
        {
          id: "murph-run-2",
          name: "Closing Mile",
          type: ActivityBlockType.Cardio,
          cardioActivity: {
            id: "murph-run-end",
            type: CardioType.Run,
            name: "Final Mile",
            plannedDistance: 1609, // 1 mile in meters
            plannedTime: 540,      // 9 minutes (slower after calisthenics)
            notes: "Push through the fatigue, finish strong"
          } as CardioActivity
        } as ActivityBlock
      ],
      tags: ["hero-wod", "murph", "challenge"],
      notes: "The Murph - in honor of Navy Lieutenant Michael Murphy"
    } as TrainingSession,

    // Session 4: Full Body Strength
    {
      id: "session-4",
      name: "Full Body Strength",
      dateTime: new Date("2025-01-09T18:00:00"),
      status: TrainingSessionStatus.Upcoming,
      blocks: [
        // Warm-up
        {
          id: "fullbody-warmup",
          name: "Warm-up",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "fullbody-warmup-block",
            name: "Dynamic Warm-up",
            type: "circuit",
            rounds: 1,
            exercises: [
              {
                id: "jumping-jacks-warmup",
                exerciseDefinitionId: "jumping-jack",
                variationId: "standard-jumping-jack",
                repetitionType: "Time" as any,
                sets: [
                  {
                    id: "jj-set-1",
                    setNumber: 1,
                    plannedTime: 30,
                    restAfter: 15
                  } as SetInstance
                ]
              } as ExerciseInstance,
              {
                id: "mountain-climbers-warmup",
                exerciseDefinitionId: "mountain-climber",
                variationId: "standard-mountain-climber",
                repetitionType: "Time" as any,
                sets: [
                  {
                    id: "mc-set-1",
                    setNumber: 1,
                    plannedTime: 30,
                    restAfter: 60
                  } as SetInstance
                ]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock,

        // Main Compound Movements
        {
          id: "fullbody-compounds",
          name: "Compound Movements",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "compounds-block",
            name: "Big Three",
            type: "exercise",
            exercises: [
              // Deadlifts
              {
                id: "deadlift-fullbody",
                exerciseDefinitionId: "deadlift",
                variationId: "conventional-deadlift",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "dl-set-1",
                    setNumber: 1,
                    plannedReps: 5,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 185, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 180
                  },
                  {
                    id: "dl-set-2",
                    setNumber: 2,
                    plannedReps: 5,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 205, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 180
                  },
                  {
                    id: "dl-set-3",
                    setNumber: 3,
                    plannedReps: 3,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 225, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 240
                  }
                ] as SetInstance[]
              } as ExerciseInstance,

              // Squats
              {
                id: "squat-fullbody",
                exerciseDefinitionId: "squat",
                variationId: "back-squat",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "sq-set-1",
                    setNumber: 1,
                    plannedReps: 8,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 165, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 150
                  },
                  {
                    id: "sq-set-2",
                    setNumber: 2,
                    plannedReps: 8,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 175, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 150
                  },
                  {
                    id: "sq-set-3",
                    setNumber: 3,
                    plannedReps: 6,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 185, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 180
                  }
                ] as SetInstance[]
              } as ExerciseInstance,

              // Overhead Press
              {
                id: "ohp-fullbody",
                exerciseDefinitionId: "overhead-press",
                variationId: "military-press",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "ohp-set-1",
                    setNumber: 1,
                    plannedReps: 8,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 85, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 120
                  },
                  {
                    id: "ohp-set-2",
                    setNumber: 2,
                    plannedReps: 6,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 95, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 120
                  },
                  {
                    id: "ohp-set-3",
                    setNumber: 3,
                    plannedReps: 4,
                    plannedWeight: {
                      type: "percentage",
                      percentage: 90,
                      maxType: "1RM"
                    } as WeightSpecification,
                    restAfter: 150
                  }
                ] as SetInstance[]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock,

        // Accessory Superset
        {
          id: "fullbody-accessories",
          name: "Accessory Superset",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "accessories-block",
            name: "Upper/Lower Superset",
            type: "superset",
            rounds: 3,
            restBetweenRounds: 90,
            exercises: [
              // Bent-over Rows
              {
                id: "rows-accessory",
                exerciseDefinitionId: "bent-over-row",
                variationId: "dumbbell-row",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "row-acc-set",
                    setNumber: 1,
                    plannedReps: 12,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 40, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 30
                  } as SetInstance
                ]
              } as ExerciseInstance,

              // Lunges
              {
                id: "lunges-accessory",
                exerciseDefinitionId: "lunge",
                variationId: "dumbbell-lunge",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "lunge-acc-set",
                    setNumber: 1,
                    plannedReps: 10,
                    plannedWeight: {
                      type: "absolute",
                      weight: { weight: 25, unit: "lbs" }
                    } as WeightSpecification,
                    restAfter: 30
                  } as SetInstance
                ]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock,

        // Core Finisher
        {
          id: "fullbody-core",
          name: "Core Finisher",
          type: ActivityBlockType.Structured,
          structuredTraining: {
            id: "core-block",
            name: "Core Circuit",
            type: "circuit",
            rounds: 2,
            restBetweenRounds: 60,
            exercises: [
              {
                id: "plank-core",
                exerciseDefinitionId: "plank",
                variationId: "standard-plank",
                repetitionType: "Time" as any,
                sets: [
                  {
                    id: "plank-set",
                    setNumber: 1,
                    plannedTime: 45,
                    restAfter: 15
                  } as SetInstance
                ]
              } as ExerciseInstance,
              {
                id: "mountain-climbers-core",
                exerciseDefinitionId: "mountain-climber",
                variationId: "standard-mountain-climber",
                repetitionType: "Reps" as any,
                sets: [
                  {
                    id: "mc-core-set",
                    setNumber: 1,
                    plannedReps: 20,
                    restAfter: 30
                  } as SetInstance
                ]
              } as ExerciseInstance
            ]
          } as ExerciseBlock
        } as ActivityBlock
      ],
      tags: ["strength", "full-body", "compound"]
    } as TrainingSession,

    // Session 5: Active Recovery Walk
    {
      id: "session-5",
      name: "Recovery Walk",
      dateTime: new Date("2025-01-10T16:00:00"),
      status: TrainingSessionStatus.Upcoming,
      blocks: [
        {
          id: "recovery-walk",
          name: "Easy Walk",
          type: ActivityBlockType.Cardio,
          cardioActivity: {
            id: "walk-1",
            type: CardioType.Walk,
            name: "Recovery Walk",
            plannedTime: 1800,    // 30 minutes
            plannedDistance: 2400, // ~1.5 miles
            notes: "Easy pace, focus on movement and recovery"
          } as CardioActivity
        } as ActivityBlock
      ],
      tags: ["recovery", "active-rest"]
    } as TrainingSession
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