'use client';
import React, { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Flame, 
  Play, 
  Edit,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  workoutScheduleData, 
  getCurrentWeekIndex,
  WeeklyWorkout,
  getWorkoutTemplateById 
} from '../../data/workoutSchedule';
import { useWorkoutSessionStore } from '../../store/workoutSessionStore';
import WorkoutProgress from './WorkoutProgress';
import ExerciseCard from './ExerciseCard';
import WorkoutSummary from './WorkoutSummary';

const TodaysWorkout: React.FC = () => {
  const router = useRouter();
  const [showDeviceReminder, setShowDeviceReminder] = useState(true);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  
  const {
    activeSession,
    startWorkout,
    endWorkout,
    getProgress
  } = useWorkoutSessionStore();

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

  const handleStartWorkout = () => {
    if (todaysWorkout && workoutTemplate) {
      startWorkout(todaysWorkout, workoutTemplate);
    }
  };

  const handleEndWorkout = () => {
    if (activeSession) {
      const progress = getProgress();
      // If workout is mostly complete or user confirms, show summary
      if (progress.overall >= 80 || confirm('Are you sure you want to end this workout?')) {
        setShowWorkoutSummary(true);
      }
    } else {
      // Direct completion without starting workout
      router.push('/dashboard');
    }
  };

  const handleCompleteSummary = (feedback: { intensity: number; enjoyment: number; notes?: string }) => {
    endWorkout(feedback);
    setShowWorkoutSummary(false);
    router.push('/dashboard');
  };


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
          
          {/* Mark Complete Option */}
          <div className="space-y-4">
            <Button variant="outline" onClick={() => alert('Edit functionality coming soon!')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Rest Day
            </Button>
            
            <Button size="lg" onClick={handleEndWorkout}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
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

    return (
      <div className="space-y-8">
        {/* Device Reminder */}
        {showDeviceReminder && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Don&apos;t forget to start recording on your device (Whoop, Apple Watch, etc.)</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowDeviceReminder(false)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Workout Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Workout</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleStartWorkout} className="text-lg px-8 py-4 h-auto">
            <Play className="h-5 w-5 mr-2" />
            Start Workout
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => alert('Edit functionality coming soon!')} className="text-lg px-8 py-4 h-auto">
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Button>
          
          <Button variant="outline" size="lg" onClick={handleEndWorkout} className="text-lg px-8 py-4 h-auto">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Mark Complete
          </Button>
        </div>

        {/* Workout Plan Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Workout Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workoutTemplate.sections
                .filter(section => section.type !== 'warmup' && section.type !== 'cooldown')
                .map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">{section.name}</h4>
                      {section.rounds && (
                        <Badge variant="outline">
                          {section.rounds} rounds
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {section.exercises.length} exercise{section.exercises.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    {section.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {section.type === 'superset' ? `${String.fromCharCode(65 + sectionIndex)}${exerciseIndex + 1}: ` : ''}
                            {exercise.name}
                          </div>
                          {exercise.weight && (
                            <div className="text-sm text-muted-foreground">
                              Weight: {exercise.weight}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {exercise.sets} × {exercise.reps}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {section.restBetweenRounds && (
                    <div className="text-sm text-muted-foreground italic text-center bg-muted/30 rounded-lg py-2">
                      Rest: {section.restBetweenRounds} between {section.type}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
            <h1 className="text-3xl font-bold">
              {activeSession ? 'Active Workout' : todaysWorkout.name}
            </h1>
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">
              {todaysWorkout.type} • {todaysWorkout.day}, {todaysWorkout.month} {todaysWorkout.date}
            </div>
          </div>
        </div>

        {/* Workout Content */}
        {showWorkoutSummary && activeSession ? (
          <WorkoutSummary 
            session={activeSession}
            onComplete={handleCompleteSummary}
            onCancel={() => setShowWorkoutSummary(false)}
          />
        ) : activeSession ? (
          <div className="space-y-6">
            {/* Workout Progress */}
            <WorkoutProgress variant="compact" />

            {/* Current Exercise */}
            <ExerciseCard />
            
            {/* End Workout Button */}
            <div className="flex justify-center pt-6">
              <Button variant="destructive" size="lg" onClick={handleEndWorkout}>
                End Workout
              </Button>
            </div>
          </div>
        ) : (
          generateWorkoutContent(todaysWorkout)
        )}
      </div>
    </div>
  );
};

export default TodaysWorkout;