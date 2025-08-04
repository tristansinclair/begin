import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import DailySummary from './DailySummary';

const meta: Meta<typeof DailySummary> = {
  title: 'Dashboard/DailySummary',
  component: DailySummary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Daily Summary component that shows either completed workout stats or upcoming workout details based on different exercise types.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => React.createElement('div', {
      style: { 
        resize: 'both', 
        overflow: 'hidden', 
        border: '2px dashed #ccc', 
        padding: '16px',
        minWidth: '280px',
        minHeight: '300px',
        width: '400px',
        height: '500px',
        maxWidth: '800px',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement('div', {
      style: {
        flex: 1,
        minHeight: 0,
        display: 'flex'
      }
    }, React.createElement(Story))),
  ],
  argTypes: {
    isWorkoutCompleted: {
      control: 'boolean',
      description: 'Whether the workout has been completed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mobile preview decorator
const MobileDecorator = (Story: any) => React.createElement('div', {
  style: { 
    width: '300px',
    height: '400px',
    border: '2px dashed #f39c12',
    padding: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
}, React.createElement('div', {
  style: {
    flex: 1,
    minHeight: 0,
    display: 'flex'
  }
}, React.createElement(Story)));

// Desktop preview decorator  
const DesktopDecorator = (Story: any) => React.createElement('div', {
  style: { 
    width: '500px',
    height: '500px',
    border: '2px dashed #3498db',
    padding: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
}, React.createElement('div', {
  style: {
    flex: 1,
    minHeight: 0,
    display: 'flex'
  }
}, React.createElement(Story)));

// Completed Workout Stories
export const CompletedStrengthWorkout: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '75 min',
      exercisesCompleted: 6,
      totalSets: 18,
      averageWeight: '185 lbs',
      caloriesBurned: 420,
      personalRecords: 2,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed strength training workout with personal records achieved.',
      },
    },
  },
};

export const CompletedCardioWorkout: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '45 min',
      exercisesCompleted: 4,
      totalSets: 12,
      averageWeight: '0 lbs',
      caloriesBurned: 680,
      personalRecords: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed cardio workout focused on calorie burn.',
      },
    },
  },
};

export const CompletedHIITWorkout: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '30 min',
      exercisesCompleted: 8,
      totalSets: 24,
      averageWeight: '25 lbs',
      caloriesBurned: 540,
      personalRecords: 1,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed high-intensity interval training workout.',
      },
    },
  },
};

// Upcoming Workout Stories - 5 Main Types
export const UpcomingWeightliftingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Push Day - Heavy',
      type: 'Weightlifting',
      duration: '75',
      exercises: 6,
      targetMuscles: 'Chest, Shoulders, Triceps',
      intensity: 'high',
      warmupTime: '10 min',
      restTime: '3-4 min',
      liftDetails: [
        {
          name: 'Barbell Bench Press',
          sets: 5,
          reps: '3-5',
          weight: '225 lbs',
          type: 'compound',
        },
        {
          name: 'Military Press',
          sets: 4,
          reps: '5-6',
          weight: '155 lbs',
          type: 'compound',
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 4,
          reps: '8-10',
          weight: '80 lbs',
          type: 'compound',
        },
        {
          name: 'Cable Flyes',
          sets: 3,
          reps: '12-15',
          weight: '40 lbs',
          type: 'isolation',
        },
        {
          name: 'Tricep Rope Pushdowns',
          sets: 4,
          reps: '15-20',
          weight: '60 lbs',
          type: 'isolation',
        },
        {
          name: 'Face Pulls',
          sets: 3,
          reps: '20-25',
          weight: '30 lbs',
          type: 'accessory',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A heavy weightlifting session focused on pushing movements with compound lifts.',
      },
    },
  },
};

export const UpcomingCrossTrainingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'MetCon Monday',
      type: 'Cross Training',
      duration: '45',
      exercises: 8,
      targetMuscles: 'Full Body',
      intensity: 'high',
      intervals: [
        { type: 'Box Jumps', duration: '1 min', intensity: 'high' },
        { type: 'Kettlebell Swings', duration: '45 sec', intensity: 'high' },
        { type: 'Battle Ropes', duration: '30 sec', intensity: 'max' },
        { type: 'Wall Balls', duration: '1 min', intensity: 'moderate' },
        { type: 'Burpees', duration: '45 sec', intensity: 'high' },
        { type: 'Assault Bike', duration: '1 min', intensity: 'max' },
        { type: 'Rest', duration: '30 sec', intensity: 'easy' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A high-intensity cross training workout with varied functional movements.',
      },
    },
  },
};

// Additional workout type examples
export const UpcomingCardioWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Cardio Blast',
      type: 'Cardio',
      duration: '45',
      exercises: 5,
      targetMuscles: 'Full Body',
      intensity: 'moderate',
      warmupTime: '5 min',
      restTime: '30 sec',
      exerciseList: [
        'Treadmill Running',
        'Rowing Machine',
        'Stationary Bike',
        'Elliptical',
        'Cool Down Walk',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming cardio workout with exercise list.',
      },
    },
  },
};

export const UpcomingYogaWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Morning Flow',
      type: 'Yoga',
      duration: '30',
      exercises: 8,
      targetMuscles: 'Flexibility',
      intensity: 'low',
      warmupTime: '5 min',
      exerciseList: [
        'Sun Salutation A',
        'Warrior I & II',
        'Downward Dog',
        'Child\'s Pose',
        'Pigeon Pose',
        'Seated Forward Fold',
        'Corpse Pose',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming yoga workout with pose sequences.',
      },
    },
  },
};

export const UpcomingHIITWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'HIIT Circuit',
      type: 'HIIT',
      duration: '25',
      exercises: 6,
      targetMuscles: 'Full Body',
      intensity: 'high',
      warmupTime: '5 min',
      restTime: '10 sec',
      exerciseList: [
        'Burpees',
        'Mountain Climbers',
        'Jump Squats',
        'Push-ups',
        'High Knees',
        'Plank Jacks',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming high-intensity interval training workout.',
      },
    },
  },
};

export const UpcomingRunningWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Tempo Run',
      type: 'Running',
      duration: '45',
      exercises: 5,
      targetMuscles: 'Cardiovascular Endurance',
      intensity: 'moderate',
      distance: '6 mi',
      pace: '7:30',
      intervals: [
        { type: 'Easy Warmup', duration: '10 min', intensity: 'easy' },
        { type: 'Tempo Pace', duration: '20 min', intensity: 'moderate' },
        { type: 'Recovery', duration: '5 min', intensity: 'easy' },
        { type: 'Tempo Pace', duration: '15 min', intensity: 'moderate' },
        { type: 'Cool Down', duration: '5 min', intensity: 'easy' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A tempo running workout designed to improve lactate threshold.',
      },
    },
  },
};

export const UpcomingBodyweightWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Bodyweight Strength',
      type: 'Bodyweight',
      duration: '40',
      exercises: 7,
      targetMuscles: 'Full Body',
      intensity: 'moderate',
      warmupTime: '5 min',
      restTime: '45 sec',
      liftDetails: [
        {
          name: 'Push-ups',
          sets: 3,
          reps: '12-15',
          type: 'compound',
        },
        {
          name: 'Pull-ups',
          sets: 3,
          reps: '6-10',
          type: 'compound',
        },
        {
          name: 'Squats',
          sets: 3,
          reps: '20-25',
          type: 'compound',
        },
        {
          name: 'Lunges',
          sets: 3,
          reps: '12 each leg',
          type: 'compound',
        },
        {
          name: 'Plank',
          sets: 3,
          reps: '45-60 sec',
          type: 'isolation',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming bodyweight workout with detailed exercise information.',
      },
    },
  },
};

export const UpcomingSwimmingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Endurance Swim',
      type: 'Swimming',
      duration: '60',
      exercises: 8,
      targetMuscles: 'Full Body Endurance',
      intensity: 'moderate',
      distance: '2000m',
      strokes: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'],
      intervals: [
        { type: 'Warm-up Mixed Strokes', duration: '10 min', intensity: 'easy' },
        { type: '4x100m Freestyle', duration: '8 min', intensity: 'moderate' },
        { type: '4x50m Backstroke', duration: '6 min', intensity: 'moderate' },
        { type: '4x50m Breaststroke', duration: '8 min', intensity: 'moderate' },
        { type: '8x25m Butterfly', duration: '8 min', intensity: 'high' },
        { type: 'Cool Down', duration: '5 min', intensity: 'easy' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An endurance-focused swimming workout incorporating all four strokes.',
      },
    },
  },
};

export const UpcomingBikingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Hill Climb Challenge',
      type: 'Biking',
      duration: '90',
      exercises: 6,
      targetMuscles: 'Legs, Glutes',
      intensity: 'high',
      distance: '25 mi',
      elevation: '1,200 ft',
      pace: '16 mph',
      intervals: [
        { type: 'Flat Warmup', duration: '15 min', intensity: 'easy' },
        { type: 'Rolling Hills', duration: '20 min', intensity: 'moderate' },
        { type: 'Main Climb', duration: '25 min', intensity: 'high' },
        { type: 'Descent Recovery', duration: '10 min', intensity: 'easy' },
        { type: 'Sprint Intervals', duration: '15 min', intensity: 'max' },
        { type: 'Cool Down', duration: '5 min', intensity: 'easy' },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A challenging bike workout featuring hill climbs and sprint intervals.',
      },
    },
  },
};

export const UpcomingPilatesWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Core Focus',
      type: 'Pilates',
      duration: '35',
      exercises: 9,
      targetMuscles: 'Core, Stability',
      intensity: 'low',
      warmupTime: '5 min',
      exerciseList: [
        'The Hundred',
        'Roll Up',
        'Single Leg Circles',
        'Teaser',
        'Plank Series',
        'Side Plank',
        'Swan Dive',
        'Leg Pull Front',
        'Relaxation',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming Pilates workout focused on core strength.',
      },
    },
  },
};

// Edge Cases
export const OffDay: Story = {
  args: {
    isWorkoutCompleted: false,
    isOffDay: true,
    hasPlan: true,
    tomorrowWorkout: {
      name: 'Push Day',
      type: 'Strength',
      targetMuscles: 'Chest, Shoulders, Triceps',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Rest day state encouraging recovery with tomorrow\'s workout preview.',
      },
    },
  },
};

export const OffDayNoTomorrow: Story = {
  args: {
    isWorkoutCompleted: false,
    isOffDay: true,
    hasPlan: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Rest day state without tomorrow\'s workout information.',
      },
    },
  },
};

export const NoPlan: Story = {
  args: {
    isWorkoutCompleted: false,
    hasPlan: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'State when user has no workout plan, directing them to create one.',
      },
    },
  },
};

export const MobileNoPlan: Story = {
  args: {
    isWorkoutCompleted: false,
    hasPlan: false,
  },
  decorators: [MobileDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view when user has no workout plan.',
      },
    },
  },
};

export const NoWorkoutData: Story = {
  args: {
    isWorkoutCompleted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component when no workout data is available (returns null).',
      },
    },
  },
};

export const MinimalCompletedWorkout: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '20 min',
      exercisesCompleted: 3,
      totalSets: 6,
      averageWeight: '0 lbs',
      caloriesBurned: 150,
      personalRecords: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal completed workout with basic stats.',
      },
    },
  },
};

// Mobile responsive testing
export const MobileWeightliftingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Push Day - Heavy',
      type: 'Weightlifting',
      duration: '75',
      exercises: 6,
      targetMuscles: 'Chest, Shoulders, Triceps',
      intensity: 'high',
      warmupTime: '10 min',
      restTime: '3-4 min',
      liftDetails: [
        {
          name: 'Barbell Bench Press',
          sets: 5,
          reps: '3-5',
          weight: '225 lbs',
          type: 'compound',
        },
        {
          name: 'Military Press',
          sets: 4,
          reps: '5-6',
          weight: '155 lbs',
          type: 'compound',
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 4,
          reps: '8-10',
          weight: '80 lbs',
          type: 'compound',
        },
      ],
    },
  },
  decorators: [MobileDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view (300x400) of weightlifting workout card.',
      },
    },
  },
};

export const DesktopWeightliftingWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Push Day - Heavy',
      type: 'Weightlifting',
      duration: '75',
      exercises: 6,
      targetMuscles: 'Chest, Shoulders, Triceps',
      intensity: 'high',
      warmupTime: '10 min',
      restTime: '3-4 min',
      liftDetails: [
        {
          name: 'Barbell Bench Press',
          sets: 5,
          reps: '3-5',
          weight: '225 lbs',
          type: 'compound',
        },
        {
          name: 'Military Press',
          sets: 4,
          reps: '5-6',
          weight: '155 lbs',
          type: 'compound',
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 4,
          reps: '8-10',
          weight: '80 lbs',
          type: 'compound',
        },
      ],
    },
  },
  decorators: [DesktopDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Desktop view (500x500) of weightlifting workout card.',
      },
    },
  },
};

export const MobileRunningWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Tempo Run',
      type: 'Running',
      duration: '45',
      exercises: 5,
      targetMuscles: 'Cardiovascular Endurance',
      intensity: 'moderate',
      distance: '6 mi',
      pace: '7:30',
      intervals: [
        { type: 'Easy Warmup', duration: '10 min', intensity: 'easy' },
        { type: 'Tempo Pace', duration: '20 min', intensity: 'moderate' },
        { type: 'Recovery', duration: '5 min', intensity: 'easy' },
      ],
    },
  },
  decorators: [MobileDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of running workout card.',
      },
    },
  },
};

export const IntenseCompletedWorkout: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '90 min',
      exercisesCompleted: 12,
      totalSets: 36,
      averageWeight: '225 lbs',
      caloriesBurned: 750,
      personalRecords: 5,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An intense completed workout with high stats across all metrics.',
      },
    },
  },
};

export const MobileCompleted: Story = {
  args: {
    isWorkoutCompleted: true,
    workoutStats: {
      duration: '75 min',
      exercisesCompleted: 6,
      totalSets: 18,
      averageWeight: '185 lbs',
      caloriesBurned: 420,
      personalRecords: 2,
    },
  },
  decorators: [MobileDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of completed workout card.',
      },
    },
  },
};

export const MobileRestDay: Story = {
  args: {
    isWorkoutCompleted: false,
    isOffDay: true,
    hasPlan: true,
    tomorrowWorkout: {
      name: 'Push Day',
      type: 'Strength',
      targetMuscles: 'Chest, Shoulders, Triceps',
    },
  },
  decorators: [MobileDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of rest day card.',
      },
    },
  },
};