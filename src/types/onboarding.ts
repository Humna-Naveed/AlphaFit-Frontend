export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'maintain_weight'
  | 'improve_fitness'
  | 'increase_strength';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutPreference =
  | 'strength_training'
  | 'cardio'
  | 'hiit'
  | 'yoga'
  | 'flexibility'
  | 'home_workouts'
  | 'gym_workouts';

export type WorkoutFrequency = 'one_two' | 'three_four' | 'five_six' | 'every_day';

export interface OnboardingData {
  fullName: string;
  age: string;
  gender: Gender | null;
  heightCm: string;
  weightKg: string;
  fitnessGoal: FitnessGoal | null;
  fitnessLevel: FitnessLevel | null;
  workoutPreferences: WorkoutPreference[];
  workoutFrequency: WorkoutFrequency | null;
}

export const initialOnboardingData: OnboardingData = {
  fullName: '',
  age: '',
  gender: null,
  heightCm: '',
  weightKg: '',
  fitnessGoal: null,
  fitnessLevel: null,
  workoutPreferences: [],
  workoutFrequency: null,
};

export interface ProfilePayload {
  fullName: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  workoutPreferences: WorkoutPreference[];
  workoutFrequency: WorkoutFrequency;
  onboardingCompleted: boolean;
}

export const genderLabels: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

export const goalLabels: Record<FitnessGoal, string> = {
  lose_weight: 'Lose weight',
  build_muscle: 'Build muscle',
  maintain_weight: 'Maintain weight',
  improve_fitness: 'Improve fitness',
  increase_strength: 'Increase strength',
};

export const fitnessLevelLabels: Record<FitnessLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const workoutPreferenceLabels: Record<WorkoutPreference, string> = {
  strength_training: 'Strength training',
  cardio: 'Cardio',
  hiit: 'HIIT',
  yoga: 'Yoga',
  flexibility: 'Flexibility',
  home_workouts: 'Home workouts',
  gym_workouts: 'Gym workouts',
};

export const workoutFrequencyLabels: Record<WorkoutFrequency, string> = {
  one_two: '1-2 days',
  three_four: '3-4 days',
  five_six: '5-6 days',
  every_day: 'Every day',
};
