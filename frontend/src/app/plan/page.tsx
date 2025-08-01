
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface WorkoutPlan {
  goals: string[];
  duration: number;
  exerciseStyles: string[];
  trainingDays: string[];
  commitmentLevel: string;
  equipmentAccess: string[];
}

const goals = [
  { id: 'strength', label: 'Build Strength', description: 'Increase max lifts and power' },
  { id: 'endurance', label: 'Improve Endurance', description: 'Run longer, train harder' },
  { id: 'fat_loss', label: 'Lose Fat', description: 'Burn calories and get lean' },
  { id: 'muscle_gain', label: 'Build Muscle', description: 'Add lean muscle mass' },
  { id: 'mobility', label: 'Improve Mobility', description: 'Increase flexibility and range' },
  { id: 'performance', label: 'Athletic Performance', description: 'Sports-specific training' },
  { id: 'recovery', label: 'Active Recovery', description: 'Low-impact movement and healing' },
  { id: 'injury_recovery', label: 'Recover from Injury', description: 'Gentle rehab and strengthening' }
];


const exerciseStyles = [
  { id: 'weightlifting', label: 'Weightlifting', icon: '🏋️' },
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'biking', label: 'Biking', icon: '🚴' },
  { id: 'swimming', label: 'Swimming', icon: '🏊' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪' }
];

const daysOfWeek = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' }
];

const commitmentLevels = [
  { id: 'light', label: 'Light', description: '1-2 days/week, 20-30 min sessions' },
  { id: 'moderate', label: 'Moderate', description: '3-4 days/week, 30-45 min sessions' },
  { id: 'committed', label: 'Committed', description: '4-5 days/week, 45-60 min sessions' },
  { id: 'intense', label: 'Intense', description: '5-6 days/week, 60+ min sessions' }
];

const equipmentOptions = [
  { id: 'bodyweight', label: 'Bodyweight Training', description: 'No equipment needed, anywhere', icon: '💪' },
  { id: 'resistance', label: 'Resistance Training', description: 'Bands, tubes, light weights, household items', icon: '🎯' },
  { id: 'free_weights', label: 'Free Weights', description: 'Dumbbells, barbells, kettlebells, weight plates', icon: '🏋️' },
  { id: 'cardio_equipment', label: 'Cardio Equipment', description: 'Treadmill, bike, elliptical, rowing machine', icon: '🏃' },
  { id: 'gym_machines', label: 'Gym Machines', description: 'Cable machines, weight machines, smith machine', icon: '🏗️' },
  { id: 'outdoor_sports', label: 'Outdoor/Sports', description: 'Parks, trails, pools, courts, fields', icon: '🌳' },
  { id: 'home_setup', label: 'Home Setup', description: 'Basic home gym equipment, adjustable pieces', icon: '🏠' },
  { id: 'studio_classes', label: 'Studio Classes', description: 'Yoga, pilates, group fitness access', icon: '🧘' }
];

export default function PlanPage() {
  const [step, setStep] = useState(1);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>({
    goals: [],
    duration: 4,
    exerciseStyles: [],
    trainingDays: [],
    commitmentLevel: '',
    equipmentAccess: []
  });

  const handleGoalToggle = (goalId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };


  const handleExerciseStyleToggle = (styleId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      exerciseStyles: prev.exerciseStyles.includes(styleId)
        ? prev.exerciseStyles.filter(id => id !== styleId)
        : [...prev.exerciseStyles, styleId]
    }));
  };

  const handleDayToggle = (dayId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      trainingDays: prev.trainingDays.includes(dayId)
        ? prev.trainingDays.filter(id => id !== dayId)
        : [...prev.trainingDays, dayId]
    }));
  };

  const handleCommitmentSelect = (levelId: string) => {
    setWorkoutPlan(prev => ({ ...prev, commitmentLevel: levelId }));
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      equipmentAccess: prev.equipmentAccess.includes(equipmentId)
        ? prev.equipmentAccess.filter(id => id !== equipmentId)
        : [...prev.equipmentAccess, equipmentId]
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Workout Plan</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Step {step} of 4</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">What are your goals?</h2>
            <p className="text-muted-foreground mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    workoutPlan.goals.includes(goal.id) ? 'border-primary bg-accent' : ''
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="font-medium">{goal.label}</div>
                  <div className="text-sm text-muted-foreground">{goal.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Plan Duration</h3>
            <div className="text-sm text-muted-foreground mb-2">Weeks</div>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((weeks) => (
                <Button
                  key={weeks}
                  variant={workoutPlan.duration === weeks ? "default" : "outline"}
                  onClick={() => setWorkoutPlan(prev => ({ ...prev, duration: weeks }))}
                >
                  {weeks}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Select exercise styles</h2>
          <p className="text-muted-foreground mb-4">Choose the types of exercises you want to include (select multiple)</p>
          <div className="grid grid-cols-2 gap-3">
            {exerciseStyles.map((style) => (
              <div
                key={style.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                  workoutPlan.exerciseStyles.includes(style.id) ? 'border-primary bg-accent' : ''
                }`}
                onClick={() => handleExerciseStyleToggle(style.id)}
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="font-medium">{style.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Access & Commitment</h2>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Training Days</h3>
            <p className="text-muted-foreground mb-4">Select the days you want to train</p>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.id}
                  variant={workoutPlan.trainingDays.includes(day.id) ? "default" : "outline"}
                  onClick={() => handleDayToggle(day.id)}
                  className="min-w-[60px]"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Commitment Level</h3>
            <p className="text-muted-foreground mb-4">How much time can you realistically commit?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commitmentLevels.map((level) => (
                <div
                  key={level.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    workoutPlan.commitmentLevel === level.id ? 'border-primary bg-accent' : ''
                  }`}
                  onClick={() => handleCommitmentSelect(level.id)}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-muted-foreground">{level.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Equipment Access</h3>
            <p className="text-muted-foreground mb-4">What equipment do you have access to?</p>
            <div className="grid grid-cols-3 gap-3">
              {equipmentOptions.map((equipment) => (
                <div
                  key={equipment.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    workoutPlan.equipmentAccess.includes(equipment.id) ? 'border-primary bg-accent' : ''
                  }`}
                  onClick={() => handleEquipmentToggle(equipment.id)}
                >
                  <div className="text-xl mb-1">{equipment.icon}</div>
                  <div className="font-medium text-sm">{equipment.label}</div>
                  <div className="text-xs text-muted-foreground">{equipment.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Plan Summary</h2>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm space-y-1">
              <p><strong>Goals:</strong> {workoutPlan.goals.map(id => goals.find(g => g.id === id)?.label).join(', ')}</p>
              <p><strong>Duration:</strong> {workoutPlan.duration} weeks</p>
              <p><strong>Exercise Styles:</strong> {workoutPlan.exerciseStyles.map(id => exerciseStyles.find(s => s.id === id)?.label).join(', ')}</p>
              <p><strong>Training Days:</strong> {workoutPlan.trainingDays.map(id => daysOfWeek.find(d => d.id === id)?.label).join(', ')}</p>
              <p><strong>Commitment Level:</strong> {commitmentLevels.find(c => c.id === workoutPlan.commitmentLevel)?.label}</p>
              <p><strong>Equipment Access:</strong> {workoutPlan.equipmentAccess.map(id => equipmentOptions.find(e => e.id === id)?.label).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={prevStep}
          >
            Previous
          </Button>
        )}
        
{step < 4 ? (
          <Button
            onClick={nextStep}
            disabled={
              (step === 1 && workoutPlan.goals.length === 0) ||
              (step === 2 && workoutPlan.exerciseStyles.length === 0) ||
              (step === 3 && (workoutPlan.trainingDays.length === 0 || !workoutPlan.commitmentLevel || workoutPlan.equipmentAccess.length === 0))
            }
            className={step === 1 ? "ml-auto" : ""}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              console.log('Creating workout plan:', workoutPlan);
            }}
          >
            Create Plan
          </Button>
        )}
      </div>
    </div>
  );
}