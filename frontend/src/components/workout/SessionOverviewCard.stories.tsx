import type { Meta, StoryObj } from '@storybook/react';
import { SessionOverviewCard } from './SessionOverviewCard';
import { 
  TrainingSession, 
  TrainingSessionStatus,
  ActivityBlockType,
  CardioType,
  RepetitionType 
} from '@/types/workouts/workout-types';

// Session examples for different states and types
const upcomingRunSession: TrainingSession = {
  id: 'upcoming-run',
  name: 'Morning 5K Run',
  dateTime: new Date('2025-01-15T07:00:00'),
  status: TrainingSessionStatus.Upcoming,
  estimatedDuration: 25,
  blocks: [
    {
      id: 'main-run-block',
      name: '5K Run',
      type: ActivityBlockType.Cardio,
      cardioActivity: {
        id: 'main-run',
        type: CardioType.Run,
        name: '5K Distance Run',
        plannedDistance: 5000,
        plannedTime: 1500,
        notes: 'Steady aerobic pace, aim for negative split'
      }
    }
  ],
  notes: 'Beautiful morning for a run! Focus on form and breathing.',
  tags: ['cardio', 'running', 'morning', '5k']
};

const upcomingLiftSession: TrainingSession = {
  id: 'upcoming-lift',
  name: 'Upper Body Strength',
  dateTime: new Date('2025-01-15T18:00:00'),
  status: TrainingSessionStatus.Upcoming,
  estimatedDuration: 60,
  blocks: [
    {
      id: 'strength-block',
      name: 'Bench Press & Rows',
      type: ActivityBlockType.Structured,
      structuredTraining: {
        id: 'upper-body-block',
        name: 'Upper Body Exercises',
        type: 'exercise',
        exercises: [
          {
            id: 'bench-press',
            exerciseDefinitionId: 'bench-press',
            variationId: 'barbell-bench',
            repetitionType: "Reps" as RepetitionType.Reps,
            sets: [
              {
                id: 'bench-set-1',
                setNumber: 1,
                plannedReps: 8,
                plannedWeight: { type: 'absolute', weight: { weight: 155, unit: 'lbs' } },
                restAfter: 120
              },
              {
                id: 'bench-set-2',
                setNumber: 2,
                plannedReps: 6,
                plannedWeight: { type: 'absolute', weight: { weight: 175, unit: 'lbs' } },
                restAfter: 120
              },
              {
                id: 'bench-set-3',
                setNumber: 3,
                plannedReps: 4,
                plannedWeight: { type: 'absolute', weight: { weight: 185, unit: 'lbs' } },
                restAfter: 180
              }
            ]
          }
        ]
      }
    }
  ],
  notes: 'Focus on controlled movement and full range of motion',
  tags: ['strength', 'upper-body', 'evening']
};

const inProgressRunSession: TrainingSession = {
  ...upcomingRunSession,
  id: 'inprogress-run',
  status: TrainingSessionStatus.InProgress,
  startedAt: new Date('2025-01-15T07:05:00'),
  pausedDuration: 0,
  currentBlockIndex: 0,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  blocks: [
    {
      ...upcomingRunSession.blocks[0],
      cardioActivity: {
        ...upcomingRunSession.blocks[0].cardioActivity!,
        actualTime: 720, // 12 minutes into the run
        actualDistance: 2400, // 2.4K completed so far
        notes: 'Running steady, feeling good halfway through'
      }
    }
  ]
};

const inProgressLiftSession: TrainingSession = {
  ...upcomingLiftSession,
  id: 'inprogress-lift',
  status: TrainingSessionStatus.InProgress,
  startedAt: new Date('2025-01-15T18:00:00'),
  pausedDuration: 180,
  currentBlockIndex: 0,
  currentExerciseIndex: 0,
  currentSetIndex: 1, // On second set
  blocks: [
    {
      ...upcomingLiftSession.blocks[0],
      structuredTraining: {
        ...upcomingLiftSession.blocks[0].structuredTraining!,
        exercises: [
          {
            ...upcomingLiftSession.blocks[0].structuredTraining!.exercises![0],
            sets: [
              {
                ...upcomingLiftSession.blocks[0].structuredTraining!.exercises![0].sets[0],
                actualReps: 8,
                actualWeight: { weight: 155, unit: 'lbs' },
                completed: true,
                notes: 'Good form, felt strong'
              },
              upcomingLiftSession.blocks[0].structuredTraining!.exercises![0].sets[1], // Currently on this set
              upcomingLiftSession.blocks[0].structuredTraining!.exercises![0].sets[2]
            ]
          }
        ]
      }
    }
  ]
};

const completedRunSession: TrainingSession = {
  ...inProgressRunSession,
  id: 'completed-run',
  status: TrainingSessionStatus.Completed,
  completedAt: new Date('2025-01-15T07:28:00'),
  actualDuration: 24,
  intensityRating: 8,
  enjoymentRating: 9,
  blocks: [
    {
      ...inProgressRunSession.blocks[0],
      cardioActivity: {
        ...inProgressRunSession.blocks[0].cardioActivity!,
        actualTime: 1440, // 24 minutes total
        actualDistance: 5000, // Full 5K completed
        actualPace: 4.8,
        heartRate: {
          average: 165,
          max: 178
        },
        calories: 320,
        notes: 'Felt strong throughout, negative split achieved!'
      }
    }
  ],
  notes: 'Excellent run! Beat my planned time and felt energized all day.'
};

const completedLiftSession: TrainingSession = {
  ...inProgressLiftSession,
  id: 'completed-lift',
  status: TrainingSessionStatus.Completed,
  completedAt: new Date('2025-01-15T19:02:00'),
  actualDuration: 52,
  intensityRating: 9,
  enjoymentRating: 8,
  blocks: [
    {
      ...inProgressLiftSession.blocks[0],
      structuredTraining: {
        ...inProgressLiftSession.blocks[0].structuredTraining!,
        exercises: [
          {
            ...inProgressLiftSession.blocks[0].structuredTraining!.exercises![0],
            sets: [
              {
                ...inProgressLiftSession.blocks[0].structuredTraining!.exercises![0].sets[0],
                actualReps: 8,
                actualWeight: { weight: 165, unit: 'lbs' }, // Increased from planned 155
                completed: true,
                notes: 'Felt strong, bumped up weight'
              },
              {
                ...inProgressLiftSession.blocks[0].structuredTraining!.exercises![0].sets[1],
                actualReps: 6,
                actualWeight: { weight: 185, unit: 'lbs' }, // Increased from planned 175
                completed: true,
                notes: 'Still felt good, increased again'
              },
              {
                ...inProgressLiftSession.blocks[0].structuredTraining!.exercises![0].sets[2],
                actualReps: 5, // Got extra rep!
                actualWeight: { weight: 195, unit: 'lbs' }, // Increased from planned 185
                completed: true,
                notes: 'PR! Got 5 reps instead of planned 4!'
              }
            ],
            notes: 'Amazing session - hit PRs on all sets!'
          }
        ]
      }
    }
  ],
  notes: 'Incredible session! Hit new PRs on bench press. Form felt solid throughout.'
};

const meta: Meta<typeof SessionOverviewCard> = {
  title: 'Workout/SessionOverviewCard',
  component: SessionOverviewCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component displaying training session overview with details about blocks, exercises, and performance data. Shows different states (upcoming, in-progress, completed) and types (cardio, strength).',
      },
    },
  },
  argTypes: {
    session: {
      control: 'select',
      options: [
        'Upcoming Run',
        'Upcoming Lift',
        'In Progress Run',
        'In Progress Lift', 
        'Completed Run',
        'Completed Lift'
      ],
      mapping: {
        'Upcoming Run': upcomingRunSession,
        'Upcoming Lift': upcomingLiftSession,
        'In Progress Run': inProgressRunSession,
        'In Progress Lift': inProgressLiftSession,
        'Completed Run': completedRunSession,
        'Completed Lift': completedLiftSession
      },
      description: 'Select different session states and types to see how the card adapts'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with controls
export const Interactive: Story = {
  name: 'Interactive (Use Controls)',
  args: {
    session: upcomingRunSession
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to switch between different session states and types. This demonstrates how the SessionOverviewCard adapts to show relevant information for upcoming, in-progress, and completed sessions of both cardio and strength training types.',
      },
    },
  },
};

// Individual stories for each state/type combination
export const UpcomingRun: Story = {
  name: 'Upcoming Run Session',
  args: {
    session: upcomingRunSession
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming cardio session showing planned distance, time, and workout notes.',
      },
    },
  },
};

export const UpcomingLift: Story = {
  name: 'Upcoming Lift Session', 
  args: {
    session: upcomingLiftSession
  },
  parameters: {
    docs: {
      description: {
        story: 'An upcoming strength session displaying planned sets, reps, and weights.',
      },
    },
  },
};

export const InProgressRun: Story = {
  name: 'In Progress Run Session',
  args: {
    session: inProgressRunSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A cardio session currently in progress, showing completed warmup with actual performance data.',
      },
    },
  },
};

export const InProgressLift: Story = {
  name: 'In Progress Lift Session',
  args: {
    session: inProgressLiftSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A strength session in progress, showing completed sets with actual weights and reps performed.',
      },
    },
  },
};

export const CompletedRun: Story = {
  name: 'Completed Run Session',
  args: {
    session: completedRunSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed cardio session with full performance metrics including heart rate, pace, and calories burned.',
      },
    },
  },
};

export const CompletedLift: Story = {
  name: 'Completed Lift Session',
  args: {
    session: completedLiftSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed strength session showing actual vs planned performance, including weight increases and extra reps achieved.',
      },
    },
  },
};