"use client"

import { Badge } from "@/components/ui/badge"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"
import { cn } from "@/lib/utils"
import {
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

function formatDistance(meters: number): string {
  const miles = meters / 1609.34
  return miles.toFixed(1)
}

function formatTime(seconds: number): string {
  const totalMins = seconds / 60
  
  // Less than 1 minute, show seconds
  if (totalMins < 1) {
    return `${seconds}s`
  }
  
  // Less than 60 minutes, show minutes with decimal if needed
  if (totalMins < 60) {
    if (totalMins % 1 === 0) {
      return `${Math.floor(totalMins)}m`
    }
    return `${totalMins.toFixed(1)}m`
  }
  
  // 60+ minutes, show hours with decimal
  const hours = totalMins / 60
  if (hours % 1 === 0) {
    return `${Math.floor(hours)}h`
  }
  return `${hours.toFixed(1)}h`
}

function formatPace(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function TrainingSessionCard({ session, className }: TrainingSessionCardProps) {
  const statusProps = getStatusBadgeProps(session.status)
  const StatusIcon = statusProps.icon

  // Check if this is a single cardio session
  const isSingleCardioSession = session.blocks.length === 1 && 
    session.blocks[0].cardioActivity && 
    !session.blocks[0].structuredTraining

  // Calculate totals for strength sessions
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
      {/* Header - Same for all card types */}
      <div className="border-b rounded-t-lg bg-muted px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3 className="text-xl font-bold text-foreground">{session.name}</h3>
          <div className="relative group">
            <Badge variant={statusProps.variant} size="sm" className="cursor-help rounded-full p-1">
              <StatusIcon className="h-2.5 w-2.5" />
            </Badge>
            <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
              {session.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

      {/* Content - Conditional based on session type */}
      <div className="bg-card px-4 py-4">
        {isSingleCardioSession ? (
          <CardioSessionContent session={session} />
        ) : (
          <StrengthSessionContent session={session} totalExercises={totalExercises} totalSets={totalSets} />
        )}
      </div>
    </div>
  )
}

// Cardio Session Content Component
function CardioSessionContent({ session }: { session: TrainingSession }) {
  const cardio = session.blocks[0].cardioActivity!
  
  return (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        <Activity className="h-3 w-3" />
        Run Overview
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {cardio.plannedDistance && (
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatDistance(cardio.plannedDistance)}
            </div>
            <div className="text-xs text-muted-foreground">Miles</div>
          </div>
        )}
        
        {cardio.plannedTime && (
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatTime(cardio.plannedTime)}
            </div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
        )}
        
        {cardio.plannedPace && (
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatPace(cardio.plannedPace * 60)}
            </div>
            <div className="text-xs text-muted-foreground">Pace</div>
          </div>
        )}
      </div>

      {/* Show actual vs planned for completed runs */}
      {session.status === 'Completed' && (cardio.actualDistance || cardio.actualTime) && (
        <>
          <div className="border-t border-border pt-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              <Activity className="h-3 w-3" />
              Actual Performance
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {cardio.actualDistance && (
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {formatDistance(cardio.actualDistance)}
                  </div>
                  <div className="text-xs text-muted-foreground">Actual Miles</div>
                </div>
              )}
              
              {cardio.actualTime && (
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {formatTime(cardio.actualTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">Actual Time</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </>
  )
}

// Strength Session Content Component
function StrengthSessionContent({ 
  session, 
  totalExercises, 
  totalSets 
}: { 
  session: TrainingSession
  totalExercises: number
  totalSets: number
}) {
  return (
    <>
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

        <div className="space-y-0.5">
          {session.blocks.slice(0, session.blocks.length <= 4 ? session.blocks.length : 3).map((block, idx) => (
            <div key={block.id} className="flex justify-between items-center text-xs py-0.5">
              <span className="font-medium text-foreground">{block.name || `Block ${idx + 1}`}</span>
              <span className="text-xs text-muted-foreground">
                {block.cardioActivity ?
                  `${block.cardioActivity.type}` :
                  `${block.structuredTraining?.exercises?.length || 0} exercises`
                }
              </span>
            </div>
          ))}
          {session.blocks.length > 4 && (
            <div className="flex justify-center items-center text-xs py-1 text-muted-foreground italic">
              +{session.blocks.length - 3} more blocks
            </div>
          )}
        </div>
      </div>
    </>
  )
}