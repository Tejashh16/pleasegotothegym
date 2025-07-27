import { Workout, Exercise, WeeklyGoal, PersonalRecord } from '../types';

const STORAGE_KEYS = {
  WORKOUTS: 'workoutTracker_workouts',
  EXERCISES: 'workoutTracker_exercises',
  GOALS: 'workoutTracker_goals',
  RECORDS: 'workoutTracker_records'
};

export const storage = {
  // Workouts
  getWorkouts: (): Workout[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  },

  saveWorkouts: (workouts: Workout[]) => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  // Exercises
  getExercises: (): Exercise[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    return data ? JSON.parse(data) : getDefaultExercises();
  },

  saveExercises: (exercises: Exercise[]) => {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  },

  // Goals
  getGoals: (): WeeklyGoal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },

  saveGoals: (goals: WeeklyGoal[]) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  // Personal Records
  getRecords: (): PersonalRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveRecords: (records: PersonalRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }
};

function getDefaultExercises(): Exercise[] {
  return [
    // Chest
    { id: '1', name: 'Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
    { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'Dumbbells' },
    { id: '3', name: 'Push-ups', muscleGroup: 'chest', equipment: 'Bodyweight' },
    { id: '4', name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'Dumbbells' },
    
    // Back
    { id: '5', name: 'Deadlift', muscleGroup: 'back', equipment: 'Barbell' },
    { id: '6', name: 'Pull-ups', muscleGroup: 'back', equipment: 'Bodyweight' },
    { id: '7', name: 'Barbell Rows', muscleGroup: 'back', equipment: 'Barbell' },
    { id: '8', name: 'Lat Pulldowns', muscleGroup: 'back', equipment: 'Cable' },
    
    // Legs
    { id: '9', name: 'Squats', muscleGroup: 'legs', equipment: 'Barbell' },
    { id: '10', name: 'Leg Press', muscleGroup: 'legs', equipment: 'Machine' },
    { id: '11', name: 'Lunges', muscleGroup: 'legs', equipment: 'Dumbbells' },
    { id: '12', name: 'Leg Curls', muscleGroup: 'legs', equipment: 'Machine' },
    
    // Shoulders
    { id: '13', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'Barbell' },
    { id: '14', name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
    { id: '15', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
    
    // Arms
    { id: '16', name: 'Bicep Curls', muscleGroup: 'arms', equipment: 'Dumbbells' },
    { id: '17', name: 'Tricep Dips', muscleGroup: 'arms', equipment: 'Bodyweight' },
    { id: '18', name: 'Hammer Curls', muscleGroup: 'arms', equipment: 'Dumbbells' },
    
    // Core
    { id: '19', name: 'Plank', muscleGroup: 'core', equipment: 'Bodyweight' },
    { id: '20', name: 'Crunches', muscleGroup: 'core', equipment: 'Bodyweight' },
    { id: '21', name: 'Russian Twists', muscleGroup: 'core', equipment: 'Bodyweight' }
  ];
}