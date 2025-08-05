"use client"

import { Badge } from "@/components/ui/badge"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Activity,
  CheckCircle2,
  Play,
  Clock4
} from "lucide-react"

interface TrainingSessionCardProps {
  session: TrainingSession
  className?: string
}

function getStatusBadgeProps(status: TrainingSessionStatus) {
  switch (status) {
    case TrainingSessionStatus.Completed:
      return {
        icon: CheckCircle2,
        variant: "completed" as const
      }
    case TrainingSessionStatus.InProgress:
      return {
        icon: Play,
        variant: "inProgress" as const
      }
    case TrainingSessionStatus.Upcoming:
      return {
        icon: Clock4,
        variant: "upcoming" as const
      }
    default:
      return {
        icon: Clock4,
        variant: "secondary" as const
      }
  }
}

export function TrainingSessionCard({ session, className }: TrainingSessionCardProps) {
  const statusProps = getStatusBadgeProps(session.status)
  const StatusIcon = statusProps.icon

  const totalExercises = session.blocks.reduce((acc, block) => {
    return acc + (block.structuredTraining?.exercises?.length || 0)
  }, 0)

  const totalSets = session.blocks.reduce((acc, block) => {
    const exercises = block.structuredTraining?.exercises || []
    return acc + exercises.reduce((setAcc, exercise) => setAcc + exercise.sets.length, 0)
  }, 0)

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="border-b rounded-t-lg bg-muted px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3 className="text-2xl font-bold text-foreground">{session.name}</h3>
          <div className="relative group">
            <Badge variant={statusProps.variant} size="sm" className="cursor-help rounded-full p-1">
              <StatusIcon className="h-2.5 w-2.5" />
            </Badge>
            <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
              {session.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(session.dateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}</span>
          <span>•</span>
          <span>{new Date(session.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })}</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card px-6 py-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          <Activity className="h-3 w-3" />
          Session Overview
        </div>

        <div className="grid grid-cols-4 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-bold text-foreground">{session.blocks.length}</div>
            <div className="text-xs text-muted-foreground">Blocks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{totalExercises}</div>
            <div className="text-xs text-muted-foreground">Exercises</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{session.estimatedDuration || 60}</div>
            <div className="text-xs text-muted-foreground">Min</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{totalSets}</div>
            <div className="text-xs text-muted-foreground">Total Sets</div>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            <Activity className="h-3 w-3" />
            Workout Summary
          </div>

          <div className="space-y-1">
            {session.blocks.map((block, idx) => (
              <div key={block.id} className="flex justify-between items-center text-xs py-1">
                <span className="font-medium text-foreground">{block.name || `Block ${idx + 1}`}</span>
                <span className="text-xs text-muted-foreground">
                  {block.cardioActivity ?
                    `${block.cardioActivity.type}` :
                    `${block.structuredTraining?.exercises?.length || 0} exercises`
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}