'use client';
import React from 'react';
import { extendedUserProfile as userProfile } from '../../../data/mock/userProfile';
import { getExperienceLevel, getExperienceLevelDisplay } from '../../../utils/experienceLevel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UserProfile = () => {
  const { name, email, avatar, memberSince, stats, goals, measurements, achievements } = userProfile;
  
  const latestWeight = measurements.weight[measurements.weight.length - 1];
  const latestBodyFat = measurements.bodyFat[measurements.bodyFat.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {/* Basic Profile Info with Body Metrics */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="text-center md:text-left">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{name}</h2>
                  <p className="text-muted-foreground mb-2">{email}</p>
                  <p className="text-sm text-muted-foreground">Member since {new Date(memberSince).toLocaleDateString()}</p>
                </div>
                
                <div className="flex-1 md:ml-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Body Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Weight</span>
                          <span className="font-semibold">{latestWeight.value} {latestWeight.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Body Fat</span>
                          <span className="font-semibold">{latestBodyFat.value}{latestBodyFat.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Workouts</span>
                          <span className="font-semibold">{stats.totalWorkouts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Streak</span>
                          <span className="font-semibold">{stats.currentStreak} days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Experience Level</h3>
                      <div className="space-y-3">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary mb-1">
                            {getExperienceLevelDisplay(userProfile.experienceLevel)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Level {userProfile.experienceLevel}/10
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {getExperienceLevel(userProfile.experienceLevel).description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness Goals */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fitness Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div key={goal.id} className="bg-card border rounded-2xl p-4">
                      <h4 className="font-medium mb-2">{goal.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Target: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats Overview */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalVolume}</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalDuration}</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.personalRecords}</div>
                  <div className="text-sm text-muted-foreground">Personal Records</div>
                </div>
                <div className="bg-card border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.longestStreak}</div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
              </div>
            </div>

            {/* Workout Preferences */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Workout Preferences</h3>
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Edit Preferences
                </button>
              </div>
              
              <div className="bg-card border rounded-2xl p-6 space-y-6">
                {/* Exercise Restrictions */}
                <div>
                  <h4 className="font-medium mb-3 text-red-700">🚫 Never Include These Exercises</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-sm">Barbell bench press</span>
                      <button className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">+ Add exercise to avoid</button>
                  </div>
                </div>

                {/* Must Include */}
                <div>
                  <h4 className="font-medium mb-3 text-green-700">✅ Always Include</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm">Core exercises at the end of strength workouts</span>
                      <button className="text-green-500 hover:text-green-700 text-xs">Remove</button>
                    </div>
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium">+ Add requirement</button>
                  </div>
                </div>

                {/* Warmup Preferences */}
                <div>
                  <h4 className="font-medium mb-3 text-blue-700">🏃 Warmup Routines</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Before Running</label>
                      <div className="mt-1 flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm">20 high knees</span>
                        <button className="text-blue-500 hover:text-blue-700 text-xs">Edit</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Before Strength Training</label>
                      <div className="mt-1 py-2 px-3 bg-muted/50 rounded-lg border border-dashed">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add warmup routine</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* General Settings */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">⚙️ General Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Units</label>
                      <Select defaultValue={userProfile.preferences.units}>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                          <SelectItem value="metric">Metric (kg, m)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Preferred Workout Time</label>
                      <Select defaultValue={userProfile.preferences.preferredWorkoutTime}>
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-card border rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;