import React from 'react';
import { Calendar, TrendingUp, Trophy, Zap } from 'lucide-react';
import { Workout, PersonalRecord, WeeklyGoal } from '../types';
import { formatDate, getCurrentWeek, getTodayString, calculateVolume, getWorkoutsInWeek } from '../utils/helpers';
import { MUSCLE_GROUPS } from '../types';

interface DashboardProps {
  workouts: Workout[];
  records: PersonalRecord[];
  goals: WeeklyGoal[];
  onStartWorkout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, records, goals, onStartWorkout }) => {
  const today = getTodayString();
  const currentWeek = getCurrentWeek();
  
  const todayWorkout = workouts.find(w => w.date === today);
  const thisWeekWorkouts = getWorkoutsInWeek(workouts, currentWeek);
  const thisWeekVolume = calculateVolume(thisWeekWorkouts);
  
  const currentGoal = goals.find(g => g.week === currentWeek);
  const workoutProgress = currentGoal ? (thisWeekWorkouts.length / currentGoal.targetWorkouts) * 100 : 0;
  const volumeProgress = currentGoal ? (thisWeekVolume / currentGoal.targetVolume) * 100 : 0;

  const topRecords = records.slice(0, 3);

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Ready to crush your fitness goals?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onStartWorkout}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Workout" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex items-center justify-center space-x-3">
            <Zap size={24} />
            <span className="text-lg font-semibold">Start Workout</span>
          </div>
        </button>

        <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {todayWorkout && (
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <img 
                src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=200" 
                alt="Completed workout" 
                className="w-full h-full object-cover rounded-bl-xl"
              />
            </div>
          )}
          <div className="relative flex items-center space-x-3 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="font-semibold text-gray-900">Today</span>
          </div>
          {todayWorkout ? (
            <div>
              <p className="text-sm text-gray-600 mb-1">{todayWorkout.name}</p>
              <p className="text-xs text-green-600">✓ Completed</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">No workout logged</p>
              <div className="w-6 h-6 opacity-30">
                <img 
                  src="https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Rest day" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Progress */}
      {currentGoal && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">This Week's Progress</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Workouts</span>
                <span className="text-sm text-gray-600">
                  {thisWeekWorkouts.length}/{currentGoal.targetWorkouts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(workoutProgress, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Volume</span>
                <span className="text-sm text-gray-600">
                  {Math.round(thisWeekVolume)}kg/{currentGoal.targetVolume}kg
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(volumeProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Records */}
      {topRecords.length > 0 && (
        <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <img 
              src="https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=200" 
              alt="Trophy" 
              className="w-full h-full object-cover rounded-bl-xl"
            />
          </div>
          <div className="relative flex items-center space-x-2 mb-4">
            <Trophy className="text-yellow-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Personal Records</h2>
          </div>
          
          <div className="space-y-3">
            {topRecords.map(record => (
              <div key={record.exerciseId} className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 opacity-60">
                      <img 
                        src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=100" 
                        alt="Exercise" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.exerciseName}</p>
                      <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{record.weight}kg</p>
                  <p className="text-sm text-gray-500">{record.reps} reps</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <img 
              src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=200" 
              alt="Gym equipment" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex items-center space-x-2 mb-4">
            <TrendingUp className="text-green-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
          </div>
          
          <div className="space-y-3">
            {recentWorkouts.map(workout => (
              <div key={workout.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{workout.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{formatDate(workout.date)}</p>
                    <div className="w-4 h-4 opacity-40">
                      <img 
                        src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=100" 
                        alt="Workout icon" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {Array.from(new Set(workout.exercises.map(e => e.exercise.muscleGroup))).map(group => {
                    const muscleGroup = MUSCLE_GROUPS.find(mg => mg.value === group);
                    return (
                      <span
                        key={group}
                        className={`w-3 h-3 rounded-full ${muscleGroup?.color || 'bg-gray-400'}`}
                        title={muscleGroup?.label}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;