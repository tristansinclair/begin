export interface ExperienceLevel {
  level: number;
  title: string;
  description: string;
  emoji: string;
}

export const experienceLevels: ExperienceLevel[] = [
  {
    level: 1,
    title: "Fresh Start Champion",
    description: "Every legend begins with a single step! You're building the foundation of greatness.",
    emoji: "🌱"
  },
  {
    level: 2,
    title: "Momentum Builder",
    description: "You're gaining steam! Each workout is making you stronger than yesterday.",
    emoji: "⚡"
  },
  {
    level: 3,
    title: "Consistency Warrior",
    description: "You're developing the habits that separate winners from dreamers!",
    emoji: "🔥"
  },
  {
    level: 4,
    title: "Rising Star",
    description: "Your dedication is showing! People are starting to notice your transformation.",
    emoji: "⭐"
  },
  {
    level: 5,
    title: "Steady Crusher",
    description: "You're in the groove! Your body is adapting and getting stronger every week.",
    emoji: "💪"
  },
  {
    level: 6,
    title: "Strength Seeker",
    description: "You know your way around the gym and you're pushing real weight!",
    emoji: "🏋️"
  },
  {
    level: 7,
    title: "Technique Master",
    description: "Your form is dialed in and you're lifting with purpose and precision.",
    emoji: "🎯"
  },
  {
    level: 8,
    title: "Iron Veteran",
    description: "You're an inspiration to others! Your experience shows in every rep.",
    emoji: "🔱"
  },
  {
    level: 9,
    title: "Beast Mode Unlocked",
    description: "You're operating at an elite level! Most people can only dream of your strength.",
    emoji: "🦁"
  },
  {
    level: 10,
    title: "Legendary Force",
    description: "You've reached the pinnacle! You're a true athlete and fitness inspiration.",
    emoji: "👑"
  }
];

export const getExperienceLevel = (level: number): ExperienceLevel => {
  const clampedLevel = Math.max(1, Math.min(10, Math.round(level)));
  return experienceLevels[clampedLevel - 1];
};

export const getExperienceLevelDisplay = (level: number): string => {
  const experienceLevel = getExperienceLevel(level);
  return `${experienceLevel.emoji} ${experienceLevel.title}`;
};