import { useWorkoutStore } from './workoutStore';
import { useDashboardStore } from './dashboardStore';

// Custom hooks for specific store slices to prevent unnecessary re-renders

export const useWorkoutData = () => {
  return useWorkoutStore((state) => ({
    workouts: state.workouts,
    viewingWeekData: state.viewingWeekData,
    selectedDate: state.selectedDate,
    todayIndex: state.todayIndex,
    selectedWorkoutIndex: state.selectedWorkoutIndex
  }));
};

export const useWorkoutNavigation = () => {
  return useWorkoutStore((state) => ({
    isViewingCurrentWeek: state.isViewingCurrentWeek,
    goToPreviousWeek: state.goToPreviousWeek,
    goToNextWeek: state.goToNextWeek,
    goBackToToday: state.goBackToToday,
    getResponsiveWeekRanges: state.getResponsiveWeekRanges
  }));
};

export const useWorkoutActions = () => {
  return useWorkoutStore((state) => ({
    selectWorkout: state.selectWorkout,
    updateWorkoutStatus: state.updateWorkoutStatus,
    getDateKey: state.getDateKey
  }));
};

export const useDashboardData = () => {
  return useDashboardStore((state) => ({
    userProfile: state.userProfile,
    isWorkoutCompleted: state.isWorkoutCompleted,
    todaysWorkout: state.todaysWorkout,
    workoutStats: state.workoutStats
  }));
};

export const useDashboardActions = () => {
  return useDashboardStore((state) => ({
    setIsWorkoutCompleted: state.setIsWorkoutCompleted,
    setUserProfile: state.setUserProfile,
    refreshTodaysWorkout: state.refreshTodaysWorkout
  }));
};

// Computed selectors for common use cases
export const useSelectedWorkout = () => {
  return useWorkoutStore((state) => 
    state.workouts[state.selectedWorkoutIndex]
  );
};

export const useTodaysWorkout = () => {
  return useWorkoutStore((state) => 
    state.todayIndex >= 0 ? state.workouts[state.todayIndex] : null
  );
};

export const useWeeklyStats = () => {
  return useWorkoutStore((state) => {
    const completedWorkouts = state.workouts.filter(w => w.status === 'Completed').length;
    const totalWorkouts = state.workouts.filter(w => w.workoutType !== 'rest').length;
    const restDays = state.workouts.filter(w => w.workoutType === 'rest').length;
    
    return {
      completedWorkouts,
      totalWorkouts,
      restDays,
      completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0
    };
  });
};