'use client';
import React from 'react';
import { CheckCircle, Play, Calendar, Trophy, Coffee, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface WorkoutStats {
  duration: string;
  exercisesCompleted: number;
  totalSets: number;
  averageWeight: string;
  caloriesBurned: number;
  personalRecords: number;
}

interface LiftDetail {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  type?: 'compound' | 'isolation' | 'accessory';
}

interface UpcomingWorkout {
  name: string;
  type: string;
  duration: string;
  exercises: number;
  targetMuscles: string;
  intensity: string;
  exerciseList?: string[];
  liftDetails?: LiftDetail[];
  restTime?: string;
  warmupTime?: string;
}

interface DailySummaryProps {
  isWorkoutCompleted: boolean;
  workoutStats?: WorkoutStats;
  upcomingWorkout?: UpcomingWorkout;
  isOffDay?: boolean;
  hasPlan?: boolean;
  tomorrowWorkout?: {
    name: string;
    type: string;
    targetMuscles: string;
  };
}

const DailySummary: React.FC<DailySummaryProps> = ({
  isWorkoutCompleted,
  workoutStats,
  upcomingWorkout,
  isOffDay = false,
  hasPlan = true,
  tomorrowWorkout
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

  if (!hasPlan) {
    return (
      <div className="bg-card rounded-2xl p-4 border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Ready to Start?</h2>
            <p className="text-sm text-muted-foreground">Create your first workout plan</p>
          </div>
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="bg-background/40 rounded-xl p-4 mb-4 border flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-2">No workout plan found</p>
          <p className="text-xs text-muted-foreground mb-4">Design a personalized plan that fits your goals and schedule</p>
        </div>

        <Button className="w-full rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2">
          Create Your Plan
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (isOffDay) {
    return (
      <div className="bg-card rounded-2xl p-4 border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Rest Day 😌</h2>
            <p className="text-sm text-muted-foreground">Recovery is part of the process</p>
          </div>
          <Coffee className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="bg-background/40 rounded-xl p-4 mb-4 border flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-secondary/60 rounded-full p-3 mb-3">
            <Coffee className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-2">Take it easy today</p>
          <p className="text-xs text-muted-foreground mb-4">Your muscles are recovering and growing stronger. Consider light stretching or a gentle walk.</p>
        </div>

        {tomorrowWorkout && (
          <div className="bg-background/60 backdrop-blur rounded-xl p-3 mb-4 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Tomorrow's Workout</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{tomorrowWorkout.name}</p>
                <p className="text-xs text-muted-foreground">{tomorrowWorkout.targetMuscles}</p>
              </div>
              <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {tomorrowWorkout.type}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            Generate Recovery Workout
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We can create a light recovery routine with stretching and mobility exercises
          </p>
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

        {/* Detailed Lift Preview */}
        {upcomingWorkout.liftDetails && upcomingWorkout.liftDetails.length > 0 ? (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Today's Main Lifts</p>
            <div className="space-y-2">
              {upcomingWorkout.liftDetails.slice(0, 3).map((lift, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium text-foreground">{lift.name}</p>
                      {lift.type === 'compound' && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lift.sets} × {lift.reps}
                      {lift.weight && ` @ ${lift.weight}`}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingWorkout.liftDetails.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  + {upcomingWorkout.liftDetails.length - 3} more exercises
                </p>
              )}
            </div>
          </div>
        ) : upcomingWorkout.exerciseList && (
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

        <Button variant="action" className="w-full rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 mt-auto">
          Start Workout
          <Play className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return null;
};

export default DailySummary;