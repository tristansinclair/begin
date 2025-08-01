'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DayCard from './DayCard';
import WeekNavigation from './WeekNavigation';
import WorkoutDetailView from './WorkoutDetailView';
import { 
  workoutScheduleData, 
  getCurrentWeekIndex,
  WeeklyWorkout,
  generateAdditionalWeeks
} from '../../data/workoutSchedule';

const WorkoutCalendar: React.FC = () => {
  // Dynamic workout schedule data with unlimited scrolling
  const [allWeeksData, setAllWeeksData] = useState(workoutScheduleData);
  const [currentWeekIndexOffset, setCurrentWeekIndexOffset] = useState(0); // Tracks how many weeks we've added to the beginning
  const currentWeekIndex = getCurrentWeekIndex() + currentWeekIndexOffset;
  const [viewingWeekIndex, setViewingWeekIndex] = useState(currentWeekIndex);
  
  // Track selected date instead of just index
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Memoized helper function to create date key from workout
  const getDateKey = useCallback((workout: WeeklyWorkout): string => {
    return `${workout.year}-${workout.month}-${workout.date}`;
  }, []);
  
  // Memoized helper function to get today's date key
  const getTodayDateKey = useCallback((): string => {
    const today = new Date(2025, 6, 31); // July 31st, 2025
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    return `${today.getFullYear()}-${month}-${today.getDate()}`;
  }, []);

  // Memoized viewing week data and workouts
  const viewingWeekData = useMemo(() => allWeeksData[viewingWeekIndex], [allWeeksData, viewingWeekIndex]);
  const workouts = useMemo(() => viewingWeekData?.workouts || [], [viewingWeekData]);
  
  // Memoized current week check
  const isViewingCurrentWeek = useMemo(() => viewingWeekIndex === currentWeekIndex, [viewingWeekIndex, currentWeekIndex]);

  // Memoized today's date key
  const todayDateKey = useMemo(() => getTodayDateKey(), [getTodayDateKey]);

  // Memoized today's index calculation
  const todayIndex = useMemo(() => {
    const index = workouts.findIndex(workout => getDateKey(workout) === todayDateKey);
    return index >= 0 ? index : -1;
  }, [workouts, getDateKey, todayDateKey]);
  
  // Memoized selected workout index calculation
  const selectedWorkoutIndex = useMemo(() => {
    if (!selectedDate) return 0;
    const index = workouts.findIndex(workout => getDateKey(workout) === selectedDate);
    return index >= 0 ? index : 0;
  }, [selectedDate, workouts, getDateKey]);
  
  // Initialize selected date if not set
  useEffect(() => {
    if (workouts.length > 0 && !selectedDate) {
      if (isViewingCurrentWeek && todayIndex >= 0) {
        // If we're on the current week and today exists, select today
        setSelectedDate(getDateKey(workouts[todayIndex]));
      } else {
        // Otherwise, select the first workout or first non-rest day
        const firstWorkoutIndex = workouts.findIndex(w => w.workoutType !== 'rest');
        const targetIndex = firstWorkoutIndex >= 0 ? firstWorkoutIndex : 0;
        setSelectedDate(getDateKey(workouts[targetIndex]));
      }
    }
  }, [selectedDate, isViewingCurrentWeek, todayIndex, workouts]);

  // Memoized workout selection handler
  const handleWorkoutSelect = useCallback((workout: WeeklyWorkout) => {
    setSelectedDate(getDateKey(workout));
  }, [getDateKey]);

  // Memoized navigation functions with unlimited scrolling
  const goToPreviousWeek = useCallback(() => {
    if (viewingWeekIndex > 0) {
      setViewingWeekIndex(viewingWeekIndex - 1);
    } else {
      // Generate more past weeks
      const additionalWeeks = generateAdditionalWeeks(allWeeksData.length, 'past', 4);
      setAllWeeksData([...additionalWeeks, ...allWeeksData]);
      setCurrentWeekIndexOffset(currentWeekIndexOffset + 4);
      setViewingWeekIndex(3); // Stay at the same week after adding 4 weeks to the beginning
    }
  }, [viewingWeekIndex, allWeeksData, currentWeekIndexOffset]);

  const goToNextWeek = useCallback(() => {
    if (viewingWeekIndex < allWeeksData.length - 1) {
      setViewingWeekIndex(viewingWeekIndex + 1);
    } else {
      // Generate more future weeks
      const additionalWeeks = generateAdditionalWeeks(allWeeksData.length, 'future', 4);
      setAllWeeksData([...allWeeksData, ...additionalWeeks]);
      setViewingWeekIndex(viewingWeekIndex + 1);
    }
  }, [viewingWeekIndex, allWeeksData]);

  // Memoized Back to Today functionality
  const goBackToToday = useCallback(() => {
    setViewingWeekIndex(currentWeekIndex);
    // Set today's date as selected
    setSelectedDate(todayDateKey);
  }, [currentWeekIndex, todayDateKey]);

  // Memoized responsive week ranges that match the card breakpoints
  const weekRanges = useMemo(() => {
    if (!viewingWeekData || workouts.length === 0) return {
      mobile: '',
      medium: '',
      large: '',
      xl: '',
      full: ''
    };
    
    const firstDay = workouts[0];
    const getEndDay = (count: number) => workouts[Math.min(count - 1, workouts.length - 1)];
    
    return {
      mobile: `${firstDay.month} ${firstDay.date} - ${getEndDay(3).date}`, // 3 days (mobile + small)
      medium: `${firstDay.month} ${firstDay.date} - ${getEndDay(4).date}`, // 4 days (medium)
      large: `${firstDay.month} ${firstDay.date} - ${getEndDay(5).date}`,  // 5 days (large)  
      xl: viewingWeekData.weekOf, // 7 days (xl+)
      full: viewingWeekData.weekOf
    };
  }, [viewingWeekData, workouts]);


  return (
    <section>
      <WeekNavigation
        currentWeekIndex={viewingWeekIndex}
        totalWeeks={allWeeksData.length}
        weekRange={viewingWeekData?.weekOf || ''}
        weekRanges={weekRanges}
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
                onClick={() => handleWorkoutSelect(workout)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <WorkoutDetailView workout={workouts[selectedWorkoutIndex]} />
    </section>
  );
};

export default WorkoutCalendar;