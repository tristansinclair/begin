"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <Card className={cn(
      "overflow-hidden",
      className
    )}>
      <CardHeader className="bg-gray-50 border-b rounded-t-lg -m-6 -mb-0 mx-0 px-6 py-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{session.name}</h3>
          <Badge variant={statusProps.variant}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {session.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
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
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            <Activity className="h-3 w-3" />
            Session Overview
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{session.blocks.length}</div>
                <div className="text-xs text-gray-600">Blocks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{totalExercises}</div>
                <div className="text-xs text-gray-600">Exercises</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{session.estimatedDuration || 60}</div>
                <div className="text-xs text-gray-600">Min</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{totalSets}</div>
                <div className="text-xs text-gray-600">Total Sets</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            <Activity className="h-3 w-3" />
            Workout Summary
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border space-y-1">
            {session.blocks.map((block, idx) => (
              <div key={block.id} className="flex justify-between items-center text-xs py-1">
                <span className="font-medium text-gray-900">{block.name || `Block ${idx + 1}`}</span>
                <span className="text-xs text-gray-600">
                  {block.cardioActivity ? 
                    `${block.cardioActivity.type}` : 
                    `${block.structuredTraining?.exercises?.length || 0} exercises`
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}