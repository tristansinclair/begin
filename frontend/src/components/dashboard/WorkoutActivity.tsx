'use client';
import React, { useEffect } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import { WorkoutStatus } from '../../data/workoutSchedule';

const WorkoutActivity = () => {
  const { allWeeksData, initialize } = useWorkoutStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  useEffect(() => {
    generateHeatmap();
  }, [allWeeksData]);

  const generateHeatmap = () => {
    const heatmapGrid = document.getElementById('heatmap-grid');
    const monthLabels = document.getElementById('month-labels');
    const totalWorkoutsEl = document.getElementById('total-workouts');
    
    if (!heatmapGrid || !monthLabels || !totalWorkoutsEl) return;
    
    heatmapGrid.innerHTML = '';
    monthLabels.innerHTML = '';
    
    // Create workout data lookup from allWeeksData
    const workoutLookup: { [key: string]: Array<{ workoutType: string; duration: number; calories: number; isCompleted: boolean }> } = {};
    
    allWeeksData.forEach(week => {
      week.workouts.forEach(workout => {
        const dateKey = `${workout.year}-${String(workout.month === 'January' ? 1 : 
          workout.month === 'February' ? 2 :
          workout.month === 'March' ? 3 :
          workout.month === 'April' ? 4 :
          workout.month === 'May' ? 5 :
          workout.month === 'June' ? 6 :
          workout.month === 'July' ? 7 :
          workout.month === 'August' ? 8 :
          workout.month === 'September' ? 9 :
          workout.month === 'October' ? 10 :
          workout.month === 'November' ? 11 : 12).padStart(2, '0')}-${String(workout.date).padStart(2, '0')}`;
        
        // Only include completed workouts or estimate calories for scheduled ones
        const isCompleted = workout.status === 'Completed';
        const estimatedCalories = workout.type === 'Rest' ? 0 : 
          workout.type === 'Upper' ? 350 :
          workout.type === 'Lower' ? 400 :
          workout.type === 'Full Body' ? 450 : 300;
        
        if (!workoutLookup[dateKey]) {
          workoutLookup[dateKey] = [];
        }
        
        workoutLookup[dateKey].push({
          workoutType: workout.type,
          duration: isCompleted ? 45 : 0, // Assume 45 min if completed, 0 if not
          calories: isCompleted ? estimatedCalories : (workout.status === WorkoutStatus.Future ? estimatedCalories * 0.5 : 0),
          isCompleted: isCompleted
        });
      });
    });
    
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const startDate = new Date(threeMonthsAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    
    let totalWorkouts = 0;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthPositions: { [key: number]: number } = {};
    
    const weekColumnsContainer = document.createElement('div');
    weekColumnsContainer.className = 'contents';
    
    let currentDate = new Date(startDate);
    let currentMonth = currentDate.getMonth();
    
    for (let week = 0; week < 13; week++) {
      const weekColumn = document.createElement('div');
      weekColumn.className = 'grid grid-rows-7 gap-[2px]';
      
      for (let day = 0; day < 7; day++) {
        const cell = document.createElement('div');
        cell.className = 'w-2.5 h-2.5 rounded-sm cursor-pointer hover:ring-1 hover:ring-gray-300 relative group';
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap';
        tooltip.style.zIndex = '9999';
        
        if (currentDate <= today && currentDate >= threeMonthsAgo) {
          const dateKey = currentDate.toISOString().split('T')[0];
          const workoutData = workoutLookup[dateKey] || [];
          
          let completedWorkouts = 0;
          let totalCalories = 0;
          let totalDuration = 0;
          
          workoutData.forEach(workout => {
            if (workout.isCompleted) {
              completedWorkouts++;
              totalCalories += workout.calories;
              totalDuration += workout.duration;
            }
          });
          
          totalWorkouts += completedWorkouts;
          
          // Color based on calories burned
          let level = 0;
          if (totalCalories === 0) level = 0;
          else if (totalCalories <= 200) level = 1;
          else if (totalCalories <= 400) level = 2;
          else if (totalCalories <= 600) level = 3;
          else if (totalCalories <= 800) level = 4;
          else level = 5;
          
          if (level === 0) cell.classList.add('bg-slate-100', 'dark:bg-slate-800');
          else if (level === 1) cell.classList.add('bg-green-100', 'dark:bg-green-900/40');
          else if (level === 2) cell.classList.add('bg-green-200', 'dark:bg-green-800/60');
          else if (level === 3) cell.classList.add('bg-green-300', 'dark:bg-green-700/80');
          else if (level === 4) cell.classList.add('bg-green-400', 'dark:bg-green-600');
          else cell.classList.add('bg-green-500', 'dark:bg-green-500');
          
          const dateStr = currentDate.toLocaleDateString('en-US', { 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric' 
          });

          if (completedWorkouts === 0) {
            tooltip.textContent = `No workouts on ${dateStr}`;
          } else {
            let tooltipContent = `${dateStr}<br/>`;
            workoutData.forEach((workout, index) => {
              if (workout.isCompleted) {
                tooltipContent += `<strong>${workout.workoutType}</strong> - ${workout.duration} min, ${workout.calories} cal`;
                if (index < workoutData.length - 1) tooltipContent += '<br/>';
              }
            });
            tooltip.innerHTML = tooltipContent;
          }
        } else {
          cell.style.visibility = 'hidden';
          tooltip.style.visibility = 'hidden';
        }
        
        if (day === 0 && currentDate.getMonth() !== currentMonth) {
          currentMonth = currentDate.getMonth();
          monthPositions[week] = currentMonth;
        }
        
        // Add hover event listeners for tooltip positioning
        cell.addEventListener('mouseenter', () => {
          const rect = cell.getBoundingClientRect();
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top - 8}px`;
          tooltip.style.transform = 'translate(-50%, -100%)';
          tooltip.style.opacity = '1';
          document.body.appendChild(tooltip);
        });
        
        cell.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
          setTimeout(() => {
            if (tooltip.parentNode === document.body) {
              document.body.removeChild(tooltip);
            }
          }, 200);
        });
        
        weekColumn.appendChild(cell);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weekColumnsContainer.appendChild(weekColumn);
    }
    
    heatmapGrid.appendChild(weekColumnsContainer);
    
    let lastLabelWeek = -2;
    Object.entries(monthPositions).forEach(([week, month]) => {
      const weekNum = parseInt(week);
      if (weekNum - lastLabelWeek >= 2) {
        const label = document.createElement('div');
        label.textContent = months[month];
        label.style.gridColumn = `${weekNum + 1} / span 3`;
        monthLabels.appendChild(label);
        lastLabelWeek = weekNum;
      }
    });
    
    totalWorkoutsEl.textContent = `${totalWorkouts} sessions in the last 3 months`;
  };

  return (
    <div className="bg-card border rounded-2xl p-6 overflow-x-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold">Workout Activity</h3>
        <div className="text-sm text-muted-foreground">
          <span id="total-workouts">0 workouts in the last 3 months</span>
        </div>
      </div>
      <div className="relative min-w-[350px] flex-1 flex flex-col justify-center">
        <div className="flex">
          <div className="w-8 mr-2">
            <div className="h-4 mb-2"></div>
            <div className="grid grid-rows-7 gap-[2px] text-xs text-muted-foreground">
              <div></div>
              <div>Mon</div>
              <div></div>
              <div>Wed</div>
              <div></div>
              <div>Fri</div>
              <div></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-13 gap-[2px] mb-2 text-xs text-muted-foreground" id="month-labels">
            </div>
            <div className="grid grid-cols-13 gap-[2px] text-xs" id="heatmap-grid">
            </div>
            <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
              <span className="mr-2">Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-100 dark:bg-green-900/40"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-800/60"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-300 dark:bg-green-700/80"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-600"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500 dark:bg-green-500"></div>
              </div>
              <span className="ml-2">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutActivity;