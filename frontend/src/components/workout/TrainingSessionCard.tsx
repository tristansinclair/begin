"use client"

import Link from "next/link"
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

function getStatusProps(status: TrainingSessionStatus) {
  switch (status) {
    case TrainingSessionStatus.Completed:
      return {
        icon: CheckCircle2,
        color: "text-green-600"
      }
    case TrainingSessionStatus.InProgress:
      return {
        icon: Play,
        color: "text-blue-600"
      }
    case TrainingSessionStatus.Upcoming:
      return {
        icon: Clock4,
        color: "text-purple-600"
      }
    case TrainingSessionStatus.Missed:
      return {
        icon: Clock4,
        color: "text-red-600"
      }
    case TrainingSessionStatus.Cancelled:
      return {
        icon: Clock4,
        color: "text-gray-500"
      }
    default:
      return {
        icon: Clock4,
        color: "text-muted-foreground"
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
  const statusProps = getStatusProps(session.status)
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
    <Link href={`/sessions/${session.id}`} className="block h-full">
      <div className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer h-full flex flex-col",
        className
      )}>
        {/* Header - Same for all card types */}
        <div className="border-b px-4 py-4">
          {/* Status Label */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${statusProps.color}`}>
            <StatusIcon className="h-4 w-4" />
            {session.status}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-1.5">{session.name}</h3>
          
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        <div className="bg-card px-4 py-4 flex-1">
          {isSingleCardioSession ? (
            <CardioSessionContent session={session} />
          ) : (
            <StrengthSessionContent session={session} totalExercises={totalExercises} totalSets={totalSets} />
          )}
        </div>
      </div>
    </Link>
  )
}

// Cardio Session Content Component
function CardioSessionContent({ session }: { session: TrainingSession }) {
  const cardio = session.blocks[0].cardioActivity!
  const isCompleted = session.status === TrainingSessionStatus.Completed
  
  return (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        <Activity className="h-3 w-3" />
        {cardio.type} Overview
      </div>

      {/* For completed runs, show actual data prominently if available */}
      {isCompleted && (cardio.actualDistance || cardio.actualTime || cardio.actualPace) ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {cardio.actualDistance && (
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatDistance(cardio.actualDistance)}
              </div>
              <div className="text-xs text-muted-foreground">Miles</div>
            </div>
          )}
          
          {cardio.actualTime && (
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatTime(cardio.actualTime)}
              </div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          )}
          
          {cardio.actualPace && (
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatPace(cardio.actualPace * 60)}
              </div>
              <div className="text-xs text-muted-foreground">Pace</div>
            </div>
          )}
        </div>
      ) : (
        /* Show planned data for non-completed or when no actual data */
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
      )}

      {/* Show additional metrics for completed cardio */}
      {isCompleted && (cardio.heartRate || cardio.calories || cardio.elevation) && (
        <>
          <div className="border-t border-border pt-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              <Activity className="h-3 w-3" />
              Performance Metrics
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              {cardio.heartRate?.average && (
                <div>
                  <div className="text-lg font-bold text-foreground">{cardio.heartRate.average}</div>
                  <div className="text-xs text-muted-foreground">Avg HR</div>
                </div>
              )}
              
              {cardio.calories && (
                <div>
                  <div className="text-lg font-bold text-foreground">{cardio.calories}</div>
                  <div className="text-xs text-muted-foreground">Calories</div>
                </div>
              )}
              
              {cardio.elevation && (
                <div>
                  <div className="text-lg font-bold text-foreground">{cardio.elevation}ft</div>
                  <div className="text-xs text-muted-foreground">Elevation</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Show planned vs actual comparison for completed runs if both exist */}
      {isCompleted && (cardio.actualDistance || cardio.actualTime) && 
       (cardio.plannedDistance || cardio.plannedTime) && (
        <>
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              <Activity className="h-3 w-3" />
              Planned vs Actual
            </div>
            
            <div className="space-y-2">
              {cardio.plannedDistance && cardio.actualDistance && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="text-foreground">
                    {formatDistance(cardio.plannedDistance)} → {formatDistance(cardio.actualDistance)} mi
                  </span>
                </div>
              )}
              
              {cardio.plannedTime && cardio.actualTime && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground">
                    {formatTime(cardio.plannedTime)} → {formatTime(cardio.actualTime)}
                  </span>
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
  const isCompleted = session.status === TrainingSessionStatus.Completed
  
  // Calculate completed sets for completed sessions
  const completedSets = isCompleted ? session.blocks.reduce((acc, block) => {
    const exercises = block.structuredTraining?.exercises || []
    return acc + exercises.reduce((setAcc, exercise) => 
      setAcc + exercise.sets.filter(set => set.completed).length, 0)
  }, 0) : 0

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
          <div className="text-lg font-bold text-foreground">
            {isCompleted && session.actualDuration ? session.actualDuration : (session.estimatedDuration || 60)}
          </div>
          <div className="text-xs text-muted-foreground">
            {isCompleted && session.actualDuration ? "Actual Min" : "Min"}
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-foreground">
            {isCompleted ? `${completedSets}/${totalSets}` : totalSets}
          </div>
          <div className="text-xs text-muted-foreground">
            {isCompleted ? "Completed" : "Total Sets"}
          </div>
        </div>
      </div>

      {/* Show workout performance for completed sessions */}
      {isCompleted && (session.intensityRating || session.enjoymentRating) && (
        <>
          <div className="border-t border-border pt-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              <Activity className="h-3 w-3" />
              Performance Ratings
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              {session.intensityRating && (
                <div>
                  <div className="text-lg font-bold text-foreground">{session.intensityRating}/10</div>
                  <div className="text-xs text-muted-foreground">Intensity</div>
                </div>
              )}
              
              {session.enjoymentRating && (
                <div>
                  <div className="text-lg font-bold text-foreground">{session.enjoymentRating}/10</div>
                  <div className="text-xs text-muted-foreground">Enjoyment</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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