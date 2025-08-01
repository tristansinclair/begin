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
    
    // Actions
    goToPreviousWeek,
    goToNextWeek,
    goBackToToday,
    selectWorkout,
    getDateKey,
    getResponsiveWeekRanges,
    initialize
  } = useWorkoutStore();
  
  // Initialize the store on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);


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
      
      {/* Adaptive Daily Cards Grid */}
      <div className="mb-6">
        {[
          { breakpoint: 'md:hidden', cols: 3, gap: 2, count: 3 },
          { breakpoint: 'hidden md:grid lg:hidden', cols: 4, gap: 3, count: 4 },
          { breakpoint: 'hidden lg:grid xl:hidden', cols: 5, gap: 4, count: 5 },
          { breakpoint: 'hidden xl:grid', cols: 7, gap: 4, count: 7 }
        ].map(({ breakpoint, cols, gap, count }, layoutIndex) => (
          <div key={layoutIndex} className={`grid grid-cols-${cols} gap-${gap} ${breakpoint}`}>
            {workouts.slice(0, count).map((workout, index) => (
              <DayCard
                key={index}
                day={workout.day}
                date={workout.date}
                workoutLabel={workout.workoutLabel}
                summaryLine={workout.summaryLine}
                mainMetric={workout.mainMetric}
                metricUnit={workout.metricUnit}
                workoutType={workout.workoutType}
                isSelected={selectedDate === getDateKey(workout)}
                isToday={isViewingCurrentWeek && index === todayIndex}
                isCompleted={workout.isCompleted || false}
                onClick={() => selectWorkout(workout)}
              />
            ))}
          </div>
        ))}
      </div>
      
      {selectedWorkoutIndex !== null && workouts[selectedWorkoutIndex] && (
        <WorkoutDetailView workout={workouts[selectedWorkoutIndex]} />
      )}
    </section>
  );
};

export default WorkoutCalendar;