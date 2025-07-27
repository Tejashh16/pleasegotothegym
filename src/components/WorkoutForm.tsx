import React, { useState } from 'react';
import { Plus, Minus, Save, X } from 'lucide-react';
import { Workout, Exercise, WorkoutExercise, WorkoutSet } from '../types';
import { getTodayString } from '../utils/helpers';
import { MUSCLE_GROUPS } from '../types';

interface WorkoutFormProps {
  exercises: Exercise[];
  onSave: (workout: Workout) => void;
  onCancel: () => void;
  editWorkout?: Workout;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ exercises, onSave, onCancel, editWorkout }) => {
  const [workoutName, setWorkoutName] = useState(editWorkout?.name || '');
  const [workoutDate, setWorkoutDate] = useState(editWorkout?.date || getTodayString());
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    editWorkout?.exercises || []
  );
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [notes, setNotes] = useState(editWorkout?.notes || '');

  const filteredExercises = selectedMuscleGroup === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.muscleGroup === selectedMuscleGroup);

  const addExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      exercise,
      sets: [{ id: Date.now().toString(), reps: 10, weight: 20 }],
      notes: ''
    };
    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSet: WorkoutSet = {
          id: Date.now().toString(),
          reps: ex.sets[ex.sets.length - 1]?.reps || 10,
          weight: ex.sets[ex.sets.length - 1]?.weight || 20
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      }
      return ex;
    }));
  };

  const handleSave = () => {
    if (!workoutName.trim() || workoutExercises.length === 0) {
      alert('Please add a workout name and at least one exercise');
      return;
    }

    const workout: Workout = {
      id: editWorkout?.id || Date.now().toString(),
      name: workoutName.trim(),
      date: workoutDate,
      exercises: workoutExercises,
      notes: notes.trim()
    };

    onSave(workout);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {editWorkout ? 'Edit Workout' : 'New Workout'}
        </h1>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Workout Info */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workout Name
          </label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Push Day, Leg Day"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Optional workout notes..."
          />
        </div>
      </div>

      {/* Exercise Selection */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Exercises</h2>
        
        <div className="mb-4">
          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Muscle Groups</option>
            {MUSCLE_GROUPS.map(group => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {filteredExercises.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => addExercise(exercise)}
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="font-medium text-gray-900">{exercise.name}</div>
              <div className="text-sm text-gray-500">{exercise.equipment}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Exercises */}
      {workoutExercises.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Workout Exercises</h2>
          
          {workoutExercises.map(workoutExercise => (
            <div key={workoutExercise.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {workoutExercise.exercise.name}
                </h3>
                <button
                  onClick={() => removeExercise(workoutExercise.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span></span>
                </div>

                {workoutExercise.sets.map((set, index) => (
                  <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm text-gray-500">{index + 1}</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(workoutExercise.id, set.id, 'weight', Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center"
                      min="0"
                      step="0.5"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(workoutExercise.id, set.id, 'reps', Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-center"
                      min="1"
                    />
                    <button
                      onClick={() => removeSet(workoutExercise.id, set.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={workoutExercise.sets.length === 1}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSet(workoutExercise.id)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus size={16} />
                <span>Add Set</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Save size={20} />
        <span>{editWorkout ? 'Update Workout' : 'Save Workout'}</span>
      </button>
    </div>
  );
};

export default WorkoutForm;