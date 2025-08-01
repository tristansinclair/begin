'use client';
import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Clock, Target, Zap, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  workoutScheduleData, 
  getCurrentWeekIndex,
  WeeklyWorkout,
  getWorkoutTemplateById 
} from '../../data/workoutSchedule';

const TodaysWorkout: React.FC = () => {
  const router = useRouter();

  // Get today's workout
  const todaysWorkout = useMemo(() => {
    const currentWeekIndex = getCurrentWeekIndex(workoutScheduleData);
    const currentWeek = workoutScheduleData[currentWeekIndex];
    
    if (!currentWeek) return null;

    // Today is July 31st, 2025 based on the dashboard code
    const today = new Date(2025, 6, 31);
    const todayDateKey = `${today.getFullYear()}-${today.toLocaleDateString('en-US', { month: 'long' })}-${today.getDate()}`;
    
    const todaysWorkout = currentWeek.workouts.find(workout => 
      `${workout.year}-${workout.month}-${workout.date}` === todayDateKey
    );
    
    return todaysWorkout || null;
  }, []);

  // Get workout template for full details
  const workoutTemplate = useMemo(() => {
    if (!todaysWorkout?.templateId) return null;
    return getWorkoutTemplateById(todaysWorkout.templateId);
  }, [todaysWorkout]);

  const generateWorkoutContent = (workout: WeeklyWorkout) => {
    if (workout.type === 'Rest') {
      return (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Rest Day</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your body needs time to recover and rebuild. Consider light stretching, a walk, or some gentle yoga.
            </p>
          </div>
        </div>
      );
    }

    if (!workoutTemplate) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Workout details not available.</p>
        </div>
      );
    }

    const getSectionBorderColor = (sectionType: string, index: number) => {
      switch (sectionType) {
        case 'superset': return index === 0 ? 'border-primary' : 'border-primary/60';
        case 'finisher': return 'border-destructive';
        case 'circuit': return 'border-primary';
        default: return 'border-muted-foreground';
      }
    };

    const getSectionDotColor = (sectionType: string, index: number) => {
      switch (sectionType) {
        case 'superset': return index === 0 ? 'bg-primary' : 'bg-primary/60';
        case 'finisher': return 'bg-destructive';
        case 'circuit': return 'bg-primary';
        default: return 'bg-muted-foreground';
      }
    };

    return (
      <div className="space-y-8">
        {/* Workout Overview */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Today's Workout</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-semibold">{workoutTemplate.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="font-semibold">{workoutTemplate.targetMuscles}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Intensity</div>
                <div className="font-semibold capitalize">{workoutTemplate.intensity}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Est. Calories</div>
                <div className="font-semibold">{workoutTemplate.estimatedCalories}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Workout Button */}
        <div className="text-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto">
            Start Workout
          </Button>
        </div>

        {/* Workout Sections */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold">Workout Plan</h3>
          {workoutTemplate.sections
            .filter(section => section.type !== 'warmup' && section.type !== 'cooldown')
            .map((section, sectionIndex) => (
            <div 
              key={sectionIndex} 
              className={`border-l-4 ${getSectionBorderColor(section.type, sectionIndex)} pl-6 relative bg-card rounded-r-lg py-4`}
            >
              <div className={`absolute -left-[8px] top-6 w-4 h-4 ${getSectionDotColor(section.type, sectionIndex)} rounded-full shadow-[0_0_0_4px_hsl(var(--background))]`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-semibold mb-1">
                    {section.name}
                  </div>
                  {section.rounds && (
                    <div className="text-sm text-muted-foreground">
                      {section.rounds} rounds
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {section.exercises.length} exercise{section.exercises.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {section.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-base">
                        {section.type === 'superset' ? `${String.fromCharCode(65 + sectionIndex)}${exerciseIndex + 1}: ` : ''}
                        {exercise.name}
                      </div>
                      <div className="text-primary font-bold text-lg">
                        {exercise.sets > 1 ? `${exercise.sets} × ` : ''}{exercise.reps}
                      </div>
                    </div>
                    {exercise.weight && (
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Weight:</span> {exercise.weight}
                      </div>
                    )}
                    {exercise.notes && (
                      <div className="text-sm text-muted-foreground italic">
                        <span className="font-medium">Note:</span> {exercise.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {section.restBetweenRounds && (
                <div className="text-sm text-muted-foreground italic mt-4 text-center bg-muted/30 rounded-lg py-2">
                  Rest: {section.restBetweenRounds} between {section.type}s
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!todaysWorkout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Today's Workout</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No workout scheduled for today.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{todaysWorkout.name}</h1>
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">
              {todaysWorkout.type} • {todaysWorkout.day}, {todaysWorkout.month} {todaysWorkout.date}
            </div>
          </div>
        </div>

        {/* Workout Content */}
        {generateWorkoutContent(todaysWorkout)}
      </div>
    </div>
  );
};

export default TodaysWorkout;