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
        overflow: 'auto', 
        border: '2px dashed #ccc', 
        padding: '16px',
        minWidth: '280px',
        minHeight: '300px',
        width: '400px',
        height: '500px',
        maxWidth: '800px',
        maxHeight: '800px'
      }
    }, React.createElement(Story)),
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

// Upcoming Workout Stories
export const UpcomingStrengthWorkout: Story = {
  args: {
    isWorkoutCompleted: false,
    upcomingWorkout: {
      name: 'Push Day',
      type: 'Strength Training',
      duration: '60',
      exercises: 6,
      targetMuscles: 'Chest, Shoulders, Triceps',
      intensity: 'high',
      warmupTime: '10 min',
      restTime: '2-3 min',
      liftDetails: [
        {
          name: 'Bench Press',
          sets: 4,
          reps: '6-8',
          weight: '185 lbs',
          type: 'compound',
        },
        {
          name: 'Overhead Press',
          sets: 4,
          reps: '8-10',
          weight: '135 lbs',
          type: 'compound',
        },
        {
          name: 'Dumbbell Flyes',
          sets: 3,
          reps: '12-15',
          weight: '30 lbs',
          type: 'isolation',
        },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: '10-12',
          type: 'accessory',
        },
        {
          name: 'Lateral Raises',
          sets: 3,
          reps: '15-20',
          weight: '15 lbs',
          type: 'isolation',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming strength training workout with detailed lift information.',
      },
    },
  },
};

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
      name: 'Long Run',
      type: 'Running',
      duration: '60',
      exercises: 3,
      targetMuscles: 'Legs, Cardio',
      intensity: 'moderate',
      warmupTime: '10 min',
      exerciseList: [
        'Dynamic Warm-up',
        '5K Steady Pace',
        'Cool Down Walk',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming running workout with distance focus.',
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
      name: 'Pool Session',
      type: 'Swimming',
      duration: '45',
      exercises: 4,
      targetMuscles: 'Full Body',
      intensity: 'moderate',
      warmupTime: '10 min',
      restTime: '30 sec',
      exerciseList: [
        'Freestyle 400m',
        'Backstroke 200m',
        'Breaststroke 200m',
        'Cool Down Easy Swim',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming swimming workout with stroke variations.',
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