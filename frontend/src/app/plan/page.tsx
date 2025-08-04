"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Users, Activity } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { formatDate } from "@/lib/format"
import { SessionOverviewCard } from "@/components/workout/SessionOverviewCard"

export default function PlanExamplePage() {
  const plan = sampleWorkoutPlan

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
          {plan.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Sessions Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Training Sessions</h2>
        {/* TODO: add a filter for the sessions */}
        {/* Quick filterers for status, date, etc. */}

        <div className="grid gap-4">
          {plan.sessions.map((session) => (
            <SessionOverviewCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  )
}