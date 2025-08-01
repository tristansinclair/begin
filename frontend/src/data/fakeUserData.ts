import { WorkoutStatus } from './workoutSchedule';

export const fakeUserProfile = {
  id: 'user-001',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  avatar: '/avatars/sarah.jpg',
  memberSince: '2024-03-15',
  timezone: 'America/Los_Angeles',
  
  stats: {
    currentStreak: 12,
    longestStreak: 27,
    totalWorkouts: 156,
    totalVolume: '487.5k lbs',
    totalDuration: '142h 30m',
    averageWorkoutDuration: '55m',
    personalRecords: 23,
    favoriteExercise: 'Deadlift',
    lastWorkoutDate: '2025-07-30'
  },
  
  preferences: {
    units: 'imperial' as 'imperial' | 'metric',
    startOfWeek: 'monday' as 'monday' | 'sunday',
    notifications: {
      workoutReminders: true,
      streakReminders: true,
      weeklyReport: true,
      achievementAlerts: true
    },
    defaultGym: 'Downtown Fitness Center',
    preferredWorkoutTime: 'morning' as 'morning' | 'afternoon' | 'evening'
  },
  
  experienceLevel: 6, // Strength Seeker level
  
  goals: [
    {
      id: 'goal-001',
      type: 'strength',
      title: 'Bench Press 225 lbs',
      target: 225,
      current: 205,
      unit: 'lbs',
      deadline: '2025-09-01',
      status: 'in_progress' as 'in_progress' | 'completed' | 'paused'
    },
    {
      id: 'goal-002',
      type: 'endurance',
      title: 'Run 5K under 25 minutes',
      target: 25,
      current: 26.5,
      unit: 'minutes',
      deadline: '2025-08-15',
      status: 'in_progress' as 'in_progress' | 'completed' | 'paused'
    },
    {
      id: 'goal-003',
      type: 'consistency',
      title: 'Work out 5 days per week',
      target: 5,
      current: 4.2,
      unit: 'days/week',
      deadline: '2025-12-31',
      status: 'in_progress' as 'in_progress' | 'completed' | 'paused'
    }
  ],
  
  measurements: {
    weight: [
      { date: '2025-07-01', value: 148, unit: 'lbs' },
      { date: '2025-07-08', value: 147.5, unit: 'lbs' },
      { date: '2025-07-15', value: 147.2, unit: 'lbs' },
      { date: '2025-07-22', value: 146.8, unit: 'lbs' },
      { date: '2025-07-29', value: 146.5, unit: 'lbs' }
    ],
    bodyFat: [
      { date: '2025-07-01', value: 22.5, unit: '%' },
      { date: '2025-07-15', value: 22.1, unit: '%' },
      { date: '2025-07-29', value: 21.8, unit: '%' }
    ]
  },
  
  achievements: [
    {
      id: 'ach-001',
      title: 'Early Bird',
      description: 'Complete 10 morning workouts',
      icon: '🌅',
      unlockedDate: '2024-04-20',
      category: 'habits'
    },
    {
      id: 'ach-002',
      title: 'Century Club',
      description: 'Complete 100 total workouts',
      icon: '💯',
      unlockedDate: '2025-05-15',
      category: 'milestones'
    },
    {
      id: 'ach-003',
      title: 'Iron Will',
      description: 'Maintain a 30-day workout streak',
      icon: '🏋️',
      unlockedDate: '2025-06-30',
      category: 'consistency'
    }
  ],
  
  workoutHistory: [
    // July 2025 - Recent completed workouts
    {
      date: '2025-07-30',
      workoutType: 'strength' as const,
      duration: 58,
      calories: 385,
      workouts: 1,
      name: 'Upper Body Power',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: [8, 6, 6, 5], weight: [185, 195, 195, 205] },
        { name: 'Overhead Press', sets: 4, reps: [8, 8, 6, 6], weight: [95, 95, 105, 105] },
        { name: 'Weighted Pull-ups', sets: 3, reps: [8, 7, 6], weight: [25, 25, 25] },
        { name: 'Barbell Rows', sets: 3, reps: [10, 10, 8], weight: [135, 135, 145] },
        { name: 'Dumbbell Curls', sets: 3, reps: [12, 10, 10], weight: [30, 30, 30] }
      ],
      notes: 'New PR on bench press! Form felt solid.',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-29',
      workoutType: 'cardio' as const,
      duration: 35,
      calories: 320,
      workouts: 1,
      name: 'Interval Running',
      exercises: [
        { name: 'Warm-up Jog', duration: 5, distance: 0.5, unit: 'miles' },
        { name: 'Sprint Intervals', sets: 8, duration: 30, rest: 90 },
        { name: 'Cool-down Walk', duration: 5, distance: 0.3, unit: 'miles' }
      ],
      notes: 'Felt good, maintained pace throughout all intervals',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-28',
      workoutType: 'rest' as const,
      duration: 0,
      calories: 0,
      workouts: 0,
      name: 'Rest Day',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-27',
      workoutType: 'strength' as const,
      duration: 65,
      calories: 420,
      workouts: 1,
      name: 'Lower Body Strength',
      exercises: [
        { name: 'Back Squat', sets: 5, reps: [5, 5, 3, 3, 1], weight: [225, 245, 265, 275, 295] },
        { name: 'Romanian Deadlift', sets: 4, reps: [8, 8, 8, 6], weight: [185, 185, 205, 205] },
        { name: 'Leg Press', sets: 3, reps: [12, 12, 10], weight: [360, 360, 405] },
        { name: 'Walking Lunges', sets: 3, reps: [20, 20, 20], weight: [50, 50, 50] },
        { name: 'Calf Raises', sets: 4, reps: [15, 15, 12, 12], weight: [180, 180, 200, 200] }
      ],
      notes: 'Heavy day, squat felt strong. Need to work on depth.',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-26',
      workoutType: 'strength' as const,
      duration: 52,
      calories: 340,
      workouts: 1,
      name: 'Upper Body Volume',
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: [12, 10, 10, 8], weight: [50, 55, 55, 60] },
        { name: 'Cable Rows', sets: 4, reps: [12, 12, 10, 10], weight: [120, 120, 130, 130] },
        { name: 'Lateral Raises', sets: 3, reps: [15, 12, 12], weight: [15, 15, 15] },
        { name: 'Face Pulls', sets: 3, reps: [20, 18, 15], weight: [40, 40, 45] },
        { name: 'Tricep Extensions', sets: 3, reps: [15, 12, 10], weight: [60, 65, 70] }
      ],
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-25',
      workoutType: 'recovery' as const,
      duration: 30,
      calories: 120,
      workouts: 1,
      name: 'Active Recovery',
      exercises: [
        { name: 'Yoga Flow', duration: 20 },
        { name: 'Foam Rolling', duration: 10 }
      ],
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-24',
      workoutType: 'cardio' as const,
      duration: 0,
      calories: 0,
      workouts: 0,
      name: 'HIIT Training',
      status: 'Missed' as WorkoutStatus,
      notes: 'Had to skip - work emergency'
    },
    // Earlier in July - mix of completed, missed, and canceled
    {
      date: '2025-07-23',
      workoutType: 'strength' as const,
      duration: 60,
      calories: 395,
      workouts: 1,
      name: 'Full Body',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-22',
      workoutType: 'rest' as const,
      duration: 0,
      calories: 0,
      workouts: 0,
      name: 'Rest Day',
      status: 'Completed' as WorkoutStatus
    },
    {
      date: '2025-07-21',
      workoutType: 'strength' as const,
      duration: 0,
      calories: 0,
      workouts: 0,
      name: 'Upper Body',
      status: 'Canceled' as WorkoutStatus,
      notes: 'Gym was closed for maintenance'
    },
    // Add more historical data for heatmap
    { date: '2025-07-20', workoutType: 'cardio' as const, duration: 40, calories: 350, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-19', workoutType: 'strength' as const, duration: 55, calories: 380, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-18', workoutType: 'recovery' as const, duration: 25, calories: 100, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-17', workoutType: 'strength' as const, duration: 62, calories: 410, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-16', workoutType: 'cardio' as const, duration: 35, calories: 300, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-15', workoutType: 'rest' as const, duration: 0, calories: 0, workouts: 0, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-14', workoutType: 'strength' as const, duration: 58, calories: 390, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-13', workoutType: 'strength' as const, duration: 0, calories: 0, workouts: 0, status: 'Missed' as WorkoutStatus },
    { date: '2025-07-12', workoutType: 'cardio' as const, duration: 45, calories: 380, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-11', workoutType: 'strength' as const, duration: 60, calories: 400, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-10', workoutType: 'recovery' as const, duration: 30, calories: 120, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-09', workoutType: 'strength' as const, duration: 55, calories: 375, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-08', workoutType: 'rest' as const, duration: 0, calories: 0, workouts: 0, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-07', workoutType: 'cardio' as const, duration: 40, calories: 340, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-06', workoutType: 'strength' as const, duration: 65, calories: 425, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-05', workoutType: 'strength' as const, duration: 50, calories: 350, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-04', workoutType: 'rest' as const, duration: 0, calories: 0, workouts: 0, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-03', workoutType: 'cardio' as const, duration: 35, calories: 310, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-02', workoutType: 'strength' as const, duration: 60, calories: 395, workouts: 1, status: 'Completed' as WorkoutStatus },
    { date: '2025-07-01', workoutType: 'strength' as const, duration: 55, calories: 380, workouts: 1, status: 'Completed' as WorkoutStatus }
  ],
  
  savedWorkouts: [
    {
      id: 'saved-001',
      name: 'Morning Upper Body Blast',
      description: 'Quick but intense upper body workout for busy mornings',
      duration: '45 min',
      difficulty: 'intermediate',
      equipment: ['barbell', 'dumbbells', 'pull-up bar'],
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Pull-ups', sets: 4, reps: '6-10', rest: '90s' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '60s' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Dips', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' }
      ],
      lastUsed: '2025-07-26',
      timesCompleted: 12
    },
    {
      id: 'saved-002',
      name: 'Leg Day Destroyer',
      description: 'High volume leg workout for maximum growth',
      duration: '75 min',
      difficulty: 'advanced',
      equipment: ['barbell', 'dumbbells', 'leg press', 'cables'],
      exercises: [
        { name: 'Back Squat', sets: 5, reps: '5-8', rest: '3 min' },
        { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Leg Press', sets: 4, reps: '12-15', rest: '90s' },
        { name: 'Walking Lunges', sets: 3, reps: '20 total', rest: '90s' },
        { name: 'Leg Curls', sets: 4, reps: '12-15', rest: '60s' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s' }
      ],
      lastUsed: '2025-07-27',
      timesCompleted: 8
    }
  ],
  
  personalRecords: [
    { exercise: 'Bench Press', value: 205, unit: 'lbs', date: '2025-07-30', previousValue: 200 },
    { exercise: 'Back Squat', value: 295, unit: 'lbs', date: '2025-07-27', previousValue: 285 },
    { exercise: 'Deadlift', value: 335, unit: 'lbs', date: '2025-07-20', previousValue: 325 },
    { exercise: 'Overhead Press', value: 105, unit: 'lbs', date: '2025-07-30', previousValue: 100 },
    { exercise: '5K Run', value: 26.5, unit: 'min', date: '2025-07-15', previousValue: 27.2 }
  ]
};