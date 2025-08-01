
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

interface WorkoutPlan {
  goals: string[];
  duration: number;
  experienceLevel: number;
  exerciseStyles: string[];
  exerciseEquipment: { [exerciseId: string]: string[] };
  weeklySchedule: { [day: string]: string[] };
  commitmentLevel: string;
}

const goals = [
  { id: 'strength', label: 'Build Strength', description: 'Increase max lifts and power' },
  { id: 'endurance', label: 'Improve Endurance', description: 'Run longer, train harder' },
  { id: 'fat_loss', label: 'Lose Fat', description: 'Burn calories and get lean' },
  { id: 'muscle_gain', label: 'Build Muscle', description: 'Add lean muscle mass' },
  { id: 'mobility', label: 'Improve Mobility', description: 'Increase flexibility and range' },
  { id: 'performance', label: 'Athletic Performance', description: 'Sports-specific training' },
  { id: 'recovery', label: 'Active Recovery', description: 'Low-impact movement' },
  { id: 'injury_recovery', label: 'Recover from Injury', description: 'Rehab and strengthening' }
];


const exerciseStyles = [
  { id: 'weightlifting', label: 'Weightlifting', icon: '🏋️' },
  { id: 'cardio', label: 'Cardio', icon: '🔥' },
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪' },
  { id: 'stretching', label: 'Stretching', icon: '🤲' },
  { id: 'biking', label: 'Biking', icon: '🚴' },
  { id: 'swimming', label: 'Swimming', icon: '🏊' },
  { id: 'pilates', label: 'Pilates', icon: '🤸' },
  { id: 'hiit', label: 'HIIT', icon: '⚡' },
  { id: 'strength', label: 'Strength Training', icon: '💪' }
];

// Exercise-specific equipment mapping
const exerciseEquipment: { [key: string]: { id: string; label: string; icon: string; }[] } = {
  weightlifting: [
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'barbells', label: 'Barbells', icon: '⚖️' },
    { id: 'weight_plates', label: 'Weight Plates', icon: '🥏' },
    { id: 'power_rack', label: 'Power Rack/Squat Rack', icon: '🏗️' },
    { id: 'bench', label: 'Weight Bench', icon: '🪑' }
  ],
  strength: [
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'kettlebells', label: 'Kettlebells', icon: '⛳' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: '🎯' },
    { id: 'cable_machine', label: 'Cable Machine', icon: '🔗' },
    { id: 'barbell', label: 'Barbell', icon: '🏋️' },
    { id: 'weight_machines', label: 'Lifting Platform', icon: '🏭' }
  ],
  bodyweight: [
    { id: 'pull_up_bar', label: 'Pull-up Bar', icon: '🏗️' },
    { id: 'dip_bars', label: 'Dip Bars/Station', icon: '🤸' },
    { id: 'gymnastic_rings', label: 'Gymnastic Rings', icon: '⚪' },
    { id: 'suspension_trainer', label: 'Suspension Trainer (TRX)', icon: '🔗' },
    { id: 'yoga_mat', label: 'Exercise Mat', icon: '🧘' }
  ],
  cardio: [
    { id: 'treadmill', label: 'Treadmill', icon: '🏃' },
    { id: 'elliptical', label: 'Elliptical Machine', icon: '⚪' },
    { id: 'stationary_bike', label: 'Stationary Bike', icon: '🚴' },
    { id: 'rowing_machine', label: 'Rowing Machine', icon: '🚣' },
    { id: 'stair_climber', label: 'Stair Climber', icon: '🪶' }
  ],
  hiit: [
    { id: 'kettlebells', label: 'Kettlebells', icon: '⛳' },
    { id: 'battle_ropes', label: 'Battle Ropes', icon: '🔗' },
    { id: 'plyometric_box', label: 'Plyo Box', icon: '📦' },
    { id: 'medicine_ball', label: 'Medicine Ball', icon: '⚽' },
    { id: 'agility_ladder', label: 'Agility Ladder', icon: '🪜' }
  ],
  running: [
    { id: 'running_shoes', label: 'Running Shoes', icon: '👟' },
    { id: 'treadmill', label: 'Treadmill', icon: '🏃' },
    { id: 'outdoor_space', label: 'Outdoor Running Space', icon: '🌳' }
  ],
  biking: [
    { id: 'bicycle', label: 'Bicycle', icon: '🚴' },
    { id: 'stationary_bike', label: 'Stationary Bike', icon: '🚴' },
    { id: 'bike_trainer', label: 'Indoor Bike Trainer', icon: '🔗' }
  ],
  swimming: [
    { id: 'pool_access', label: 'Pool Access', icon: '🏊' },
    { id: 'swim_gear', label: 'Swimming Gear', icon: '🥽' }
  ],
  yoga: [
    { id: 'yoga_mat', label: 'Yoga Mat', icon: '🧘' },
    { id: 'yoga_blocks', label: 'Yoga Blocks', icon: '🧱' },
    { id: 'yoga_strap', label: 'Yoga Strap', icon: '🔗' },
    { id: 'bolster', label: 'Yoga Bolster', icon: '🚯' }
  ],
  pilates: [
    { id: 'pilates_mat', label: 'Pilates Mat', icon: '🧘' },
    { id: 'pilates_ball', label: 'Pilates Ball', icon: '⚽' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: '🎯' },
    { id: 'pilates_reformer', label: 'Pilates Reformer', icon: '🏭' }
  ],
  stretching: [
    { id: 'yoga_mat', label: 'Exercise Mat', icon: '🧘' },
    { id: 'foam_roller', label: 'Foam Roller', icon: '🌯' },
    { id: 'massage_ball', label: 'Massage Ball', icon: '⚽' },
    { id: 'stretching_strap', label: 'Stretching Strap', icon: '🔗' }
  ],
  walking: [
    { id: 'walking_shoes', label: 'Walking Shoes', icon: '👟' },
    { id: 'outdoor_space', label: 'Walking Area/Trails', icon: '🌳' },
    { id: 'treadmill', label: 'Treadmill (optional)', icon: '🏃' }
  ]
};

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


export default function PlanPage() {
  const [step, setStep] = useState(1);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>({
    goals: [],
    duration: 4,
    experienceLevel: 1,
    exerciseStyles: [],
    exerciseEquipment: {},
    weeklySchedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    commitmentLevel: ''
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleGoalToggle = (goalId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };


  const handleExerciseStyleToggle = (styleId: string) => {
    setWorkoutPlan(prev => {
      const isAdding = !prev.exerciseStyles.includes(styleId);
      const updatedStyles = isAdding
        ? [...prev.exerciseStyles, styleId]
        : prev.exerciseStyles.filter(id => id !== styleId);
      
      // Auto-select all equipment when adding an exercise
      const updatedEquipment = { ...prev.exerciseEquipment };
      if (isAdding && exerciseEquipment[styleId]) {
        updatedEquipment[styleId] = exerciseEquipment[styleId].map(eq => eq.id);
      } else if (!isAdding) {
        delete updatedEquipment[styleId];
      }
      
      return {
        ...prev,
        exerciseStyles: updatedStyles,
        exerciseEquipment: updatedEquipment
      };
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id !== active.id) {
      const exerciseId = active.id as string;
      const dayId = over.id as string;
      
      if (daysOfWeek.some(day => day.id === dayId)) {
        setWorkoutPlan(prev => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [dayId]: prev.weeklySchedule[dayId].includes(exerciseId)
              ? prev.weeklySchedule[dayId]
              : [...prev.weeklySchedule[dayId], exerciseId]
          }
        }));
      }
    }
  };

  const removeExerciseFromDay = (dayId: string, exerciseId: string) => {
    setWorkoutPlan(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [dayId]: prev.weeklySchedule[dayId].filter(id => id !== exerciseId)
      }
    }));
  };

  const handleCommitmentSelect = (levelId: string) => {
    setWorkoutPlan(prev => ({ ...prev, commitmentLevel: levelId }));
  };

  const handleExerciseEquipmentToggle = (exerciseId: string, equipmentId: string) => {
    setWorkoutPlan(prev => {
      const currentEquipment = prev.exerciseEquipment[exerciseId] || [];
      return {
        ...prev,
        exerciseEquipment: {
          ...prev.exerciseEquipment,
          [exerciseId]: currentEquipment.includes(equipmentId)
            ? currentEquipment.filter(id => id !== equipmentId)
            : [...currentEquipment, equipmentId]
        }
      };
    });
  };

  const getAvailableEquipment = () => {
    const availableEquipment: { [exerciseId: string]: { id: string; label: string; icon: string; }[] } = {};
    workoutPlan.exerciseStyles.forEach(exerciseId => {
      if (exerciseEquipment[exerciseId]) {
        availableEquipment[exerciseId] = exerciseEquipment[exerciseId];
      }
    });
    return availableEquipment;
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  // Draggable Exercise Chip Component
  const DraggableExercise = ({ exercise }: { exercise: typeof exerciseStyles[0] }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: exercise.id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium cursor-grab active:cursor-grabbing transition-opacity hover:bg-primary/90 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <span className="mr-1.5 text-base">{exercise.icon}</span>
        <span className="text-xs font-medium">{exercise.label}</span>
      </div>
    );
  };

  // Day Bucket Drop Zone Component
  const DayBucket = ({ day }: { day: typeof daysOfWeek[0] }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: day.id,
    });

    const dayExercises = workoutPlan.weeklySchedule[day.id];

    return (
      <div
        ref={setNodeRef}
        className={`p-2 border-2 border-dashed rounded-lg min-h-[140px] transition-all duration-200 ${
          isOver 
            ? 'border-primary bg-primary/5 shadow-sm' 
            : 'border-border bg-card hover:bg-accent/20'
        }`}
      >
        <div className="font-semibold text-xs mb-3 text-center text-foreground">
          {day.label}
        </div>
        <div className="space-y-1.5">
          {dayExercises.map((exerciseId) => {
            const exercise = exerciseStyles.find(e => e.id === exerciseId);
            if (!exercise) return null;
            return (
              <div
                key={`${day.id}-${exerciseId}`}
                className="flex items-center justify-between bg-secondary/70 px-2 py-1.5 rounded-md text-xs group hover:bg-secondary transition-colors"
              >
                <span className="flex items-center min-w-0 flex-1">
                  <span className="mr-1 text-xs">{exercise.icon}</span>
                  <span className="text-xs font-medium truncate">{exercise.label}</span>
                </span>
                <button
                  onClick={() => removeExerciseFromDay(day.id, exerciseId)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1 opacity-0 group-hover:opacity-100 text-sm leading-none"
                  aria-label="Remove exercise"
                >
                  ×
                </button>
              </div>
            );
          })}
          {dayExercises.length === 0 && (
            <div className="text-muted-foreground text-xs text-center py-6 px-2">
              Drop here
            </div>
          )}
        </div>
      </div>
    );
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Create Your Workout Plan</h1>
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          <span>Step {step} of 4</span>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">What are your goals?</h2>
            <p className="text-muted-foreground mb-6">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <h3 className="text-xl font-semibold">Experience Level</h3>
            <p className="text-muted-foreground mb-4">Rate your fitness experience (1 = Never exercised, 10 = Elite competitive athlete)</p>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                <Button
                  key={level}
                  variant={workoutPlan.experienceLevel === level ? "default" : "outline"}
                  onClick={() => setWorkoutPlan(prev => ({ ...prev, experienceLevel: level }))}
                  className="text-sm"
                >
                  {level}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Never exercised</span>
              <span>Elite athlete</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">Plan Duration</h3>
            <p className="text-muted-foreground mb-4">How many weeks?</p>
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
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Select exercise styles</h2>
            <p className="text-muted-foreground mb-6">Choose the types of exercises you want to include (select multiple)</p>
          </div>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exerciseStyles.map((style) => (
              <div
                key={style.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                  workoutPlan.exerciseStyles.includes(style.id) ? 'border-primary bg-accent' : ''
                }`}
                onClick={() => handleExerciseStyleToggle(style.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div className="font-semibold text-sm">{style.label}</div>
                </div>
              </div>
              ))}
            </div>
            
            {workoutPlan.exerciseStyles.length > 0 && (
              <div className="mt-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Equipment Access</h3>
                  <p className="text-muted-foreground mb-6">Select the equipment you have for each exercise type</p>
                  
                  <div className="space-y-6">
                    {Object.entries(getAvailableEquipment()).map(([exerciseId, equipment]) => {
                      const exercise = exerciseStyles.find(e => e.id === exerciseId);
                      if (!exercise) return null;
                      
                      return (
                        <div key={exerciseId}>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <span className="mr-2">{exercise.icon}</span>
                            {exercise.label} Equipment
                          </h4>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {equipment.map((item) => (
                              <div
                                key={item.id}
                                className={`p-1.5 border rounded-md cursor-pointer transition-all hover:border-primary text-xs ${
                                  (workoutPlan.exerciseEquipment[exerciseId] || []).includes(item.id) 
                                    ? 'border-primary bg-accent' : ''
                                }`}
                                onClick={() => handleExerciseEquipmentToggle(exerciseId, item.id)}
                              >
                                <div className="flex items-center justify-center text-center">
                                  <span className="mr-1 text-sm">{item.icon}</span>
                                  <span className="font-medium text-xs leading-tight">{item.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Access & Commitment</h2>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">Weekly Schedule</h3>
            <p className="text-muted-foreground mb-6">Drag your selected exercises to days of the week</p>
            
            {workoutPlan.exerciseStyles.length > 0 && (
              <div className="mb-6">
                <h4 className="text-base font-medium mb-3">Your Exercise Styles:</h4>
                <div className="flex flex-wrap gap-2">
                  {workoutPlan.exerciseStyles.map((styleId) => {
                    const exercise = exerciseStyles.find(e => e.id === styleId);
                    if (!exercise) return null;
                    return <DraggableExercise key={exercise.id} exercise={exercise} />;
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-7 gap-1.5">
              {daysOfWeek.map((day) => (
                <DayBucket key={day.id} day={day} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Commitment Level</h3>
            <p className="text-muted-foreground mb-6">How much time can you realistically commit?</p>
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

        </div>
      )}

      {step === 4 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Plan Summary</h2>
            <p className="text-muted-foreground mb-6">Review your workout plan before creating</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm space-y-1">
              <p><strong>Goals:</strong> {workoutPlan.goals.map(id => goals.find(g => g.id === id)?.label).join(', ')}</p>
              <p><strong>Experience Level:</strong> {workoutPlan.experienceLevel}/10</p>
              <p><strong>Duration:</strong> {workoutPlan.duration} weeks</p>
              <p><strong>Exercise Styles:</strong> {workoutPlan.exerciseStyles.map(id => exerciseStyles.find(s => s.id === id)?.label).join(', ')}</p>
              <p><strong>Weekly Schedule:</strong></p>
              <div className="ml-4 text-xs space-y-1">
                {daysOfWeek.map(day => {
                  const dayExercises = workoutPlan.weeklySchedule[day.id];
                  if (dayExercises.length === 0) return null;
                  return (
                    <div key={day.id}>
                      <strong>{day.label}:</strong> {dayExercises.map(id => exerciseStyles.find(e => e.id === id)?.label).join(', ')}
                    </div>
                  );
                })}
              </div>
              <p><strong>Commitment Level:</strong> {commitmentLevels.find(c => c.id === workoutPlan.commitmentLevel)?.label}</p>
              <p><strong>Equipment:</strong></p>
              <div className="ml-4 text-xs space-y-1">
                {Object.entries(workoutPlan.exerciseEquipment).map(([exerciseId, equipment]) => {
                  const exercise = exerciseStyles.find(e => e.id === exerciseId);
                  if (!exercise || !equipment.length) return null;
                  return (
                    <div key={exerciseId}>
                      <strong>{exercise.label}:</strong> {equipment.map((equipId: string) => {
                        const equipItem = exerciseEquipment[exerciseId]?.find((e) => e.id === equipId);
                        return equipItem?.label;
                      }).filter(Boolean).join(', ')}
                    </div>
                  );
                })}
              </div>
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
              (step === 3 && (Object.values(workoutPlan.weeklySchedule).every(day => day.length === 0) || !workoutPlan.commitmentLevel))
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
      
      <DragOverlay>
        {activeId ? (
          <div className="inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium shadow-lg border border-primary/20">
            <span className="mr-1.5 text-base">{exerciseStyles.find(e => e.id === activeId)?.icon}</span>
            <span className="text-xs font-medium">{exerciseStyles.find(e => e.id === activeId)?.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </div>
    </DndContext>
  );
}