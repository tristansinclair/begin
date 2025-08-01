'use client';
import React from 'react';

interface DayCardProps {
  day: string;
  date: number;
  workoutLabel: string;
  summaryLine: string;
  mainMetric: string;
  metricUnit: string;
  workoutType: 'strength' | 'cardio' | 'recovery' | 'rest';
  isSelected: boolean;
  isToday?: boolean;
  isCompleted?: boolean;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  date,
  workoutLabel,
  summaryLine,
  mainMetric,
  metricUnit,
  workoutType,
  isSelected,
  isToday = false,
  isCompleted = false,
  onClick
}) => {

  return (
    <div
      className={`flex h-[70px] bg-card border rounded-xl cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg overflow-hidden ${isSelected ? 'border-primary bg-accent' : ''
        }`}
      onClick={onClick}
    >
      {/* Date Sidebar */}
      <div className={`flex flex-col items-center justify-center px-1.5 rounded-l-xl bg-secondary text-foreground w-[45px] flex-shrink-0 relative`}>
        
        {isToday && (
          <div className="absolute w-9 h-9 bg-red-500 rounded-full z-9"></div>
        )}
        <div className="text-sm font-bold leading-none relative z-10">{date}</div>
        <div className="text-[9px] font-medium uppercase tracking-wider leading-none mt-0.5 relative z-10">{day}</div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-center p-1.5 min-w-0">
        <div className="flex items-center gap-1">
          <div className="text-[11px] font-semibold text-foreground leading-tight truncate">{workoutLabel}</div>
          {isCompleted && workoutType !== 'rest' && (
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          )}
        </div>
        <div className="text-[9px] text-muted-foreground leading-tight truncate mt-0.5">{summaryLine}</div>

        {workoutType !== 'rest' && (
          <div className="flex items-baseline justify-end mt-0.5">
            <span className="text-xs font-bold text-foreground leading-none">{mainMetric}</span>
            <span className="text-[8px] font-medium text-muted-foreground ml-1 uppercase leading-none">{metricUnit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCard;