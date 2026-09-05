import type { OnboardingData, ProfilePayload } from '@/types/onboarding';

export interface ProfileSaveResult {
  syncedToSupabase: boolean;
}

export class ProfileServiceUnavailableError extends Error {
  constructor() {
    super('Profile service is not configured.');
    this.name = 'ProfileServiceUnavailableError';
  }
}

export function toProfilePayload(data: OnboardingData): ProfilePayload {
  if (
    !data.gender ||
    !data.fitnessGoal ||
    !data.fitnessLevel ||
    !data.workoutFrequency ||
    data.workoutPreferences.length === 0
  ) {
    throw new Error('Incomplete onboarding data.');
  }

  return {
    fullName: data.fullName.trim(),
    age: Number(data.age),
    gender: data.gender,
    heightCm: Number(data.heightCm),
    weightKg: Number(data.weightKg),
    fitnessGoal: data.fitnessGoal,
    fitnessLevel: data.fitnessLevel,
    workoutPreferences: data.workoutPreferences,
    workoutFrequency: data.workoutFrequency,
    onboardingCompleted: true,
  };
}

export async function saveProfile(data: OnboardingData): Promise<ProfileSaveResult> {
  toProfilePayload(data);

  // The repository currently has no Supabase client or authenticated user context.
  // This typed boundary is ready for the existing client when it is added.
  return { syncedToSupabase: false };
}
