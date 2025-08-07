import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm } from './login-form'
import { LoginFormOTP } from './login-form-otp'

const meta = {
  title: 'UI/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: any) => (
      <div className="min-h-[600px] w-full max-w-[500px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WaitingForOTP: Story = {
  render: () => <LoginFormOTP />,
}