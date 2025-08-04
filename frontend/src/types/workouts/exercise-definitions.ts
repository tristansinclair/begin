// Exercise definitions - the "library" of exercises that can be performed
// These are the templates/blueprints for exercises

export enum Equipment {
  Barbell = "Barbell",
  Dumbbell = "Dumbbell",
  SquatRack = "SquatRack",
  Kettlebell = "Kettlebell",
  Bodyweight = "Bodyweight",
  Cable = "Cable",
  Machine = "Machine",
}

export enum MuscleGroup {
  Chest = "Chest",
  Back = "Back",
  Shoulders = "Shoulders",
  Arms = "Arms",
  Legs = "Legs",
  Core = "Core",
  Glutes = "Glutes",
  Hamstrings = "Hamstrings",
  Quadriceps = "Quadriceps",
  Calves = "Calves",
  Biceps = "Biceps",
  Triceps = "Triceps",
  Forearms = "Forearms",
}

export enum UpperLower {
  Upper = "Upper",
  Lower = "Lower",
  Full = "Full",
}

export enum RepetitionType {
  Reps = "Reps",
  Time = "Time",
  Distance = "Distance",
  AMRAP = "AMRAP",
}

export type ExerciseVariation = {
  id: string;
  name: string;
  equipment: Equipment[];
  instructions?: string;
}

export type ExerciseDefinition = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup[];
  upperLower: UpperLower;
  supportedRepTypes: RepetitionType[];
  variations: ExerciseVariation[];
  description?: string;
}

// Common exercise definitions
export const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  {
    id: "bench-press",
    name: "Bench Press",
    muscleGroup: [MuscleGroup.Chest, MuscleGroup.Triceps, MuscleGroup.Shoulders],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "barbell-bench", name: "Barbell Bench Press", equipment: [Equipment.Barbell] },
      { id: "dumbbell-bench", name: "Dumbbell Bench Press", equipment: [Equipment.Dumbbell] }
    ]
  },
  {
    id: "squat",
    name: "Squat",
    muscleGroup: [MuscleGroup.Legs, MuscleGroup.Glutes, MuscleGroup.Core],
    upperLower: UpperLower.Lower,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "back-squat", name: "Back Squat", equipment: [Equipment.Barbell, Equipment.SquatRack] },
      { id: "front-squat", name: "Front Squat", equipment: [Equipment.Barbell, Equipment.SquatRack] },
      { id: "goblet-squat", name: "Goblet Squat", equipment: [Equipment.Dumbbell] },
      { id: "air-squat", name: "Air Squat", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: [MuscleGroup.Back, MuscleGroup.Glutes, MuscleGroup.Hamstrings, MuscleGroup.Core],
    upperLower: UpperLower.Full,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "conventional-deadlift", name: "Conventional Deadlift", equipment: [Equipment.Barbell] },
      { id: "sumo-deadlift", name: "Sumo Deadlift", equipment: [Equipment.Barbell] },
      { id: "romanian-deadlift", name: "Romanian Deadlift", equipment: [Equipment.Barbell] },
      { id: "dumbbell-deadlift", name: "Dumbbell Deadlift", equipment: [Equipment.Dumbbell] }
    ]
  },
  {
    id: "pullup",
    name: "Pull-up",
    muscleGroup: [MuscleGroup.Back, MuscleGroup.Biceps],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP, RepetitionType.Time],
    variations: [
      { id: "standard-pullup", name: "Pull-up", equipment: [Equipment.Bodyweight] },
      { id: "chin-up", name: "Chin-up", equipment: [Equipment.Bodyweight] },
      { id: "wide-grip-pullup", name: "Wide Grip Pull-up", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "pushup",
    name: "Push-up",
    muscleGroup: [MuscleGroup.Chest, MuscleGroup.Triceps, MuscleGroup.Shoulders, MuscleGroup.Core],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP, RepetitionType.Time],
    variations: [
      { id: "standard-pushup", name: "Push-up", equipment: [Equipment.Bodyweight] },
      { id: "diamond-pushup", name: "Diamond Push-up", equipment: [Equipment.Bodyweight] },
      { id: "wide-pushup", name: "Wide Push-up", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscleGroup: [MuscleGroup.Shoulders, MuscleGroup.Triceps, MuscleGroup.Core],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "military-press", name: "Military Press", equipment: [Equipment.Barbell] },
      { id: "dumbbell-press", name: "Dumbbell Shoulder Press", equipment: [Equipment.Dumbbell] },
      { id: "push-press", name: "Push Press", equipment: [Equipment.Barbell] }
    ]
  },
  {
    id: "bent-over-row",
    name: "Bent-over Row",
    muscleGroup: [MuscleGroup.Back, MuscleGroup.Biceps],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "barbell-row", name: "Barbell Row", equipment: [Equipment.Barbell] },
      { id: "dumbbell-row", name: "Dumbbell Row", equipment: [Equipment.Dumbbell] },
      { id: "t-bar-row", name: "T-Bar Row", equipment: [Equipment.Barbell] }
    ]
  },
  {
    id: "lunge",
    name: "Lunge",
    muscleGroup: [MuscleGroup.Legs, MuscleGroup.Glutes],
    upperLower: UpperLower.Lower,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "forward-lunge", name: "Forward Lunge", equipment: [Equipment.Bodyweight] },
      { id: "reverse-lunge", name: "Reverse Lunge", equipment: [Equipment.Bodyweight] },
      { id: "walking-lunge", name: "Walking Lunge", equipment: [Equipment.Bodyweight] },
      { id: "dumbbell-lunge", name: "Dumbbell Lunge", equipment: [Equipment.Dumbbell] }
    ]
  },
  {
    id: "dip",
    name: "Dip",
    muscleGroup: [MuscleGroup.Chest, MuscleGroup.Triceps, MuscleGroup.Shoulders],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "parallel-dip", name: "Parallel Bar Dips", equipment: [Equipment.Bodyweight] },
      { id: "bench-dip", name: "Bench Dips", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "plank",
    name: "Plank",
    muscleGroup: [MuscleGroup.Core, MuscleGroup.Shoulders],
    upperLower: UpperLower.Full,
    supportedRepTypes: [RepetitionType.Time],
    variations: [
      { id: "standard-plank", name: "Plank", equipment: [Equipment.Bodyweight] },
      { id: "side-plank", name: "Side Plank", equipment: [Equipment.Bodyweight] },
      { id: "plank-up-down", name: "Plank Up-Down", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "burpee",
    name: "Burpee",
    muscleGroup: [MuscleGroup.Chest, MuscleGroup.Legs, MuscleGroup.Core],
    upperLower: UpperLower.Full,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP, RepetitionType.Time],
    variations: [
      { id: "standard-burpee", name: "Burpee", equipment: [Equipment.Bodyweight] },
      { id: "burpee-box-jump", name: "Burpee Box Jump", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    muscleGroup: [MuscleGroup.Core, MuscleGroup.Shoulders, MuscleGroup.Legs],
    upperLower: UpperLower.Full,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.Time],
    variations: [
      { id: "standard-mountain-climber", name: "Mountain Climber", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "jumping-jack",
    name: "Jumping Jack",
    muscleGroup: [MuscleGroup.Legs, MuscleGroup.Shoulders],
    upperLower: UpperLower.Full,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.Time],
    variations: [
      { id: "standard-jumping-jack", name: "Jumping Jack", equipment: [Equipment.Bodyweight] }
    ]
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    muscleGroup: [MuscleGroup.Glutes, MuscleGroup.Hamstrings, MuscleGroup.Core],
    upperLower: UpperLower.Lower,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.Time],
    variations: [
      { id: "two-hand-swing", name: "Two-Hand Kettlebell Swing", equipment: [Equipment.Kettlebell] },
      { id: "one-hand-swing", name: "One-Hand Kettlebell Swing", equipment: [Equipment.Kettlebell] }
    ]
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    muscleGroup: [MuscleGroup.Biceps],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "barbell-curl", name: "Barbell Curl", equipment: [Equipment.Barbell] },
      { id: "dumbbell-curl", name: "Dumbbell Curl", equipment: [Equipment.Dumbbell] },
      { id: "hammer-curl", name: "Hammer Curl", equipment: [Equipment.Dumbbell] }
    ]
  },
  {
    id: "tricep-extension",
    name: "Tricep Extension",
    muscleGroup: [MuscleGroup.Triceps],
    upperLower: UpperLower.Upper,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", equipment: [Equipment.Dumbbell] },
      { id: "lying-tricep-extension", name: "Lying Tricep Extension", equipment: [Equipment.Barbell] }
    ]
  },
  {
    id: "calf-raise",
    name: "Calf Raise",
    muscleGroup: [MuscleGroup.Calves],
    upperLower: UpperLower.Lower,
    supportedRepTypes: [RepetitionType.Reps, RepetitionType.AMRAP],
    variations: [
      { id: "standing-calf-raise", name: "Standing Calf Raise", equipment: [Equipment.Bodyweight] },
      { id: "weighted-calf-raise", name: "Weighted Calf Raise", equipment: [Equipment.Dumbbell] }
    ]
  }
];