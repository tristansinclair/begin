"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Target, Users, Activity } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { formatDate } from "@/lib/format"
import { TrainingSessionCard } from "@/components/workout/TrainingSessionCard"
import { TrainingSession, TrainingSessionStatus, ActivityBlockType } from "@/types/workouts/workout-types"

type SortOption = "date-asc" | "date-desc"
type StatusFilter = "all" | TrainingSessionStatus
type TypeFilter = "all" | "cardio" | "strength" | "mixed"

export default function PlanExamplePage() {
  const plan = sampleWorkoutPlan

  // State for sorting and filtering
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")

  // Helper function to determine session type
  const getSessionType = (session: TrainingSession): TypeFilter => {
    const hasCardio = session.blocks.some(block => block.cardioActivity)
    const hasStrength = session.blocks.some(block => block.structuredTraining)

    if (hasCardio && hasStrength) return "mixed"
    if (hasCardio) return "cardio"
    if (hasStrength) return "strength"
    return "strength" // default
  }

  // Filtered and sorted sessions
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = plan.sessions.filter((session: TrainingSession) => {
      // Status filter
      if (statusFilter !== "all" && session.status !== statusFilter) {
        return false
      }

      // Type filter
      if (typeFilter !== "all") {
        const sessionType = getSessionType(session)
        if (sessionType !== typeFilter) {
          return false
        }
      }

      return true
    })

    // Sort sessions
    return filtered.sort((a: TrainingSession, b: TrainingSession) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        case "date-desc":
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        default:
          return 0
      }
    })
  }, [plan.sessions, sortBy, statusFilter, typeFilter])

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Plan Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{plan.name}</h1>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(plan.startDate)} - {plan.endDate ? formatDate(plan.endDate) : "Ongoing"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>{plan.sessions.length} Sessions</span>
          </div>
          {plan.createdBy && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Created by {plan.createdBy}</span>
            </div>
          )}
        </div>

        {plan.description && (
          <p className="text-muted-foreground max-w-2xl">{plan.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {plan.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Sessions Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Training Sessions</h2>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedSessions.length} of {plan.sessions.length} sessions
          </div>
        </div>

        {/* Sorting and Filtering Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest</SelectItem>
              <SelectItem value="date-asc">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={TrainingSessionStatus.Upcoming}>Upcoming</SelectItem>
              <SelectItem value={TrainingSessionStatus.InProgress}>In Progress</SelectItem>
              <SelectItem value={TrainingSessionStatus.Completed}>Completed</SelectItem>
              <SelectItem value={TrainingSessionStatus.Missed}>Missed</SelectItem>
              <SelectItem value={TrainingSessionStatus.Cancelled}>Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value: TypeFilter) => setTypeFilter(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset filters button */}
          {(sortBy !== "date-asc" || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortBy("date-asc")
                setStatusFilter("all")
                setTypeFilter("all")
              }}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedSessions.map((session: TrainingSession) => (
            <TrainingSessionCard key={session.id} session={session} />
          ))}
        </div>

        {filteredAndSortedSessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No sessions match the selected filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSortBy("date-asc")
                setStatusFilter("all")
                setTypeFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}