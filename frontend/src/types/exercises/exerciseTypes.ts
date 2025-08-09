export interface ExerciseType {
  id: string;
  name: string;
  icon: string;
  description: string;
  equipment?: ExerciseEquipment[];
  preferences?: ExercisePreference[];
}

export interface ExercisePreference {
  id: string;
  label: string;
  type: 'single' | 'multiple' | 'text';
  options?: PreferenceOption[];
  required?: boolean;
  description?: string;
}

export interface PreferenceOption {
  id: string;
  label: string;
  icon?: string;
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
      { id: 'squat_rack', name: 'Squat Rack/Power Rack', icon: '🏗️' },
      { id: 'barbells', name: 'Barbells', icon: '⚖️' },
      { id: 'drop_area', name: 'Drop Area (for Cleans/Deadlifts)', icon: '🎯' },
      { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️' },
      { id: 'kettlebells', name: 'Kettlebells', icon: '⛳' },
      { id: 'resistance_bands', name: 'Resistance Bands', icon: '🔗' },
      { id: 'cables', name: 'Cable Machine', icon: '🔌' },
      { id: 'bench', name: 'Weight Bench', icon: '🪑' }
    ],
    preferences: [
      {
        id: 'training_focus',
        label: 'Training Focus',
        type: 'single',
        required: true,
        options: [
          { id: 'strength', label: 'Strength (Heavy, Low Reps)', icon: '💪' },
          { id: 'hypertrophy', label: 'Muscle Building (Moderate Weight)', icon: '🏋️' },
          { id: 'endurance', label: 'Muscular Endurance (Light, High Reps)', icon: '⚡' }
        ]
      }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: '⚡',
    description: 'High-Intensity Interval Training combines short bursts of intense exercise with periods of rest. Burns calories efficiently and improves both strength and cardio.',
    equipment: [
      { id: 'treadmill', name: 'Treadmill', icon: '🏃' },
      { id: 'stationary_bike', name: 'Stationary Bike', icon: '🚴' },
      { id: 'rowing_machine', name: 'Rowing Machine', icon: '🚣' },
      { id: 'elliptical', name: 'Elliptical', icon: '🏃' },
      { id: 'kettlebells', name: 'Kettlebells', icon: '⛳' },
      { id: 'battle_ropes', name: 'Battle Ropes', icon: '🔗' },
      { id: 'plyometric_box', name: 'Plyo Box', icon: '📦' },
      { id: 'medicine_ball', name: 'Medicine Ball', icon: '⚽' },
      { id: 'agility_ladder', name: 'Agility Ladder', icon: '🪜' },
      { id: 'burpee_space', name: 'Open Floor Space', icon: '🔳' }
    ],
    preferences: [
      {
        id: 'hiit_style',
        label: 'HIIT Style Preference',
        type: 'single',
        required: true,
        options: [
          { id: 'cardio_focused', label: 'Cardio-Focused HIIT', icon: '❤️' },
          { id: 'strength_focused', label: 'Strength-Focused HIIT', icon: '💪' },
          { id: 'mixed', label: 'Mixed Cardio + Strength', icon: '⚡' }
        ]
      }
    ]
  },
  {
    id: 'running',
    name: 'Running',
    icon: '🏃',
    description: 'Outdoor and indoor running for cardiovascular fitness and endurance. From casual jogging to marathon training, running is accessible and effective for all fitness levels.',
    equipment: [
      { id: 'treadmill', name: 'Treadmill', icon: '🏃' },
      { id: 'outdoor_space', name: 'Outdoor Running Space', icon: '🌳' }
    ],
    preferences: [
      {
        id: 'running_location',
        label: 'Where do you prefer to run?',
        type: 'multiple',
        required: true,
        options: [
          { id: 'treadmill', label: 'Treadmill/Indoor', icon: '🏃' },
          { id: 'outdoors', label: 'Outdoors', icon: '🌳' }
        ]
      }
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
    ],
    preferences: [
      {
        id: 'yoga_practice',
        label: 'How do you practice yoga?',
        type: 'single',
        required: true,
        options: [
          { id: 'solo_home', label: 'Solo Practice at Home', icon: '🏠' },
          { id: 'studio_classes', label: 'Studio Classes', icon: '🧘‍♀️' },
          { id: 'both', label: 'Both Home & Studio', icon: '🔄' }
        ]
      },
      {
        id: 'yoga_style',
        label: 'Preferred Yoga Style',
        type: 'single',
        options: [
          { id: 'vinyasa', label: 'Vinyasa (Flow)', icon: '🌊' },
          { id: 'hatha', label: 'Hatha (Slower)', icon: '🐌' },
          { id: 'power', label: 'Power Yoga', icon: '💪' },
          { id: 'restorative', label: 'Restorative', icon: '😌' },
          { id: 'any', label: 'Any Style', icon: '🔄' }
        ]
      }
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
    ],
    preferences: [
      {
        id: 'biking_location',
        label: 'Where do you prefer to bike?',
        type: 'multiple',
        required: true,
        options: [
          { id: 'indoor', label: 'Indoor (Stationary/Trainer)', icon: '🏠' },
          { id: 'outdoor', label: 'Outdoor Cycling', icon: '🌳' }
        ]
      }
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
    ],
    preferences: [
      {
        id: 'swimming_style',
        label: 'What type of swimming do you prefer?',
        type: 'single',
        required: true,
        options: [
          { id: 'pool_laps', label: 'Pool Laps (Structured)', icon: '🏊' },
          { id: 'open_water', label: 'Open Water/Ocean', icon: '🌊' },
          { id: 'both', label: 'Both Pool & Open Water', icon: '🔄' }
        ]
      },
      {
        id: 'swimming_focus',
        label: 'Swimming Focus',
        type: 'single',
        options: [
          { id: 'technique', label: 'Technique & Form', icon: '🎯' },
          { id: 'distance', label: 'Distance/Endurance', icon: '🏃' },
          { id: 'speed', label: 'Speed/Intervals', icon: '⚡' },
          { id: 'recreation', label: 'Recreational/Fun', icon: '😊' }
        ]
      }
    ]
  },
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