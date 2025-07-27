import React, { useState } from 'react';
import { Calendar, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Workout } from '../types';
import { formatDate, calculateVolume } from '../utils/helpers';
import { MUSCLE_GROUPS } from '../types';

interface WorkoutHistoryProps {
  workouts: Workout[];
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ 
  workouts, 
  onEditWorkout, 
  onDeleteWorkout 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'volume'>('date');

  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMuscleGroup = filterMuscleGroup === 'all' || 
        workout.exercises.some(ex => ex.exercise.muscleGroup === filterMuscleGroup);
      return matchesSearch && matchesMuscleGroup;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'volume':
          return calculateVolume([b]) - calculateVolume([a]);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const handleDelete = (workout: Workout) => {
    if (window.confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      onDeleteWorkout(workout.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workout History</h1>
        <p className="text-gray-600">View and manage your past workouts</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="font-medium text-gray-900">Filters & Search</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterMuscleGroup}
            onChange={(e) => setFilterMuscleGroup(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Muscle Groups</option>
            {MUSCLE_GROUPS.map(group => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'volume')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="volume">Sort by Volume</option>
          </select>
        </div>
      </div>

      {/* Workout List */}
      {filteredWorkouts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-500">
            {searchTerm || filterMuscleGroup !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : 'Start your fitness journey by logging your first workout!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map(workout => {
            const volume = calculateVolume([workout]);
            const uniqueMuscleGroups = Array.from(
              new Set(workout.exercises.map(ex => ex.exercise.muscleGroup))
            );

            return (
              <div key={workout.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {workout.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(workout.date)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditWorkout(workout)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(workout)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Muscle Groups:</span>
                    <div className="flex space-x-1">
                      {uniqueMuscleGroups.map(group => {
                        const muscleGroup = MUSCLE_GROUPS.find(mg => mg.value === group);
                        return (
                          <span
                            key={group}
                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                              muscleGroup?.color || 'bg-gray-400'
                            }`}
                          >
                            {muscleGroup?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{Math.round(volume)}kg</span> total volume
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Exercises:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {workout.exercises.map(exercise => (
                      <div key={exercise.id} className="text-sm text-gray-600">
                        <span className="font-medium">{exercise.exercise.name}</span>
                        <span className="ml-2">({exercise.sets.length} sets)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {workout.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{workout.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;