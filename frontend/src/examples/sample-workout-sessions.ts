import {
    TrainingSession,
    TrainingSessionStatus,
    ActivityBlockType,
    CardioType,
    ActivityBlock,
    CardioActivity,
    ExerciseBlock,
    ExerciseInstance,
    SetInstance,
    WeightSpecification,
    // New types for planned vs execution
    PlannedTrainingSession,
    createWorkoutExecution,
    getWorkoutProgress,
    // Unified approach utilities
    startWorkout,
    completeWorkout
} from "@/types/workouts/workout-types"
import { RepetitionType } from "@/types/workouts/exercise-definitions"

// Session 1: Simple 3 Mile Run
export const threeMileRunSession: TrainingSession = {
    id: "easy-3-mile-run",
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
} as TrainingSession

// Session 2: Full weightlifting Session
export const upperBodyStrengthSession: TrainingSession = {
    id: "upper-body-strength",
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
} as TrainingSession

// Session 3: Murph Workout (Run + Lift + Run)
export const murphWorkoutSession: TrainingSession = {
    id: "murph-workout",
    name: "🇺🇸 Murph Workout 🦅 LET'S GOOOO",
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
            name: "Calisthenics",
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
} as TrainingSession

// Session 4: Full Body Strength
export const fullBodyStrengthSession: TrainingSession = {
    id: "full-body-strength",
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
                        repetitionType: RepetitionType.Reps,
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
} as TrainingSession

// Session 5: Active Recovery Walk
export const recoveryWalkSession: TrainingSession = {
    id: "recovery-walk",
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

// ================================================================
// NEW PLANNED VS EXECUTION EXAMPLES
// ================================================================

// Example 1: Planned Running Session (Clean Template)
export const plannedRunningSession: PlannedTrainingSession = {
    id: "planned_run_1",
    name: "Morning 5K Run",
    dateTime: new Date("2024-01-15T07:00:00"),
    status: TrainingSessionStatus.Upcoming,
    estimatedDuration: 30, // 30 minutes
    blocks: [
        {
            id: "warmup_block",
            name: "Warm-up Walk",
            type: ActivityBlockType.Cardio,
            cardioActivity: {
                id: "warmup_walk",
                type: CardioType.Walk,
                name: "Warm-up Walk",
                plannedTime: 300, // 5 minutes
                plannedDistance: 400, // 400 meters
                notes: "Easy pace warm-up"
            }
        },
        {
            id: "main_run_block",
            name: "Main Run",
            type: ActivityBlockType.Cardio,
            cardioActivity: {
                id: "main_run",
                type: CardioType.Run,
                name: "5K Run",
                plannedDistance: 5000, // 5000 meters (5K)
                plannedTime: 1500, // 25 minutes target
                notes: "Steady aerobic pace"
            }
        }
    ],
    notes: "Easy morning run",
    tags: ["cardio", "running", "morning"]
};

// Example 2: Planned weightlifting Session (Clean Template)
export const plannedStrengthSession: PlannedTrainingSession = {
    id: "planned_strength_1",
    name: "Upper Body Strength",
    dateTime: new Date("2024-01-15T18:00:00"),
    status: TrainingSessionStatus.Upcoming,
    estimatedDuration: 60, // 60 minutes
    blocks: [
        {
            id: "strength_block",
            name: "Upper Body Work",
            type: ActivityBlockType.Structured,
            structuredTraining: {
                id: "upper_body_block",
                name: "Upper Body Exercises",
                type: "exercise",
                exercises: [
                    {
                        id: "bench_press_exercise",
                        exerciseDefinitionId: "bench-press",
                        variationId: "barbell-bench",
                        repetitionType: RepetitionType.Reps,
                        sets: [
                            {
                                id: "bench_set_1",
                                setNumber: 1,
                                plannedReps: 8,
                                plannedWeight: { type: "absolute", weight: { weight: 135, unit: "lbs" } },
                                restAfter: 90
                            },
                            {
                                id: "bench_set_2",
                                setNumber: 2,
                                plannedReps: 8,
                                plannedWeight: { type: "absolute", weight: { weight: 135, unit: "lbs" } },
                                restAfter: 90
                            },
                            {
                                id: "bench_set_3",
                                setNumber: 3,
                                plannedReps: 8,
                                plannedWeight: { type: "absolute", weight: { weight: 135, unit: "lbs" } },
                                restAfter: 90
                            }
                        ],
                        notes: "Focus on controlled movement"
                    }
                ]
            }
        }
    ],
    notes: "Upper body strength focus",
    tags: ["strength", "upper-body", "evening"]
};

// Example 3: Starting a Workout (Convert Planned to Execution)
export const startRunningWorkout = (): TrainingSession => {
    return createWorkoutExecution(plannedRunningSession);
};

// Example 4: Completed Running Workout - Actual vs Planned Performance
export const completedRunningWorkout: TrainingSession = (() => {
    const execution = createWorkoutExecution(plannedRunningSession);

    // User completed the warm-up walk
    const warmupCardio = execution.blocks[0].cardioActivity;
    if (warmupCardio) {
        warmupCardio.actualTime = 360; // Actually took 6 minutes instead of planned 5
        warmupCardio.actualDistance = 450; // Walked 450 meters instead of planned 400
    }

    // User ran 4K instead of planned 5K (stopped early)
    const mainRunCardio = execution.blocks[1].cardioActivity;
    if (mainRunCardio) {
        mainRunCardio.actualTime = 1200; // 20 minutes
        mainRunCardio.actualDistance = 4000; // Only 4K instead of planned 5K
        mainRunCardio.notes = "Felt tired, stopped at 4K";
    }

    // Mark as completed
    execution.status = TrainingSessionStatus.Completed;
    execution.completedAt = new Date();
    execution.actualDuration = 26; // 26 minutes total
    execution.intensityRating = 7;
    execution.enjoymentRating = 8;
    execution.notes = "Good run, felt strong until 4K mark";

    return execution;
})();

// Example 5: Completed Strength Workout - User Increased Weight
export const completedStrengthWorkout: TrainingSession = (() => {
    const execution = createWorkoutExecution(plannedStrengthSession);

    // Get the bench press exercise
    const strengthBlock = execution.blocks[0].structuredTraining;
    if (strengthBlock?.exercises) {
        const benchPress = strengthBlock.exercises[0];

        // User decided to increase weight from planned 135lbs to 155lbs
        benchPress.sets.forEach(set => {
            set.actualWeight = { weight: 155, unit: "lbs" }; // Increased from planned 135lbs
            set.actualReps = set.plannedReps; // Hit planned reps
            set.completed = true;
            set.notes = "Felt strong, increased weight by 20lbs";
        });

        benchPress.notes = "Great session, was able to increase weight!";
    }

    // Mark as completed
    execution.status = TrainingSessionStatus.Completed;
    execution.completedAt = new Date();
    execution.actualDuration = 45; // 45 minutes actual
    execution.intensityRating = 9;
    execution.enjoymentRating = 9;
    execution.notes = "Excellent strength session, PRs on bench press!";

    return execution;
})();

// Example 6: Progress Tracking Function
export const trackWorkoutProgress = (execution: TrainingSession) => {
    const progress = getWorkoutProgress(execution);

    console.log(`Overall Progress: ${progress.overall.toFixed(1)}%`);
    console.log(`Current Block Progress: ${progress.currentBlock.toFixed(1)}%`);
    console.log(`Current Exercise Progress: ${progress.currentExercise.toFixed(1)}%`);

    return progress;
};

// Example 7: Comparison Function - Planned vs Actual
export const compareActualVsPlanned = (execution: TrainingSession) => {
    console.log(`\n=== WORKOUT COMPARISON: ${execution.id} ===`);

    execution.blocks.forEach((block, blockIndex) => {
        console.log(`\nBlock ${blockIndex + 1}: ${block.name}`);

        if (block.cardioActivity) {
            const cardio = block.cardioActivity;
            console.log(`  Cardio Activity: ${cardio.name}`);

            if (cardio.plannedDistance && cardio.actualDistance) {
                console.log(`  Distance: Planned ${cardio.plannedDistance}m, Actual ${cardio.actualDistance}m`);
                const variance = ((cardio.actualDistance - cardio.plannedDistance) / cardio.plannedDistance) * 100;
                console.log(`  Variance: ${variance.toFixed(1)}%`);
            }

            if (cardio.plannedTime && cardio.actualTime) {
                console.log(`  Time: Planned ${cardio.plannedTime}s, Actual ${cardio.actualTime}s`);
            }
        }

        if (block.structuredTraining?.exercises) {
            block.structuredTraining.exercises.forEach((exercise, exIndex) => {
                console.log(`  Exercise ${exIndex + 1}: ${exercise.exerciseDefinitionId}`);

                exercise.sets.forEach((set, setIndex) => {
                    if (set.plannedWeight && set.actualWeight) {
                        console.log(`    Set ${setIndex + 1}: Planned ${JSON.stringify(set.plannedWeight)}, Actual ${set.actualWeight.weight}${set.actualWeight.unit}`);
                    }
                    if (set.plannedReps && set.actualReps) {
                        console.log(`    Reps: Planned ${set.plannedReps}, Actual ${set.actualReps}`);
                    }
                });
            });
        }
    });

    console.log(`\nStatus: ${execution.status}`);
    if (execution.intensityRating) {
        console.log(`Intensity Rating: ${execution.intensityRating}/10`);
    }
    if (execution.enjoymentRating) {
        console.log(`Enjoyment Rating: ${execution.enjoymentRating}/10`);
    }
};

// Example Usage:
// const runProgress = trackWorkoutProgress(completedRunningWorkout);
// compareActualVsPlanned(completedRunningWorkout);
// compareActualVsPlanned(completedStrengthWorkout);

// ================================================================
// NEW UNIFIED APPROACH EXAMPLES (Single Evolving Type)
// ================================================================
// The unified approach uses a single TrainingSession type that evolves from planned to executed

// Example: Planned Running Session (Clean Template)
export const unifiedPlannedRun: TrainingSession = {
  id: "unified_run_1",
  name: "Morning 5K Run",
  dateTime: new Date("2024-01-15T07:00:00"),
  status: TrainingSessionStatus.Upcoming,
  estimatedDuration: 30, // 30 minutes
  blocks: [
    {
      id: "warmup_block",
      name: "Warm-up Walk", 
      type: ActivityBlockType.Cardio,
      cardioActivity: {
        id: "warmup_walk",
        type: CardioType.Walk,
        name: "Warm-up Walk",
        plannedTime: 300, // 5 minutes
        plannedDistance: 400, // 400 meters
        notes: "Easy pace warm-up"
      }
    },
    {
      id: "main_run_block",
      name: "Main Run",
      type: ActivityBlockType.Cardio,
      cardioActivity: {
        id: "main_run",
        type: CardioType.Run,
        name: "5K Run",
        plannedDistance: 5000, // 5000 meters (5K)
        plannedTime: 1500, // 25 minutes target
        notes: "Steady aerobic pace"
      }
    }
  ],
  notes: "Easy morning run",
  tags: ["cardio", "running", "morning"]
};

// Same session after starting (in-progress)
export const unifiedInProgressRun: TrainingSession = {
  ...unifiedPlannedRun,
  status: TrainingSessionStatus.InProgress,
  startedAt: new Date("2024-01-15T07:05:00"),
  pausedDuration: 0,
  currentBlockIndex: 0,
  currentExerciseIndex: 0,
  currentSetIndex: 0
};

// Same session after completion with actual performance data
export const unifiedCompletedRun: TrainingSession = {
  ...unifiedInProgressRun,
  status: TrainingSessionStatus.Completed,
  completedAt: new Date("2024-01-15T07:31:00"),
  actualDuration: 26, // 26 minutes total
  intensityRating: 7,
  enjoymentRating: 8,
  notes: "Good run, felt strong until 4K mark",
  blocks: [
    {
      ...unifiedInProgressRun.blocks[0],
      cardioActivity: {
        ...unifiedInProgressRun.blocks[0].cardioActivity!,
        actualTime: 360, // Actually took 6 minutes instead of planned 5
        actualDistance: 450, // Walked 450 meters instead of planned 400
      }
    },
    {
      ...unifiedInProgressRun.blocks[1], 
      cardioActivity: {
        ...unifiedInProgressRun.blocks[1].cardioActivity!,
        actualTime: 1200, // 20 minutes
        actualDistance: 4000, // Only 4K instead of planned 5K
        notes: "Felt tired, stopped at 4K"
      }
    }
  ]
};

// Utility functions for the unified approach
export const startUnifiedWorkout = () => {
  const inProgress = startWorkout(unifiedPlannedRun);
  console.log(`Started workout: ${inProgress.id} at ${inProgress.startedAt}`);
  return inProgress;
};

export const completeUnifiedWorkout = () => {
  const completed = completeWorkout(unifiedInProgressRun, {
    intensityRating: 8,
    enjoymentRating: 9,
    notes: "Great workout!"
  });
  console.log(`Completed workout: ${completed.id} - Duration: ${completed.actualDuration} min`);
  return completed;
};

// Progress tracking with unified approach
export const trackUnifiedProgress = (session: TrainingSession) => {
  const progress = getWorkoutProgress(session);
  
  console.log(`=== PROGRESS: ${session.name} ===`);
  console.log(`Status: ${session.status}`);
  console.log(`Overall Progress: ${progress.overall.toFixed(1)}%`);
  
  return progress;
};

// Comparison with unified approach
export const compareUnifiedSession = (session: TrainingSession) => {
  console.log(`\n=== WORKOUT: ${session.name} ===`);
  console.log(`Status: ${session.status}`);
  
  if (session.estimatedDuration && session.actualDuration) {
    console.log(`Duration: Planned ${session.estimatedDuration}min, Actual ${session.actualDuration}min`);
  }
  
  session.blocks.forEach((block) => {
    if (block.cardioActivity) {
      const cardio = block.cardioActivity;
      if (cardio.plannedDistance && cardio.actualDistance) {
        const variance = ((cardio.actualDistance - cardio.plannedDistance) / cardio.plannedDistance) * 100;
        console.log(`  Distance: Planned ${cardio.plannedDistance}m, Actual ${cardio.actualDistance}m (${variance.toFixed(1)}%)`);
      }
    }
  });
  
  if (session.intensityRating) console.log(`Intensity: ${session.intensityRating}/10`);
};

// ================================================================
// NEW EXAMPLE SESSIONS - REQUESTED VARIATIONS
// ================================================================

// 1. Completed Run Workout - Morning 5K with actual performance data
export const completedMorning5K: TrainingSession = {
  id: "completed-5k-run",
  name: "Morning 5K Run",
  dateTime: new Date("2025-01-11T07:00:00"),
  status: TrainingSessionStatus.Completed,
  estimatedDuration: 30,
  actualDuration: 28,
  startedAt: new Date("2025-01-11T07:00:00"),
  completedAt: new Date("2025-01-11T07:28:00"),
  intensityRating: 8,
  enjoymentRating: 9,
  blocks: [
    {
      id: "warmup-walk-block",
      name: "Warm-up Walk",
      type: ActivityBlockType.Cardio,
      cardioActivity: {
        id: "warmup-walk-activity",
        type: CardioType.Walk,
        name: "Pre-run Walk",
        plannedTime: 300,
        plannedDistance: 400,
        actualTime: 240, // 4 minutes instead of planned 5
        actualDistance: 350, // 350m instead of planned 400m
        notes: "Felt ready to start running sooner"
      }
    },
    {
      id: "main-5k-block",
      name: "5K Run",
      type: ActivityBlockType.Cardio,
      cardioActivity: {
        id: "main-5k-activity",
        type: CardioType.Run,
        name: "5K Distance Run",
        plannedDistance: 5000,
        plannedTime: 1500, // planned 25 minutes
        actualDistance: 5000, // completed full 5K
        actualTime: 1440, // 24 minutes - faster than planned!
        actualPace: 4.8, // seconds per meter
        heartRate: {
          average: 165,
          max: 178
        },
        calories: 320,
        notes: "Felt strong throughout, negative split with faster second half"
      }
    }
  ],
  notes: "Great morning run! Beat my planned time and felt energized all day.",
  tags: ["cardio", "running", "morning", "5k"]
};

// 2. Completed Lift Workout - User lifted different weights than planned
export const completedBenchPressWorkout: TrainingSession = {
  id: "completed-bench-workout",
  name: "Chest & Triceps Strength",
  dateTime: new Date("2025-01-12T18:30:00"),
  status: TrainingSessionStatus.Completed,
  estimatedDuration: 45,
  actualDuration: 52,
  startedAt: new Date("2025-01-12T18:30:00"),
  completedAt: new Date("2025-01-12T19:22:00"),
  intensityRating: 9,
  enjoymentRating: 8,
  blocks: [
    {
      id: "chest-main-block",
      name: "Bench Press Focus",
      type: ActivityBlockType.Structured,
      structuredTraining: {
        id: "bench-press-block",
        name: "Bench Press Sets",
        type: "exercise",
        exercises: [
          {
            id: "bench-press-main",
            exerciseDefinitionId: "bench-press",
            variationId: "barbell-bench",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "bench-set-1",
                setNumber: 1,
                plannedReps: 8,
                plannedWeight: { type: "absolute", weight: { weight: 155, unit: "lbs" } },
                actualReps: 8,
                actualWeight: { weight: 165, unit: "lbs" }, // increased by 10lbs
                completed: true,
                restAfter: 120,
                notes: "Felt strong, bumped up weight"
              },
              {
                id: "bench-set-2",
                setNumber: 2,
                plannedReps: 6,
                plannedWeight: { type: "absolute", weight: { weight: 165, unit: "lbs" } },
                actualReps: 6,
                actualWeight: { weight: 175, unit: "lbs" }, // increased by 10lbs
                completed: true,
                restAfter: 150,
                notes: "Still felt good, increased again"
              },
              {
                id: "bench-set-3",
                setNumber: 3,
                plannedReps: 4,
                plannedWeight: { type: "absolute", weight: { weight: 175, unit: "lbs" } },
                actualReps: 5, // got an extra rep!
                actualWeight: { weight: 185, unit: "lbs" }, // increased by 10lbs
                completed: true,
                restAfter: 180,
                notes: "PR! Got 5 reps at 185lbs instead of planned 4 at 175lbs"
              }
            ],
            notes: "Amazing session - hit PRs on all sets!"
          },
          {
            id: "tricep-dips-accessory",
            exerciseDefinitionId: "tricep-dip",
            variationId: "parallel-bar-dip",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "dip-set-1",
                setNumber: 1,
                plannedReps: 12,
                plannedWeight: { type: "bodyweight" },
                actualReps: 10, // got fewer reps due to fatigue from bench PRs
                actualWeight: { weight: 0, unit: "lbs" },
                completed: true,
                restAfter: 90,
                notes: "Triceps were fried from heavy bench press"
              },
              {
                id: "dip-set-2",
                setNumber: 2,
                plannedReps: 10,
                plannedWeight: { type: "bodyweight" },
                actualReps: 8,
                actualWeight: { weight: 0, unit: "lbs" },
                completed: true,
                restAfter: 90,
                notes: "As expected, still feeling the bench work"
              }
            ]
          }
        ]
      }
    }
  ],
  notes: "Incredible session! Hit new PRs on bench press. The extra weight felt manageable and I was able to maintain good form throughout.",
  tags: ["strength", "chest", "triceps", "PR", "evening"]
};

// 3. Ongoing Lift Session - Currently in progress  
export const ongoingSquatWorkout: TrainingSession = {
  id: "ongoing-squat-workout",
  name: "Lower Body Power",
  dateTime: new Date("2025-01-13T17:00:00"),
  status: TrainingSessionStatus.InProgress,
  estimatedDuration: 60,
  startedAt: new Date("2025-01-13T17:00:00"),
  pausedDuration: 180, // 3 minutes of rest time so far
  currentBlockIndex: 1, // on the second block (main squats)
  currentExerciseIndex: 0, // first exercise in the block
  currentSetIndex: 2, // on the third set
  blocks: [
    {
      id: "leg-warmup-block",
      name: "Leg Warm-up",
      type: ActivityBlockType.Structured,
      structuredTraining: {
        id: "leg-warmup-exercises",
        name: "Dynamic Warm-up",
        type: "circuit",
        rounds: 1,
        exercises: [
          {
            id: "bodyweight-squats-warmup",
            exerciseDefinitionId: "squat",
            variationId: "air-squat",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "warmup-squat-set",
                setNumber: 1,
                plannedReps: 15,
                plannedWeight: { type: "bodyweight" },
                actualReps: 15,
                actualWeight: { weight: 0, unit: "lbs" },
                completed: true,
                restAfter: 30,
                notes: "Good warm-up, felt loose"
              }
            ]
          },
          {
            id: "leg-swings-warmup",
            exerciseDefinitionId: "leg-swing",
            variationId: "standing-leg-swing",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "leg-swing-set",
                setNumber: 1,
                plannedReps: 20,
                actualReps: 20,
                completed: true,
                restAfter: 60,
                notes: "Hip mobility felt good"
              }
            ]
          }
        ]
      }
    },
    {
      id: "main-squat-block",
      name: "Back Squat Sets",
      type: ActivityBlockType.Structured,
      structuredTraining: {
        id: "back-squat-main",
        name: "Heavy Back Squats",
        type: "exercise",
        exercises: [
          {
            id: "back-squat-main-exercise",
            exerciseDefinitionId: "squat",
            variationId: "back-squat",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "squat-set-1",
                setNumber: 1,
                plannedReps: 5,
                plannedWeight: { type: "absolute", weight: { weight: 185, unit: "lbs" } },
                actualReps: 5,
                actualWeight: { weight: 185, unit: "lbs" },
                completed: true,
                restAfter: 180,
                notes: "Solid first set, felt strong"
              },
              {
                id: "squat-set-2",
                setNumber: 2,
                plannedReps: 5,
                plannedWeight: { type: "absolute", weight: { weight: 205, unit: "lbs" } },
                actualReps: 5,
                actualWeight: { weight: 205, unit: "lbs" },
                completed: true,
                restAfter: 180,
                notes: "Good depth, maintaining form"
              },
              {
                id: "squat-set-3",
                setNumber: 3,
                plannedReps: 3,
                plannedWeight: { type: "absolute", weight: { weight: 225, unit: "lbs" } },
                // This set is in progress - no actual data yet
                restAfter: 240
              },
              {
                id: "squat-set-4",
                setNumber: 4,
                plannedReps: 2,
                plannedWeight: { type: "absolute", weight: { weight: 245, unit: "lbs" } },
                restAfter: 240
              }
            ],
            notes: "Working up to a heavy double. Feeling strong so far."
          }
        ]
      }
    },
    {
      id: "accessory-leg-block",
      name: "Leg Accessories",
      type: ActivityBlockType.Structured,
      structuredTraining: {
        id: "leg-accessories",
        name: "Romanian Deadlifts & Lunges",
        type: "exercise",
        exercises: [
          {
            id: "romanian-deadlift",
            exerciseDefinitionId: "romanian-deadlift",
            variationId: "barbell-rdl",
            repetitionType: RepetitionType.Reps,
            sets: [
              {
                id: "rdl-set-1",
                setNumber: 1,
                plannedReps: 10,
                plannedWeight: { type: "absolute", weight: { weight: 135, unit: "lbs" } },
                restAfter: 120
              },
              {
                id: "rdl-set-2",
                setNumber: 2,
                plannedReps: 10,
                plannedWeight: { type: "absolute", weight: { weight: 135, unit: "lbs" } },
                restAfter: 120
              }
            ]
          }
        ]
      }
    }
  ],
  tags: ["strength", "legs", "squat", "evening", "in-progress"]
};