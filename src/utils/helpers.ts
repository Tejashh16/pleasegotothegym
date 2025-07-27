import { Workout, PersonalRecord, WeeklyGoal } from '../types';

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getWeekNumber = (date: Date): string => {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${date.getFullYear()}-${week.toString().padStart(2, '0')}`;
};

export const getCurrentWeek = (): string => {
  return getWeekNumber(new Date());
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const calculateVolume = (workouts: Workout[]): number => {
  return workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);
};

export const findPersonalRecords = (workouts: Workout[]): PersonalRecord[] => {
  const records: { [exerciseId: string]: PersonalRecord } = {};

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        const key = exercise.exerciseId;
        const currentRecord = records[key];
        
        if (!currentRecord || set.weight > currentRecord.weight || 
            (set.weight === currentRecord.weight && set.reps > currentRecord.reps)) {
          records[key] = {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exercise.name,
            weight: set.weight,
            reps: set.reps,
            date: workout.date
          };
        }
      });
    });
  });

  return Object.values(records);
};

export const getWorkoutsInWeek = (workouts: Workout[], week: string): Workout[] => {
  return workouts.filter(workout => {
    const workoutWeek = getWeekNumber(new Date(workout.date));
    return workoutWeek === week;
  });
};