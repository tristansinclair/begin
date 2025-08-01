'use client';
import React from 'react';

interface WeekNavigationProps {
  currentWeekIndex: number;
  totalWeeks: number;
  weekRange: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekIndex,
  totalWeeks,
  weekRange,
  onPreviousWeek,
  onNextWeek
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Your Weekly Schedule</h2>
      <div className="flex items-center gap-4">
        <button 
          onClick={onPreviousWeek}
          disabled={currentWeekIndex === 0}
          className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <span className="text-sm text-muted-foreground">{weekRange}</span>
        <button 
          onClick={onNextWeek}
          disabled={currentWeekIndex === totalWeeks - 1}
          className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default WeekNavigation;