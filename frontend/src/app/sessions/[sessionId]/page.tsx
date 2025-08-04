"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Target, Users, Activity, ArrowLeft, Timer, Weight, Repeat } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { formatDate, formatDay, formatTime } from "@/lib/format"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"
import { use } from "react"

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
            Back to Plan
          </Link>
        </Button>
      </div>

      {/* Session Header */}
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
            <Badge variant={session.status === "Completed" ? "default" : "outline"}>
              {session.status}
            </Badge>
          </div>
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {session.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}

        {/* For single-activity sessions, show activity details in header */}
        {isSingleActivitySession && session.blocks[0].cardioActivity && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-lg font-medium">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="capitalize">{session.blocks[0].cardioActivity.type}</span>
              {session.blocks[0].cardioActivity.name && session.blocks[0].cardioActivity.name !== session.blocks[0].cardioActivity.type && (
                <span className="text-muted-foreground">- {session.blocks[0].cardioActivity.name}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session.blocks[0].cardioActivity.plannedDistance && (
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Target className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Distance</div>
                    <div className="font-medium">
                      {(session.blocks[0].cardioActivity.plannedDistance / 1609.34).toFixed(1)} miles
                    </div>
                  </div>
                </div>
              )}
              
              {session.blocks[0].cardioActivity.plannedTime && (
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Timer className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-medium">
                      {Math.floor(session.blocks[0].cardioActivity.plannedTime / 60)}:{(session.blocks[0].cardioActivity.plannedTime % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              )}

              {session.blocks[0].cardioActivity.plannedPace && (
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Activity className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Target Pace</div>
                    <div className="font-medium">{session.blocks[0].cardioActivity.plannedPace} min/mile</div>
                  </div>
                </div>
              )}
            </div>

            {session.blocks[0].cardioActivity.notes && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                <p className="text-sm text-blue-800">{session.blocks[0].cardioActivity.notes}</p>
              </div>
            )}
          </div>
        )}

        {session.notes && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm italic">{session.notes}</p>
          </div>
        )}
      </div>

      {/* Session Blocks - only show for multi-block sessions or structured training */}
      {!isSingleActivitySession && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Workout Details</h2>
          
          {session.blocks.map((block, blockIndex) => (
          <Card key={block.id} className="w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {blockIndex + 1}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {block.name || `Block ${blockIndex + 1}`}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {block.type}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Cardio Activity */}
              {block.cardioActivity && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="capitalize">{block.cardioActivity.type}</span>
                    {block.cardioActivity.name && block.cardioActivity.name !== block.cardioActivity.type && (
                      <span className="text-muted-foreground">- {block.cardioActivity.name}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {block.cardioActivity.plannedDistance && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Target className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Distance</div>
                          <div className="font-medium">
                            {(block.cardioActivity.plannedDistance / 1609.34).toFixed(1)} miles
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {block.cardioActivity.plannedTime && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Timer className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Time</div>
                          <div className="font-medium">
                            {Math.floor(block.cardioActivity.plannedTime / 60)}:{(block.cardioActivity.plannedTime % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    )}

                    {block.cardioActivity.plannedPace && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Activity className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Target Pace</div>
                          <div className="font-medium">{block.cardioActivity.plannedPace} min/mile</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {block.cardioActivity.notes && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                      <p className="text-sm text-blue-800">{block.cardioActivity.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Structured Training */}
              {block.structuredTraining && (
                <div className="space-y-4">
                  {/* Block Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {block.structuredTraining.rounds && block.structuredTraining.rounds > 1 && (
                      <div className="flex items-center gap-1">
                        <Repeat className="h-4 w-4" />
                        <span>{block.structuredTraining.rounds} rounds</span>
                      </div>
                    )}
                    {block.structuredTraining.restBetweenRounds && (
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <span>{block.structuredTraining.restBetweenRounds}s rest between rounds</span>
                      </div>
                    )}
                  </div>

                  {/* Exercises */}
                  <div className="space-y-4">
                    {block.structuredTraining.exercises?.map((exercise, exerciseIndex) => (
                      <div key={exercise.id} className="border rounded-lg p-4 space-y-3">
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

                        {/* Sets */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Sets:</h5>
                          <div className="grid gap-2">
                            {exercise.sets.map((set) => (
                              <div key={set.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                <span className="font-medium">Set {set.setNumber}</span>
                                
                                <div className="flex items-center gap-4">
                                  {set.plannedReps && (
                                    <div className="flex items-center gap-1">
                                      <Repeat className="h-3 w-3" />
                                      <span>{set.plannedReps} reps</span>
                                    </div>
                                  )}
                                  
                                  {set.plannedTime && (
                                    <div className="flex items-center gap-1">
                                      <Timer className="h-3 w-3" />
                                      <span>{set.plannedTime}s</span>
                                    </div>
                                  )}

                                  {set.plannedWeight && (
                                    <div className="flex items-center gap-1">
                                      <Weight className="h-3 w-3" />
                                      <span>
                                        {set.plannedWeight.type === 'absolute' && set.plannedWeight.weight ? 
                                          `${set.plannedWeight.weight.weight}${set.plannedWeight.weight.unit}` :
                                          set.plannedWeight.type === 'bodyweight' ? 'Bodyweight' :
                                          set.plannedWeight.type === 'percentage' ? `${set.plannedWeight.percentage}% 1RM` : ''
                                        }
                                      </span>
                                    </div>
                                  )}

                                  {set.restAfter && (
                                    <div className="text-xs text-muted-foreground">
                                      Rest: {set.restAfter}s
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {exercise.notes && (
                          <div className="p-2 bg-yellow-50 border-l-4 border-yellow-200 rounded text-sm">
                            <p className="text-yellow-800">{exercise.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {block.notes && (
                <div className="p-3 bg-gray-50 border-l-4 border-gray-200 rounded">
                  <p className="text-sm text-gray-700">{block.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  )
}