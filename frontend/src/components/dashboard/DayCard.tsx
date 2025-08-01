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
  onClick
}) => {
  const getTypeStyles = () => {
    switch (workoutType) {
      case 'strength':
        return 'bg-blue-500';
      case 'cardio':
        return 'bg-red-500';
      case 'recovery':
        return 'bg-green-500';
      case 'rest':
        return 'bg-muted-foreground';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div 
      className={`flex h-[70px] bg-card border rounded-xl cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg overflow-hidden ${
        isSelected ? 'border-primary bg-accent' : ''
      }`}
      onClick={onClick}
    >
      {/* Date Sidebar */}
      <div className={`flex flex-col items-center justify-center px-1.5 rounded-l-xl ${getTypeStyles()} text-white w-[45px] flex-shrink-0`}>
        <div className="text-sm font-bold leading-none">{date}</div>
        <div className="text-[9px] font-medium uppercase tracking-wider leading-none mt-0.5">{day}</div>
      </div>
      
      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-center p-1.5 min-w-0">
        <div className="text-[11px] font-semibold text-foreground leading-tight truncate">{workoutLabel}</div>
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