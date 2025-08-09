'use client';
import React, { useState, useMemo } from 'react';
import DayCard from './DayCard';
import WeekNavigation from './WeekNavigation';
import WorkoutDetailView from './WorkoutDetailView';
import { 
  threeMileRunSession,
  upperBodyStrengthSession,
  murphWorkoutSession,
  fullBodyStrengthSession,
  recoveryWalkSession,
  completedMorning5K,
  completedBenchPressWorkout,
  ongoingSquatWorkout
} from '@/examples/sample-workout-sessions';
import { TrainingSession, TrainingSessionStatus, ActivityBlockType, CardioType } from '@/types/workouts/workout-types';

// Use the existing example training sessions and create calendar data
const generateCalendarFromSampleData = () => {
  const sampleSessions: TrainingSession[] = [
    threeMileRunSession,
    upperBodyStrengthSession,
    murphWorkoutSession,
    fullBodyStrengthSession,
    recoveryWalkSession,
    completedMorning5K,
    completedBenchPressWorkout,
    ongoingSquatWorkout
  ];
  
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  
  const workouts = [];
  
  // Generate 3 weeks of data (previous, current, next) using the sample sessions
  for (let weekOffset = -1; weekOffset <= 1; weekOffset++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const sessionIndex = (dayOffset + weekOffset + 7) % sampleSessions.length;
      const session = sampleSessions[sessionIndex];
      
      // Extract workout info from the session
      let workoutType: 'strength' | 'cardio' | 'recovery' | 'rest' = 'strength';
      let mainMetric = '0';
      let metricUnit = '';
      let summaryLine = '';
      
      // Determine workout type and metrics based on session content
      if (session.name.toLowerCase().includes('run') || session.name.toLowerCase().includes('cardio')) {
        workoutType = 'cardio';
        // Try to get distance from cardio activities
        const cardioBlock = session.blocks.find(block => block.type === ActivityBlockType.Cardio);
        if (cardioBlock?.cardioActivity) {
          const distance = cardioBlock.cardioActivity.plannedDistance || cardioBlock.cardioActivity.actualDistance;
          if (distance) {
            mainMetric = (distance / 1000).toFixed(1); // Convert meters to km
            metricUnit = 'km';
          } else {
            const time = cardioBlock.cardioActivity.plannedTime || cardioBlock.cardioActivity.actualTime;
            if (time) {
              mainMetric = Math.round(time / 60).toString(); // Convert seconds to minutes
              metricUnit = 'min';
            }
          }
          summaryLine = cardioBlock.cardioActivity.name || 'Cardio workout';
        }
      } else if (session.name.toLowerCase().includes('recovery') || session.name.toLowerCase().includes('walk')) {
        workoutType = 'recovery';
        mainMetric = '30';
        metricUnit = 'min';
        summaryLine = 'Active recovery';
      } else if (session.name.toLowerCase().includes('rest')) {
        workoutType = 'rest';
        mainMetric = '0';
        metricUnit = '';
        summaryLine = 'Rest day';
      } else {
        // Strength workout - try to extract weight info
        workoutType = 'strength';
        const structuredBlock = session.blocks.find(block => block.type === ActivityBlockType.Structured);
        if (structuredBlock?.structuredTraining?.exercises?.[0]?.sets?.[0]) {
          const firstSet = structuredBlock.structuredTraining.exercises[0].sets[0];
          
          // Try actual weight first (simple structure)
          if (firstSet.actualWeight && 'weight' in firstSet.actualWeight) {
            mainMetric = firstSet.actualWeight.weight.toString();
            metricUnit = firstSet.actualWeight.unit;
          }
          // Try planned weight (may have nested structure)
          else if (firstSet.plannedWeight) {
            if (firstSet.plannedWeight.type === 'bodyweight') {
              mainMetric = 'BW';
              metricUnit = '';
            } else if (firstSet.plannedWeight.type === 'absolute' && 'weight' in firstSet.plannedWeight && firstSet.plannedWeight.weight) {
              mainMetric = firstSet.plannedWeight.weight.weight.toString();
              metricUnit = firstSet.plannedWeight.weight.unit;
            } else {
              mainMetric = '155'; // Default strength metric
              metricUnit = 'lbs';
            }
          } else {
            mainMetric = '155'; // Default strength metric
            metricUnit = 'lbs';
          }
        } else {
          mainMetric = '155';
          metricUnit = 'lbs';
        }
        
        // Create summary based on session name
        const sessionName = session.name || '';
        if (sessionName.toLowerCase().includes('upper')) {
          summaryLine = 'Chest, Shoulders, Arms';
        } else if (sessionName.toLowerCase().includes('lower') || sessionName.toLowerCase().includes('squat')) {
          summaryLine = 'Legs, Glutes, Quads';
        } else if (sessionName.toLowerCase().includes('full')) {
          summaryLine = 'Full body compound';
        } else {
          summaryLine = 'Strength training';
        }
      }
      
      // Determine completion status
      let isCompleted = false;
      if (session.status === TrainingSessionStatus.Completed) {
        isCompleted = true;
      } else if (date < today && workoutType !== 'rest') {
        isCompleted = Math.random() > 0.3; // 70% chance of being completed for past workouts
      }
      
      workouts.push({
        date: date.getDate(),
        day: dayNames[date.getDay()],
        fullDate: date,
        workoutLabel: session.name || 'Workout',
        summaryLine,
        mainMetric,
        metricUnit,
        workoutType,
        isCompleted,
        weekIndex: weekOffset + 1,
        originalSession: session, // Keep reference to original session for detail view
      });
    }
  }
  
  return workouts;
};

const WorkoutCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(1); // Start at current week (index 1)
  
  const allWorkouts = useMemo(() => generateCalendarFromSampleData(), []);
  
  // Get current week workouts
  const currentWeekWorkouts = useMemo(() => {
    return allWorkouts.filter(workout => workout.weekIndex === currentWeekIndex);
  }, [allWorkouts, currentWeekIndex]);
  
  // Find today's index
  const todayIndex = useMemo(() => {
    const today = new Date();
    return currentWeekWorkouts.findIndex(workout => 
      workout.fullDate.toDateString() === today.toDateString()
    );
  }, [currentWeekWorkouts]);
  
  // Get selected workout
  const selectedWorkout = useMemo(() => {
    if (!selectedDate) return null;
    return currentWeekWorkouts.find(workout => 
      `${workout.fullDate.getTime()}` === selectedDate
    );
  }, [selectedDate, currentWeekWorkouts]);
  
  // Week navigation handlers
  const goToPreviousWeek = () => {
    setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
    setSelectedDate(null);
  };
  
  const goToNextWeek = () => {
    setCurrentWeekIndex(Math.min(2, currentWeekIndex + 1));
    setSelectedDate(null);
  };
  
  const goBackToToday = () => {
    setCurrentWeekIndex(1);
    setSelectedDate(null);
  };
  
  const selectWorkout = (workout: any) => {
    setSelectedDate(`${workout.fullDate.getTime()}`);
  };
  
  // Get week range string
  const getWeekRange = () => {
    if (currentWeekWorkouts.length === 0) return '';
    const first = currentWeekWorkouts[0];
    const last = currentWeekWorkouts[6];
    return `${first.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${last.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };
  
  const getDateKey = (workout: any) => `${workout.fullDate.getTime()}`;
  
  const isCurrentWeek = currentWeekIndex === 1;

  return (
    <section className="mt-8">
      <WeekNavigation
        currentWeekIndex={currentWeekIndex}
        totalWeeks={3}
        weekRange={getWeekRange()}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        isCurrentWeek={isCurrentWeek}
        onBackToToday={goBackToToday}
      />
      
      {/* Daily Cards Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3 lg:gap-4">
          {currentWeekWorkouts.map((workout, index) => (
            <DayCard
              key={getDateKey(workout)}
              day={workout.day}
              date={workout.date}
              workoutLabel={workout.workoutLabel}
              summaryLine={workout.summaryLine}
              mainMetric={workout.mainMetric}
              metricUnit={workout.metricUnit}
              workoutType={workout.workoutType}
              isSelected={selectedDate === getDateKey(workout)}
              isToday={isCurrentWeek && index === todayIndex}
              isCompleted={workout.isCompleted || false}
              onClick={() => selectWorkout(workout)}
            />
          ))}
        </div>
      </div>
      
      {selectedWorkout && (
        <WorkoutDetailView workout={selectedWorkout.originalSession || selectedWorkout} />
      )}
    </section>
  );
};

export default WorkoutCalendar;