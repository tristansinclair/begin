import type { Meta, StoryObj } from '@storybook/react'
import { TrainingSessionCard } from './TrainingSessionCard'
import { 
  threeMileRunSession, 
  fullBodyStrengthSession,
  murphWorkoutSession,
  singleBlockWorkout,
  manyBlocksWorkout,
  completedMorning5K,
  completedBenchPressWorkout,
  ongoingSquatWorkout
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

// Murph Workout Session
export const MurphWorkout: Story = {
  args: {
    session: murphWorkoutSession
  },
  parameters: {
    docs: {
      description: {
        story: 'The famous Murph Hero WOD - a complex workout with run-calisthenics-run structure showcasing mixed cardio and strength blocks.'
      }
    }
  }
}

// Single Block Session
export const SingleBlockSession: Story = {
  args: {
    session: singleBlockWorkout
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple workout with only one block - shows how the card handles minimal content without truncation.'
      }
    }
  }
}

// Many Blocks Session
export const ManyBlocksSession: Story = {
  args: {
    session: manyBlocksWorkout
  },
  parameters: {
    docs: {
      description: {
        story: 'A complex training day with 8 blocks - demonstrates the truncation logic showing first 3 blocks with "+5 more blocks..." indicator.'
      }
    }
  }
}

// ================================================================
// COMPLETED STATE STORIES - Show actual workout results
// ================================================================

// Completed Cardio Session
export const CompletedCardioSession: Story = {
  args: {
    session: completedMorning5K
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed 5K run showing actual performance data including time, pace, heart rate, and calories. Demonstrates how completed cardio sessions display results vs planned targets.'
      }
    }
  }
}

// Completed Strength Session
export const CompletedStrengthSession: Story = {
  args: {
    session: completedBenchPressWorkout
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed strength workout showing actual weights lifted, reps completed, and performance ratings. Shows how the card displays PR achievements and workout results.'
      }
    }
  }
}

// In-Progress Session
export const InProgressSession: Story = {
  args: {
    session: ongoingSquatWorkout
  },
  parameters: {
    docs: {
      description: {
        story: 'A workout currently in progress, showing completed sets and upcoming sets. Demonstrates the in-progress state with partial completion data.'
      }
    }
  }
}