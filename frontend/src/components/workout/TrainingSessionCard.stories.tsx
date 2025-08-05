import type { Meta, StoryObj } from '@storybook/react'
import { TrainingSessionCard } from './TrainingSessionCard'
import { 
  threeMileRunSession, 
  fullBodyStrengthSession
} from '@/examples/sample-workout-sessions'

const meta: Meta<typeof TrainingSessionCard> = {
  title: 'Workout/TrainingSessionCard',
  component: TrainingSessionCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Strength Training Session
export const StrengthSession: Story = {
  args: {
    session: fullBodyStrengthSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A strength training session with multiple blocks, exercises, and sets.'
      }
    }
  }
}

// Running Session
export const RunningSession: Story = {
  args: {
    session: threeMileRunSession
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple running session showing how cardio activities are displayed.'
      }
    }
  }
}