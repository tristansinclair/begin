'use client';
import React, { useState } from 'react';
import DayCard from './DayCard';
import WeekNavigation from './WeekNavigation';
import WorkoutDetailView from './WorkoutDetailView';
import { 
  workoutScheduleData, 
  getCurrentWeekIndex,
  WeeklyWorkout 
} from '../../data/workoutSchedule';

const WorkoutCalendar: React.FC = () => {
  // Week navigation state
  const [currentWeekIndex, setCurrentWeekIndex] = useState(getCurrentWeekIndex());
  const [selectedWorkout, setSelectedWorkout] = useState(4); // Thursday (today)
  
  // Get current week data
  const currentWeekData = workoutScheduleData[currentWeekIndex];
  const workouts = currentWeekData.workouts;
  const todayIndex = 4; // Thursday = July 31st, 2025
  
  // Navigation functions
  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
      setSelectedWorkout(0); // Reset to first day of week
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < workoutScheduleData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
      setSelectedWorkout(0); // Reset to first day of week
    }
  };

  return (
    <section>
      <WeekNavigation
        currentWeekIndex={currentWeekIndex}
        totalWeeks={workoutScheduleData.length}
        weekRange={currentWeekData.weekOf}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-6">
        {workouts.map((workout, index) => (
          <DayCard
            key={index}
            day={workout.day}
            date={workout.date}
            workoutLabel={workout.workoutLabel}
            summaryLine={workout.summaryLine}
            mainMetric={workout.mainMetric}
            metricUnit={workout.metricUnit}
            workoutType={workout.workoutType}
            isSelected={selectedWorkout === index}
            isToday={currentWeekIndex === getCurrentWeekIndex() && index === todayIndex}
            isCompleted={workout.isCompleted || false}
            onClick={() => setSelectedWorkout(index)}
          />
        ))}
      </div>
      
      <WorkoutDetailView workout={workouts[selectedWorkout]} />
    </section>
  );
};

export default WorkoutCalendar;