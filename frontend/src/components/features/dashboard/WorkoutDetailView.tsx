'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';
import { TrainingSession } from '@/types/workouts/workout-types';

interface WorkoutDetailViewProps {
  workout: TrainingSession | any; // Allow both TrainingSession and our calendar workout object
}

const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({ workout }) => {
  // Handle both TrainingSession objects and our calendar workout objects
  const getWorkoutInfo = () => {
    if (!workout) return null;
    
    // If it's a TrainingSession object
    if ('blocks' in workout && workout.blocks) {
      return {
        name: workout.name,
        status: workout.status,
        estimatedDuration: workout.estimatedDuration,
        actualDuration: workout.actualDuration,
        blocks: workout.blocks,
        tags: workout.tags,
        notes: workout.notes,
        intensityRating: workout.intensityRating,
        enjoymentRating: workout.enjoymentRating
      };
    }
    
    // If it's our calendar workout object
    return {
      name: workout.workoutLabel || workout.name,
      type: workout.workoutType,
      mainMetric: workout.mainMetric,
      metricUnit: workout.metricUnit,
      summaryLine: workout.summaryLine,
      isCompleted: workout.isCompleted
    };
  };

  const workoutInfo = getWorkoutInfo();
  
  if (!workoutInfo) {
    return (
      <div className="bg-card border rounded-2xl p-8 mt-6">
        <p className="text-muted-foreground">Select a workout to view details.</p>
      </div>
    );
  }

  const generateWorkoutContent = () => {
    // Handle TrainingSession with blocks
    if ('blocks' in workoutInfo && workoutInfo.blocks) {
      const session = workoutInfo as any;
      
      return (
        <>
          <div className="bg-secondary rounded-xl p-4 mb-6">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Overview</div>
            <div className="flex flex-wrap gap-6">
              {session.estimatedDuration && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Est. Duration:</span> {session.estimatedDuration}min
                </div>
              )}
              {session.actualDuration && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Actual Duration:</span> {session.actualDuration}min
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Blocks:</span> {session.blocks.length}
              </div>
              {session.status && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Status:</span> {session.status}
                </div>
              )}
              {session.intensityRating && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Intensity:</span> {session.intensityRating}/10
                </div>
              )}
              {session.enjoymentRating && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Enjoyment:</span> {session.enjoymentRating}/10
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {session.blocks.map((block: any, blockIndex: number) => (
              <div 
                key={block.id || blockIndex} 
                className="border-l-2 border-primary pl-5 relative"
              >
                <div className="absolute -left-[6px] top-2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_0_3px_hsl(var(--card))]"></div>
                <div className="text-base font-semibold mb-1">
                  {block.name}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Type: {block.type}
                </div>
                
                {/* Cardio Activity */}
                {block.cardioActivity && (
                  <div className="ml-5 space-y-2">
                    <div className="text-sm font-medium">{block.cardioActivity.name}</div>
                    <div className="space-y-1">
                      {block.cardioActivity.plannedDistance && (
                        <div className="text-xs text-muted-foreground">
                          Planned Distance: {(block.cardioActivity.plannedDistance / 1000).toFixed(1)}km
                        </div>
                      )}
                      {block.cardioActivity.actualDistance && (
                        <div className="text-xs text-muted-foreground">
                          Actual Distance: {(block.cardioActivity.actualDistance / 1000).toFixed(1)}km
                        </div>
                      )}
                      {block.cardioActivity.plannedTime && (
                        <div className="text-xs text-muted-foreground">
                          Planned Time: {Math.round(block.cardioActivity.plannedTime / 60)}min
                        </div>
                      )}
                      {block.cardioActivity.actualTime && (
                        <div className="text-xs text-muted-foreground">
                          Actual Time: {Math.round(block.cardioActivity.actualTime / 60)}min
                        </div>
                      )}
                      {block.cardioActivity.notes && (
                        <div className="text-xs text-muted-foreground italic">
                          {block.cardioActivity.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Structured Training */}
                {block.structuredTraining && (
                  <div className="ml-5 space-y-3">
                    {block.structuredTraining.exercises?.map((exercise: any, exIndex: number) => (
                      <div key={exercise.id || exIndex}>
                        <div className="text-sm font-medium">{exercise.exerciseDefinitionId}</div>
                        <div className="space-y-1 ml-2">
                          {exercise.sets.map((set: any, setIndex: number) => (
                            <div key={set.id || setIndex} className="text-xs text-muted-foreground">
                              Set {set.setNumber}: 
                              {set.plannedReps && ` ${set.plannedReps} reps`}
                              {set.actualReps && ` (${set.actualReps} actual)`}
                              {set.plannedWeight && 'weight' in set.plannedWeight && ` @ ${set.plannedWeight.weight.weight}${set.plannedWeight.weight.unit}`}
                              {set.actualWeight && ` (${set.actualWeight.weight}${set.actualWeight.unit} actual)`}
                              {set.restAfter && ` • Rest: ${set.restAfter}s`}
                              {set.notes && (
                                <div className="italic ml-2">{set.notes}</div>
                              )}
                            </div>
                          ))}
                        </div>
                        {exercise.notes && (
                          <div className="text-xs text-muted-foreground italic ml-2 mt-1">
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {session.notes && (
            <div className="mt-6 bg-secondary rounded-xl p-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</div>
              <div className="text-sm">{session.notes}</div>
            </div>
          )}
        </>
      );
    }
    
    // Handle simple calendar workout object
    const simpleWorkout = workoutInfo as any;
    
    if (simpleWorkout.type === 'rest') {
      return (
        <p className="text-muted-foreground">Your body needs time to recover. Consider light stretching or a walk.</p>
      );
    }

    return (
      <div className="bg-secondary rounded-xl p-4">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workout Summary</div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Type:</span> {simpleWorkout.type}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Focus:</span> {simpleWorkout.summaryLine}
          </div>
          {simpleWorkout.mainMetric && simpleWorkout.metricUnit && (
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Target:</span> {simpleWorkout.mainMetric} {simpleWorkout.metricUnit}
            </div>
          )}
          {simpleWorkout.isCompleted && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Completed
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle "No workout planned" case
  if (workoutInfo.name === 'No workout planned') {
    return (
      <div className="bg-card border rounded-2xl p-8 mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">No Workout Planned</h3>
            <div className="text-muted-foreground text-sm">No workout scheduled for this date</div>
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
          <h3 className="text-2xl font-semibold mb-2">{workoutInfo.name}</h3>
          {workoutInfo.status && (
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              {workoutInfo.status}
            </div>
          )}
          {workoutInfo.type && (
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              {workoutInfo.type}
            </div>
          )}
        </div>
        {workoutInfo.type !== 'rest' && (
          <Button variant="outline" onClick={() => window.location.href = '/today'}>
            View Session
            <SquareArrowOutUpRight className="w-3 h-3" />
          </Button>
        )}
      </div>
      {generateWorkoutContent()}
    </div>
  );
};

export default React.memo(WorkoutDetailView);