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