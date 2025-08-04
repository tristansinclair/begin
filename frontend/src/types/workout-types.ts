// Workout session types and simple activities

import { ExerciseBlock } from "./structured-training";

export enum TrainingSessionStatus {
  Completed = "Completed",
  InProgress = "In Progress",
  Upcoming = "Upcoming",
  Missed = "Missed",
  Cancelled = "Cancelled",
}

// Simple cardio activity (runs, bikes, swims, etc.)
export type CardioActivity = {
  id: string;
  type: CardioType;
  name?: string;
  
  // Planned parameters
  plannedTime?: number;       // in seconds
  plannedDistance?: number;   // in meters
  plannedPace?: number;       // seconds per meter
  
  // Actual performance
  actualTime?: number;
  actualDistance?: number;
  actualPace?: number;
  
  // Additional metrics
  heartRate?: {
    average?: number;
    max?: number;
  };
  calories?: number;
  elevation?: number;         // for runs/hikes
  
  notes?: string;
}

export enum CardioType {
  Run = "Run",
  Bike = "Bike",
  Swim = "Swim",
  Walk = "Walk",
  Hike = "Hike",
  Row = "Row",
  Elliptical = "Elliptical",
}

// A block that can contain different types of activities
export type ActivityBlock = {
  id: string;
  name?: string;
  type: ActivityBlockType;
  
  // Can contain structured training or simple cardio
  structuredTraining?: ExerciseBlock;
  cardioActivity?: CardioActivity;
  
  notes?: string;
}

export enum ActivityBlockType {
  Structured = "Structured",
  Cardio = "Cardio",
  Rest = "Rest",
}

// A complete training session
export type TrainingSession = {
  id: string;
  name?: string;
  dateTime: Date;
  status: TrainingSessionStatus;
  
  blocks: ActivityBlock[];
  
  // Session metadata
  duration?: number;    // actual duration in minutes
  notes?: string;
  tags?: string[];
}

// A workout plan containing multiple sessions
export type WorkoutPlan = {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;

  createdAt: Date;
  updatedAt: Date;
  
  sessions: TrainingSession[];
  
  // Plan metadata
  tags?: string[];
  createdBy?: string;
}