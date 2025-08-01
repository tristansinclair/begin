'use client';
import React, { useState } from 'react';
import WorkoutActivity from './WorkoutActivity';
import DayCard from './DayCard';
import { TwoSidebarLayout } from '../TwoSidebarLayout';
import LeftSidebar from '../LeftSidebar';
import { userProfile } from '../../data/userProfile';
import { useSidebar } from '@/contexts/SidebarContext';

const Dashboard = () => {
  const [selectedWorkout, setSelectedWorkout] = useState(2);
  const { toggleLeftSidebar } = useSidebar();

  const workouts = [
    { 
      day: 'MON', 
      date: 28, 
      type: 'AI Recommended', 
      name: 'Upper Body Power', 
      duration: '45 min', 
      exercises: 6, 
      intensity: 'high',
      workoutLabel: 'Upper Body',
      summaryLine: 'Chest & Triceps • 6 exercises',
      mainMetric: '45',
      metricUnit: 'MIN',
      workoutType: 'strength' as const
    },
    { 
      day: 'TUE', 
      date: 29, 
      type: 'Cardio', 
      name: 'HIIT Sprint Session', 
      duration: '30 min', 
      exercises: 4, 
      intensity: 'high',
      workoutLabel: 'HIIT Cardio',
      summaryLine: 'High intensity • Sprint intervals',
      mainMetric: '30',
      metricUnit: 'MIN',
      workoutType: 'cardio' as const
    },
    { 
      day: 'WED', 
      date: 30, 
      type: 'Recovery', 
      name: 'Active Recovery Flow', 
      duration: '30 min', 
      exercises: 'Mobility', 
      intensity: 'low',
      workoutLabel: 'Recovery',
      summaryLine: 'Active recovery • Mobility work',
      mainMetric: '30',
      metricUnit: 'MIN',
      workoutType: 'recovery' as const
    },
    { 
      day: 'THU', 
      date: 31, 
      type: 'Strength', 
      name: 'Leg Day Destroyer', 
      duration: '60 min', 
      exercises: 8, 
      intensity: 'high',
      workoutLabel: 'Leg Day',
      summaryLine: 'Quads & Glutes • 8 exercises',
      mainMetric: '60',
      metricUnit: 'MIN',
      workoutType: 'strength' as const
    },
    { 
      day: 'FRI', 
      date: 1, 
      type: 'AI Recommended', 
      name: 'Full Body Circuit', 
      duration: '50 min', 
      exercises: 7, 
      intensity: 'medium',
      workoutLabel: 'Full Body',
      summaryLine: 'Circuit training • 7 exercises',
      mainMetric: '50',
      metricUnit: 'MIN',
      workoutType: 'strength' as const
    },
    { 
      day: 'SAT', 
      date: 2, 
      type: 'Cardio', 
      name: 'Endurance Run', 
      duration: '40 min', 
      exercises: 1, 
      intensity: 'medium',
      workoutLabel: 'Running',
      summaryLine: 'Steady pace • Endurance',
      mainMetric: '5.2',
      metricUnit: 'KM',
      workoutType: 'cardio' as const
    },
    { 
      day: 'SUN', 
      date: 3, 
      type: 'Rest', 
      name: 'Rest Day', 
      duration: '-', 
      exercises: '-', 
      intensity: 'rest',
      workoutLabel: 'Rest Day',
      summaryLine: 'Recovery time • Take it easy',
      mainMetric: '',
      metricUnit: '',
      workoutType: 'rest' as const
    }
  ];


  const generateWorkoutContent = (workout: typeof workouts[0]) => {
    if (workout.type === 'Rest') {
      return (
        <p className="text-muted-foreground">Your body needs time to recover. Consider light stretching or a walk.</p>
      );
    }

    return (
      <>
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Overview</div>
          <div className="flex flex-wrap gap-6">
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Duration:</span> {workout.duration}</div>
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Target:</span> Upper Body</div>
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Weight:</span> 65-85% 1RM</div>
            <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Total Sets:</span> 16</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border-l-2 border-primary pl-5 relative">
            <div className="absolute -left-[6px] top-2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_0_3px_hsl(var(--card))]"></div>
            <div className="text-base font-semibold mb-1 flex items-center gap-2">Superset A</div>
            <div className="text-xs text-muted-foreground mb-3">3 rounds</div>
            <div className="space-y-2 ml-5">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">A1: Bench Press</span>
                <span className="text-primary font-semibold text-xs">8-10 reps</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">A2: Pull-ups</span>
                <span className="text-primary font-semibold text-xs">8-12 reps</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground italic mt-2 ml-5">Rest: 2 minutes between supersets</div>
          </div>
          
          <div className="border-l-2 border-primary/60 pl-5 relative">
            <div className="absolute -left-[6px] top-2 w-2.5 h-2.5 bg-primary/60 rounded-full shadow-[0_0_0_3px_hsl(var(--card))]"></div>
            <div className="text-base font-semibold mb-1 flex items-center gap-2">Superset B</div>
            <div className="text-xs text-muted-foreground mb-3">3 rounds</div>
            <div className="space-y-2 ml-5">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">B1: Shoulder Press</span>
                <span className="text-primary font-semibold text-xs">10 reps</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">B2: Barbell Rows</span>
                <span className="text-primary font-semibold text-xs">10-12 reps</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground italic mt-2 ml-5">Rest: 90 seconds between supersets</div>
          </div>
          
          <div className="border-l-2 border-muted-foreground pl-5 relative">
            <div className="absolute -left-[6px] top-2 w-2.5 h-2.5 bg-muted-foreground rounded-full shadow-[0_0_0_3px_hsl(var(--card))]"></div>
            <div className="text-base font-semibold mb-1">Isolation Work</div>
            <div className="space-y-2 ml-5">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">Cable Flyes</span>
                <span className="text-primary font-semibold text-xs">3 × 12-15 reps</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">60 sec rest between sets</div>
          </div>
          
          <div className="border-l-2 border-destructive pl-5 relative">
            <div className="absolute -left-[6px] top-2 w-2.5 h-2.5 bg-destructive rounded-full shadow-[0_0_0_3px_hsl(var(--card))]"></div>
            <div className="text-base font-semibold mb-1">Finisher</div>
            <div className="text-xs text-muted-foreground mb-3">2 rounds</div>
            <div className="space-y-2 ml-5">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">Tricep Dips</span>
                <span className="text-primary font-semibold text-xs">To failure</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium">Barbell Curls</span>
                <span className="text-primary font-semibold text-xs">21s</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground italic mt-2 ml-5">Rest: 90 seconds between rounds</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <TwoSidebarLayout leftSidebar={<LeftSidebar />}>
      <div className="min-h-screen bg-background">
        {/* Toggle Button */}
        <div className="p-4">
          <button
            onClick={toggleLeftSidebar}
            className="fixed top-4 left-4 z-20 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Main Content */}
        <main className="p-10">
          {/* AI Trainer Card */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl p-8 mb-8 relative overflow-hidden border border-primary/20">
            <div className="absolute -top-1/2 -right-1/4 w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-3xl shadow-lg">
                🤖
              </div>
              <div>
                <h1 className="text-3xl font-semibold mb-1">Ready to crush today's workout?</h1>
                <p className="text-muted-foreground">Your AI trainer has prepared a personalized plan based on your progress</p>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="px-6 py-3 bg-background/50 hover:bg-background/70 border border-border rounded-2xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
                Start Today's Workout
              </button>
              <button className="px-6 py-3 bg-background/50 hover:bg-background/70 border border-border rounded-2xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
                Adjust My Plan
              </button>
              <button className="px-6 py-3 bg-background/50 hover:bg-background/70 border border-border rounded-2xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
                Chat with AI Trainer
              </button>
            </div>
          </div>

          {/* Activity Heatmap and Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-6 mb-8">
            {/* Activity Heatmap */}
            <WorkoutActivity />

            {/* Workout Streak */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Workout Streak</span>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  🔥
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{userProfile.stats.currentStreak}</div>
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <span>↑ 4 days from last week</span>
              </div>
            </div>

            {/* Total Volume */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Total Volume</span>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  💪
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{userProfile.stats.totalVolume.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <span>↑ 12% this week</span>
              </div>
            </div>
          </div>

          {/* Workout Calendar */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Weekly Schedule</h2>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300">
                  ←
                </button>
                <span className="text-sm text-muted-foreground">July 28 - Aug 3</span>
                <button className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300">
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-6">
              {workouts.map((workout, index) => (
                <DayCard
                  key={index}
                  day={workout.day}
                  date={workout.date}
                  workoutLabel={workout.workoutLabel}
                  summaryLine={workout.summaryLine}
                  mainMetric={workout.mainMetric}
                  metricUnit={workout.metricUnit}
                  workoutType={workout.workoutType}
                  isSelected={selectedWorkout === index}
                  onClick={() => setSelectedWorkout(index)}
                />
              ))}
            </div>
            <div>
              <div className="bg-card border rounded-2xl p-8 mt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{workouts[selectedWorkout].name}</h3>
                    <div className="text-primary text-xs font-semibold uppercase tracking-wider">{workouts[selectedWorkout].type}</div>
                  </div>
                  {workouts[selectedWorkout].type !== 'Rest' && (
                    <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-medium transition-all duration-300">
                      Start Workout
                    </button>
                  )}
                </div>
                {generateWorkoutContent(workouts[selectedWorkout])}
              </div>
            </div>
          </section>
        </main>
      </div>
    </TwoSidebarLayout>
  );
};

export default Dashboard;