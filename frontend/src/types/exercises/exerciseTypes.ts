export interface ExerciseType {
  id: string;
  name: string;
  icon: string;
  description: string;
  equipment?: ExerciseEquipment[];
}

export interface ExerciseEquipment {
  id: string;
  name: string;
  icon: string;
}

export const exerciseTypes: ExerciseType[] = [
  {
    id: 'weightlifting',
    name: 'Weightlifting',
    icon: '🏋🏼‍♂️',
    description: 'Traditional weightlifting with dumbbells, barbells, and weight plates. Focus on compound movements like squats, deadlifts, and bench press to build strength and muscle mass.',
    equipment: [
      { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️' },
      { id: 'barbells', name: 'Barbells', icon: '⚖️' },
      { id: 'power_rack', name: 'Power Rack/Squat Rack', icon: '🏗️' },
      { id: 'bench', name: 'Weight Bench', icon: '🪑' }
    ]
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: '🔥',
    description: 'Cardiovascular training to improve heart health and endurance. Includes steady-state cardio and interval training using various machines and equipment.',
    equipment: [
      { id: 'treadmill', name: 'Treadmill', icon: '🏃' },
      { id: 'elliptical', name: 'Elliptical Machine', icon: '⚪' },
      { id: 'stationary_bike', name: 'Stationary Bike', icon: '🚴' },
      { id: 'rowing_machine', name: 'Rowing Machine', icon: '🚣' },
      { id: 'stair_climber', name: 'Stair Climber', icon: '🪶' }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: '⚡',
    description: 'High-Intensity Interval Training combines short bursts of intense exercise with periods of rest. Burns calories efficiently and improves both strength and cardio.',
    equipment: [
      { id: 'kettlebells', name: 'Kettlebells', icon: '⛳' },
      { id: 'battle_ropes', name: 'Battle Ropes', icon: '🔗' },
      { id: 'plyometric_box', name: 'Plyo Box', icon: '📦' },
      { id: 'medicine_ball', name: 'Medicine Ball', icon: '⚽' },
      { id: 'agility_ladder', name: 'Agility Ladder', icon: '🪜' }
    ]
  },
  {
    id: 'running',
    name: 'Running',
    icon: '🏃',
    description: 'Outdoor and indoor running for cardiovascular fitness and endurance. From casual jogging to marathon training, running is accessible and effective for all fitness levels.',
    equipment: [
      { id: 'running_shoes', name: 'Running Shoes', icon: '👟' },
      { id: 'treadmill', name: 'Treadmill', icon: '🏃' },
      { id: 'outdoor_space', name: 'Outdoor Running Space', icon: '🌳' }
    ]
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: '🚶',
    description: 'Low-impact exercise perfect for beginners or active recovery. Walking improves cardiovascular health, aids in weight management, and can be done anywhere.',
    equipment: [
      { id: 'walking_shoes', name: 'Walking Shoes', icon: '👟' },
      { id: 'outdoor_space', name: 'Walking Area/Trails', icon: '🌳' },
      { id: 'treadmill', name: 'Treadmill (optional)', icon: '🏃' }
    ]
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘',
    description: 'Ancient practice combining physical postures, breathing techniques, and meditation. Improves flexibility, balance, strength, and mental well-being through mindful movement.',
    equipment: [
      { id: 'yoga_mat', name: 'Yoga Mat', icon: '🧘' },
      { id: 'yoga_blocks', name: 'Yoga Blocks', icon: '🧱' },
      { id: 'yoga_strap', name: 'Yoga Strap', icon: '🔗' },
      { id: 'bolster', name: 'Yoga Bolster', icon: '🚯' }
    ]
  },
  {
    id: 'biking',
    name: 'Biking',
    icon: '🚴',
    description: 'Cycling for cardiovascular fitness and leg strength. Whether outdoor cycling or indoor spinning, biking is a low-impact way to build endurance and burn calories.',
    equipment: [
      { id: 'bicycle', name: 'Bicycle', icon: '🚴' },
      { id: 'stationary_bike', name: 'Stationary Bike', icon: '🚴' },
      { id: 'bike_trainer', name: 'Indoor Bike Trainer', icon: '🔗' }
    ]
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: '🏊',
    description: 'Full-body, low-impact exercise that builds cardiovascular endurance and muscle strength. Swimming works all major muscle groups while being gentle on joints.',
    equipment: [
      { id: 'pool_access', name: 'Pool Access', icon: '🏊' },
      { id: 'swim_gear', name: 'Swimming Gear', icon: '🥽' }
    ]
  },
  {
    id: 'pilates',
    name: 'Pilates',
    icon: '🤸',
    description: 'Low-impact exercise focusing on core strength, flexibility, and body awareness. Pilates uses controlled movements to improve posture, balance, and muscle tone.',
    equipment: [
      { id: 'pilates_mat', name: 'Pilates Mat', icon: '🧘' },
      { id: 'pilates_ball', name: 'Pilates Ball', icon: '⚽' },
      { id: 'resistance_bands', name: 'Resistance Bands', icon: '🎯' },
      { id: 'pilates_reformer', name: 'Pilates Reformer', icon: '🏭' }
    ]
  },
  {
    id: 'stretching',
    name: 'Stretching',
    icon: '🤲',
    description: 'Essential for flexibility, mobility, and injury prevention. Static and dynamic stretching routines help maintain range of motion and aid in muscle recovery.',
    equipment: [
      { id: 'yoga_mat', name: 'Exercise Mat', icon: '🧘' },
      { id: 'foam_roller', name: 'Foam Roller', icon: '🌯' },
      { id: 'massage_ball', name: 'Massage Ball', icon: '⚽' },
      { id: 'stretching_strap', name: 'Stretching Strap', icon: '🔗' }
    ]
  }
];

// Helper functions
export const getExerciseTypeById = (id: string): ExerciseType | undefined => {
  return exerciseTypes.find(type => type.id === id);
};

export const getExerciseTypesByIds = (ids: string[]): ExerciseType[] => {
  return ids.map(id => getExerciseTypeById(id)).filter(Boolean) as ExerciseType[];
};

export const getEquipmentForExerciseType = (exerciseTypeId: string): ExerciseEquipment[] => {
  const exerciseType = getExerciseTypeById(exerciseTypeId);
  return exerciseType?.equipment || [];
};

export const getAllEquipmentForExerciseTypes = (exerciseTypeIds: string[]): { [exerciseId: string]: ExerciseEquipment[] } => {
  const equipment: { [exerciseId: string]: ExerciseEquipment[] } = {};
  exerciseTypeIds.forEach(id => {
    const equipmentList = getEquipmentForExerciseType(id);
    if (equipmentList.length > 0) {
      equipment[id] = equipmentList;
    }
  });
  return equipment;
};