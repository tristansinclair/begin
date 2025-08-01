export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: string;
  notes?: string;
}

export interface WorkoutSection {
  name: string;
  type: 'warmup' | 'main' | 'superset' | 'circuit' | 'finisher' | 'cooldown';
  exercises: Exercise[];
  rounds?: number;
  restBetweenRounds?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: string;
  duration: string;
  targetMuscles: string;
  intensity: 'low' | 'medium' | 'high';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  sections: WorkoutSection[];
  totalExercises: number;
  estimatedCalories: number;
  description: string;
}

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'upper-body-power',
    name: 'Upper Body Power',
    type: 'Strength Training',
    duration: '45 min',
    targetMuscles: 'Chest, Back, Shoulders, Arms',
    intensity: 'high',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Dumbbells', 'Pull-up Bar', 'Cable Machine'],
    totalExercises: 6,
    estimatedCalories: 400,
    description: 'High-intensity upper body workout focusing on compound movements and power development.',
    sections: [
      {
        name: 'Warmup',
        type: 'warmup',
        exercises: [
          { name: 'Arm Circles', sets: 1, reps: '10 each direction', rest: '0s' },
          { name: 'Band Pull-Aparts', sets: 2, reps: '15', rest: '30s' },
          { name: 'Push-up to T', sets: 1, reps: '8', rest: '30s' }
        ]
      },
      {
        name: 'Superset A',
        type: 'superset',
        rounds: 3,
        restBetweenRounds: '2 min',
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10', weight: '75-85% 1RM', rest: '0s' },
          { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '2 min' }
        ]
      },
      {
        name: 'Superset B',
        type: 'superset',
        rounds: 3,
        restBetweenRounds: '90s',
        exercises: [
          { name: 'Shoulder Press', sets: 3, reps: '10', weight: '70-80% 1RM', rest: '0s' },
          { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: '90s' }
        ]
      },
      {
        name: 'Isolation Work',
        type: 'main',
        exercises: [
          { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        name: 'Finisher',
        type: 'finisher',
        rounds: 2,
        restBetweenRounds: '90s',
        exercises: [
          { name: 'Tricep Dips', sets: 2, reps: 'To failure', rest: '0s' },
          { name: 'Barbell Curls', sets: 2, reps: '21s', rest: '90s', notes: '7 bottom half + 7 top half + 7 full reps' }
        ]
      }
    ]
  },
  {
    id: 'hiit-cardio-blast',
    name: 'HIIT Cardio Blast',
    type: 'Cardio',
    duration: '30 min',
    targetMuscles: 'Full Body',
    intensity: 'high',
    difficulty: 'intermediate',
    equipment: ['Bodyweight', 'Timer'],
    totalExercises: 8,
    estimatedCalories: 350,
    description: 'High-intensity interval training to boost cardiovascular fitness and burn calories.',
    sections: [
      {
        name: 'Warmup',
        type: 'warmup',
        exercises: [
          { name: 'Light Jogging in Place', sets: 1, reps: '2 min', rest: '0s' },
          { name: 'Dynamic Stretching', sets: 1, reps: '3 min', rest: '0s' }
        ]
      },
      {
        name: 'HIIT Circuit',
        type: 'circuit',
        rounds: 4,
        restBetweenRounds: '2 min',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '45s', rest: '15s' },
          { name: 'Mountain Climbers', sets: 4, reps: '45s', rest: '15s' },
          { name: 'Jump Squats', sets: 4, reps: '45s', rest: '15s' },
          { name: 'High Knees', sets: 4, reps: '45s', rest: '15s' },
          { name: 'Push-up to T', sets: 4, reps: '45s', rest: '15s' },
          { name: 'Plank Jacks', sets: 4, reps: '45s', rest: '2 min' }
        ]
      },
      {
        name: 'Cooldown',
        type: 'cooldown',
        exercises: [
          { name: 'Walking', sets: 1, reps: '3 min', rest: '0s' },
          { name: 'Static Stretching', sets: 1, reps: '5 min', rest: '0s' }
        ]
      }
    ]
  },
  {
    id: 'leg-day-destroyer',
    name: 'Leg Day Destroyer',
    type: 'Strength Training',
    duration: '60 min',
    targetMuscles: 'Quadriceps, Glutes, Hamstrings, Calves',
    intensity: 'high',
    difficulty: 'advanced',
    equipment: ['Barbell', 'Dumbbells', 'Leg Press Machine', 'Calf Raise Machine'],
    totalExercises: 8,
    estimatedCalories: 450,
    description: 'Comprehensive leg workout targeting all major lower body muscle groups with progressive overload.',
    sections: [
      {
        name: 'Warmup',
        type: 'warmup',
        exercises: [
          { name: 'Leg Swings', sets: 1, reps: '10 each leg', rest: '0s' },
          { name: 'Bodyweight Squats', sets: 2, reps: '15', rest: '30s' },
          { name: 'Walking Lunges', sets: 1, reps: '20 total', rest: '60s' }
        ]
      },
      {
        name: 'Compound Movements',
        type: 'main',
        exercises: [
          { name: 'Back Squats', sets: 4, reps: '8-10', weight: '80-90% 1RM', rest: '3 min' },
          { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', weight: '75-85% 1RM', rest: '2.5 min' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each leg', rest: '90s' }
        ]
      },
      {
        name: 'Isolation Work',
        type: 'main',
        exercises: [
          { name: 'Leg Press', sets: 3, reps: '15-20', rest: '90s' },
          { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        name: 'Finisher',
        type: 'finisher',
        exercises: [
          { name: 'Calf Raises', sets: 4, reps: '20', rest: '45s' },
          { name: 'Wall Sit', sets: 3, reps: '60s', rest: '60s' }
        ]
      }
    ]
  },
  {
    id: 'full-body-circuit',
    name: 'Full Body Circuit',
    type: 'Circuit Training',
    duration: '50 min',
    targetMuscles: 'Full Body',
    intensity: 'medium',
    difficulty: 'intermediate',
    equipment: ['Dumbbells', 'Kettlebell', 'Resistance Bands', 'Mat'],
    totalExercises: 7,
    estimatedCalories: 380,
    description: 'Time-efficient full body workout combining strength and cardio in a circuit format.',
    sections: [
      {
        name: 'Dynamic Warmup',
        type: 'warmup',
        exercises: [
          { name: 'Arm Circles', sets: 1, reps: '30s', rest: '0s' },
          { name: 'Leg Swings', sets: 1, reps: '30s', rest: '0s' },
          { name: 'Torso Twists', sets: 1, reps: '30s', rest: '0s' },
          { name: 'Jumping Jacks', sets: 1, reps: '60s', rest: '60s' }
        ]
      },
      {
        name: 'Full Body Circuit',
        type: 'circuit',
        rounds: 4,
        restBetweenRounds: '2 min',
        exercises: [
          { name: 'Goblet Squats', sets: 4, reps: '15', rest: '30s' },
          { name: 'Push-ups', sets: 4, reps: '12', rest: '30s' },
          { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: '30s' },
          { name: 'Dumbbell Rows', sets: 4, reps: '12 each arm', rest: '30s' },
          { name: 'Plank', sets: 4, reps: '45s', rest: '30s' },
          { name: 'Reverse Lunges', sets: 4, reps: '10 each leg', rest: '30s' },
          { name: 'Pike Push-ups', sets: 4, reps: '8', rest: '2 min' }
        ]
      },
      {
        name: 'Core Finisher',
        type: 'finisher',
        exercises: [
          { name: 'Russian Twists', sets: 3, reps: '30', rest: '45s' },
          { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: '45s' }
        ]
      }
    ]
  },
  {
    id: 'active-recovery-flow',
    name: 'Active Recovery Flow',
    type: 'Recovery',
    duration: '30 min',
    targetMuscles: 'Full Body Mobility',
    intensity: 'low',
    difficulty: 'beginner',
    equipment: ['Yoga Mat', 'Foam Roller'],
    totalExercises: 12,
    estimatedCalories: 150,
    description: 'Gentle mobility and recovery session to promote blood flow and reduce muscle tension.',
    sections: [
      {
        name: 'Gentle Movement',
        type: 'warmup',
        exercises: [
          { name: 'Cat-Cow Stretch', sets: 1, reps: '10', rest: '0s' },
          { name: 'Arm Circles', sets: 1, reps: '10 each direction', rest: '0s' },
          { name: 'Neck Rolls', sets: 1, reps: '5 each direction', rest: '30s' }
        ]
      },
      {
        name: 'Mobility Flow',
        type: 'main',
        exercises: [
          { name: 'Hip Circles', sets: 2, reps: '10 each direction', rest: '30s' },
          { name: 'Leg Swings', sets: 2, reps: '10 each leg', rest: '30s' },
          { name: 'Shoulder Rolls', sets: 2, reps: '10', rest: '30s' },
          { name: 'Spinal Twists', sets: 2, reps: '10 each side', rest: '30s' },
          { name: 'Hip Flexor Stretch', sets: 2, reps: '30s each leg', rest: '30s' },
          { name: 'Hamstring Stretch', sets: 2, reps: '30s each leg', rest: '30s' }
        ]
      },
      {
        name: 'Foam Rolling',
        type: 'cooldown',
        exercises: [
          { name: 'IT Band Roll', sets: 1, reps: '60s each leg', rest: '30s' },
          { name: 'Calf Roll', sets: 1, reps: '60s each leg', rest: '30s' },
          { name: 'Quad Roll', sets: 1, reps: '60s each leg', rest: '30s' }
        ]
      }
    ]
  },
  {
    id: 'endurance-run',
    name: 'Endurance Run',
    type: 'Cardio',
    duration: '40 min',
    targetMuscles: 'Cardiovascular System, Legs',
    intensity: 'medium',
    difficulty: 'intermediate',
    equipment: ['Running Shoes', 'GPS Watch'],
    totalExercises: 1,
    estimatedCalories: 400,
    description: 'Steady-state cardio run to build aerobic endurance and mental toughness.',
    sections: [
      {
        name: 'Warmup',
        type: 'warmup',
        exercises: [
          { name: 'Dynamic Warm-up Walk', sets: 1, reps: '5 min', rest: '0s' },
          { name: 'Light Jogging', sets: 1, reps: '5 min', rest: '0s' }
        ]
      },
      {
        name: 'Main Run',
        type: 'main',
        exercises: [
          { 
            name: 'Steady Pace Run', 
            sets: 1, 
            reps: '30 min', 
            rest: '0s',
            notes: 'Maintain conversational pace (65-75% max HR)'
          }
        ]
      },
      {
        name: 'Cooldown',
        type: 'cooldown',
        exercises: [
          { name: 'Cool-down Walk', sets: 1, reps: '5 min', rest: '0s' },
          { name: 'Static Stretching', sets: 1, reps: '10 min', rest: '0s' }
        ]
      }
    ]
  }
];

// Helper function to get workout by ID
export const getWorkoutById = (id: string): WorkoutTemplate | undefined => {
  return workoutTemplates.find(workout => workout.id === id);
};

// Helper function to get workouts by type
export const getWorkoutsByType = (type: string): WorkoutTemplate[] => {
  return workoutTemplates.filter(workout => workout.type === type);
};

// Helper function to get workouts by difficulty
export const getWorkoutsByDifficulty = (difficulty: string): WorkoutTemplate[] => {
  return workoutTemplates.filter(workout => workout.difficulty === difficulty);
};