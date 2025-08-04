'use client';
import React from 'react';
import { WeeklyWorkout, getWorkoutTemplateById } from '../../data/workoutSchedule';
import { Button } from '../ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';

interface WorkoutDetailViewProps {
  workout: WeeklyWorkout;
}

const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({ workout }) => {
  const generateWorkoutContent = (workout: WeeklyWorkout) => {
    if (workout.type === 'Rest') {
      return (
        <p className="text-muted-foreground">Your body needs time to recover. Consider light stretching or a walk.</p>
      );
    }

    // Get the workout template
    const template = workout.templateId ? getWorkoutTemplateById(workout.templateId) : null;

    if (!template) {
      return (
        <p className="text-muted-foreground">Workout details not available.</p>
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
      <>
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Overview</div>
          <div className="flex flex-wrap gap-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Duration:</span> {template.duration}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Target:</span> {template.targetMuscles}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Intensity:</span> {template.intensity}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Exercises:</span> {template.totalExercises}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Est. Calories:</span> {template.estimatedCalories}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {template.sections
            .filter(section => section.type !== 'warmup' && section.type !== 'cooldown')
            .map((section, sectionIndex) => (
            <div 
              key={sectionIndex} 
              className={`border-l-2 ${getSectionBorderColor(section.type, sectionIndex)} pl-5 relative`}
            >
              <div className={`absolute -left-[6px] top-2 w-2.5 h-2.5 ${getSectionDotColor(section.type, sectionIndex)} rounded-full shadow-[0_0_0_3px_hsl(var(--card))]`}></div>
              <div className="text-base font-semibold mb-1 flex items-center gap-2">
                {section.name}
              </div>
              {section.rounds && (
                <div className="text-xs text-muted-foreground mb-3">
                  {section.rounds} rounds
                </div>
              )}
              <div className="space-y-2 ml-5">
                {section.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex}>
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="font-medium">
                        {section.type === 'superset' ? `${String.fromCharCode(65 + sectionIndex)}${exerciseIndex + 1}: ` : ''}
                        {exercise.name}
                      </span>
                      <span className="text-primary font-semibold text-xs">
                        {exercise.sets > 1 ? `${exercise.sets} × ` : ''}{exercise.reps}
                      </span>
                    </div>
                    {exercise.weight && (
                      <div className="text-xs text-muted-foreground ml-0 mt-1">
                        Weight: {exercise.weight}
                      </div>
                    )}
                    {exercise.notes && (
                      <div className="text-xs text-muted-foreground italic ml-0 mt-1">
                        {exercise.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {section.restBetweenRounds && (
                <div className="text-xs text-muted-foreground italic mt-2 ml-5">
                  Rest: {section.restBetweenRounds} between {section.type}s
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  if (!workout) {
    return (
      <div className="bg-card border rounded-2xl p-8 mt-6">
        <p className="text-muted-foreground">Select a workout to view details.</p>
      </div>
    );
  }

  // Handle empty/unplanned workout entries
  if (workout.type === 'No workout planned') {
    return (
      <div className="bg-card border rounded-2xl p-8 mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">No Workout Planned</h3>
            <div className="text-muted-foreground text-sm">No workout scheduled for {workout.month} {workout.date}, {workout.year}</div>
          </div>
          <Button variant="default" onClick={() => window.location.href = '/plan'}>
            Generate Workout
          </Button>
        </div>
        <div className="bg-secondary rounded-xl p-6 text-center">
          <p className="text-muted-foreground mb-4">
            This date is outside your current workout planning period. 
            Generate a personalized workout plan or extend your current program.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/plan'}>
              Create Workout Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-2xl p-8 mt-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{workout.name}</h3>
          <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{workout.type}</div>
        </div>
        {workout.type !== 'Rest' && (
          <Button variant="outline" onClick={() => window.location.href = '/today'}>
            View Session
            <SquareArrowOutUpRight className="w-3 h-3" />
          </Button>
        )}
      </div>
      {generateWorkoutContent(workout)}
    </div>
  );
};

export default React.memo(WorkoutDetailView);