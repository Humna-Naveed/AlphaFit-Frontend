import type { FitnessGoal, FitnessLevel, WorkoutPreference } from '@/types/onboarding';

/**
 * Rule-based recommendation logic for AlphaFit.
 *
 * This file intentionally has no Supabase dependency: it ranks rows already
 * fetched by a caller, so the rules can be unit-tested independently.
 * Database field names match public.workout_templates and public.meals.
 */

export type DatabaseFitnessGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'general_fitness';

export interface RecommendationProfile {
  fitness_goal: DatabaseFitnessGoal | null;
  fitness_level: FitnessLevel | null;
  equipment: string[] | null;
  diet_preference: 'any' | 'vegetarian' | 'halal' | 'vegan' | null;
  disliked_foods?: string[] | null;
}

export interface WorkoutCandidate {
  id: string;
  title: string;
  description?: string | null;
  goal: DatabaseFitnessGoal | null;
  difficulty: FitnessLevel | null;
  duration_min: number | null;
  equipment: string[] | null;
  tags: string[] | null;
}

export interface MealCandidate {
  id: string;
  title: string;
  kcal: number | null;
  protein_g: number | null;
  diet_tags: string[] | null;
  allergens: string[] | null;
  meal_types: string[] | null;
  recommendation_tags: string[] | null;
  /** Ingredient names should be supplied when the caller fetches meal_ingredients. */
  ingredients?: string[] | null;
}

export interface RankedRecommendation<T> {
  item: T;
  score: number;
  reasons: string[];
}

export type WorkoutRecommendationOptions = {
  availableMinutes?: number | null;
  preferences?: WorkoutPreference[];
  limit?: number;
};

export type MealRecommendationOptions = {
  /** User-confirmed allergies; never infer allergies from a fitness goal. */
  allergies?: string[];
  limit?: number;
};

const GOAL_MAP: Record<FitnessGoal, DatabaseFitnessGoal> = {
  lose_weight: 'weight_loss',
  build_muscle: 'muscle_gain',
  maintain_weight: 'general_fitness',
  improve_fitness: 'general_fitness',
  increase_strength: 'muscle_gain',
};

const PREFERENCE_TAGS: Record<WorkoutPreference, string[]> = {
  strength_training: ['strength', 'strength_training', 'weights'],
  cardio: ['cardio', 'endurance'],
  hiit: ['hiit', 'high_intensity'],
  yoga: ['yoga', 'mobility', 'flexibility'],
  flexibility: ['flexibility', 'stretch', 'mobility', 'recovery'],
  home_workouts: ['home', 'no_equipment', 'bodyweight'],
  gym_workouts: ['gym', 'machine', 'barbell', 'dumbbells'],
};

const normalize = (value: string): string => value.trim().toLowerCase();

const uniqueStrings = (values: Array<string | null | undefined>): string[] =>
  [...new Set(values.filter((value): value is string => Boolean(value)).map(normalize))];

function equipmentMatches(
  requiredEquipment: string[] | null,
  userEquipment: string[] | null,
): boolean {
  const required = uniqueStrings(requiredEquipment ?? []);
  const available = uniqueStrings(userEquipment ?? []);

  // Missing equipment metadata is not enough evidence to reject a workout.
  if (required.length === 0) return true;
  if (required.includes('none') || required.includes('bodyweight')) return true;
  if (available.includes('any')) return true;
  if (available.length === 0 || available.includes('none')) return false;

  return required.some((item) => available.includes(item));
}

export function rankWorkoutRecommendations(
  profile: RecommendationProfile,
  candidates: WorkoutCandidate[],
  options: WorkoutRecommendationOptions = {},
): RankedRecommendation<WorkoutCandidate>[] {
  if (!profile.fitness_goal || !profile.fitness_level) return [];

  const targetGoal = profile.fitness_goal;
  const targetLevel = profile.fitness_level;
  const availableMinutes = options.availableMinutes;
  const preferences = options.preferences ?? [];
  const preferredTags = uniqueStrings(preferences.flatMap((preference) => PREFERENCE_TAGS[preference]));

  return candidates
    .filter((workout) => {
      if (
        typeof availableMinutes === 'number' &&
        availableMinutes > 0 &&
        typeof workout.duration_min === 'number' &&
        workout.duration_min > availableMinutes
      ) {
        return false;
      }
      return equipmentMatches(workout.equipment, profile.equipment);
    })
    .map((workout) => {
      let score = 0;
      const reasons: string[] = [];
      const tags = uniqueStrings(workout.tags ?? []);

      if (workout.goal === targetGoal) {
        score += 40;
        reasons.push('Matches your fitness goal');
      }
      if (workout.difficulty === targetLevel) {
        score += 30;
        reasons.push('Matches your fitness level');
      } else if (
        workout.difficulty &&
        ['beginner', 'intermediate', 'advanced'].indexOf(workout.difficulty) >= 0 &&
        ['beginner', 'intermediate', 'advanced'].indexOf(workout.difficulty) <
          ['beginner', 'intermediate', 'advanced'].indexOf(targetLevel)
      ) {
        score += 12;
        reasons.push('Uses a lower-intensity level');
      }
      if (preferredTags.some((tag) => tags.includes(tag))) {
        score += 20;
        reasons.push('Matches your workout preferences');
      }
      if (typeof availableMinutes === 'number' && workout.duration_min != null) {
        score += 10;
        reasons.push('Fits your available time');
      }
      if (score === 0) reasons.push('Available option that passed your equipment and time filters');

      return { item: workout, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, Math.max(0, options.limit ?? 5));
}

export function rankMealRecommendations(
  profile: RecommendationProfile,
  candidates: MealCandidate[],
  options: MealRecommendationOptions = {},
): RankedRecommendation<MealCandidate>[] {
  const dietPreference = profile.diet_preference ?? 'any';
  const blockedAllergens = uniqueStrings(options.allergies ?? []);
  const dislikedFoods = uniqueStrings(profile.disliked_foods ?? []);

  return candidates
    .filter((meal) => {
      const dietTags = uniqueStrings(meal.diet_tags ?? []);
      const allergens = uniqueStrings(meal.allergens ?? []);
      const ingredients = uniqueStrings(meal.ingredients ?? []);
      const searchableFoods = uniqueStrings([meal.title, ...ingredients]);

      // Allergy and explicit dietary requirements are hard filters, not scores.
      if (blockedAllergens.some((allergen) => allergens.includes(allergen))) return false;
      if (dislikedFoods.some((food) => searchableFoods.some((item) => item.includes(food)))) return false;

      if (dietPreference === 'vegetarian' && !dietTags.some((tag) => ['vegetarian', 'vegan'].includes(tag))) {
        return false;
      }
      if (dietPreference === 'vegan' && !dietTags.includes('vegan')) return false;

      // Never infer that a meal is halal. Require an explicit catalogue tag.
      if (dietPreference === 'halal' && !dietTags.includes('halal')) return false;

      return true;
    })
    .map((meal) => {
      let score = 0;
      const reasons: string[] = [];
      const tags = uniqueStrings(meal.recommendation_tags ?? []);
      const goal = profile.fitness_goal;

      if (dietPreference !== 'any') {
        score += 30;
        reasons.push(`Matches your ${dietPreference} dietary preference`);
      }
      if (goal === 'muscle_gain' && typeof meal.protein_g === 'number' && tags.includes('high_protein')) {
        score += 30;
        reasons.push('Tagged high-protein in the meal catalogue');
      } else if (goal === 'weight_loss' && tags.includes('balanced')) {
        score += 20;
        reasons.push('Tagged balanced in the meal catalogue');
      } else if (goal === 'endurance' && tags.includes('energy_dense')) {
        score += 15;
        reasons.push('Tagged energy-dense in the meal catalogue');
      }
      if (typeof meal.protein_g === 'number') {
        reasons.push('Protein value is available in the meal catalogue');
      }
      if (typeof meal.kcal === 'number') {
        reasons.push('Calorie value is available in the meal catalogue');
      }
      if (score === 0) reasons.push('Meets the available dietary filters');

      return { item: meal, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, Math.max(0, options.limit ?? 5));
}

/** Maps the current onboarding goal vocabulary to the database constraint values. */
export function mapOnboardingGoalToDatabaseGoal(
  goal: FitnessGoal | null | undefined,
): DatabaseFitnessGoal | null {
  return goal ? GOAL_MAP[goal] : null;
}
