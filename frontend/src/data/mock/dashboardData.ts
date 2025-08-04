// Hardcoded data for dashboard components
export const hardcodedUserProfile = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: '/avatars/alex.jpg',
  experienceLevel: 'intermediate' as const,
  fitnessGoals: ['strength', 'muscle-building'] as const,
  workoutPreferences: {
    duration: 60,
    frequency: 4,
    intensity: 'moderate' as const,
    equipmentAccess: ['dumbbells', 'barbell', 'machine'] as const
  },
  stats: {
    totalWorkouts: 89,
    totalVolume: '12,540 lbs',
    currentStreak: '7 days',
    personalRecords: 23,
    averageWorkoutTime: '52 min',
    lastWorkout: '2024-01-15'
  },
  preferences: {
    units: 'imperial' as const,
    notifications: true,
    privacy: 'friends' as const
  }
};

export const hardcodedWorkoutStats = {
  duration: '52m',
  exercisesCompleted: 8,
  totalSets: 18,
  averageWeight: '195lbs',
  caloriesBurned: 485,
  personalRecords: 3
};

export const hardcodedUpcomingWorkout = {
  name: 'Upper Body Power',
  type: 'Strength Training',
  duration: '65',
  exercises: 8,
  targetMuscles: 'Chest, Back, Shoulders, Arms',
  intensity: 'high' as const,
  exerciseList: [
    'Bench Press',
    'Pull-ups',
    'Overhead Press',
    'Barbell Rows',
    'Incline Dumbbell Press',
    'Face Pulls',
    'Dips',
    'Barbell Curls'
  ],
  liftDetails: [
    { name: 'Bench Press', sets: 4, reps: '6-8', weight: '80-90% 1RM', type: 'compound' as const },
    { name: 'Pull-ups', sets: 4, reps: '8-10', weight: 'Bodyweight + 25lbs', type: 'compound' as const },
    { name: 'Overhead Press', sets: 4, reps: '6-8', weight: '75-85% 1RM', type: 'compound' as const },
    { name: 'Barbell Rows', sets: 4, reps: '8-10', weight: '70-80% 1RM', type: 'compound' as const }
  ],
  restTime: '2-3min',
  warmupTime: '10m'
};

export const hardcodedTomorrowWorkout = {
  name: 'Lower Body Strength',
  type: 'Strength Training',
  targetMuscles: 'Quadriceps, Glutes, Hamstrings'
};

// Mock state for different dashboard scenarios
export const dashboardScenarios = {
  // Normal workout day with upcoming workout
  hasUpcomingWorkout: {
    isWorkoutCompleted: false,
    workoutStats: undefined,
    upcomingWorkout: hardcodedUpcomingWorkout,
    isOffDay: false,
    hasPlan: true,
    tomorrowWorkout: hardcodedTomorrowWorkout
  },
  
  // Completed workout
  completedWorkout: {
    isWorkoutCompleted: true,
    workoutStats: hardcodedWorkoutStats,
    upcomingWorkout: undefined,
    isOffDay: false,
    hasPlan: true,
    tomorrowWorkout: hardcodedTomorrowWorkout
  },
  
  // Rest day
  restDay: {
    isWorkoutCompleted: false,
    workoutStats: undefined,
    upcomingWorkout: undefined,
    isOffDay: true,
    hasPlan: true,
    tomorrowWorkout: hardcodedTomorrowWorkout
  },
  
  // No plan created yet
  noPlan: {
    isWorkoutCompleted: false,
    workoutStats: undefined,
    upcomingWorkout: undefined,
    isOffDay: false,
    hasPlan: false,
    tomorrowWorkout: undefined
  }
};

// WorkoutActivity heatmap data - 3 months of workout history
export const generateWorkoutActivityData = () => {
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const workoutData: Array<{
    date: string;
    month: string;
    day: number;
    year: number;
    type: string;
    status: string;
    duration: number;
    calories: number;
    isCompleted: boolean;
  }> = [];

  // Create realistic workout pattern for the last 3 months
  let currentDate = new Date(threeMonthsAgo);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  while (currentDate <= today) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const isRestDay = Math.random() < 0.3; // 30% chance of rest day
    const dayOfWeek = currentDate.getDay();
    
    // More likely to workout on weekdays, but still some weekend workouts
    const shouldWorkout = isWeekend ? Math.random() < 0.4 : Math.random() < 0.8;
    
    if (shouldWorkout && !isRestDay) {
      // Choose workout type based on day pattern
      let type: string;
      if (dayOfWeek === 1) type = 'Upper'; // Monday
      else if (dayOfWeek === 2) type = 'Lower'; // Tuesday  
      else if (dayOfWeek === 3) type = 'Push'; // Wednesday
      else if (dayOfWeek === 4) type = 'Pull'; // Thursday
      else if (dayOfWeek === 5) type = 'Full Body'; // Friday
      else type = 'Cardio'; // Weekend
      
      const duration = type === 'Cardio' ? 30 + Math.floor(Math.random() * 30) : 45 + Math.floor(Math.random() * 30);
      const baseCalories = type === 'Cardio' ? 300 : type === 'Full Body' ? 450 : type === 'Upper' ? 350 : 400;
      const calories = baseCalories + Math.floor(Math.random() * 100) - 50;
      
      workoutData.push({
        date: currentDate.toISOString().split('T')[0],
        month: monthNames[currentDate.getMonth()],
        day: currentDate.getDate(),
        year: currentDate.getFullYear(),
        type,
        status: 'Completed',
        duration,
        calories,
        isCompleted: true
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workoutData;
};

export const hardcodedWorkoutActivity = generateWorkoutActivityData();

// Current scenario - change this to switch between different states
export const currentScenario = dashboardScenarios.hasUpcomingWorkout;