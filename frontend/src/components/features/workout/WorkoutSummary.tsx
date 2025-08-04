import { useState } from 'react';
import { useWorkoutSessionStore, WorkoutSession } from '@/store/workoutSessionStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Star,
  MessageSquare,
  CheckCircle2,
  Award,
  Flame
} from 'lucide-react';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  onComplete: (feedback: { intensity: number; enjoyment: number; notes?: string }) => void;
  onCancel?: () => void;
}

export default function WorkoutSummary({ session, onComplete, onCancel }: WorkoutSummaryProps) {
  const [intensityRating, setIntensityRating] = useState(5);
  const [enjoymentRating, setEnjoymentRating] = useState(5);
  const [notes, setNotes] = useState('');

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const workoutDuration = session.endTime 
    ? session.endTime - session.startTime - session.pausedDuration
    : Date.now() - session.startTime - session.pausedDuration;

  const completedExercises = session.sections.reduce(
    (total, section) => total + section.exercises.filter(ex => ex.sets.every(s => s.completed)).length,
    0
  );

  const totalWeight = session.sections.reduce(
    (total, section) => total + section.exercises.reduce(
      (sectionTotal, ex) => sectionTotal + ex.sets.reduce(
        (exerciseTotal, set) => exerciseTotal + (set.weight || 0) * set.reps,
        0
      ),
      0
    ),
    0
  );

  const averageWeight = session.completedSets > 0 
    ? totalWeight / session.completedSets 
    : 0;

  const getIntensityLabel = (rating: number): string => {
    if (rating <= 2) return 'Very Easy';
    if (rating <= 4) return 'Easy';
    if (rating <= 6) return 'Moderate';
    if (rating <= 8) return 'Hard';
    return 'Very Hard';
  };

  const getEnjoymentLabel = (rating: number): string => {
    if (rating <= 2) return 'Didn\'t Enjoy';
    if (rating <= 4) return 'Okay';
    if (rating <= 6) return 'Good';
    if (rating <= 8) return 'Great';
    return 'Loved It!';
  };

  const handleSubmit = () => {
    onComplete({
      intensity: intensityRating,
      enjoyment: enjoymentRating,
      notes: notes.trim() || undefined
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Workout Complete!</CardTitle>
          <p className="text-muted-foreground">
            Great job finishing your workout. Here's how you did:
          </p>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Workout Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{formatDuration(workoutDuration)}</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{session.completedSets}</div>
              <div className="text-sm text-muted-foreground">Sets Completed</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{completedExercises}</div>
              <div className="text-sm text-muted-foreground">Exercises</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">{Math.round(averageWeight)}</div>
              <div className="text-sm text-muted-foreground">Avg Weight (lbs)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Records */}
      {session.personalRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {session.personalRecords.map((record, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">{record}</span>
                  <Badge variant="secondary" className="ml-auto">PR!</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intensity Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            How intense was this workout?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Too Easy</span>
              <span className="font-medium">{getIntensityLabel(intensityRating)}</span>
              <span className="text-sm text-muted-foreground">Too Hard</span>
            </div>
            <Slider
              value={[intensityRating]}
              onValueChange={(value) => setIntensityRating(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enjoyment Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            How much did you enjoy this workout?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Didn't enjoy</span>
              <span className="font-medium">{getEnjoymentLabel(enjoymentRating)}</span>
              <span className="text-sm text-muted-foreground">Loved it!</span>
            </div>
            <Slider
              value={[enjoymentRating]}
              onValueChange={(value) => setEnjoymentRating(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Workout Notes (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How did you feel? Any observations about form, energy levels, or specific exercises?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Go Back
          </Button>
        )}
        
        <Button onClick={handleSubmit} className="flex-1" size="lg">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Complete Workout
        </Button>
      </div>
    </div>
  );
}