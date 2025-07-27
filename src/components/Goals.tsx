import React, { useState } from 'react';
import { Target, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { WeeklyGoal, Workout } from '../types';
import { getCurrentWeek, getWorkoutsInWeek, calculateVolume } from '../utils/helpers';

interface GoalsProps {
  goals: WeeklyGoal[];
  workouts: Workout[];
  onSaveGoal: (goal: WeeklyGoal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, workouts, onSaveGoal, onDeleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
  const [targetWorkouts, setTargetWorkouts] = useState(3);
  const [targetVolume, setTargetVolume] = useState(5000);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: WeeklyGoal = {
      id: editingGoal?.id || Date.now().toString(),
      week: selectedWeek,
      targetWorkouts,
      targetVolume,
      completedWorkouts: 0,
      completedVolume: 0
    };

    onSaveGoal(goal);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGoal(null);
    setTargetWorkouts(3);
    setTargetVolume(5000);
    setSelectedWeek(getCurrentWeek());
  };

  const startEdit = (goal: WeeklyGoal) => {
    setEditingGoal(goal);
    setTargetWorkouts(goal.targetWorkouts);
    setTargetVolume(goal.targetVolume);
    setSelectedWeek(goal.week);
    setShowForm(true);
  };

  const handleDelete = (goal: WeeklyGoal) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      onDeleteGoal(goal.id);
    }
  };

  // Calculate progress for each goal
  const goalsWithProgress = goals.map(goal => {
    const weekWorkouts = getWorkoutsInWeek(workouts, goal.week);
    const completedWorkouts = weekWorkouts.length;
    const completedVolume = calculateVolume(weekWorkouts);
    
    return {
      ...goal,
      completedWorkouts,
      completedVolume,
      workoutProgress: (completedWorkouts / goal.targetWorkouts) * 100,
      volumeProgress: (completedVolume / goal.targetVolume) * 100
    };
  }).sort((a, b) => b.week.localeCompare(a.week));

  const generateWeekOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate weeks for current and next few weeks
    for (let i = -4; i <= 12; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + (i * 7));
      
      const year = date.getFullYear();
      const start = new Date(year, 0, 1);
      const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + start.getDay() + 1) / 7);
      const weekString = `${year}-${week.toString().padStart(2, '0')}`;
      
      options.push({
        value: weekString,
        label: `Week ${week}, ${year}`,
        isCurrent: weekString === getCurrentWeek()
      });
    }
    
    return options;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Weekly Goals</h1>
          <p className="text-gray-600">Set and track your fitness targets</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGoal ? 'Edit Goal' : 'Set New Goal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {generateWeekOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Workouts
              </label>
              <input
                type="number"
                value={targetWorkouts}
                onChange={(e) => setTargetWorkouts(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Volume (kg)
              </label>
              <input
                type="number"
                value={targetVolume}
                onChange={(e) => setTargetVolume(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                step="100"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingGoal ? 'Update Goal' : 'Save Goal'}
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

      {/* Goals List */}
      {goalsWithProgress.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
          <p className="text-gray-500">Set your first weekly goal to start tracking your progress!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goalsWithProgress.map(goal => (
            <div key={goal.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week {goal.week.split('-')[1]}, {goal.week.split('-')[0]}
                  </h3>
                  {goal.week === getCurrentWeek() && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                      Current Week
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(goal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(goal)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Workouts Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      Workouts
                    </span>
                    <span className="text-sm text-gray-600">
                      {goal.completedWorkouts}/{goal.targetWorkouts}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(goal.workoutProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {goal.workoutProgress >= 100 ? '🎉 Goal achieved!' : 
                     goal.workoutProgress >= 80 ? 'Almost there!' : 
                     'Keep going!'}
                  </p>
                </div>

                {/* Volume Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Volume
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(goal.completedVolume)}kg/{goal.targetVolume}kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(goal.volumeProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {goal.volumeProgress >= 100 ? '🎉 Goal achieved!' : 
                     goal.volumeProgress >= 80 ? 'Almost there!' : 
                     'Keep pushing!'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;