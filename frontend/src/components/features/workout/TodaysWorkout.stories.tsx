import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
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

// Mock workout template data
const mockWorkoutTemplate = {
  id: 'upper-body-power',
  name: 'Upper Body Power',
  type: 'Strength Training',
  duration: '45 min',
  targetMuscles: 'Chest, Back, Shoulders, Arms',
  intensity: 'high' as const,
  difficulty: 'intermediate' as const,
  experienceLevelRange: [4, 7] as [number, number],
  equipment: ['Barbell', 'Dumbbells', 'Pull-up Bar', 'Cable Machine'],
  totalExercises: 6,
  estimatedCalories: 400,
  description: 'High-intensity upper body workout focusing on compound movements and power development.',
  sections: [
    {
      name: 'Compound Movements',
      type: 'main' as const,
      exercises: [
        {
          name: 'Bench Press',
          sets: 4,
          reps: '6-8',
          weight: '185-205 lbs',
          rest: '2-3 min',
          notes: 'Focus on explosive concentric movement'
        },
        {
          name: 'Bent-Over Barbell Rows',
          sets: 4,
          reps: '6-8', 
          weight: '155-175 lbs',
          rest: '2-3 min',
          notes: 'Keep core tight, pull to lower chest'
        },
        {
          name: 'Overhead Press',
          sets: 3,
          reps: '8-10',
          weight: '115-135 lbs',
          rest: '90 sec',
          notes: 'Press slightly behind head at top'
        }
      ]
    },
    {
      name: 'Power Superset',
      type: 'superset' as const,
      rounds: 3,
      restBetweenRounds: '2-3 min',
      exercises: [
        {
          name: 'Weighted Pull-ups',
          sets: 3,
          reps: '5-7',
          weight: '+25 lbs',
          rest: '0 sec',
          notes: 'Explosive pull, controlled descent'
        },
        {
          name: 'Explosive Push-ups',
          sets: 3,
          reps: '8-12',
          weight: 'Bodyweight',
          rest: '0 sec',
          notes: 'Push explosively off ground'
        }
      ]
    },
    {
      name: 'Finisher',
      type: 'finisher' as const,
      exercises: [
        {
          name: 'Cable Face Pulls',
          sets: 2,
          reps: '15-20',
          weight: 'Light',
          rest: '60 sec',
          notes: 'Focus on rear delt activation'
        }
      ]
    }
  ]
};

// Component to display the workout details (simplified version without routing/stores)
const WorkoutDetailsDisplay: React.FC<{ 
  showRestDay?: boolean;
  showNoWorkout?: boolean;
  showActiveSession?: boolean;
}> = ({ showRestDay, showNoWorkout, showActiveSession }) => {
  const [showDeviceReminder, setShowDeviceReminder] = React.useState(true);

  if (showNoWorkout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" className="p-2">
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
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {showActiveSession ? 'Active Workout' : showRestDay ? 'Rest Day' : 'Upper Body Power'}
            </h1>
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">
              {showRestDay ? 'REST' : 'STRENGTH TRAINING'} • THU, JULY 31
            </div>
          </div>
        </div>

        {/* Rest Day Content */}
        {showRestDay ? (
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
            
            <div className="space-y-4">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Rest Day
              </Button>
              
              <Button size="lg">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>
        ) : showActiveSession ? (
          // Active Session View
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>2 of 6 exercises</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Exercise: Bench Press</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold">Set 2 of 4</div>
                  <div className="text-2xl text-muted-foreground">6-8 reps @ 185-205 lbs</div>
                  <Button size="lg" className="w-full">Complete Set</Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center pt-6">
              <Button variant="destructive" size="lg">
                End Workout
              </Button>
            </div>
          </div>
        ) : (
          // Standard Workout View
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
                      <div className="font-semibold">{mockWorkoutTemplate.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-semibold">{mockWorkoutTemplate.targetMuscles}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Intensity</div>
                      <div className="font-semibold capitalize">{mockWorkoutTemplate.intensity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Est. Calories</div>
                      <div className="font-semibold">{mockWorkoutTemplate.estimatedCalories}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                <Play className="h-5 w-5 mr-2" />
                Start Workout
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
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
                  {mockWorkoutTemplate.sections
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
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof WorkoutDetailsDisplay> = {
  title: 'Workout/TodaysWorkout',
  component: WorkoutDetailsDisplay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main workout details page showing today\'s scheduled workout with overview, actions, and detailed exercise plan.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StrengthWorkout: Story = {
  name: 'Strength Training Workout',
  args: {
    showRestDay: false,
    showNoWorkout: false,
    showActiveSession: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A typical strength training workout with compound movements, supersets, and finisher exercises.',
      },
    },
  },
};

export const RestDay: Story = {
  name: 'Rest Day',
  args: {
    showRestDay: true,
    showNoWorkout: false,
    showActiveSession: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A rest day view encouraging recovery with options to mark complete or edit.',
      },
    },
  },
};

export const ActiveWorkout: Story = {
  name: 'Active Workout Session',
  args: {
    showRestDay: false,
    showNoWorkout: false,
    showActiveSession: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The workout view when a session is active, showing progress and current exercise.',
      },
    },
  },
};

export const NoWorkout: Story = {
  name: 'No Workout Scheduled',
  args: {
    showRestDay: false,
    showNoWorkout: true,
    showActiveSession: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The view when no workout is scheduled for today.',
      },
    },
  },
};