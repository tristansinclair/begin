
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import SectionHeader from '@/components/ui/section-header';
import { exerciseTypes, getAllEquipmentForExerciseTypes, getExerciseTypeById, getEquipmentForExerciseType } from '@/types/exercises/exerciseTypes';
import { getExperienceLevel, getExperienceLevelDisplay } from '@/utils/experienceLevel';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  closestCenter,
  useDraggable,
  useDroppable,
  rectIntersection,
  DropAnimation,
  defaultDropAnimationSideEffects,
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




const daysOfWeek = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' }
];


// Custom drop animation configuration
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

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
  const [overId, setOverId] = useState<string | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [wasSuccessfulDrop, setWasSuccessfulDrop] = useState(false);

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
      if (isAdding) {
        const availableEquipment = getEquipmentForExerciseType(styleId);
        if (availableEquipment.length > 0) {
          updatedEquipment[styleId] = availableEquipment.map(eq => eq.id);
        }
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
    setIsDropping(false);
    setWasSuccessfulDrop(false);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? over.id as string : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id !== active.id) {
      const exerciseId = active.id as string;
      const dayId = over.id as string;

      if (daysOfWeek.some(day => day.id === dayId)) {
        // Mark as successful drop to disable return animation
        setWasSuccessfulDrop(true);
        
        // Add the item to the schedule immediately
        setWorkoutPlan(prev => ({
          ...prev,
          weeklySchedule: {
            ...prev.weeklySchedule,
            [dayId]: prev.weeklySchedule[dayId].includes(exerciseId)
              ? prev.weeklySchedule[dayId]
              : [...prev.weeklySchedule[dayId], exerciseId]
          }
        }));
        
        
        // Don't clear activeId immediately - let the animation system handle it
        setOverId(null);
        setIsDropping(false);
        return;
      }
    }
    
    // Reset states for invalid drops
    setActiveId(null);
    setOverId(null);
    setIsDropping(false);
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
    return getAllEquipmentForExerciseTypes(workoutPlan.exerciseStyles);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  // Draggable Exercise Chip Component
  const DraggableExercise = ({ exercise }: { exercise: typeof exerciseTypes[0] }) => {
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
        className={`inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium cursor-grab active:cursor-grabbing transition-opacity hover:bg-primary/90 ${isDragging ? 'opacity-50' : ''
          }`}
      >
        <span className="mr-1.5 text-base">{exercise.icon}</span>
        <span className="text-xs font-medium">{exercise.name}</span>
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
        className={`p-2 border-2 border-dashed rounded-lg min-h-[140px] transition-all duration-200 ${isOver && overId === day.id && activeId
            ? 'border-primary bg-primary/10 shadow-md scale-105 transform'
            : isOver
            ? 'border-primary/50 bg-primary/5'
            : 'border-border bg-card hover:bg-accent/20'
          }`}
      >
        <div className="font-semibold text-xs mb-3 text-center text-foreground">
          {day.label}
        </div>
        <div className="space-y-1.5">
          {dayExercises.map((exerciseId) => {
            const exerciseType = getExerciseTypeById(exerciseId);
            if (!exerciseType) return null;
            return (
              <div
                key={`${day.id}-${exerciseId}`}
                className="flex items-center justify-between bg-secondary/70 px-2 py-1.5 rounded-md text-xs group hover:bg-secondary transition-colors"
              >
                <span className="flex items-center min-w-0 flex-1">
                  <span className="mr-1 text-xs">{exerciseType.icon}</span>
                  <span className="text-xs font-medium truncate">{exerciseType.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExerciseFromDay(day.id, exerciseId)}
                  className="h-auto p-1 ml-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  aria-label="Remove exercise"
                >
                  ×
                </Button>
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
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
                  className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <SectionHeader 
              title="What are your goals?" 
              subtitle="Select all that apply" 
            />
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${workoutPlan.goals.includes(goal.id) ? 'border-primary bg-accent' : ''
                      }`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <div className="font-medium">{goal.label}</div>
                    <div className="text-sm text-muted-foreground">{goal.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <SectionHeader 
              title="Experience Level" 
              subtitle="Rate your fitness experience" 
            />
            <div className="space-y-4">
              <div className="px-2 relative">
                <Slider
                  value={[workoutPlan.experienceLevel]}
                  onValueChange={(value) => setWorkoutPlan(prev => ({ ...prev, experienceLevel: value[0] }))}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                {/* Tick marks for experience level */}
                <div className="absolute top-6 pointer-events-none" style={{ left: '0.875rem', right: '0.875rem' }}>
                  <div className="relative h-4">
                    {Array.from({ length: 10 }, (_, i) => {
                      const position = (i / (10 - 1)) * 100;
                      return (
                        <div 
                          key={i} 
                          className="absolute flex flex-col items-center"
                          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                        >
                          <div className="w-0.5 h-2 bg-muted-foreground/30" />
                          <span className="text-xs text-muted-foreground/50 mt-1">{i + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-2 mt-8">
                <span>Never exercised</span>
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Elite athlete</span>
              </div>
              <div className="text-center space-y-2">
                <span className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {getExperienceLevelDisplay(workoutPlan.experienceLevel)}
                </span>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {getExperienceLevel(workoutPlan.experienceLevel).description}
                </p>
              </div>
            </div>

            <SectionHeader 
              title="Cycle Duration" 
              subtitle="How many weeks?" 
            />
            <div className="space-y-4">
              <div className="px-2 relative">
                <Slider
                  value={[workoutPlan.duration]}
                  onValueChange={(value) => setWorkoutPlan(prev => ({ ...prev, duration: value[0] }))}
                  min={1}
                  max={12}
                  step={1}
                  className="w-full"
                />
                {/* Tick marks for duration */}
                <div className="absolute top-6 pointer-events-none" style={{ left: '0.875rem', right: '0.875rem' }}>
                  <div className="relative h-4">
                    {Array.from({ length: 12 }, (_, i) => {
                      const position = (i / (12 - 1)) * 100;
                      return (
                        <div 
                          key={i} 
                          className="absolute flex flex-col items-center"
                          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                        >
                          <div className="w-0.5 h-2 bg-muted-foreground/30" />
                          <span className="text-xs text-muted-foreground/50 mt-1">{i + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-2 mt-8">
                <span>1 week</span>
                <span>6 weeks</span>
                <span>12 weeks</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  {workoutPlan.duration} week{workoutPlan.duration !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <SectionHeader 
              title="Select exercise styles" 
              subtitle="Choose the types of exercises you want to include (select multiple)" 
            />
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exerciseTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md ${workoutPlan.exerciseStyles.includes(type.id) ? 'border-primary bg-accent' : ''
                      }`}
                    onClick={() => handleExerciseStyleToggle(type.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="font-semibold text-sm">{type.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              {workoutPlan.exerciseStyles.length > 0 && (
                <div className="mt-8">
                  <div className="border rounded-lg p-6">
                    <SectionHeader 
                      title="Equipment Access" 
                      subtitle="Select the equipment you have for each exercise type" 
                    />

                    <div className="space-y-6">
                      {Object.entries(getAvailableEquipment()).map(([exerciseId, equipment]) => {
                        const exerciseType = getExerciseTypeById(exerciseId);
                        if (!exerciseType) return null;

                        return (
                          <div key={exerciseId}>
                            <h3 className="font-semibold mb-3 flex items-center">
                              <span className="mr-2">{exerciseType.icon}</span>
                              {exerciseType.name} Equipment
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                              {equipment.map((item) => (
                                <div
                                  key={item.id}
                                  className={`p-1.5 border rounded-md cursor-pointer transition-all hover:border-primary text-xs ${(workoutPlan.exerciseEquipment[exerciseId] || []).includes(item.id)
                                      ? 'border-primary bg-accent' : ''
                                    }`}
                                  onClick={() => handleExerciseEquipmentToggle(exerciseId, item.id)}
                                >
                                  <div className="flex items-center justify-center text-center">
                                    <span className="mr-1 text-sm">{item.icon}</span>
                                    <span className="font-medium text-xs leading-tight">{item.name}</span>
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
            <SectionHeader 
              title="Weekly Schedule" 
              subtitle="Drag your selected exercises to days of the week" 
            />
            <div>

              {workoutPlan.exerciseStyles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">Your Exercise Styles:</h3>
                  <div className="flex flex-wrap gap-2">
                    {workoutPlan.exerciseStyles.map((styleId) => {
                      const exerciseType = getExerciseTypeById(styleId);
                      if (!exerciseType) return null;
                      return <DraggableExercise key={exerciseType.id} exercise={exerciseType} />;
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


          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <SectionHeader 
              title="Plan Summary" 
              subtitle="Review your workout plan before creating" 
            />
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Goals:</strong> {workoutPlan.goals.map(id => goals.find(g => g.id === id)?.label).join(', ')}</p>
                <p><strong>Experience Level:</strong> {getExperienceLevelDisplay(workoutPlan.experienceLevel)} (Level {workoutPlan.experienceLevel}/10)</p>
                <p><strong>Duration:</strong> {workoutPlan.duration} weeks</p>
                <p><strong>Exercise Styles:</strong> {workoutPlan.exerciseStyles.map(id => getExerciseTypeById(id)?.name).join(', ')}</p>
                <p><strong>Weekly Schedule:</strong></p>
                <div className="ml-4 text-xs space-y-1">
                  {daysOfWeek.map(day => {
                    const dayExercises = workoutPlan.weeklySchedule[day.id];
                    if (dayExercises.length === 0) return null;
                    return (
                      <div key={day.id}>
                        <strong>{day.label}:</strong> {dayExercises.map(id => getExerciseTypeById(id)?.name).join(', ')}
                      </div>
                    );
                  })}
                </div>
                <p><strong>Equipment:</strong></p>
                <div className="ml-4 text-xs space-y-1">
                  {Object.entries(workoutPlan.exerciseEquipment).map(([exerciseId, equipment]) => {
                    const exerciseType = getExerciseTypeById(exerciseId);
                    if (!exerciseType || !equipment.length) return null;
                    return (
                      <div key={exerciseId}>
                        <strong>{exerciseType.name}:</strong> {equipment.map((equipId: string) => {
                          const equipItem = exerciseType.equipment?.find((e) => e.id === equipId);
                          return equipItem?.name;
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
                (step === 3 && Object.values(workoutPlan.weeklySchedule).every(day => day.length === 0))
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

        <DragOverlay dropAnimation={wasSuccessfulDrop ? null : dropAnimation}>
          {activeId ? (
            <div className={`inline-flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium shadow-lg border border-primary/20 transition-all duration-200 ${
              overId && daysOfWeek.some(day => day.id === overId) 
                ? 'scale-110 rotate-1 shadow-xl' 
                : 'scale-105'
            }`}>
              <span className="mr-1.5 text-base">{getExerciseTypeById(activeId as string)?.icon}</span>
              <span className="text-xs font-medium">{getExerciseTypeById(activeId as string)?.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}