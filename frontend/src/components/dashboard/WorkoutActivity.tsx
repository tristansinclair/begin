'use client';
import React, { useEffect } from 'react';

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
    
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const startDate = new Date(threeMonthsAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weekdayLabelsContainer = document.createElement('div');
    weekdayLabelsContainer.className = 'grid grid-rows-7 gap-[3px] pr-1';
    const weekdays = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    weekdays.forEach(day => {
      const label = document.createElement('div');
      label.className = 'text-muted-foreground h-2.5 flex items-center text-xs';
      label.textContent = day;
      weekdayLabelsContainer.appendChild(label);
    });
    heatmapGrid.appendChild(weekdayLabelsContainer);
    
    const workoutData: { [key: string]: number } = {};
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
        cell.className = 'w-2.5 h-2.5 rounded-sm cursor-pointer hover:outline hover:outline-1 hover:outline-border relative';
        
        if (currentDate <= today && currentDate >= threeMonthsAgo) {
          const dateKey = currentDate.toISOString().split('T')[0];
          const random = Math.random();
          let workouts = 0;
          
          if (random > 0.25) {
            if (random > 0.9) workouts = 3;
            else if (random > 0.7) workouts = 2;
            else workouts = 1;
          }
          
          workoutData[dateKey] = workouts;
          totalWorkouts += workouts;
          
          const level = Math.min(workouts, 4);
          if (level === 0) cell.classList.add('bg-muted');
          else if (level === 1) cell.classList.add('bg-primary/20');
          else if (level === 2) cell.classList.add('bg-primary/40');
          else if (level === 3) cell.classList.add('bg-primary/60');
          else cell.classList.add('bg-primary');
          
          const dateStr = currentDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          cell.title = `${workouts} workout${workouts !== 1 ? 's' : ''} on ${dateStr}`;
        } else {
          cell.style.visibility = 'hidden';
        }
        
        if (day === 0 && currentDate.getMonth() !== currentMonth) {
          currentMonth = currentDate.getMonth();
          monthPositions[week] = currentMonth;
        }
        
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
    
    totalWorkoutsEl.textContent = `${totalWorkouts} sessions`;
  };

  return (
    <div className="bg-card border rounded-2xl p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold">Workout Activity</h3>
        <div className="text-sm text-muted-foreground">
          <span id="total-workouts">0 workouts in the last 3 months</span>
        </div>
      </div>
      <div className="relative min-w-[350px]">
        <div className="grid grid-cols-12 gap-[3px] mb-2 pl-10 text-xs text-muted-foreground" id="month-labels">
        </div>
        <div className="grid grid-cols-[auto_repeat(13,_1fr)] gap-[3px] text-xs" id="heatmap-grid">
        </div>
      </div>
    </div>
  );
};

export default WorkoutActivity;