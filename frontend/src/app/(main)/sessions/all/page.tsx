"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Activity, CheckCircle2, Play, Clock4, Filter, Dumbbell, Heart } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { TrainingSessionCard } from "@/components/workout/TrainingSessionCard"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"

type SortOption = "date-asc" | "date-desc"
type StatusFilter = "all" | TrainingSessionStatus
type TypeFilter = "all" | "cardio" | "strength" | "mixed"

export default function SessionsPage() {
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
      {/* Sessions Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Training Sessions</h1>
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
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  <span>All</span>
                </div>
              </SelectItem>
              <SelectItem value={TrainingSessionStatus.Upcoming}>
                <div className="flex items-center gap-2">
                  <Clock4 className="h-3 w-3 text-purple-600" />
                  <span className="text-purple-600 font-semibold uppercase text-xs">Upcoming</span>
                </div>
              </SelectItem>
              <SelectItem value={TrainingSessionStatus.InProgress}>
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600 font-semibold uppercase text-xs">In Progress</span>
                </div>
              </SelectItem>
              <SelectItem value={TrainingSessionStatus.Completed}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 font-semibold uppercase text-xs">Completed</span>
                </div>
              </SelectItem>
              <SelectItem value={TrainingSessionStatus.Missed}>
                <div className="flex items-center gap-2">
                  <Clock4 className="h-3 w-3 text-red-600" />
                  <span className="text-red-600 font-semibold uppercase text-xs">Missed</span>
                </div>
              </SelectItem>
              <SelectItem value={TrainingSessionStatus.Cancelled}>
                <div className="flex items-center gap-2">
                  <Clock4 className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-500 font-semibold uppercase text-xs">Cancelled</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value: TypeFilter) => setTypeFilter(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  <span>All</span>
                </div>
              </SelectItem>
              <SelectItem value="cardio">
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>Cardio</span>
                </div>
              </SelectItem>
              <SelectItem value="strength">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-3 w-3 text-blue-500" />
                  <span>Strength</span>
                </div>
              </SelectItem>
              <SelectItem value="mixed">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-purple-500" />
                  <span>Mixed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Reset filters button */}
          {(sortBy !== "date-desc" || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortBy("date-desc")
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
                setSortBy("date-desc")
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