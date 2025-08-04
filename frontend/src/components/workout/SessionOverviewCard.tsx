"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ChevronRight, CheckCircle2, Play, Clock4, XCircle, Pause } from "lucide-react"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"
import { formatDay, formatTime } from "@/lib/format"
import Link from "next/link"

interface SessionOverviewCardProps {
  session: TrainingSession
}

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

export function SessionOverviewCard({ session }: SessionOverviewCardProps) {
  // Check if this is a single-activity session (only one block with cardio only)
  const isSingleActivitySession = session.blocks.length === 1 && 
    session.blocks[0].cardioActivity && 
    !session.blocks[0].structuredTraining

  const statusProps = getStatusBadgeProps(session.status)
  const StatusIcon = statusProps.icon

  return (
    <Link href={`/sessions/${session.id}`}>
      <Card className="w-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {session.name}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDay(session.dateTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(session.dateTime)}</span>
                </div>
              </CardDescription>
            </div>
            <Badge variant={statusProps.variant} className={statusProps.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {session.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Session Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Single Activity Session - Show prominent cardio details */}
          {isSingleActivitySession && session.blocks[0].cardioActivity && (
            <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
              <div className="flex items-center gap-2 text-base font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="capitalize">{session.blocks[0].cardioActivity.type}</span>
                {session.blocks[0].cardioActivity.name && 
                  session.blocks[0].cardioActivity.name !== session.blocks[0].cardioActivity.type && (
                  <span className="text-muted-foreground">- {session.blocks[0].cardioActivity.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {session.blocks[0].cardioActivity.plannedDistance && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">
                      {(session.blocks[0].cardioActivity.plannedDistance / 1609.34).toFixed(1)} miles
                    </span>
                    {session.blocks[0].cardioActivity.actualDistance && 
                      session.blocks[0].cardioActivity.actualDistance !== session.blocks[0].cardioActivity.plannedDistance && (
                      <span className="text-xs text-muted-foreground">
                        (actual: {(session.blocks[0].cardioActivity.actualDistance / 1609.34).toFixed(1)} mi)
                      </span>
                    )}
                  </div>
                )}
                
                {session.blocks[0].cardioActivity.plannedTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {Math.floor(session.blocks[0].cardioActivity.plannedTime / 60)}:{(session.blocks[0].cardioActivity.plannedTime % 60).toString().padStart(2, '0')}
                    </span>
                    {session.blocks[0].cardioActivity.actualTime && 
                      session.blocks[0].cardioActivity.actualTime !== session.blocks[0].cardioActivity.plannedTime && (
                      <span className="text-xs text-muted-foreground">
                        (actual: {Math.floor(session.blocks[0].cardioActivity.actualTime / 60)}:{(session.blocks[0].cardioActivity.actualTime % 60).toString().padStart(2, '0')})
                      </span>
                    )}
                  </div>
                )}

                {session.blocks[0].cardioActivity.heartRate && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <span className="font-medium">
                      {session.blocks[0].cardioActivity.heartRate.average} avg
                      {session.blocks[0].cardioActivity.heartRate.max && 
                        ` / ${session.blocks[0].cardioActivity.heartRate.max} max`
                      }
                    </span>
                  </div>
                )}

                {session.blocks[0].cardioActivity.calories && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="font-medium">{session.blocks[0].cardioActivity.calories}</span>
                  </div>
                )}
              </div>

              {session.blocks[0].cardioActivity.notes && (
                <div className="p-2 bg-blue-50 border-l-4 border-blue-200 rounded text-sm">
                  <p className="text-blue-800 italic">{session.blocks[0].cardioActivity.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Multi-Block Session - Show blocks overview */}
          {!isSingleActivitySession && (
            <div className="space-y-3">
              {session.blocks.map((block, blockIndex) => (
                <div key={block.id} className="border-l-2 border-muted pl-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {block.name || `Block ${blockIndex + 1}`}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {block.type}
                    </Badge>
                  </div>

                  {/* Cardio Activity */}
                  {block.cardioActivity && (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="capitalize">{block.cardioActivity.type}</span>
                        {block.cardioActivity.plannedDistance && (
                          <span>• {(block.cardioActivity.plannedDistance / 1609.34).toFixed(1)} miles</span>
                        )}
                        {block.cardioActivity.plannedTime && (
                          <span>• {Math.floor(block.cardioActivity.plannedTime / 60)}min</span>
                        )}
                      </div>
                      {block.cardioActivity.notes && (
                        <p className="text-xs mt-1 italic">{block.cardioActivity.notes}</p>
                      )}
                    </div>
                  )}

                  {/* Structured Training */}
                  {block.structuredTraining && (
                    <div className="text-sm space-y-2">
                      {block.structuredTraining.exercises?.map((exercise) => (
                        <div key={exercise.id} className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="capitalize">
                              {exercise.exerciseDefinitionId.replace(/-/g, ' ')}
                            </span>
                            <span className="text-xs">
                              ({exercise.variationId.replace(/-/g, ' ')})
                            </span>
                          </div>

                          {/* Sets Summary */}
                          <div className="text-xs mt-1">
                            {exercise.sets.length} sets: {exercise.sets.map((set, setIndex) => (
                              <span key={set.id}>
                                {set.plannedReps ? `${set.plannedReps} reps` : ''}
                                {set.plannedWeight?.type === 'absolute' && set.plannedWeight.weight ?
                                  ` @ ${set.plannedWeight.weight.weight}${set.plannedWeight.weight.unit}` :
                                  set.plannedWeight?.type === 'bodyweight' ? ' @ bodyweight' :
                                    set.plannedWeight?.type === 'percentage' ? ` @ ${set.plannedWeight.percentage}%` : ''
                                }
                                {set.plannedTime ? `${Math.floor(set.plannedTime / 60)}min` : ''}
                                {setIndex < exercise.sets.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      {block.structuredTraining.rounds && block.structuredTraining.rounds > 1 && (
                        <div className="text-xs text-muted-foreground italic">
                          × {block.structuredTraining.rounds} rounds
                          {block.structuredTraining.restBetweenRounds &&
                            ` (${block.structuredTraining.restBetweenRounds}s rest between rounds)`
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Session Notes - only show for multi-block sessions (single activity notes shown above) */}
          {!isSingleActivitySession && session.notes && (
            <div className="text-sm text-muted-foreground italic border-t pt-3">
              {session.notes}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}