'use client';
import React from 'react';
import WorkoutActivity from './WorkoutActivity';
import DailySummary from './DailySummary';
import WorkoutCalendar from './WorkoutCalendar';
import StatCard from './StatCard';
import ExperienceLevelCard from './ExperienceLevelCard';
import { useDashboardStore } from '../../store/dashboardStore';
import { getWorkoutTemplateById } from '../../data/workoutSchedule';

const Dashboard = () => {
  // Get data and actions from Dashboard store
  const {
    userProfile,
    isWorkoutCompleted,
    todaysWorkout,
    workoutStats,
    setIsWorkoutCompleted
  } = useDashboardStore();

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
    liftDetails: todayWorkoutTemplate.sections
      .filter(section => section.type === 'main' || section.type === 'superset')
      .flatMap(section => section.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        type: (['Back Squats', 'Romanian Deadlifts', 'Bench Press', 'Pull-ups', 'Shoulder Press', 'Barbell Rows'].includes(ex.name) ? 'compound' : 'isolation') as 'compound' | 'isolation'
      })))
      .slice(0, 4),
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
    liftDetails: [
      { name: 'Back Squats', sets: 4, reps: '8-10', weight: '80-90% 1RM', type: 'compound' as const },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', weight: '75-85% 1RM', type: 'compound' as const },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each leg', type: 'isolation' as const },
      { name: 'Leg Press', sets: 3, reps: '15-20', type: 'isolation' as const }
    ],
    restTime: '2-3min',
    warmupTime: '10m'
  };



  return (
    <div className="min-h-[75vh] bg-background max-w-6xl mx-auto">
      {/* Main Content */}
      <main className="p-6">
        {/* Main Dashboard Grid - 2x3 layout on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 mb-8">
          {/* Daily Summary - Takes 2x2 on large screens, full width on mobile */}
          <div className="col-span-2 lg:row-span-2 h-full">
            <DailySummary
              isWorkoutCompleted={isWorkoutCompleted}
              workoutStats={isWorkoutCompleted ? workoutStats : undefined}
              upcomingWorkout={!isWorkoutCompleted ? upcomingWorkout : undefined}
            />
          </div>

          {/* Total Volume - Takes 2x1 on large screens (bottom right) */}
          <StatCard
            title="Total Volume"
            value={userProfile.stats.totalVolume}
            icon="💪"
            change={{
              value: "12% this week",
              direction: "up"
            }}
            titleColor="muted-foreground"
          />


          {/* Workout Streak - Takes 1x1 on large screens (middle right) */}
          <StatCard
            title="Workout Streak"
            value={userProfile.stats.currentStreak}
            icon="🔥"
            change={{
              value: "4 days from last week",
              direction: "up"
            }}
            titleColor="foreground"
          />

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