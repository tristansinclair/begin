'use client';
import React, { useEffect } from 'react';
import { userProfile } from '../../data/userProfile';

const WorkoutActivity = () => {
  useEffect(() => {
    generateHeatmap();
  }, []);

  const generateHeatmap = () => {
    const heatmapGrid = document.getElementById('heatmap-grid');
    const monthLabels = document.getElementById('month-labels');
    const totalWorkoutsEl = document.getElementById('total-workouts');
    
    if (!heatmapGrid || !monthLabels || !totalWorkoutsEl) return;
    
    heatmapGrid.innerHTML = '';
    monthLabels.innerHTML = '';
    
    // Create workout data lookup from userProfile
    const workoutLookup: { [key: string]: { workoutType: string; duration: number; calories: number; workouts: number } } = {};
    userProfile.workoutHistory.forEach(workout => {
      workoutLookup[workout.date] = {
        workoutType: workout.workoutType,
        duration: workout.duration,
        calories: workout.calories,
        workouts: workout.workouts
      };
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
      weekColumn.className = 'grid grid-rows-7 gap-[3px]';
      
      for (let day = 0; day < 7; day++) {
        const cell = document.createElement('div');
        cell.className = 'w-2.5 h-2.5 rounded-sm cursor-pointer hover:outline hover:outline-1 hover:outline-border relative group';
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap';
        tooltip.style.zIndex = '9999';
        
        if (currentDate <= today && currentDate >= threeMonthsAgo) {
          const dateKey = currentDate.toISOString().split('T')[0];
          const workoutData = workoutLookup[dateKey];
          
          let workouts = 0;
          let workoutType = '';
          let duration = 0;
          let calories = 0;
          
          if (workoutData) {
            workouts = workoutData.workouts;
            workoutType = workoutData.workoutType;
            duration = workoutData.duration;
            calories = workoutData.calories;
            totalWorkouts += workouts;
          }
          
          // Color based on calories burned
          let level = 0;
          if (calories === 0) level = 0;
          else if (calories <= 200) level = 1;
          else if (calories <= 400) level = 2;
          else if (calories <= 600) level = 3;
          else if (calories <= 800) level = 4;
          else level = 5;
          
          if (level === 0) cell.classList.add('bg-muted');
          else if (level === 1) cell.classList.add('bg-primary/10');
          else if (level === 2) cell.classList.add('bg-primary/25');
          else if (level === 3) cell.classList.add('bg-primary/50');
          else if (level === 4) cell.classList.add('bg-primary/75');
          else cell.classList.add('bg-primary');
          
          const dateStr = currentDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          if (workouts === 0) {
            tooltip.textContent = `No workout on ${dateStr}`;
          } else {
            tooltip.innerHTML = `<div><strong>${workoutType}</strong></div><div>${dateStr}</div><div>Duration: ${duration} min</div><div>Calories: ${calories}</div>`;
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
        cell.addEventListener('mouseenter', (e) => {
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
        <div className="grid grid-cols-12 gap-[3px] mb-2 text-xs text-muted-foreground" id="month-labels">
        </div>
        <div className="grid grid-cols-13 gap-[3px] text-xs" id="heatmap-grid">
        </div>
      </div>
    </div>
  );
};

export default WorkoutActivity;