export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  height: number; // in cm
  currentWeight: number; // in kg
}

export type UserPreferences = {
  weightUnit: "kg" | "lbs";
}


export type Weight = {
  weight: number;
  unit: "kg" | "lbs";
}

export type WorkoutHistory = {
  date: string;
  workoutType: string;
}


export type TrainingType = "Run" | "Lift" | "Bike" | "Swim" | "Cardio" | "Yoga" | "Pilates" | "Hiking" | "CrossFit";

export type Workout = {
  id: string;
  name: string;
  type: TrainingType;
  duration: number;
  calories: number;
}

