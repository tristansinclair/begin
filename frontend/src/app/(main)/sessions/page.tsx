"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, TrendingUp, ChevronRight } from "lucide-react"
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan"
import { TrainingSessionCard } from "@/components/workout/TrainingSessionCard"
import { TrainingSession, TrainingSessionStatus } from "@/types/workouts/workout-types"

export default function SessionsPage() {
  const plan = sampleWorkoutPlan
  
  // Get today's date at midnight for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Get upcoming sessions (next 7 days)
  const upcomingSessions = plan.sessions
    .filter((session: TrainingSession) => {
      const sessionDate = new Date(session.dateTime)
      const daysDiff = Math.ceil((sessionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff >= 0 && daysDiff <= 7 && session.status === TrainingSessionStatus.Upcoming
    })
    .sort((a: TrainingSession, b: TrainingSession) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3)
  
  // Get recent completed sessions
  const recentCompletedSessions = plan.sessions
    .filter((session: TrainingSession) => session.status === TrainingSessionStatus.Completed)
    .sort((a: TrainingSession, b: TrainingSession) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 3)
  
  // Calculate stats
  const totalSessions = plan.sessions.length
  const completedSessions = plan.sessions.filter((s: TrainingSession) => s.status === TrainingSessionStatus.Completed).length
  const upcomingCount = plan.sessions.filter((s: TrainingSession) => s.status === TrainingSessionStatus.Upcoming).length
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Button asChild>
          <Link href="/sessions/all">
            View All Sessions
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          <span className="text-sm text-muted-foreground">Next 7 days</span>
        </div>
        
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingSessions.map((session: TrainingSession) => (
              <TrainingSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mb-2 opacity-50" />
              <p>No upcoming sessions in the next 7 days</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Completed Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Completed</h2>
          <span className="text-sm text-muted-foreground">Latest completions</span>
        </div>
        
        {recentCompletedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCompletedSessions.map((session: TrainingSession) => (
              <TrainingSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mb-2 opacity-50" />
              <p>No completed sessions yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your training sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/sessions/all">
              <Activity className="mr-2 h-4 w-4" />
              Browse All Sessions
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/plan">
              <Calendar className="mr-2 h-4 w-4" />
              View Training Plan
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/stats">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Statistics
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}