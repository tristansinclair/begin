import { useDashboardStore } from './dashboardStore';

// Custom hooks for specific store slices to prevent unnecessary re-renders

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
