'use client';
import React from 'react';
import DataManager from '@/components/DataManager';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6">
        {/* User Profile Section */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">Sarah Chen</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">sarah.chen@example.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">March 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Units</span>
              <span className="font-medium">Imperial (lbs, miles)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Preferred Workout Time</span>
              <span className="font-medium">Morning</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Week Starts On</span>
              <span className="font-medium">Monday</span>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <DataManager />
        
        {/* About Section */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-sm text-muted-foreground">
            Begin Fitness Tracker v1.0.0
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            All data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}