'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Flame,
  Trophy,
  TrendingUp,
  Target,
  ChevronRight
} from 'lucide-react';
import { useWorkoutHistoryStore } from '@/store/workoutHistoryStore';

const WorkoutHistoryPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIntensity, setFilterIntensity] = useState<string>('all');
  const [showStats] = useState(true);

  const {
    workoutHistory,
    getWorkoutStats,
    searchWorkouts,
    filterWorkouts
  } = useWorkoutHistoryStore();

  const stats = useMemo(() => getWorkoutStats(), [getWorkoutStats]);

  // Filter and search workouts
  const filteredWorkouts = useMemo(() => {
    let result = workoutHistory;

    // Apply search
    if (searchQuery.trim()) {
      result = searchWorkouts(searchQuery);
    }

    // Apply filters
    const filters: Record<string, string> = {};
    if (filterType !== 'all') {
      filters.type = filterType;
    }
    if (filterIntensity !== 'all') {
      filters.intensity = filterIntensity;
    }

    if (Object.keys(filters).length > 0) {
      result = filterWorkouts(filters);
    }

    return result.sort((a, b) => b.completedAt - a.completedAt);
  }, [searchQuery, filterType, filterIntensity, workoutHistory, searchWorkouts, filterWorkouts]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    if (!intensity) return 'N/A';
    if (intensity <= 3) return 'Light';
    if (intensity <= 6) return 'Moderate';
    if (intensity <= 8) return 'Hard';
    return 'Very Hard';
  };

  // Group workouts by date for better organization
  const groupedWorkouts = useMemo(() => {
    const groups: Record<string, typeof filteredWorkouts> = {};
    
    filteredWorkouts.forEach(workout => {
      const dateKey = new Date(workout.completedAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(workout);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredWorkouts]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Workout History</h1>
            <p className="text-muted-foreground">
              Track your progress and view past workouts
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                    <div className="text-sm text-muted-foreground">Total Workouts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.averageIntensity}/10</div>
                    <div className="text-sm text-muted-foreground">Avg Intensity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search workouts, exercises, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Workout Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Strength Training">Strength</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Circuit Training">Circuit</SelectItem>
                    <SelectItem value="Recovery">Recovery</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterIntensity} onValueChange={setFilterIntensity}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout List */}
        <div className="space-y-6">
          {groupedWorkouts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchQuery || filterType !== 'all' || filterIntensity !== 'all' 
                    ? 'No workouts found matching your criteria.' 
                    : 'No workouts completed yet. Start your first workout!'
                  }
                </div>
                {!searchQuery && filterType === 'all' && filterIntensity === 'all' && (
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/today')}
                  >
                    Start a Workout
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            groupedWorkouts.map(([date, workouts]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                  {formatDate(new Date(date).getTime())}
                </h3>
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <Card 
                      key={workout.sessionId}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/workouts/${workout.sessionId}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                {workout.originalTemplate?.name || 'Custom Workout'}
                              </h4>
                              <Badge variant="outline">
                                {workout.originalTemplate?.type || 'Custom'}
                              </Badge>
                              {workout.personalRecords.length > 0 && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  {workout.personalRecords.length} PR{workout.personalRecords.length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{formatDuration(workout.actualDuration)}</span>
                              </div>
                              
                              {workout.intensityRating && (
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-muted-foreground" />
                                  <Badge 
                                    className={`text-xs ${getIntensityColor(workout.intensityRating)}`}
                                  >
                                    {getIntensityLabel(workout.intensityRating)}
                                  </Badge>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                <span>{workout.completedSets}/{workout.totalSets} sets</span>
                              </div>
                              
                              {workout.totalVolume && workout.totalVolume > 0 && (
                                <div className="flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-muted-foreground" />
                                  <span>{workout.totalVolume.toLocaleString()} lbs</span>
                                </div>
                              )}
                            </div>

                            {workout.workoutNotes && (
                              <div className="mt-2 text-sm text-muted-foreground italic">
                                &ldquo;{workout.workoutNotes}&rdquo;
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;