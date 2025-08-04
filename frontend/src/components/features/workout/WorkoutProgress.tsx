import { useWorkoutSessionStore } from '@/store/workoutSessionStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Target, 
  CheckCircle2,
  Circle,
  Play,
  Pause
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkoutProgressProps {
  showNavigation?: boolean;
  showSectionBreakdown?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
}

export default function WorkoutProgress({
  showNavigation = true,
  showSectionBreakdown = true,
  variant = 'full'
}: WorkoutProgressProps) {
  const {
    activeSession,
    getProgress,
    goToSection,
    nextExercise,
    previousExercise,
    pauseWorkout,
    resumeWorkout
  } = useWorkoutSessionStore();

  if (!activeSession) {
    return null;
  }

  const progress = getProgress();
  const currentSection = activeSession.sections[activeSession.currentSectionIndex];
  const currentExercise = currentSection?.exercises[activeSession.currentExerciseIndex];
  
  const elapsedTime = activeSession.isPaused 
    ? (activeSession.lastPauseStart || Date.now()) - activeSession.startTime - activeSession.pausedDuration
    : Date.now() - activeSession.startTime - activeSession.pausedDuration;
  
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'warmup':
        return '🔥';
      case 'main':
        return '💪';
      case 'superset':
        return '⚡';
      case 'circuit':
        return '🔄';
      case 'finisher':
        return '🎯';
      case 'cooldown':
        return '🧘';
      default:
        return '💪';
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{Math.round(progress.overall)}%</span>
        </div>

        <Progress value={progress.overall} className="flex-1 h-2" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {getSectionIcon(currentSection?.sectionType)} {currentSection?.sectionName}
              </Badge>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(elapsedTime)}
              </div>
            </div>

            {showNavigation && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousExercise}
                  disabled={activeSession.currentSectionIndex === 0 && activeSession.currentExerciseIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={activeSession.isPaused ? resumeWorkout : pauseWorkout}
                  className="h-8 w-8 p-0"
                >
                  {activeSession.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextExercise}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{Math.round(progress.overall)}%</span>
            </div>
            <Progress value={progress.overall} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Workout Progress</span>
            {activeSession.isPaused && (
              <Badge variant="secondary">Paused</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </div>
            
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {activeSession.completedSets} / {activeSession.totalSets} sets
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(progress.overall)}%</span>
          </div>
          <Progress value={progress.overall} className="h-3" />
        </div>

        {/* Current Section Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {getSectionIcon(currentSection?.sectionType)} {currentSection?.sectionName}
            </span>
            <span className="font-medium">{Math.round(progress.section)}%</span>
          </div>
          <Progress value={progress.section} className="h-2" />
        </div>

        {/* Current Exercise */}
        {currentExercise && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{currentExercise.exerciseName}</span>
              <span>
                Set {activeSession.currentSetIndex + 1} / {currentExercise.sets.length}
              </span>
            </div>
            <Progress value={progress.exercise} className="h-2" />
          </div>
        )}

        {/* Section Breakdown */}
        {showSectionBreakdown && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Sections</h4>
            <div className="grid gap-2">
              {activeSession.sections.map((section, index) => {
                const sectionProgress = section.exercises.reduce(
                  (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
                  0
                );
                const sectionTotal = section.exercises.reduce(
                  (acc, ex) => acc + ex.sets.length,
                  0
                );
                const isComplete = sectionProgress === sectionTotal;
                const isCurrent = index === activeSession.currentSectionIndex;
                
                return (
                  <Button
                    key={section.sectionId}
                    variant={isCurrent ? "default" : "ghost"}
                    className={cn(
                      "justify-between h-auto p-3",
                      isComplete && "text-green-600",
                      isCurrent && "ring-2 ring-ring ring-offset-2"
                    )}
                    onClick={() => goToSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span>{getSectionIcon(section.sectionType)} {section.sectionName}</span>
                    </div>
                    
                    <span className="text-xs">
                      {sectionProgress} / {sectionTotal}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        {showNavigation && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousExercise}
              disabled={activeSession.currentSectionIndex === 0 && activeSession.currentExerciseIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant={activeSession.isPaused ? "default" : "secondary"}
              onClick={activeSession.isPaused ? resumeWorkout : pauseWorkout}
            >
              {activeSession.isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={nextExercise}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}