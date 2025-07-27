import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Library } from 'lucide-react';
import { Exercise, MuscleGroup } from '../types';
import { MUSCLE_GROUPS } from '../types';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onSaveExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ 
  exercises, 
  onSaveExercise, 
  onDeleteExercise 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest');
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('all');

  const filteredExercises = exercises
    .filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMuscleGroup = filterMuscleGroup === 'all' || exercise.muscleGroup === filterMuscleGroup;
      return matchesSearch && matchesMuscleGroup;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    const exercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: name.trim(),
      muscleGroup,
      equipment: equipment.trim(),
      instructions: instructions.trim()
    };

    onSaveExercise(exercise);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingExercise(null);
    setName('');
    setMuscleGroup('chest');
    setEquipment('');
    setInstructions('');
  };

  const startEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setMuscleGroup(exercise.muscleGroup);
    setEquipment(exercise.equipment || '');
    setInstructions(exercise.instructions || '');
    setShowForm(true);
  };

  const handleDelete = (exercise: Exercise) => {
    if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
      onDeleteExercise(exercise.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exercise Library</h1>
          <p className="text-gray-600">Manage your exercise database</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Exercise</span>
        </button>
      </div>

      {/* Exercise Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bench Press"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muscle Group *
              </label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MUSCLE_GROUPS.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Barbell, Dumbbells, Machine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Optional exercise instructions..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingExercise ? 'Update Exercise' : 'Add Exercise'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search exercises..."
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
        </div>
      </div>

      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <Library className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-500">
            {searchTerm || filterMuscleGroup !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Add your first exercise to get started!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => {
            const muscleGroupInfo = MUSCLE_GROUPS.find(mg => mg.value === exercise.muscleGroup);
            
            return (
              <div key={exercise.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {exercise.name}
                  </h3>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEdit(exercise)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(exercise)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-full ${muscleGroupInfo?.color || 'bg-gray-400'}`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {muscleGroupInfo?.label}
                    </span>
                  </div>

                  {exercise.equipment && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Equipment:</span> {exercise.equipment}
                    </p>
                  )}

                  {exercise.instructions && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exercise.instructions}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;