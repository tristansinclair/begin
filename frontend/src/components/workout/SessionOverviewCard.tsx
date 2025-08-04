"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import { TrainingSession } from "@/types/workouts/workout-types"
import { formatDay, formatTime } from "@/lib/format"
import Link from "next/link"

interface SessionOverviewCardProps {
  session: TrainingSession
}

export function SessionOverviewCard({ session }: SessionOverviewCardProps) {
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
            <Badge variant={session.status === "Completed" ? "default" : "outline"}>
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

          {/* Blocks Overview */}
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

          {/* Session Notes */}
          {session.notes && (
            <div className="text-sm text-muted-foreground italic border-t pt-3">
              {session.notes}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}