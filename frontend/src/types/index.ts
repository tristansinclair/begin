// Core user and app types
export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  height: number; // in cm
  currentWeight: number; // in kg
  units: "kg" | "lbs";
}


// export type WorkoutHistory = {
//   date: string;
//   workoutType: string;
// }

// // Legacy types (consider removing after migration)
// export type TrainingType = "Run" | "Lift" | "Bike" | "Swim" | "Cardio" | "Yoga" | "Pilates" | "Hiking" | "CrossFit";

// export type Workout = {
//   id: string;
//   name: string;
//   type: TrainingType;
//   duration: number;
//   calories: number;
// }

// Re-export from specialized modules
export * from "./exercise-definitions";
export * from "./structured-training";
export * from "./workout-types";