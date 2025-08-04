'use client';
import React, { useEffect } from 'react';
import DayCard from './DayCard';
import WeekNavigation from './WeekNavigation';
import WorkoutDetailView from './WorkoutDetailView';
import { useWorkoutStore } from '../../store/workoutStore';

const WorkoutCalendar: React.FC = () => {
  // Get all data and actions from Zustand store
  const {
    // Data
    workouts,
    viewingWeekData,
    selectedDate,
    isViewingCurrentWeek,
    todayIndex,
    selectedWorkoutIndex,
    visibleCardsCount,
    
    // Actions
    goToPreviousWeek,
    goToNextWeek,
    goBackToToday,
    selectWorkout,
    getDateKey,
    getResponsiveWeekRanges,
    getVisibleWorkouts,
    updateVisibleCardsCount,
    initialize
  } = useWorkoutStore();
  
  // Initialize the store on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Update visible cards count on window resize
  useEffect(() => {
    const handleResize = () => {
      updateVisibleCardsCount();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateVisibleCardsCount]);


  return (
    <section>
      <WeekNavigation
        currentWeekIndex={useWorkoutStore.getState().viewingWeekIndex}
        totalWeeks={useWorkoutStore.getState().allWeeksData.length}
        weekRange={viewingWeekData?.weekOf || ''}
        weekRanges={getResponsiveWeekRanges()}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        isCurrentWeek={isViewingCurrentWeek}
        onBackToToday={goBackToToday}
      />
      
      {/* Adaptive Daily Cards Flex Row */}
      <div className="mb-6">
        <div className="grid gap-2 md:gap-3 lg:gap-4" style={{
          gridTemplateColumns: `repeat(${visibleCardsCount}, 1fr)`
        }}>
          {getVisibleWorkouts().map((workout, index) => {
            const workoutIndex = workouts.findIndex(w => getDateKey(w) === getDateKey(workout));
            return (
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
                isToday={isViewingCurrentWeek && workoutIndex === todayIndex}
                isCompleted={workout.isCompleted || false}
                onClick={() => selectWorkout(workout)}
              />
            );
          })}
          {/* Fill empty slots if we have fewer workouts than expected */}
          {Array.from({ length: Math.max(0, visibleCardsCount - getVisibleWorkouts().length) }).map((_, index) => (
            <div key={`empty-${index}`} className="invisible">
              <div className="h-[70px]" />
            </div>
          ))}
        </div>
      </div>
      
      {selectedWorkoutIndex !== null && workouts[selectedWorkoutIndex] && (
        <WorkoutDetailView workout={workouts[selectedWorkoutIndex]} />
      )}
    </section>
  );
};

export default WorkoutCalendar;