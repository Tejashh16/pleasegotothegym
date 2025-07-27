import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import Goals from './components/Goals';
import ExerciseLibrary from './components/ExerciseLibrary';
import { Workout, Exercise, WeeklyGoal, PersonalRecord } from './types';
import { storage } from './utils/storage';
import { findPersonalRecords } from './utils/helpers';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setWorkouts(storage.getWorkouts());
    setExercises(storage.getExercises());
    setGoals(storage.getGoals());
    setRecords(storage.getRecords());
  }, []);

  // Update records whenever workouts change
  useEffect(() => {
    const newRecords = findPersonalRecords(workouts);
    setRecords(newRecords);
    storage.saveRecords(newRecords);
  }, [workouts]);

  const handleSaveWorkout = (workout: Workout) => {
    const updatedWorkouts = editingWorkout
      ? workouts.map(w => w.id === workout.id ? workout : w)
      : [...workouts, workout];
    
    setWorkouts(updatedWorkouts);
    storage.saveWorkouts(updatedWorkouts);
    setEditingWorkout(null);
    setActiveTab('dashboard');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    storage.saveWorkouts(updatedWorkouts);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setActiveTab('workout');
  };

  const handleSaveExercise = (exercise: Exercise) => {
    const updatedExercises = exercises.find(e => e.id === exercise.id)
      ? exercises.map(e => e.id === exercise.id ? exercise : e)
      : [...exercises, exercise];
    
    setExercises(updatedExercises);
    storage.saveExercises(updatedExercises);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(e => e.id !== exerciseId);
    setExercises(updatedExercises);
    storage.saveExercises(updatedExercises);
  };

  const handleSaveGoal = (goal: WeeklyGoal) => {
    const updatedGoals = goals.find(g => g.id === goal.id)
      ? goals.map(g => g.id === goal.id ? goal : g)
      : [...goals, goal];
    
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  };

  const handleStartWorkout = () => {
    setEditingWorkout(null);
    setActiveTab('workout');
  };

  const handleCancelWorkout = () => {
    setEditingWorkout(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            workouts={workouts}
            records={records}
            goals={goals}
            onStartWorkout={handleStartWorkout}
          />
        );
      
      case 'workout':
        return (
          <WorkoutForm
            exercises={exercises}
            onSave={handleSaveWorkout}
            onCancel={handleCancelWorkout}
            editWorkout={editingWorkout}
          />
        );
      
      case 'history':
        return (
          <WorkoutHistory
            workouts={workouts}
            onEditWorkout={handleEditWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        );
      
      case 'goals':
        return (
          <Goals
            goals={goals}
            workouts={workouts}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      
      case 'exercises':
        return (
          <ExerciseLibrary
            exercises={exercises}
            onSaveExercise={handleSaveExercise}
            onDeleteExercise={handleDeleteExercise}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="pb-20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;