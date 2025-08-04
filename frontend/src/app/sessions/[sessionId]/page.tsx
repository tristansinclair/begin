"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Target, Users, Activity, ArrowLeft, Timer, Weight, Repeat, CheckCircle2, Play, Clock4, XCircle, Pause } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"
import { formatDate, formatDay, formatTime } from "@/lib/format"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"
import { use } from "react"
import React from "react"

function getStatusBadgeProps(status: TrainingSessionStatus) {
  switch (status) {
    case TrainingSessionStatus.Completed:
      return {
        variant: "default" as const,
        icon: CheckCircle2,
        className: "bg-green-500 hover:bg-green-600 text-white"
      }
    case TrainingSessionStatus.InProgress:
      return {
        variant: "default" as const,
        icon: Play,
        className: "bg-blue-500 hover:bg-blue-600 text-white"
      }
    case TrainingSessionStatus.Upcoming:
      return {
        variant: "outline" as const,
        icon: Clock4,
        className: "border-orange-300 text-orange-700 hover:bg-orange-50"
      }
    case TrainingSessionStatus.Missed:
      return {
        variant: "outline" as const,
        icon: XCircle,
        className: "border-red-300 text-red-700 hover:bg-red-50"
      }
    case TrainingSessionStatus.Cancelled:
      return {
        variant: "outline" as const,
        icon: Pause,
        className: "border-gray-300 text-gray-600 hover:bg-gray-50"
      }
    default:
      return {
        variant: "outline" as const,
        icon: Clock4,
        className: ""
      }
  }
}

interface SessionHeaderProps {
  session: any
  isSingleActivitySession: boolean
}

function SessionHeader({ session, isSingleActivitySession }: SessionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">{session.name}</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDay(session.dateTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{formatTime(session.dateTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <Badge variant={getStatusBadgeProps(session.status).variant} className={getStatusBadgeProps(session.status).className}>
            {React.createElement(getStatusBadgeProps(session.status).icon, { className: "h-3 w-3 mr-1" })}
            {session.status}
          </Badge>
        </div>
      </div>

      {session.tags && session.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {session.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      {isSingleActivitySession && session.blocks[0].cardioActivity && (
        <CardioActivity activity={session.blocks[0].cardioActivity} isHeader={true} />
      )}

      {session.notes && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm italic">{session.notes}</p>
        </div>
      )}
    </div>
  )
}

interface CardioActivityProps {
  activity: any
  isHeader?: boolean
}

function CardioActivity({ activity, isHeader = false }: CardioActivityProps) {
  const wrapperClass = isHeader ? "space-y-3 p-4 bg-muted/50 rounded-lg border" : "space-y-3"
  
  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-2 text-base font-medium">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="capitalize">{activity.type}</span>
        {activity.name && activity.name !== activity.type && (
          <span className="text-muted-foreground">- {activity.name}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activity.plannedDistance && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-medium">
              {(activity.plannedDistance / 1609.34).toFixed(1)} miles
            </span>
            {activity.actualDistance && activity.actualDistance !== activity.plannedDistance && (
              <span className="text-xs text-muted-foreground">
                (actual: {(activity.actualDistance / 1609.34).toFixed(1)} mi)
              </span>
            )}
          </div>
        )}
        
        {activity.plannedTime && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">
              {Math.floor(activity.plannedTime / 60)}:{(activity.plannedTime % 60).toString().padStart(2, '0')}
            </span>
            {activity.actualTime && activity.actualTime !== activity.plannedTime && (
              <span className="text-xs text-muted-foreground">
                (actual: {Math.floor(activity.actualTime / 60)}:{(activity.actualTime % 60).toString().padStart(2, '0')})
              </span>
            )}
          </div>
        )}

        {activity.plannedPace && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Target Pace:</span>
            <span className="font-medium">{activity.plannedPace} min/mile</span>
          </div>
        )}

        {activity.heartRate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Heart Rate:</span>
            <span className="font-medium">
              {activity.heartRate.average} avg
              {activity.heartRate.max && ` / ${activity.heartRate.max} max`}
            </span>
          </div>
        )}

        {activity.calories && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Calories:</span>
            <span className="font-medium">{activity.calories}</span>
          </div>
        )}
      </div>

      {activity.notes && (
        <div className="p-2 bg-blue-50 border-l-4 border-blue-200 rounded text-sm">
          <p className="text-blue-800 italic">{activity.notes}</p>
        </div>
      )}
    </div>
  )
}

interface ExerciseSetProps {
  set: any
}

function ExerciseSet({ set }: ExerciseSetProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
      <span className="font-medium">Set {set.setNumber}</span>
      
      <div className="flex items-center gap-3">
        {set.plannedReps && (
          <span>{set.plannedReps} reps</span>
        )}
        
        {set.plannedTime && (
          <span>{set.plannedTime}s</span>
        )}

        {set.plannedWeight && (
          <span className="font-medium">
            {set.plannedWeight.type === 'absolute' && set.plannedWeight.weight ? 
              `${set.plannedWeight.weight.weight}${set.plannedWeight.weight.unit}` :
              set.plannedWeight.type === 'bodyweight' ? 'Bodyweight' :
              set.plannedWeight.type === 'percentage' ? `${set.plannedWeight.percentage}% 1RM` : ''
            }
          </span>
        )}

        {set.actualReps && set.actualReps !== set.plannedReps && (
          <span className="text-xs text-green-600">
            (actual: {set.actualReps} reps)
          </span>
        )}

        {set.actualWeight && set.actualWeight.weight !== set.plannedWeight?.weight?.weight && (
          <span className="text-xs text-green-600">
            (actual: {set.actualWeight.weight}{set.actualWeight.unit})
          </span>
        )}

        {set.completed && (
          <span className="text-xs text-green-600">✓</span>
        )}

        {set.restAfter && (
          <span className="text-xs text-muted-foreground">
            Rest: {set.restAfter}s
          </span>
        )}
      </div>
    </div>
  )
}

interface ExerciseProps {
  exercise: any
  exerciseIndex: number
}

function Exercise({ exercise, exerciseIndex }: ExerciseProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
          {exerciseIndex + 1}
        </div>
        <div>
          <h4 className="font-medium capitalize">
            {exercise.exerciseDefinitionId.replace(/-/g, ' ')}
          </h4>
          <p className="text-sm text-muted-foreground capitalize">
            {exercise.variationId.replace(/-/g, ' ')}
          </p>
        </div>
      </div>

      <div className="ml-9 space-y-2">
        <div className="grid gap-2">
          {exercise.sets.map((set: any) => (
            <ExerciseSet key={set.id} set={set} />
          ))}
        </div>
      </div>

      {exercise.notes && (
        <div className="ml-9 p-2 bg-yellow-50 border-l-4 border-yellow-200 rounded text-sm">
          <p className="text-yellow-800 italic">{exercise.notes}</p>
        </div>
      )}
    </div>
  )
}

interface StructuredTrainingProps {
  training: any
}

function StructuredTraining({ training }: StructuredTrainingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {training.rounds && training.rounds > 1 && (
          <div className="flex items-center gap-1">
            <Repeat className="h-4 w-4" />
            <span>{training.rounds} rounds</span>
          </div>
        )}
        {training.restBetweenRounds && (
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            <span>{training.restBetweenRounds}s rest between rounds</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {training.exercises?.map((exercise: any, exerciseIndex: number) => (
          <Exercise key={exercise.id} exercise={exercise} exerciseIndex={exerciseIndex} />
        ))}
      </div>
    </div>
  )
}

interface SessionPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = use(params)
  const plan = sampleWorkoutPlan
  const session = plan.sessions.find(s => s.id === sessionId)
  const useNavigate = useRouter()

  if (!session) {
    notFound()
  }

  // Check if this is a single-activity session (only one block with cardio only)
  const isSingleActivitySession = session.blocks.length === 1 && 
    session.blocks[0].cardioActivity && 
    !session.blocks[0].structuredTraining

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link onClick={() => useNavigate.back()} href={""}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <SessionHeader session={session} isSingleActivitySession={isSingleActivitySession} />

      {/* Session Blocks - only show for multi-block sessions or structured training */}
      {!isSingleActivitySession && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Workout Details</h2>
          
          <div className="space-y-6">
            {session.blocks.map((block, blockIndex) => (
              <div key={block.id} className="space-y-4">
                {/* Block Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                    {blockIndex + 1}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {block.name || `Block ${blockIndex + 1}`}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {block.type}
                  </Badge>
                </div>

                {/* Block Content */}
                <div className="border-l-2 border-muted pl-6 space-y-4 ml-6">
                  {block.cardioActivity && (
                    <CardioActivity activity={block.cardioActivity} />
                  )}

                  {block.structuredTraining && (
                    <StructuredTraining training={block.structuredTraining} />
                  )}

                  {block.notes && (
                    <div className="p-3 bg-muted/50 border-l-4 border-primary/20 rounded text-sm">
                      <p className="text-muted-foreground italic">{block.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}