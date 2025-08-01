import { workoutTemplates, WorkoutTemplate } from './workoutTemplates';

export enum WorkoutStatus {
  Completed = 'Completed',
  Missed = 'Missed',
  Canceled = 'Canceled',
  Future = 'Future'
}

export interface WeeklyWorkout {
  day: string;
  date: number;
  month: string;
  year: number;
  templateId: string | null;
  type: string;
  name: string;
  duration: string;
  exercises: number | string;
  intensity: 'low' | 'medium' | 'high' | 'rest';
  workoutLabel: string;
  summaryLine: string;
  mainMetric: string;
  metricUnit: string;
  workoutType: 'strength' | 'cardio' | 'recovery' | 'rest';
  status: WorkoutStatus;
  isCompleted?: boolean;
  completedStats?: {
    actualDuration: string;
    caloriesBurned: number;
    personalRecords: number;
    averageWeight: string;
    totalSets: number;
  };
}

export interface WeekData {
  weekOf: string; // e.g., "July 21 - 27"
  startDate: Date;
  workouts: WeeklyWorkout[];
}

// Helper function to get day abbreviation
const getDayAbbr = (date: Date): string => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
};

// Helper function to get month name
const getMonthName = (date: Date): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[date.getMonth()];
};

// Helper function to format week range
const formatWeekRange = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const startMonth = getMonthName(startDate).substring(0, 3);
  const endMonth = getMonthName(endDate).substring(0, 3);
  
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}`;
  } else {
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
  }
};

// Helper function to determine workout status based on date and completion
const getWorkoutStatus = (date: Date, isCompleted: boolean = false): WorkoutStatus => {
  const today = new Date(2025, 6, 31); // July 31st, 2025
  const workoutDate = new Date(date);
  
  // Set time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  workoutDate.setHours(0, 0, 0, 0);
  
  if (workoutDate > today) {
    return WorkoutStatus.Future;
  } else if (isCompleted) {
    return WorkoutStatus.Completed;
  } else {
    // For past dates that aren't completed, randomly assign Missed or Canceled for variety
    // In a real app, this would be based on user input
    return Math.random() > 0.7 ? WorkoutStatus.Canceled : WorkoutStatus.Missed;
  }
};

// Helper function to create workout from user data
const createWorkoutFromUserData = (date: Date, userData: any): WeeklyWorkout => {
  const workoutTypeMap: { [key: string]: 'strength' | 'cardio' | 'recovery' | 'rest' } = {
    'strength': 'strength',
    'cardio': 'cardio',
    'recovery': 'recovery',
    'rest': 'rest'
  };

  const getWorkoutStatus = (status: string): WorkoutStatus => {
    switch (status) {
      case 'Completed': return WorkoutStatus.Completed;
      case 'Missed': return WorkoutStatus.Missed;
      case 'Canceled': return WorkoutStatus.Canceled;
      default: return WorkoutStatus.Future;
    }
  };

  return {
    day: getDayAbbr(date),
    date: date.getDate(),
    month: getMonthName(date),
    year: date.getFullYear(),
    templateId: null,
    type: userData.workoutType || 'Unknown',
    name: userData.name || userData.workoutType || 'Workout',
    duration: userData.duration ? `${userData.duration}m` : '0m',
    exercises: userData.exercises ? userData.exercises.length : 0,
    intensity: userData.workoutType === 'rest' ? 'rest' as const : 'medium' as const,
    workoutLabel: userData.name || userData.workoutType || 'Workout',
    summaryLine: userData.notes || `${userData.duration || 0} min • ${userData.calories || 0} cal`,
    mainMetric: userData.calories ? userData.calories.toString() : '0',
    metricUnit: 'cal',
    workoutType: workoutTypeMap[userData.workoutType] || 'rest',
    status: getWorkoutStatus(userData.status),
    isCompleted: userData.status === 'Completed',
    completedStats: userData.status === 'Completed' ? {
      actualDuration: `${userData.duration}m`,
      caloriesBurned: userData.calories,
      personalRecords: 0,
      averageWeight: '185lbs',
      totalSets: userData.exercises ? userData.exercises.reduce((total: number, ex: any) => total + (ex.sets || 0), 0) : 0
    } : undefined
  };
};

// Helper function to create empty workout entry for dates outside planning range
const createEmptyWorkoutEntry = (date: Date): WeeklyWorkout => {
  return {
    day: getDayAbbr(date),
    date: date.getDate(),
    month: getMonthName(date),
    year: date.getFullYear(),
    templateId: null,
    type: 'No workout planned',
    name: 'No workout planned',
    duration: '0m',
    exercises: 0,
    intensity: 'rest' as const,
    workoutLabel: 'Not Scheduled',
    summaryLine: 'No workout scheduled for this date',
    mainMetric: '—',
    metricUnit: '',
    workoutType: 'rest' as const,
    status: WorkoutStatus.Future,
    isCompleted: false
  };
};

// Helper function to create workout from template
const createWorkoutFromTemplate = (
  date: Date, 
  templateId: string | null, 
  isCompleted: boolean = false
): WeeklyWorkout => {
  const day = getDayAbbr(date);
  const dateNum = date.getDate();
  const month = getMonthName(date);
  const year = date.getFullYear();

  if (!templateId) {
    return {
      day,
      date: dateNum,
      month,
      year,
      templateId: null,
      type: 'Rest',
      name: 'Rest Day',
      duration: '-',
      exercises: '-',
      intensity: 'rest',
      workoutLabel: 'Rest Day',
      summaryLine: 'Recovery time • Take it easy',
      mainMetric: '',
      metricUnit: '',
      workoutType: 'rest',
      status: getWorkoutStatus(date, isCompleted),
      isCompleted
    };
  }

  const template = workoutTemplates.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Workout template not found: ${templateId}`);
  }

  const workout: WeeklyWorkout = {
    day,
    date: dateNum,
    month,
    year,
    templateId,
    type: template.type,
    name: template.name,
    duration: template.duration,
    exercises: template.totalExercises,
    intensity: template.intensity,
    workoutLabel: template.type === 'Strength Training' ? 'Strength' : 
                 template.type === 'Circuit Training' ? 'Circuit' : 
                 template.type === 'Recovery' ? 'Recovery' :
                 template.type,
    summaryLine: `${template.targetMuscles} • ${template.totalExercises} exercises`,
    mainMetric: template.type === 'Cardio' && template.name === 'Endurance Run' ? '5.2' : 
                template.duration.replace(' min', ''),
    metricUnit: template.type === 'Cardio' && template.name === 'Endurance Run' ? 'KM' : 'MIN',
    workoutType: template.type === 'Cardio' ? 'cardio' : 
                 template.type === 'Recovery' ? 'recovery' : 
                 'strength',
    status: getWorkoutStatus(date, isCompleted),
    isCompleted
  };

  // Add completed stats for past workouts
  if (isCompleted) {
    workout.completedStats = {
      actualDuration: template.duration,
      caloriesBurned: template.estimatedCalories + Math.floor(Math.random() * 50 - 25), // ±25 calories variation
      personalRecords: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0, // 30% chance of 1-3 PRs
      averageWeight: template.type === 'Strength Training' ? `${65 + Math.floor(Math.random() * 20)}kg` : '0kg',
      totalSets: template.sections
        .filter(s => s.type === 'main' || s.type === 'superset' || s.type === 'circuit')
        .reduce((total, section) => {
          return total + section.exercises.reduce((sectionTotal, ex) => sectionTotal + ex.sets, 0);
        }, 0)
    };
  }

  return workout;
};

// Weekly workout pattern - this creates a realistic fitness schedule
const weeklyPattern = [
  'upper-body-power',     // Monday
  'hiit-cardio-blast',    // Tuesday  
  'active-recovery-flow', // Wednesday
  'leg-day-destroyer',    // Thursday
  'full-body-circuit',    // Friday
  'endurance-run',        // Saturday
  null                    // Sunday - Rest
];

// Generate a week of workouts
const generateWeek = (startDate: Date, weekOffset: number = 0): WeekData => {
  const workouts: WeeklyWorkout[] = [];
  const currentDate = new Date(startDate);
  
  // Define realistic planning boundaries
  const today = new Date(2025, 6, 31); // July 31st, 2025 (current day)
  const planningStartDate = new Date(2025, 6, 1); // July 1st, 2025 (start of planned workouts)
  const planningEndDate = new Date(2025, 7, 31); // August 31st, 2025 (end of planning horizon)
  
  // Determine if workouts should be marked as completed (past weeks)
  const isCompletedWeek = currentDate < today;
  
  for (let i = 0; i < 7; i++) {
    const workoutDate = new Date(currentDate);
    workoutDate.setDate(currentDate.getDate() + i);
    
    // Only generate workouts within our planning boundaries
    if (workoutDate >= planningStartDate && workoutDate <= planningEndDate) {
      // For variety, occasionally swap workouts or add rest days
      let templateId = weeklyPattern[i];
      
      // Add some variety every few weeks
      if (weekOffset % 3 === 1 && i === 2) { // Every 3rd week, make Wednesday a strength day instead of recovery
        templateId = 'upper-body-power';
      }
      if (weekOffset % 4 === 2 && i === 1) { // Every 4th week, make Tuesday a rest day
        templateId = null;
      }
      
      const isWorkoutCompleted = isCompletedWeek || workoutDate < today;
      const workout = createWorkoutFromTemplate(workoutDate, templateId, isWorkoutCompleted);
      workouts.push(workout);
    } else {
      // For dates outside planning range, create empty/no-workout entries
      const workout = createEmptyWorkoutEntry(workoutDate);
      workouts.push(workout);
    }
  }

  return {
    weekOf: formatWeekRange(currentDate),
    startDate: new Date(currentDate),
    workouts
  };
};

// Create workout data lookup from fake user data
const createUserDataLookup = (userWorkoutHistory: any[]): Map<string, any> => {
  const userDataLookup = new Map<string, any>();
  
  userWorkoutHistory.forEach(workout => {
    const date = new Date(workout.date);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    userDataLookup.set(dateKey, workout);
  });
  
  return userDataLookup;
};

// Generate a single week of workouts for any given start date
export const generateWeekForDate = (weekStartDate: Date, userDataLookup: Map<string, any>): WeekData => {
  const workouts: WeeklyWorkout[] = [];
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(weekStartDate.getDate() + dayOffset);
    
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const userData = userDataLookup.get(dateKey);
    
    if (userData) {
      // Convert user data to WeeklyWorkout format
      const workout = createWorkoutFromUserData(currentDate, userData);
      workouts.push(workout);
    } else {
      // Create empty workout entry for dates without data
      const workout = createEmptyWorkoutEntry(currentDate);
      workouts.push(workout);
    }
  }
  
  return {
    weekOf: formatWeekRange(weekStartDate),
    startDate: new Date(weekStartDate),
    workouts
  };
};

// Create initial weeks covering June 8 - August 19, 2025
export const createInitialWorkoutSchedule = (userWorkoutHistory: any[]): WeekData[] => {
  const userDataLookup = createUserDataLookup(userWorkoutHistory);
  const weeks: WeekData[] = [];
  
  // Data range: June 1 - August 31, 2025 
  // Start from Sunday June 1, 2025 and create weeks until we cover August 31
  const startDate = new Date(2025, 5, 1); // June 1, 2025 (Sunday)
  const endDate = new Date(2025, 7, 31);  // August 31, 2025
  
  let currentWeekStart = new Date(startDate);
  
  while (currentWeekStart <= endDate) {
    weeks.push(generateWeekForDate(currentWeekStart, userDataLookup));
    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return weeks;
};

// Dynamic week generation for unlimited navigation
export const generateAdditionalWeeks = (
  baseWeekStart: Date, 
  direction: 'past' | 'future', 
  weekCount: number,
  userDataLookup: Map<string, any>
): WeekData[] => {
  const weeks: WeekData[] = [];
  
  for (let i = 1; i <= weekCount; i++) {
    const weekStart = new Date(baseWeekStart);
    
    if (direction === 'past') {
      weekStart.setDate(baseWeekStart.getDate() - (i * 7));
    } else {
      weekStart.setDate(baseWeekStart.getDate() + (i * 7));
    }
    
    const week = generateWeekForDate(weekStart, userDataLookup);
    
    if (direction === 'past') {
      weeks.unshift(week);
    } else {
      weeks.push(week);
    }
  }
  
  return weeks;
};

// Get current week index (for navigation) 
export const getCurrentWeekIndex = (allWeeksData: WeekData[]): number => {
  // July 31st, 2025 - find which week contains this date
  const today = new Date(2025, 6, 31); // July 31, 2025
  
  for (let i = 0; i < allWeeksData.length; i++) {
    const week = allWeeksData[i];
    const weekStart = week.startDate;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    if (today >= weekStart && today <= weekEnd) {
      return i;
    }
  }
  
  // Fallback - should not happen with proper data
  return Math.floor(allWeeksData.length / 2);
};

// Import fake user data and create initial workout schedule
import { fakeUserProfile } from './fakeUserData';
export const workoutScheduleData = createInitialWorkoutSchedule(fakeUserProfile.workoutHistory);
export const userDataLookup = createUserDataLookup(fakeUserProfile.workoutHistory);

// Helper to get workout by week and day
export const getWorkoutByWeekAndDay = (weekIndex: number, dayIndex: number): WeeklyWorkout | null => {
  if (weekIndex < 0 || weekIndex >= workoutScheduleData.length) return null;
  if (dayIndex < 0 || dayIndex >= 7) return null;
  return workoutScheduleData[weekIndex].workouts[dayIndex];
};

// Helper to get today's workout (July 31st, 2025 = Thursday)
export const getTodaysWorkout = (): WeeklyWorkout | null => {
  const currentWeekIndex = getCurrentWeekIndex(workoutScheduleData);
  const todayIndex = 4; // Thursday = index 4 (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
  return getWorkoutByWeekAndDay(currentWeekIndex, todayIndex);
};

// Helper to get workout template by ID
export const getWorkoutTemplateById = (templateId: string): WorkoutTemplate | undefined => {
  return workoutTemplates.find(template => template.id === templateId);
};

// No longer needed - workout schedule data already contains fake user data