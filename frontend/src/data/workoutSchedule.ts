import { workoutTemplates, WorkoutTemplate } from './workoutTemplates';

export type WorkoutStatus = 'Completed' | 'Missed' | 'Canceled' | 'Future';

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
    return 'Future';
  } else if (isCompleted) {
    return 'Completed';
  } else {
    // For past dates that aren't completed, randomly assign Missed or Canceled for variety
    // In a real app, this would be based on user input
    return Math.random() > 0.7 ? 'Canceled' : 'Missed';
  }
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
  
  // Determine if workouts should be marked as completed (past weeks)
  const today = new Date(2025, 6, 31); // July 31st, 2025
  const isCompletedWeek = currentDate < today;
  
  for (let i = 0; i < 7; i++) {
    const workoutDate = new Date(currentDate);
    workoutDate.setDate(currentDate.getDate() + i);
    
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
  }

  return {
    weekOf: formatWeekRange(currentDate),
    startDate: new Date(currentDate),
    workouts
  };
};

// Generate multiple weeks of workout data
export const generateWorkoutSchedule = (weeksCount: number = 3): WeekData[] => {
  const weeks: WeekData[] = [];
  
  // July 31st, 2025 is a Thursday
  // We want the current week to be July 28 - Aug 3 (Monday to Sunday)
  // So we need to start from Sunday July 27th to make Monday July 28th index 1
  const currentWeekStart = new Date(2025, 6, 27); // July 27th, 2025 (Sunday)
  
  // Generate weeks: past 2 weeks + current week
  const startDate = new Date(currentWeekStart);
  startDate.setDate(currentWeekStart.getDate() - (14)); // Go back 2 weeks (14 days)
  
  for (let i = 0; i < weeksCount; i++) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (i * 7));
    weeks.push(generateWeek(weekStartDate, i));
  }
  
  return weeks;
};

// Generate additional weeks dynamically for unlimited scrolling
export const generateAdditionalWeeks = (currentWeeksCount: number, direction: 'past' | 'future', additionalWeeks: number = 4): WeekData[] => {
  const weeks: WeekData[] = [];
  const currentWeekStart = new Date(2025, 6, 27); // July 27th, 2025 (Sunday)
  
  if (direction === 'past') {
    // Generate past weeks
    for (let i = 1; i <= additionalWeeks; i++) {
      const weekStartDate = new Date(currentWeekStart);
      weekStartDate.setDate(currentWeekStart.getDate() - (14 + (currentWeeksCount - 3) * 7) - (i * 7));
      weeks.unshift(generateWeek(weekStartDate, -(currentWeeksCount + i - 3)));
    }
  } else {
    // Generate future weeks
    for (let i = 1; i <= additionalWeeks; i++) {
      const weekStartDate = new Date(currentWeekStart);
      weekStartDate.setDate(currentWeekStart.getDate() + (currentWeeksCount - 2) * 7 + (i * 7));
      weeks.push(generateWeek(weekStartDate, currentWeeksCount - 3 + i));
    }
  }
  
  return weeks;
};

// Get current week index (for navigation)
export const getCurrentWeekIndex = (): number => {
  // July 31st, 2025 falls in the week of July 28 - Aug 3, which should be index 2 (3rd week)
  return 2;
};

// Generate the default 3 weeks of data
export const workoutScheduleData = generateWorkoutSchedule(3);

// Helper to get workout by week and day
export const getWorkoutByWeekAndDay = (weekIndex: number, dayIndex: number): WeeklyWorkout | null => {
  if (weekIndex < 0 || weekIndex >= workoutScheduleData.length) return null;
  if (dayIndex < 0 || dayIndex >= 7) return null;
  return workoutScheduleData[weekIndex].workouts[dayIndex];
};

// Helper to get today's workout (July 31st, 2025 = Thursday)
export const getTodaysWorkout = (): WeeklyWorkout | null => {
  const currentWeekIndex = getCurrentWeekIndex();
  const todayIndex = 4; // Thursday = index 4 (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
  return getWorkoutByWeekAndDay(currentWeekIndex, todayIndex);
};

// Helper to get workout template by ID
export const getWorkoutTemplateById = (templateId: string): WorkoutTemplate | undefined => {
  return workoutTemplates.find(template => template.id === templateId);
};