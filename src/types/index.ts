export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string;
  instructions?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  restTime?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  notes?: string;
}

export interface WeeklyGoal {
  id: string;
  week: string; // YYYY-WW format
  targetWorkouts: number;
  targetVolume: number;
  completedWorkouts: number;
  completedVolume: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string; color: string }[] = [
  { value: 'chest', label: 'Chest', color: 'bg-red-500' },
  { value: 'back', label: 'Back', color: 'bg-blue-500' },
  { value: 'legs', label: 'Legs', color: 'bg-green-500' },
  { value: 'shoulders', label: 'Shoulders', color: 'bg-yellow-500' },
  { value: 'arms', label: 'Arms', color: 'bg-purple-500' },
  { value: 'core', label: 'Core', color: 'bg-orange-500' },
  { value: 'cardio', label: 'Cardio', color: 'bg-pink-500' }
];