'use client';
import React, { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  Weight,
  CheckCircle2,
  Circle,
  Heart,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useWorkoutHistoryStore } from '@/store/workoutHistoryStore';

const WorkoutDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { getWorkoutById } = useWorkoutHistoryStore();
  const workout = useMemo(() => getWorkoutById(sessionId), [sessionId, getWorkoutById]);

  if (!workout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/workouts')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Workout Not Found</h1>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground mb-4">
                The workout you&apos;re looking for doesn&apos;t exist or has been deleted.
              </div>
              <Button onClick={() => router.push('/workouts')}>
                Back to Workouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getIntensityColor = (intensity?: number) => {
    if (!intensity) return 'bg-gray-100 text-gray-600';
    if (intensity <= 3) return 'bg-green-100 text-green-700';
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-700';
    if (intensity <= 8) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getIntensityLabel = (intensity?: number) => {
    if (!intensity) return 'Not Rated';
    if (intensity <= 3) return 'Light';
    if (intensity <= 6) return 'Moderate';
    if (intensity <= 8) return 'Hard';
    return 'Very Hard';
  };

  const getEnjoymentLabel = (enjoyment?: number) => {
    if (!enjoyment) return 'Not Rated';
    if (enjoyment <= 2) return 'Poor';
    if (enjoyment <= 4) return 'Fair';
    if (enjoyment <= 6) return 'Good';
    if (enjoyment <= 8) return 'Very Good';
    return 'Excellent';
  };

  const completionPercentage = Math.round((workout.completedSets / workout.totalSets) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/workouts')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {workout.originalTemplate?.name || 'Custom Workout'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>{formatDate(workout.completedAt)}</span>
              <span>•</span>
              <span>{formatTime(workout.startTime)} - {formatTime(workout.endTime!)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Workout Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Workout Summary</span>
                <Badge variant="outline" className="text-sm">
                  {workout.originalTemplate?.type || 'Custom'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatDuration(workout.actualDuration)}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completionPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>

                {workout.totalVolume && workout.totalVolume > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Weight className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{workout.totalVolume.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Volume (lbs)</div>
                    </div>
                  </div>
                )}

                {workout.personalRecords.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{workout.personalRecords.length}</div>
                      <div className="text-sm text-muted-foreground">Personal Records</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Intensity</div>
                    <div className="flex items-center gap-2">
                      <Badge className={getIntensityColor(workout.intensityRating)}>
                        {getIntensityLabel(workout.intensityRating)}
                      </Badge>
                      {workout.intensityRating && (
                        <span className="text-sm text-muted-foreground">
                          {workout.intensityRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Enjoyment</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getEnjoymentLabel(workout.enjoymentRating)}
                      </Badge>
                      {workout.enjoymentRating && (
                        <span className="text-sm text-muted-foreground">
                          {workout.enjoymentRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Records */}
          {workout.personalRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workout.personalRecords.map((record, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">{record}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workout Notes */}
          {workout.workoutNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Workout Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground italic">&ldquo;{workout.workoutNotes}&rdquo;</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercise Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workout.sections.map((section) => (
                  <div key={section.sectionId} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{section.sectionName}</h3>
                      <Badge variant="outline" className="capitalize">
                        {section.sectionType}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {section.exercises.map((exercise) => (
                        <div key={exercise.exerciseId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-lg">{exercise.exerciseName}</h4>
                            {exercise.isSubstituted && (
                              <Badge variant="secondary" className="text-xs">
                                Substituted from: {exercise.originalExercise}
                              </Badge>
                            )}
                          </div>

                          {/* Sets */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-muted-foreground">Sets</h5>
                            <div className="grid gap-2">
                              {exercise.sets.map((set, setIndex) => (
                                <div
                                  key={setIndex}
                                  className={`flex items-center justify-between p-3 rounded-lg border ${
                                    set.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">Set {setIndex + 1}</span>
                                    {set.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    {set.completed ? (
                                      <>
                                        <span>{set.reps} reps</span>
                                        {set.weight && <span>{set.weight} lbs</span>}
                                      </>
                                    ) : (
                                      <span className="text-muted-foreground">Not completed</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exercise Notes */}
                          {exercise.notes && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                              <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                              <div className="text-sm">{exercise.notes}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workout Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Workout Started</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(workout.startTime)} on {formatDate(workout.startTime)}
                    </div>
                  </div>
                </div>

                {workout.pausedDuration > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Paused Duration</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(Math.round(workout.pausedDuration / 60000))} total
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Workout Completed</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(workout.endTime!)} on {formatDate(workout.endTime!)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;