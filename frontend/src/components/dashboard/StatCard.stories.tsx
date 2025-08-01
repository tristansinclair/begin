import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Dashboard/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    titleColor: {
      control: { type: 'select' },
      options: ['foreground', 'muted-foreground'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkoutStreak: Story = {
  args: {
    title: 'Workout Streak',
    value: 15,
    icon: '🔥',
    change: {
      value: '4 days from last week',
      direction: 'up',
    },
    titleColor: 'foreground',
  },
};

export const TotalVolume: Story = {
  args: {
    title: 'Total Volume',
    value: 125500,
    icon: '💪',
    change: {
      value: '12% this week',
      direction: 'up',
    },
    titleColor: 'muted-foreground',
  },
};

export const CaloriesBurned: Story = {
  args: {
    title: 'Calories Burned',
    value: 2450,
    icon: '🔥',
    change: {
      value: '250 cal today',
      direction: 'up',
    },
    titleColor: 'foreground',
  },
};

export const RestDays: Story = {
  args: {
    title: 'Rest Days',
    value: 2,
    icon: '😴',
    change: {
      value: 'Same as last week',
      direction: 'neutral',
    },
    titleColor: 'foreground',
  },
};

export const PersonalRecords: Story = {
  args: {
    title: 'Personal Records',
    value: 3,
    icon: '🏆',
    change: {
      value: '2 new PRs this month',
      direction: 'up',
    },
    titleColor: 'foreground',
  },
};

export const MissedWorkouts: Story = {
  args: {
    title: 'Missed Workouts',
    value: 1,
    icon: '❌',
    change: {
      value: '1 more than last week',
      direction: 'down',
    },
    titleColor: 'muted-foreground',
  },
};

export const ActiveMinutes: Story = {
  args: {
    title: 'Active Minutes',
    value: '45m',
    icon: '⏱️',
    change: {
      value: '5m longer than average',
      direction: 'up',
    },
    titleColor: 'foreground',
  },
};

export const WorkoutFrequency: Story = {
  args: {
    title: 'Weekly Frequency',
    value: '4x',
    icon: '📊',
    change: {
      value: 'On track with goal',
      direction: 'neutral',
    },
    titleColor: 'foreground',
  },
};

export const NoChangeIndicator: Story = {
  args: {
    title: 'Total Workouts',
    value: 142,
    icon: '📈',
    titleColor: 'foreground',
  },
};