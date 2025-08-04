'use client';
import React from 'react';
import { CheckCircle, Play, Calendar, Trophy, Coffee, ArrowRight, Dumbbell, Activity, MapPin, Waves, Bike } from 'lucide-react';
import { Button } from '../../ui/button';

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
  distance?: string;
  pace?: string;
  elevation?: string;
  strokes?: string[];
  intervals?: { type: string; duration: string; intensity: string }[];
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
  // Use container queries for responsive design
  const containerClasses = "bg-card rounded-2xl p-3 sm:p-4 border h-full flex flex-col min-h-0";
  if (isWorkoutCompleted && workoutStats) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">All Done! 🎉</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">You crushed today's workout</p>
          </div>
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0 ml-2" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2.5 sm:p-3 border">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 sm:mb-1" />
            <p className="text-xs sm:text-sm font-semibold">{workoutStats.duration}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Duration</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2.5 sm:p-3 border">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 sm:mb-1" />
            <p className="text-xs sm:text-sm font-semibold">{workoutStats.caloriesBurned} cal</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Calories burned</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-auto">
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2 text-center border">
            <p className="text-base sm:text-lg font-bold">{workoutStats.exercisesCompleted}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Exercises</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2 text-center border">
            <p className="text-base sm:text-lg font-bold">{workoutStats.totalSets}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Sets</p>
          </div>
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2 text-center border">
            <p className="text-sm sm:text-base font-bold">{workoutStats.personalRecords}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">New PRs</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">Ready to Start?</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Create your first workout plan</p>
          </div>
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0 ml-2" />
        </div>

        <div className="bg-background/40 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border flex-1 flex flex-col justify-center items-center text-center min-h-0">
          <div className="bg-primary/10 rounded-full p-2.5 sm:p-3 mb-2 sm:mb-3">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">No workout plan found</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Design a personalized plan that fits your goals and schedule</p>
        </div>

        <Button className="w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2">
          Create Your Plan
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
    );
  }

  if (isOffDay) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">Rest Day 😌</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Recovery is part of the process</p>
          </div>
          <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0 ml-2" />
        </div>

        <div className="bg-background/40 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border flex-1 flex flex-col justify-center items-center text-center min-h-0">
          <div className="bg-secondary/60 rounded-full p-2.5 sm:p-3 mb-2 sm:mb-3">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Take it easy today</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Your muscles are recovering and growing stronger. Consider light stretching or a gentle walk.</p>
        </div>

        {tomorrowWorkout && (
          <div className="bg-background/60 backdrop-blur rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 border">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 sm:mb-2">Tomorrow's Workout</p>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">{tomorrowWorkout.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{tomorrowWorkout.targetMuscles}</p>
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                {tomorrowWorkout.type}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5 sm:space-y-2 mt-auto">
          <Button
            variant="outline"
            className="w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generate Recovery Workout
          </Button>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center px-2">
            We can create a light recovery routine with stretching and mobility exercises
          </p>
        </div>
      </div>
    );
  }

  if (upcomingWorkout) {
    const getWorkoutIcon = () => {
      switch (upcomingWorkout.type.toLowerCase()) {
        case 'weightlifting':
        case 'strength training':
          return <Dumbbell className="w-4 h-4" />;
        case 'cross training':
        case 'crossfit':
          return <Activity className="w-4 h-4" />;
        case 'running':
          return <MapPin className="w-4 h-4" />;
        case 'swimming':
          return <Waves className="w-4 h-4" />;
        case 'biking':
        case 'cycling':
          return <Bike className="w-4 h-4" />;
        default:
          return <Play className="w-4 h-4" />;
      }
    };

    const getCategoryColor = () => {
      switch (upcomingWorkout.type.toLowerCase()) {
        case 'weightlifting':
        case 'strength training':
          return 'bg-red-500/10 text-red-600 border-red-500/20';
        case 'cross training':
        case 'crossfit':
          return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        case 'running':
          return 'bg-green-500/10 text-green-600 border-green-500/20';
        case 'swimming':
          return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        case 'biking':
        case 'cycling':
          return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
        default:
          return 'bg-primary/10 text-primary border-primary/20';
      }
    };

    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1 truncate">{upcomingWorkout.name}</h3>
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getCategoryColor()}`}>
                {React.cloneElement(getWorkoutIcon(), { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                <span>{upcomingWorkout.type}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl sm:text-2xl font-bold">{upcomingWorkout.duration}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">minutes</p>
          </div>
        </div>

        {/* Workout Type Specific Info */}
        {(upcomingWorkout.type.toLowerCase() === 'weightlifting' || upcomingWorkout.type.toLowerCase() === 'strength training') && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-background/60 backdrop-blur rounded-xl p-3 border">
                <p className="text-xs text-muted-foreground mb-1">Focus</p>
                <p className="text-sm font-semibold">{upcomingWorkout.targetMuscles}</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-3 border">
                <p className="text-xs text-muted-foreground mb-1">Intensity</p>
                <div className="flex items-center gap-1">
                  <div className={`h-1.5 w-full rounded-full bg-background`}>
                    <div className={`h-1.5 rounded-full transition-all ${
                      upcomingWorkout.intensity === 'low' ? 'w-1/3 bg-green-500' :
                      upcomingWorkout.intensity === 'moderate' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-red-500'
                    }`} />
                  </div>
                  <span className="text-sm font-semibold capitalize">{upcomingWorkout.intensity}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {(upcomingWorkout.type.toLowerCase() === 'running') && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-lg font-bold">{upcomingWorkout.distance || '5K'}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold">{upcomingWorkout.pace || '8:30'}</p>
                <p className="text-xs text-muted-foreground">Pace/mi</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold capitalize">{upcomingWorkout.intensity}</p>
                <p className="text-xs text-muted-foreground">Intensity</p>
              </div>
            </div>
          </>
        )}

        {(upcomingWorkout.type.toLowerCase() === 'swimming') && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-lg font-bold">{upcomingWorkout.distance || '1500m'}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold">{upcomingWorkout.exercises}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold capitalize">{upcomingWorkout.intensity}</p>
                <p className="text-xs text-muted-foreground">Intensity</p>
              </div>
            </div>
          </>
        )}

        {(upcomingWorkout.type.toLowerCase() === 'biking' || upcomingWorkout.type.toLowerCase() === 'cycling') && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-lg font-bold">{upcomingWorkout.distance || '20mi'}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold">{upcomingWorkout.elevation || '500ft'}</p>
                <p className="text-xs text-muted-foreground">Elevation</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold capitalize">{upcomingWorkout.intensity}</p>
                <p className="text-xs text-muted-foreground">Intensity</p>
              </div>
            </div>
          </>
        )}

        {(upcomingWorkout.type.toLowerCase() === 'cross training' || upcomingWorkout.type.toLowerCase() === 'crossfit') && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-lg font-bold">{upcomingWorkout.exercises}</p>
                <p className="text-xs text-muted-foreground">Stations</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold">{upcomingWorkout.intervals?.length || 4}</p>
                <p className="text-xs text-muted-foreground">Rounds</p>
              </div>
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-base font-bold capitalize">{upcomingWorkout.intensity}</p>
                <p className="text-xs text-muted-foreground">Intensity</p>
              </div>
            </div>
          </>
        )}

        {/* Default stats for other workout types */}
        {!['weightlifting', 'strength training', 'running', 'swimming', 'biking', 'cycling', 'cross training', 'crossfit'].includes(upcomingWorkout.type.toLowerCase()) && (
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
        )}

        {/* Exercise Preview - Weightlifting */}
        {(upcomingWorkout.type.toLowerCase() === 'weightlifting' || upcomingWorkout.type.toLowerCase() === 'strength training') && upcomingWorkout.liftDetails && upcomingWorkout.liftDetails.length > 0 ? (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Exercise Preview</p>
              <p className="text-xs text-muted-foreground">{upcomingWorkout.liftDetails.length} total</p>
            </div>
            <div className="space-y-2.5">
              {upcomingWorkout.liftDetails.slice(0, 3).map((lift, index) => (
                <div key={index} className="flex items-center justify-between bg-background/60 rounded-lg p-2 border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{lift.name}</p>
                      {lift.type === 'compound' && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Compound</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lift.sets} sets × {lift.reps} reps
                      {lift.weight && ` • ${lift.weight}`}
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
        ) : (upcomingWorkout.type.toLowerCase() === 'running' && upcomingWorkout.intervals) ? (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Workout Structure</p>
            <div className="space-y-2">
              {upcomingWorkout.intervals.slice(0, 3).map((interval, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-xs font-medium">{interval.type}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{interval.duration}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      interval.intensity === 'easy' ? 'bg-green-500/10 text-green-600' :
                      interval.intensity === 'moderate' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>{interval.intensity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (upcomingWorkout.type.toLowerCase() === 'swimming' && upcomingWorkout.strokes) ? (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Stroke Breakdown</p>
            <div className="grid grid-cols-2 gap-2">
              {upcomingWorkout.strokes.map((stroke, index) => (
                <div key={index} className="bg-background/60 rounded-lg p-2 border text-center">
                  <p className="text-xs font-medium">{stroke}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (upcomingWorkout.type.toLowerCase() === 'cross training' || upcomingWorkout.type.toLowerCase() === 'crossfit') && upcomingWorkout.intervals ? (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Circuit Preview</p>
            <div className="space-y-2">
              {upcomingWorkout.intervals.slice(0, 4).map((interval, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{interval.type}</span>
                  <span className="text-muted-foreground">{interval.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ) : upcomingWorkout.exerciseList && (
          <div className="bg-background/40 rounded-xl p-3 mb-3 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Today's Focus</p>
            <div className="space-y-1.5">
              {upcomingWorkout.exerciseList.slice(0, 3).map((exercise, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <p className="text-xs text-foreground">{exercise}</p>
                </div>
              ))}
              {upcomingWorkout.exerciseList.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  + {upcomingWorkout.exerciseList.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timing Info - Only for Weightlifting */}
        {(upcomingWorkout.type.toLowerCase() === 'weightlifting' || upcomingWorkout.type.toLowerCase() === 'strength training') && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {upcomingWorkout.warmupTime && (
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-sm font-bold">{upcomingWorkout.warmupTime}</p>
                <p className="text-xs text-muted-foreground">Warmup</p>
              </div>
            )}
            {upcomingWorkout.restTime && (
              <div className="bg-background/60 backdrop-blur rounded-xl p-2 text-center border">
                <p className="text-sm font-bold">{upcomingWorkout.restTime}</p>
                <p className="text-xs text-muted-foreground">Rest Between Sets</p>
              </div>
            )}
          </div>
        )}

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