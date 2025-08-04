import React from 'react';
import { getExperienceLevel, getExperienceLevelDisplay } from '../../utils/experienceLevel';

interface ExperienceLevelCardProps {
  level: number;
}

const ExperienceLevelCard: React.FC<ExperienceLevelCardProps> = ({ level }) => {
  const experienceData = getExperienceLevel(level);
  const progressToNext = level < 10 ? ((level % 1) * 100) : 100;
  
  return (
    <div className="bg-card border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
          {experienceData.emoji}
        </div>
        <span className="text-sm font-medium text-foreground">Fitness Level</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-primary mb-1">
            {experienceData.title}
          </div>
          <div className="text-sm text-muted-foreground">
            Level {level}/10
          </div>
        </div>
        
        {level < 10 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to Level {Math.floor(level) + 1}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
          {experienceData.description}
        </p>
      </div>
    </div>
  );
};

export default ExperienceLevelCard;