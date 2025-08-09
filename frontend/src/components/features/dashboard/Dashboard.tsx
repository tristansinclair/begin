'use client';
import React from 'react';
import WorkoutActivity from './WorkoutActivity';
import DailySummary from './DailySummary';
import WorkoutCalendar from './WorkoutCalendar';
import StatCard from './StatCard';
import ExperienceLevelCard from './ExperienceLevelCard';
import { hardcodedUserProfile, currentScenario } from '../../../data/mock/dashboardData';

const Dashboard = () => {
  // Use hardcoded data instead of store
  const userProfile = hardcodedUserProfile;
  const {
    isWorkoutCompleted,
    workoutStats,
    upcomingWorkout,
    isOffDay,
    hasPlan,
    tomorrowWorkout
  } = currentScenario;



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
              workoutStats={workoutStats}
              upcomingWorkout={upcomingWorkout}
              isOffDay={isOffDay}
              hasPlan={hasPlan}
              tomorrowWorkout={tomorrowWorkout}
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