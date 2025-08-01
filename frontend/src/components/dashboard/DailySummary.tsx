'use client';
import React from 'react';

interface WorkoutStats {
  duration: string;
  exercisesCompleted: number;
  totalSets: number;
  averageWeight: string;
  caloriesBurned: number;
  personalRecords: number;
}

interface UpcomingWorkout {
  name: string;
  type: string;
  duration: string;
  exercises: number;
  targetMuscles: string;
  intensity: string;
}

interface DailySummaryProps {
  isWorkoutCompleted: boolean;
  workoutStats?: WorkoutStats;
  upcomingWorkout?: UpcomingWorkout;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  isWorkoutCompleted,
  workoutStats,
  upcomingWorkout
}) => {
  if (isWorkoutCompleted && workoutStats) {
    return (
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-4 relative overflow-hidden border border-green-500/20 h-full flex flex-col">
        <div className="absolute -top-1/2 -right-1/4 w-[300px] h-[300px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xl shadow-lg">
            ✅
          </div>
          <div>
            <h1 className="text-xl font-bold mb-1">Workout Complete!</h1>
            <p className="text-muted-foreground text-sm">Great job crushing today's session!</p>
          </div>
        </div>
        
        {/* Main Stats - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
          {/* Duration - Main highlight */}
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
            <div className="text-xl font-bold text-green-600 mb-1">{workoutStats.duration}</div>
            <div className="text-muted-foreground text-xs">Total Time</div>
          </div>
          
          {/* Calories - Second highlight */}
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
            <div className="text-xl font-bold text-green-600 mb-1">{workoutStats.caloriesBurned}</div>
            <div className="text-muted-foreground text-xs">Calories Burned</div>
          </div>
          
          {/* Personal Records */}
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-lg font-bold text-green-600">{workoutStats.personalRecords}</div>
              <div className="text-base">🏆</div>
            </div>
            <div className="text-muted-foreground text-xs">New PRs</div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Exercises</span>
                <span className="text-sm font-semibold text-green-600">{workoutStats.exercisesCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Sets</span>
                <span className="text-sm font-semibold text-green-600">{workoutStats.totalSets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Avg Weight</span>
                <span className="text-sm font-semibold text-green-600">{workoutStats.averageWeight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 relative z-10 mt-auto">
          <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            View Report
          </button>
          <button className="px-3 py-2 bg-background/60 hover:bg-background/80 border border-green-500/30 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
            Share
          </button>
        </div>
      </div>
    );
  }

  if (upcomingWorkout) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-4 relative overflow-hidden border border-primary/20 h-full flex flex-col">
        <div className="absolute -top-1/2 -right-1/4 w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xl shadow-lg">
            💪
          </div>
          <div>
            <h1 className="text-xl font-bold mb-1">Ready to Crush It?</h1>
            <p className="text-muted-foreground text-sm">Today's {upcomingWorkout.name} is ready</p>
          </div>
        </div>
        
        {/* Workout Overview */}
        <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-primary/30 mb-3 relative z-10">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-primary mb-1">{upcomingWorkout.duration}</div>
            <div className="text-xs text-muted-foreground">{upcomingWorkout.type} Workout</div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-primary mb-1">{upcomingWorkout.exercises}</div>
              <div className="text-muted-foreground text-xs">Exercises</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary mb-1 capitalize">{upcomingWorkout.intensity}</div>
              <div className="text-muted-foreground text-xs">Intensity</div>
            </div>
            <div>
              <div className="text-sm font-bold text-primary mb-1">{upcomingWorkout.targetMuscles}</div>
              <div className="text-muted-foreground text-xs">Focus</div>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-primary/20 mb-3 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-base">🔥</div>
            <div className="text-xs font-semibold">Today's Focus</div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Perfect your form on {upcomingWorkout.targetMuscles.toLowerCase()} exercises and push through that {upcomingWorkout.intensity} intensity.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 relative z-10 mt-auto">
          <button className="flex-1 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            Start Workout
          </button>
          <button className="px-3 py-2 bg-background/60 hover:bg-background/80 border border-primary/30 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
            Preview
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default DailySummary;