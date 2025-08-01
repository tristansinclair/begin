'use client';
import React from 'react';
import { CheckCircle, Play, Calendar, Trophy } from 'lucide-react';

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
  exerciseList?: string[];
  restTime?: string;
  warmupTime?: string;
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
      <div className="bg-card rounded-2xl p-4 border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">All Done! 🎉</h2>
            <p className="text-sm text-muted-foreground">You crushed today's workout</p>
          </div>
          <Trophy className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-background/60 backdrop-blur rounded-xl p-3 border">
            <CheckCircle className="w-4 h-4 mb-1" />
            <p className="text-sm font-semibold">{workoutStats.duration}</p>
            <p className="text-xs text-muted-foreground">Total Duration</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-xl p-3 border">
            <CheckCircle className="w-4 h-4 mb-1" />
            <p className="text-sm font-semibold">{workoutStats.caloriesBurned} cal</p>
            <p className="text-xs text-muted-foreground">Calories burned</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-lg font-bold">{workoutStats.exercisesCompleted}</p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-lg font-bold">{workoutStats.totalSets}</p>
            <p className="text-xs text-muted-foreground">Sets</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-base font-bold">{workoutStats.personalRecords}</p>
            <p className="text-xs text-muted-foreground">New PRs</p>
          </div>
        </div>
      </div>
    );
  }

  if (upcomingWorkout) {
    return (
      <div className="bg-card rounded-2xl p-4 border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-background/60 backdrop-blur rounded-full p-2 border">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ready to Crush It?</p>
              <h3 className="text-lg font-bold">{upcomingWorkout.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{upcomingWorkout.duration}</p>
            <p className="text-xs text-muted-foreground">min</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-lg font-bold">{upcomingWorkout.exercises}</p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-base font-bold capitalize">{upcomingWorkout.intensity}</p>
            <p className="text-xs text-muted-foreground">Intensity</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
            <p className="text-sm font-bold">{upcomingWorkout.targetMuscles}</p>
            <p className="text-xs text-muted-foreground">Focus</p>
          </div>
        </div>

        {/* Workout Preview */}
        {upcomingWorkout.exerciseList && (
          <div className="bg-background/40 rounded-xl p-2 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Today's Focus</p>
            <div className="space-y-1">
              {upcomingWorkout.exerciseList.slice(0, 3).map((exercise, index) => (
                <p key={index} className="text-xs text-foreground">• {exercise}</p>
              ))}
              {upcomingWorkout.exerciseList.length > 3 && (
                <p className="text-xs text-muted-foreground">+ {upcomingWorkout.exerciseList.length - 3} more</p>
              )}
            </div>
          </div>
        )}

        {/* Timing Info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {upcomingWorkout.warmupTime && (
            <div className="text-center">
              <p className="text-sm font-bold">{upcomingWorkout.warmupTime}</p>
              <p className="text-xs text-muted-foreground">Warmup</p>
            </div>
          )}
          {upcomingWorkout.restTime && (
            <div className="text-center">
              <p className="text-sm font-bold">{upcomingWorkout.restTime}</p>
              <p className="text-xs text-muted-foreground">Rest</p>
            </div>
          )}
        </div>

        <button className="w-full bg-foreground text-background rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-auto">
          <Play className="w-4 h-4" />
          Start Workout
        </button>
      </div>
    );
  }

  return null;
};

export default DailySummary;