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
  
  
  personalRecords: [
    { exercise: 'Bench Press', value: 205, unit: 'lbs', date: '2025-07-30', previousValue: 200 },
    { exercise: 'Back Squat', value: 295, unit: 'lbs', date: '2025-07-27', previousValue: 285 },
    { exercise: 'Deadlift', value: 335, unit: 'lbs', date: '2025-07-20', previousValue: 325 },
    { exercise: 'Overhead Press', value: 105, unit: 'lbs', date: '2025-07-30', previousValue: 100 },
    { exercise: '5K Run', value: 26.5, unit: 'min', date: '2025-07-15', previousValue: 27.2 }
  ]
};