import type { OnboardingData } from '@/types/onboarding';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function validateStep(step: OnboardingStep, data: OnboardingData): string | null {
  if (step === 1) {
    const name = data.fullName.trim();
    const age = Number(data.age);

    if (name.length < 2) return 'Enter your full name.';
    if (name.length > 80) return 'Your name must be 80 characters or fewer.';
    if (!/^\d+$/.test(data.age) || age < 13 || age > 100) {
      return 'Enter an age between 13 and 100.';
    }
    if (!data.gender) return 'Select an option for gender.';
  }

  if (step === 2) {
    const height = Number(data.heightCm);
    const weight = Number(data.weightKg);

    if (!data.heightCm || !Number.isFinite(height) || height < 100 || height > 250) {
      return 'Enter a height between 100 and 250 cm.';
    }
    if (!data.weightKg || !Number.isFinite(weight) || weight < 25 || weight > 350) {
      return 'Enter a weight between 25 and 350 kg.';
    }
  }

  if (step === 3 && !data.fitnessGoal) return 'Choose your primary fitness goal.';
  if (step === 4 && !data.fitnessLevel) return 'Choose your fitness level.';
  if (step === 5 && data.workoutPreferences.length === 0) {
    return 'Choose at least one workout preference.';
  }
  if (step === 6 && !data.workoutFrequency) return 'Choose how often you want to train.';

  return null;
}

export function validateAllSteps(data: OnboardingData): string | null {
  for (const step of [1, 2, 3, 4, 5, 6] as const) {
    const error = validateStep(step, data);
    if (error) return error;
  }
  return null;
}
