import { useState, useEffect } from 'react';
import { useWorkoutSessionStore } from '@/store/workoutSessionStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  Circle, 
  Weight, 
  RotateCcw,
  MessageSquare,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from "@/lib/utils";
import WorkoutTimer from './WorkoutTimer';

interface ExerciseCardProps {
  showTimer?: boolean;
  showNotes?: boolean;
  variant?: 'full' | 'compact';
}

export default function ExerciseCard({ 
  showTimer = true, 
  showNotes = true,
  variant = 'full' 
}: ExerciseCardProps) {
  const {
    activeSession,
    completeSet,
    updateSet,
    updateExerciseNotes,
    restTimerEndTime,
    skipRest
  } = useWorkoutSessionStore();

  const [repsInput, setRepsInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  // Get current exercise data - always call hooks before early returns
  const currentSection = activeSession?.sections[activeSession?.currentSectionIndex];
  const currentExercise = currentSection?.exercises[activeSession?.currentExerciseIndex];
  const currentSet = currentExercise?.sets[activeSession?.currentSetIndex];
  const nextSet = currentExercise?.sets[activeSession?.currentSetIndex + 1];

  // Initialize input values
  useEffect(() => {
    if (currentSet) {
      setRepsInput(currentSet.reps.toString() || '');
      setWeightInput(currentSet.weight?.toString() || '');
    }
    if (currentExercise) {
      setNotesInput(currentExercise.notes || '');
    }
  }, [currentSet, currentExercise, activeSession?.currentSetIndex]);

  if (!activeSession) {
    return null;
  }

  if (!currentExercise) {
    return null;
  }

  const handleCompleteSet = () => {
    const reps = parseInt(repsInput) || 0;
    const weight = weightInput ? parseFloat(weightInput) : undefined;
    
    if (reps > 0) {
      completeSet(reps, weight);
      
      // Clear inputs for next set
      setRepsInput('');
      setWeightInput('');
    }
  };

  const handleUpdateSet = (setIndex: number, completed: boolean) => {
    if (!completed) {
      updateSet(setIndex, { completed: false, reps: 0, weight: undefined });
    }
  };

  const saveNotes = () => {
    updateExerciseNotes(notesInput);
    setShowNotesInput(false);
  };

  const parseTargetReps = (repsString: string): { min?: number; max?: number; target?: number } => {
    if (repsString.includes('-')) {
      const [min, max] = repsString.split('-').map(s => parseInt(s.trim()));
      return { min, max };
    }
    
    const target = parseInt(repsString);
    if (!isNaN(target)) {
      return { target };
    }
    
    return {};
  };

  const formatWeight = (weight?: number): string => {
    return weight ? `${weight} lbs` : 'Body weight';
  };

  const getTargetRepsDisplay = (): string => {
    if (!currentExercise.sets[0]?.reps) return 'As prescribed';
    const parsed = parseTargetReps(currentExercise.sets[0].reps);
    return parsed.min ? `${parsed.min}-${parsed.max || parsed.min}` : (parsed.target?.toString() || 'As prescribed');
  };

  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{currentExercise.exerciseName}</h3>
            <Badge variant="outline">
              Set {activeSession.currentSetIndex + 1} / {currentExercise.sets.length}
            </Badge>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Reps"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Weight"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="text-center"
              />
            </div>
            <Button 
              onClick={handleCompleteSet}
              disabled={!repsInput || parseInt(repsInput) <= 0}
              className="px-6"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1">
            {currentExercise.sets.map((set, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 h-2 rounded",
                  set.completed ? "bg-green-500" : "bg-gray-200",
                  index === activeSession.currentSetIndex && "ring-2 ring-blue-500 ring-offset-1"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentExercise.exerciseName}</h2>
            {currentExercise.isSubstituted && (
              <Badge variant="secondary" className="mt-1">
                Substituted from: {currentExercise.originalExercise}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotesInput(!showNotesInput)}
                className="h-8 w-8 p-0"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
            
            <Badge variant="outline">
              Set {activeSession.currentSetIndex + 1} / {currentExercise.sets.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Rest Timer */}
        {showTimer && restTimerEndTime && (
          <WorkoutTimer
            type="rest"
            duration={Math.ceil((restTimerEndTime - Date.now()) / 1000)}
            endTime={restTimerEndTime}
            title="Rest Time"
            onComplete={() => {}}
            onSkip={skipRest}
            variant="compact"
          />
        )}

        {/* Current Set Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Target: {getTargetRepsDisplay()} reps</span>
            {currentExercise.sets[0]?.weight && (
              <>
                <Weight className="h-4 w-4 ml-2" />
                <span>{currentExercise.sets[0]?.weight}</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reps</label>
              <Input
                type="number"
                placeholder="0"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
                className="text-center text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (lbs)</label>
              <Input
                type="number"
                step="0.5"
                placeholder="0"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="text-center text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Complete</label>
              <Button 
                size="lg"
                onClick={handleCompleteSet}
                disabled={!repsInput || parseInt(repsInput) <= 0}
                className="w-full h-10"
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Set History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Sets</h4>
          <div className="grid gap-2">
            {currentExercise.sets.map((set, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  set.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200",
                  index === activeSession.currentSetIndex && "ring-2 ring-blue-500 ring-offset-1"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Set {index + 1}</span>
                  
                  {set.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  {set.completed ? (
                    <>
                      <span>{set.reps} reps</span>
                      <span>{formatWeight(set.weight)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateSet(index, false)}
                        className="h-6 w-6 p-0"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Set Preview */}
        {nextSet && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span>Next: Set {activeSession.currentSetIndex + 2}</span>
            </div>
          </div>
        )}

        {/* Exercise Notes */}
        {showNotes && (showNotesInput || currentExercise.notes) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            {showNotesInput ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add notes about this exercise..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveNotes}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowNotesInput(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                {currentExercise.notes || "No notes for this exercise"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}