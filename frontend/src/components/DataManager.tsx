'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  clearAllData, 
  exportData, 
  importData 
} from '@/store/persistence';
import { useWorkoutStore } from '@/store/workoutStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { usePlanStore } from '@/store/planStore';

export default function DataManager() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `begin-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importData(content);
        setImportStatus('Data imported successfully! Please refresh the page.');
        
        // Refresh stores
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setImportStatus('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (showConfirm) {
      clearAllData();
      // Reset all stores to initial state
      useWorkoutStore.getState().initialize();
      useDashboardStore.getState().refreshTodaysWorkout();
      usePlanStore.getState().resetPlan();
      
      setShowConfirm(false);
      window.location.reload();
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Data Management</h3>
      
      <div className="space-y-3">
        <div>
          <Button onClick={handleExport} variant="outline" className="w-full">
            Export All Data
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Download your workout data as JSON
          </p>
        </div>

        <div>
          <label className="block">
            <Button variant="outline" className="w-full" asChild>
              <span>Import Data</span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          {importStatus && (
            <p className={`text-xs mt-1 ${importStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {importStatus}
            </p>
          )}
        </div>

        <div>
          <Button 
            onClick={handleReset} 
            variant={showConfirm ? "destructive" : "outline"}
            className="w-full"
          >
            {showConfirm ? 'Click again to confirm reset' : 'Reset All Data'}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Clear all data and start fresh
          </p>
        </div>
      </div>
    </div>
  );
}