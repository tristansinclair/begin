'use client';
import React, { useState } from 'react';
import WorkoutActivity from './WorkoutActivity';
import DailySummary from './DailySummary';
import WorkoutCalendar from './WorkoutCalendar';
import { userProfile } from '../../data/userProfile';
import { 
  getTodaysWorkout,
  getWorkoutTemplateById 
} from '../../data/workoutSchedule';

const Dashboard = () => {
  // Toggle this to test both states - in real app this would come from API/state
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);
  
  // Get today's workout
  const todaysWorkout = getTodaysWorkout();
  
  // Sample data for completed workout (using today's workout if completed)
  const workoutStats = todaysWorkout?.completedStats ? {
    duration: todaysWorkout.completedStats.actualDuration,
    exercisesCompleted: typeof todaysWorkout.exercises === 'number' ? todaysWorkout.exercises : 6,
    totalSets: todaysWorkout.completedStats.totalSets,
    averageWeight: todaysWorkout.completedStats.averageWeight,
    caloriesBurned: todaysWorkout.completedStats.caloriesBurned,
    personalRecords: todaysWorkout.completedStats.personalRecords
  } : {
    duration: '48m',
    exercisesCompleted: 6,
    totalSets: 16,
    averageWeight: '72kg',
    caloriesBurned: 387,
    personalRecords: 2
  };
  
  // Get today's workout template for upcoming workout data
  const todayWorkoutTemplate = todaysWorkout?.templateId ? getWorkoutTemplateById(todaysWorkout.templateId) : null;
  
  // Sample data for upcoming workout using the template
  const upcomingWorkout = todayWorkoutTemplate ? {
    name: todayWorkoutTemplate.name,
    type: 'AI Recommended',
    duration: todayWorkoutTemplate.duration,
    exercises: todayWorkoutTemplate.totalExercises,
    targetMuscles: todayWorkoutTemplate.targetMuscles,
    intensity: todayWorkoutTemplate.intensity,
    exerciseList: todayWorkoutTemplate.sections
      .filter(section => section.type === 'main' || section.type === 'superset')
      .flatMap(section => section.exercises.map(ex => ex.name))
      .slice(0, 6),
    restTime: '90s',
    warmupTime: '10m'
  } : {
    name: 'Leg Day Destroyer',
    type: 'AI Recommended',
    duration: '60 min',
    exercises: 8,
    targetMuscles: 'Quadriceps, Glutes, Hamstrings, Calves',
    intensity: 'high' as const,
    exerciseList: [
      'Back Squats',
      'Romanian Deadlifts',
      'Bulgarian Split Squats',
      'Leg Press',
      'Leg Curls',
      'Leg Extensions'
    ],
    restTime: '2-3min',
    warmupTime: '10m'
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-6">
          {/* Main Dashboard Grid - 2x2 layout on large screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 mb-8">
            {/* Daily Summary - Takes 2x2 on large screens, full width on mobile */}
            <div className="col-span-2 lg:row-span-2 h-full">
              <DailySummary 
                isWorkoutCompleted={isWorkoutCompleted}
                workoutStats={isWorkoutCompleted ? workoutStats : undefined}
                upcomingWorkout={!isWorkoutCompleted ? upcomingWorkout : undefined}
              />
            </div>

            {/* Workout Streak - Takes 1x1 on large screens (top right) */}
            <div className="bg-card border rounded-2xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-foreground">Workout Streak</span>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  🔥
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-3xl font-bold mb-2">{userProfile.stats.currentStreak}</div>
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <span>↑ 4 days from last week</span>
                </div>
              </div>
            </div>

            {/* Total Volume - Takes 1x1 on large screens (middle right) */}
            <div className="bg-card border rounded-2xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Total Volume</span>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  💪
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-3xl font-bold mb-2">{userProfile.stats.totalVolume.toLocaleString()}</div>
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <span>↑ 12% this week</span>
                </div>
              </div>
            </div>

            {/* Activity Heatmap - Takes 2x1 on large screens, full width on mobile */}
            <div className="col-span-2 h-full">
              <WorkoutActivity />
            </div>
          </div>

          <WorkoutCalendar />
        </main>
    </div>
  );
};

export default Dashboard;