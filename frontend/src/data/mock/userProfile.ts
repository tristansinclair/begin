export interface WorkoutData {
  date: string;
  workoutType: string;
  duration: number;
  calories: number;
  workouts: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  fitnessGoal: string;
  workoutHistory: WorkoutData[];
  stats: {
    totalWorkouts: number;
    currentStreak: number;
    totalVolume: number;
    averageCaloriesPerWorkout: number;
  };
}

// Generate static workout data for the past 3 months
const generateWorkoutHistory = (): WorkoutData[] => {
  const workouts: WorkoutData[] = [];
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const workoutTypes = [
    { type: 'Strength Training', duration: [60, 90], calories: [400, 600] },
    { type: 'Cardio', duration: [45, 75], calories: [500, 750] },
    { type: 'HIIT', duration: [30, 50], calories: [450, 650] },
    { type: 'Recovery/Yoga', duration: [30, 60], calories: [150, 250] },
    { type: 'Light Cardio', duration: [30, 50], calories: [250, 400] },
    { type: 'Strength + Cardio', duration: [90, 120], calories: [650, 850] }
  ];

  // Create a realistic pattern averaging 5 workouts per week (May-July 2025)
  const staticDates = [
    // May 2025 - 22 workouts
    { date: '2025-05-01', type: 0, intensity: 0.8 },
    { date: '2025-05-02', type: 1, intensity: 0.7 },
    { date: '2025-05-05', type: 2, intensity: 0.9 },
    { date: '2025-05-06', type: 0, intensity: 0.6 },
    { date: '2025-05-07', type: 3, intensity: 0.4 },
    { date: '2025-05-09', type: 1, intensity: 0.8 },
    { date: '2025-05-10', type: 4, intensity: 0.5 },
    { date: '2025-05-12', type: 5, intensity: 0.9 },
    { date: '2025-05-13', type: 0, intensity: 0.7 },
    { date: '2025-05-14', type: 2, intensity: 0.8 },
    { date: '2025-05-16', type: 1, intensity: 0.6 },
    { date: '2025-05-17', type: 3, intensity: 0.5 },
    { date: '2025-05-19', type: 0, intensity: 0.8 },
    { date: '2025-05-20', type: 1, intensity: 0.7 },
    { date: '2025-05-21', type: 2, intensity: 0.9 },
    { date: '2025-05-23', type: 4, intensity: 0.5 },
    { date: '2025-05-24', type: 0, intensity: 0.8 },
    { date: '2025-05-26', type: 1, intensity: 0.7 },
    { date: '2025-05-27', type: 2, intensity: 0.8 },
    { date: '2025-05-28', type: 3, intensity: 0.4 },
    { date: '2025-05-30', type: 0, intensity: 0.9 },
    { date: '2025-05-31', type: 5, intensity: 0.7 },
    
    // June 2025 - 21 workouts
    { date: '2025-06-02', type: 0, intensity: 0.8 },
    { date: '2025-06-03', type: 1, intensity: 0.7 },
    { date: '2025-06-04', type: 4, intensity: 0.5 },
    { date: '2025-06-06', type: 0, intensity: 0.9 },
    { date: '2025-06-07', type: 2, intensity: 0.8 },
    { date: '2025-06-09', type: 3, intensity: 0.4 },
    { date: '2025-06-10', type: 1, intensity: 0.8 },
    { date: '2025-06-11', type: 5, intensity: 0.9 },
    { date: '2025-06-13', type: 0, intensity: 0.7 },
    { date: '2025-06-14', type: 2, intensity: 0.8 },
    { date: '2025-06-16', type: 1, intensity: 0.6 },
    { date: '2025-06-17', type: 3, intensity: 0.5 },
    { date: '2025-06-19', type: 0, intensity: 0.8 },
    { date: '2025-06-20', type: 1, intensity: 0.7 },
    { date: '2025-06-23', type: 2, intensity: 0.9 },
    { date: '2025-06-24', type: 4, intensity: 0.5 },
    { date: '2025-06-25', type: 0, intensity: 0.8 },
    { date: '2025-06-27', type: 1, intensity: 0.7 },
    { date: '2025-06-28', type: 2, intensity: 0.8 },
    { date: '2025-06-30', type: 5, intensity: 0.9 },
    
    // July 2025 - 22 workouts
    { date: '2025-07-01', type: 0, intensity: 0.8 },
    { date: '2025-07-02', type: 1, intensity: 0.7 },
    { date: '2025-07-04', type: 2, intensity: 0.9 },
    { date: '2025-07-05', type: 3, intensity: 0.4 },
    { date: '2025-07-07', type: 0, intensity: 0.8 },
    { date: '2025-07-08', type: 4, intensity: 0.5 },
    { date: '2025-07-09', type: 1, intensity: 0.8 },
    { date: '2025-07-11', type: 5, intensity: 0.9 },
    { date: '2025-07-12', type: 0, intensity: 0.7 },
    { date: '2025-07-14', type: 2, intensity: 0.8 },
    { date: '2025-07-15', type: 1, intensity: 0.6 },
    { date: '2025-07-16', type: 3, intensity: 0.4 },
    { date: '2025-07-18', type: 0, intensity: 0.8 },
    { date: '2025-07-19', type: 1, intensity: 0.7 },
    { date: '2025-07-21', type: 2, intensity: 0.9 },
    { date: '2025-07-22', type: 4, intensity: 0.5 },
    { date: '2025-07-23', type: 0, intensity: 0.8 },
    { date: '2025-07-25', type: 1, intensity: 0.7 },
    { date: '2025-07-26', type: 2, intensity: 0.8 },
    { date: '2025-07-28', type: 5, intensity: 0.9 },
    { date: '2025-07-29', type: 0, intensity: 0.7 },
    { date: '2025-07-30', type: 1, intensity: 0.8 }
  ];

  staticDates.forEach(({ date, type, intensity }) => {
    const workoutType = workoutTypes[type];
    const durationRange = workoutType.duration[1] - workoutType.duration[0];
    const caloriesRange = workoutType.calories[1] - workoutType.calories[0];
    
    const duration = Math.round(workoutType.duration[0] + (durationRange * intensity));
    const calories = Math.round(workoutType.calories[0] + (caloriesRange * intensity));
    
    workouts.push({
      date,
      workoutType: workoutType.type,
      duration,
      calories,
      workouts: 1
    });
  });

  return workouts;
};

export const userProfile: UserProfile = {
  name: "Alex Johnson",
  age: 28,
  weight: 75,
  height: 180,
  fitnessGoal: "Build strength and improve cardiovascular health",
  workoutHistory: generateWorkoutHistory(),
  stats: {
    totalWorkouts: 65,
    currentStreak: 12,
    totalVolume: 38500,
    averageCaloriesPerWorkout: 520
  }
};

// Extended user profile for UserProfile component
export const extendedUserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: '/avatars/alex.jpg',
  memberSince: '2023-09-15',
  
  stats: {
    totalWorkouts: 127,
    totalVolume: '18,540 lbs',
    totalDuration: '89h 24m',
    currentStreak: 8,
    longestStreak: 23,
    personalRecords: 15,
    averageWorkoutTime: '52 min',
    lastWorkout: '2024-08-03'
  },
  
  measurements: {
    weight: [
      { date: '2023-09-15', value: 175, unit: 'lbs' },
      { date: '2023-12-15', value: 172, unit: 'lbs' },
      { date: '2024-03-15', value: 168, unit: 'lbs' },
      { date: '2024-06-15', value: 165, unit: 'lbs' },
      { date: '2024-08-01', value: 162, unit: 'lbs' }
    ],
    bodyFat: [
      { date: '2023-09-15', value: 18.5, unit: '%' },
      { date: '2023-12-15', value: 17.2, unit: '%' },
      { date: '2024-03-15', value: 15.8, unit: '%' },
      { date: '2024-06-15', value: 14.5, unit: '%' },
      { date: '2024-08-01', value: 13.2, unit: '%' }
    ]
  },
  
  goals: [
    {
      id: '1',
      title: 'Lose Weight',
      current: 162,
      target: 155,
      unit: 'lbs',
      status: 'in_progress',
      deadline: '2024-12-31'
    },
    {
      id: '2',
      title: 'Bench Press PR',
      current: 185,
      target: 225,
      unit: 'lbs',
      status: 'in_progress',
      deadline: '2024-10-31'
    },
    {
      id: '3',
      title: 'Workout Streak',
      current: 8,
      target: 30,
      unit: 'days',
      status: 'in_progress',
      deadline: '2024-09-15'
    },
    {
      id: '4',
      title: 'Body Fat',
      current: 13.2,
      target: 12.0,
      unit: '%',
      status: 'in_progress',
      deadline: '2024-11-30'
    },
    {
      id: '5',
      title: 'Marathon Training',
      current: 15,
      target: 26.2,
      unit: 'miles',
      status: 'not_started',
      deadline: '2025-05-01'
    },
    {
      id: '6',
      title: 'Squat PR',
      current: 225,
      target: 275,
      unit: 'lbs',
      status: 'completed',
      deadline: '2024-07-31'
    }
  ],
  
  achievements: [
    {
      id: '1',
      title: 'First Week Strong',
      description: 'Completed 7 consecutive workouts',
      icon: '🔥',
      unlockedDate: '2024-07-28'
    },
    {
      id: '2',
      title: 'Weight Loss Champion',
      description: 'Lost 10+ pounds in 3 months',
      icon: '🏆',
      unlockedDate: '2024-06-15'
    },
    {
      id: '3',
      title: 'Strength Gains',
      description: 'Increased bench press by 25 lbs',
      icon: '💪',
      unlockedDate: '2024-05-20'
    },
    {
      id: '4',
      title: 'Consistency King',
      description: 'Worked out 4+ times per week for a month',
      icon: '👑',
      unlockedDate: '2024-04-30'
    },
    {
      id: '5',
      title: 'PR Setter',
      description: 'Set 5 new personal records',
      icon: '🎯',
      unlockedDate: '2024-07-10'
    },
    {
      id: '6',
      title: 'Early Bird',
      description: 'Completed 10 morning workouts',
      icon: '🌅',
      unlockedDate: '2024-03-22'
    }
  ],
  
  preferences: {
    units: 'imperial' as const,
    preferredWorkoutTime: 'morning' as const,
    notifications: true,
    privacy: 'friends' as const
  },

  experienceLevel: 6 as const,
  fitnessGoals: ['weight-loss', 'strength', 'endurance'] as const,
  workoutPreferences: {
    duration: 60,
    frequency: 5,
    intensity: 'moderate' as const,
    equipmentAccess: ['dumbbells', 'barbell', 'machine', 'bodyweight'] as const
  }
};