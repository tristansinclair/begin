export interface PersonalRecord {
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume';
  previousValue: number;
  newValue: number;
  date: string;
}

export interface ExerciseHistory {
  exerciseName: string;
  sessions: {
    date: string;
    sets: {
      reps: number;
      weight?: number;
    }[];
  }[];
}

// Simple PR detection - in a real app this would query a database
export const detectPersonalRecords = (
  exerciseName: string,
  newSets: { reps: number; weight?: number }[],
  exerciseHistory: ExerciseHistory[]
): PersonalRecord[] => {
  const records: PersonalRecord[] = [];
  const history = exerciseHistory.find(h => h.exerciseName === exerciseName);
  
  if (!history || history.sessions.length === 0) {
    // First time doing this exercise - everything is a PR!
    const maxWeight = Math.max(...newSets.map(s => s.weight || 0));
    const maxReps = Math.max(...newSets.map(s => s.reps));
    const totalVolume = newSets.reduce((sum, s) => sum + s.reps * (s.weight || 0), 0);
    
    if (maxWeight > 0) {
      records.push({
        exerciseName,
        type: 'weight',
        previousValue: 0,
        newValue: maxWeight,
        date: new Date().toISOString()
      });
    }
    
    if (maxReps > 0) {
      records.push({
        exerciseName,
        type: 'reps',
        previousValue: 0,
        newValue: maxReps,
        date: new Date().toISOString()
      });
    }
    
    if (totalVolume > 0) {
      records.push({
        exerciseName,
        type: 'volume',
        previousValue: 0,
        newValue: totalVolume,
        date: new Date().toISOString()
      });
    }
    
    return records;
  }
  
  // Calculate historical bests
  const allHistoricalSets = history.sessions.flatMap(s => s.sets);
  const historicalMaxWeight = Math.max(...allHistoricalSets.map(s => s.weight || 0));
  const historicalMaxReps = Math.max(...allHistoricalSets.map(s => s.reps));
  const historicalMaxVolume = Math.max(
    ...history.sessions.map(session => 
      session.sets.reduce((sum, s) => sum + s.reps * (s.weight || 0), 0)
    )
  );
  
  // Check for new records
  const newMaxWeight = Math.max(...newSets.map(s => s.weight || 0));
  const newMaxReps = Math.max(...newSets.map(s => s.reps));
  const newTotalVolume = newSets.reduce((sum, s) => sum + s.reps * (s.weight || 0), 0);
  
  if (newMaxWeight > historicalMaxWeight) {
    records.push({
      exerciseName,
      type: 'weight',
      previousValue: historicalMaxWeight,
      newValue: newMaxWeight,
      date: new Date().toISOString()
    });
  }
  
  if (newMaxReps > historicalMaxReps) {
    records.push({
      exerciseName,
      type: 'reps',
      previousValue: historicalMaxReps,
      newValue: newMaxReps,
      date: new Date().toISOString()
    });
  }
  
  if (newTotalVolume > historicalMaxVolume) {
    records.push({
      exerciseName,
      type: 'volume',
      previousValue: historicalMaxVolume,
      newValue: newTotalVolume,
      date: new Date().toISOString()
    });
  }
  
  return records;
};

export const formatPersonalRecord = (record: PersonalRecord): string => {
  switch (record.type) {
    case 'weight':
      return `${record.exerciseName}: New max weight ${record.newValue}lbs (prev: ${record.previousValue}lbs)`;
    case 'reps':
      return `${record.exerciseName}: New max reps ${record.newValue} (prev: ${record.previousValue})`;
    case 'volume':
      return `${record.exerciseName}: New volume record ${Math.round(record.newValue)}lbs total (prev: ${Math.round(record.previousValue)}lbs)`;
    default:
      return `${record.exerciseName}: New personal record!`;
  }
};

// Mock exercise history for demo purposes
export const getMockExerciseHistory = (): ExerciseHistory[] => [
  {
    exerciseName: 'Bench Press',
    sessions: [
      {
        date: '2025-07-24',
        sets: [
          { reps: 8, weight: 185 },
          { reps: 6, weight: 185 },
          { reps: 5, weight: 185 }
        ]
      },
      {
        date: '2025-07-17',
        sets: [
          { reps: 10, weight: 175 },
          { reps: 8, weight: 175 },
          { reps: 6, weight: 175 }
        ]
      }
    ]
  },
  {
    exerciseName: 'Pull-ups',
    sessions: [
      {
        date: '2025-07-24',
        sets: [
          { reps: 12 },
          { reps: 10 },
          { reps: 8 }
        ]
      },
      {
        date: '2025-07-17',
        sets: [
          { reps: 10 },
          { reps: 8 },
          { reps: 6 }
        ]
      }
    ]
  },
  {
    exerciseName: 'Shoulder Press',
    sessions: [
      {
        date: '2025-07-24',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 135 },
          { reps: 6, weight: 135 }
        ]
      }
    ]
  }
];