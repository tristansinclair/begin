import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  titleColor?: 'foreground' | 'muted-foreground';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  titleColor = 'foreground'
}) => {
  const getChangeColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'neutral':
        return '→';
      default:
        return '';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-card border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-card border border-primary/20 flex items-center justify-center text-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium text-${titleColor}`}>{title}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-3xl font-bold mb-2">{formatValue(value)}</div>
        {change && (
          <div className={`flex items-center gap-2 ${getChangeColor(change.direction)} text-sm`}>
            <span>{getChangeIcon(change.direction)} {change.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;