'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from "recharts";

const StatsPage = () => {
  // Dummy data for weight progress
  const weightData = [
    { month: "Jan", weight: 150 },
    { month: "Feb", weight: 149 },
    { month: "Mar", weight: 148 },
    { month: "Apr", weight: 147.5 },
    { month: "May", weight: 147 },
    { month: "Jun", weight: 146.8 },
    { month: "Jul", weight: 146.5 },
  ];

  // Dummy data for workout volume
  const volumeData = [
    { week: "Week 1", volume: 45000 },
    { week: "Week 2", volume: 48000 },
    { week: "Week 3", volume: 52000 },
    { week: "Week 4", volume: 49000 },
    { week: "Week 5", volume: 55000 },
    { week: "Week 6", volume: 58000 },
    { week: "Week 7", volume: 61000 },
    { week: "Week 8", volume: 59000 },
  ];

  // Dummy data for workout types distribution
  const workoutTypeData = [
    { name: "Strength", value: 45, fill: "var(--color-strength)" },
    { name: "Cardio", value: 30, fill: "var(--color-cardio)" },
    { name: "Recovery", value: 15, fill: "var(--color-recovery)" },
    { name: "Rest", value: 10, fill: "var(--color-rest)" },
  ];

  // Dummy data for personal records progression
  const prData = [
    { exercise: "Bench", current: 205, previous: 185, goal: 225 },
    { exercise: "Squat", current: 295, previous: 275, goal: 315 },
    { exercise: "Deadlift", current: 335, previous: 315, goal: 365 },
    { exercise: "OHP", current: 105, previous: 95, goal: 125 },
  ];

  const weightChartConfig: ChartConfig = {
    weight: {
      label: "Weight (lbs)",
      color: "hsl(var(--chart-1))",
    },
  };

  const volumeChartConfig: ChartConfig = {
    volume: {
      label: "Volume (lbs)",
      color: "hsl(var(--chart-2))",
    },
  };

  const workoutTypeChartConfig: ChartConfig = {
    strength: {
      label: "Strength",
      color: "hsl(var(--chart-1))",
    },
    cardio: {
      label: "Cardio",
      color: "hsl(var(--chart-2))",
    },
    recovery: {
      label: "Recovery",
      color: "hsl(var(--chart-3))",
    },
    rest: {
      label: "Rest",
      color: "hsl(var(--chart-4))",
    },
  };

  const prChartConfig: ChartConfig = {
    previous: {
      label: "Previous",
      color: "hsl(var(--chart-3))",
    },
    current: {
      label: "Current",
      color: "hsl(var(--chart-1))",
    },
    goal: {
      label: "Goal",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Stats</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weight Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Your weight trend over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={weightChartConfig}>
                  <LineChart data={weightData}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 1']}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent />} 
                    />
                    <Line 
                      dataKey="weight" 
                      type="monotone"
                      stroke="var(--color-weight)" 
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-weight)",
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Training Volume</CardTitle>
                <CardDescription>Total weight lifted per week (lbs)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={volumeChartConfig}>
                  <AreaChart data={volumeData}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent formatter={(value) => [`${value.toLocaleString()} lbs`, "Volume"]} />} 
                    />
                    <Area 
                      dataKey="volume" 
                      type="natural"
                      fill="var(--color-volume)" 
                      fillOpacity={0.4}
                      stroke="var(--color-volume)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workout Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Distribution</CardTitle>
                <CardDescription>Breakdown of workout types this month</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={workoutTypeChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={workoutTypeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Cell key="strength" fill="var(--color-strength)" />
                      <Cell key="cardio" fill="var(--color-cardio)" />
                      <Cell key="recovery" fill="var(--color-recovery)" />
                      <Cell key="rest" fill="var(--color-rest)" />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Personal Records Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Records Progress</CardTitle>
                <CardDescription>Current vs Previous vs Goal (lbs)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={prChartConfig}>
                  <BarChart data={prData}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="exercise"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent />} 
                    />
                    <Bar dataKey="previous" fill="var(--color-previous)" radius={4} />
                    <Bar dataKey="current" fill="var(--color-current)" radius={4} />
                    <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Total Workouts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">487.5k</div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">142h</div>
                <div className="text-sm text-muted-foreground">Time Trained</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-muted-foreground">Personal Records</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;