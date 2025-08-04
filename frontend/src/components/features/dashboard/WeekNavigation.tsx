'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WeekNavigationProps {
  currentWeekIndex: number;
  totalWeeks: number;
  weekRange: string;
  weekRanges?: {
    mobile: string;
    medium: string;
    large: string;
    xl: string;
    full: string;
  };
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  isCurrentWeek?: boolean;
  onBackToToday?: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekIndex,
  totalWeeks,
  weekRange,
  weekRanges,
  onPreviousWeek,
  onNextWeek,
  isCurrentWeek = false,
  onBackToToday
}) => {

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Your Weekly Schedule</h2>

      <div className="flex items-center gap-3">
        {/* Back to Today Button - ghost style, only show when not current week */}
        {!isCurrentWeek && onBackToToday && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onBackToToday}
                  className="h-full px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Today
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Jump to Today
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        )}

        {/* Week Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onPreviousWeek}
            className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center min-w-[90px]">
            {weekRanges ? (
              <>
                {/* Mobile and Small screens: 3 days range */}
                <div className="text-sm font-medium md:hidden">{weekRanges.mobile}</div>
                {/* Medium screens: 4 days range */}
                <div className="text-sm font-medium hidden md:block lg:hidden">{weekRanges.medium}</div>
                {/* Large screens: 5 days range */}
                <div className="text-sm font-medium hidden lg:block xl:hidden">{weekRanges.large}</div>
                {/* Extra large screens: 7 days range */}
                <div className="text-sm font-medium hidden xl:block">{weekRanges.xl}</div>
              </>
            ) : (
              <div className="text-sm font-medium">{weekRange}</div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onNextWeek}
            className="w-8 h-8 rounded-lg bg-secondary border hover:bg-accent hover:border-primary flex items-center justify-center transition-all duration-300"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WeekNavigation);