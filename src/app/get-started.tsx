import { router } from 'expo-router';
import { useReducer, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingButton } from '@/components/onboarding-buttons';
import { OnboardingOption } from '@/components/onboarding-option';
import { OnboardingProgress } from '@/components/onboarding-progress';
import { saveProfile } from '@/services/profile-service';
import {
    fitnessLevelLabels,
    genderLabels,
    goalLabels,
    initialOnboardingData,
    workoutFrequencyLabels,
    workoutPreferenceLabels,
    type Gender,
    type OnboardingData,
    type WorkoutPreference,
} from '@/types/onboarding';
import { validateAllSteps, validateStep, type OnboardingStep } from '@/utils/onboarding-validation';

const TOTAL_STEPS = 7;
type DataAction = { type: 'update'; values: Partial<OnboardingData> };

function dataReducer(data: OnboardingData, action: DataAction): OnboardingData {
  return { ...data, ...action.values };
}

export default function GetStartedScreen() {
  const insets = useSafeAreaInsets();
  const [data, dispatch] = useReducer(dataReducer, initialOnboardingData);
  const [step, setStep] = useState<OnboardingStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(values: Partial<OnboardingData>) {
    dispatch({ type: 'update', values });
    setError(null);
    setSaveError(null);
  }

  function goBack() {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((currentStep) => (currentStep - 1) as OnboardingStep);
    setError(null);
  }

  function goNext() {
    const validationError = validateStep(step, data);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep((currentStep) => Math.min(currentStep + 1, TOTAL_STEPS) as OnboardingStep);
    setError(null);
  }

  async function completeProfile() {
    const validationError = validateAllSteps(data);
    if (validationError) {
      setStep(1);
      setError(validationError);
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(data);
      router.replace('/home');
    } catch {
      setSaveError('Something went wrong while saving your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={12} onPress={goBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.logo}>ALPHAFIT</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        <View style={styles.content}>
          {step === 1 && <BasicInformation data={data} update={update} />}
          {step === 2 && <BodyMeasurements data={data} update={update} />}
          {step === 3 && <SingleChoiceStep title="What's your main goal?" subtitle="Choose the goal you want to focus on." options={goalLabels} value={data.fitnessGoal} onSelect={(fitnessGoal) => update({ fitnessGoal })} />}
          {step === 4 && <SingleChoiceStep title="What's your fitness level?" subtitle="This helps us recommend the right intensity." options={fitnessLevelLabels} value={data.fitnessLevel} onSelect={(fitnessLevel) => update({ fitnessLevel })} />}
          {step === 5 && <PreferencesStep data={data} update={update} />}
          {step === 6 && <SingleChoiceStep title="How often do you want to train?" subtitle="Choose your preferred weekly frequency." options={workoutFrequencyLabels} value={data.workoutFrequency} onSelect={(workoutFrequency) => update({ workoutFrequency })} />}
          {step === 7 && <ReviewStep data={data} />}

          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          {saveError && <Text accessibilityRole="alert" style={styles.error}>{saveError}</Text>}
        </View>

        <View style={styles.actions}>
          {step === 7 ? (
            <OnboardingButton label="Finish setup" loading={saving} onPress={completeProfile} />
          ) : (
            <OnboardingButton label="Continue" onPress={goNext} />
          )}
          <OnboardingButton label="Back" onPress={goBack} secondary />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface StepProps {
  data: OnboardingData;
  update: (values: Partial<OnboardingData>) => void;
}

function BasicInformation({ data, update }: StepProps) {
  return (
    <>
      <StepHeading title="Let's get to know you" subtitle="Tell us a little about yourself." />
      <Field label="FULL NAME" value={data.fullName} onChangeText={(fullName) => update({ fullName })} placeholder="Your name" />
      <Field label="AGE" keyboardType="number-pad" value={data.age} onChangeText={(age) => update({ age })} placeholder="Your age" />
      <Text style={styles.fieldLabel}>GENDER</Text>
      <View style={styles.optionList}>
        {(Object.keys(genderLabels) as Gender[]).map((gender) => (
          <OnboardingOption key={gender} label={genderLabels[gender]} selected={data.gender === gender} onPress={() => update({ gender })} />
        ))}
      </View>
    </>
  );
}

function BodyMeasurements({ data, update }: StepProps) {
  return (
    <>
      <StepHeading title="Your body metrics" subtitle="These help us personalize your fitness experience." />
      <Field label="HEIGHT (CM)" keyboardType="decimal-pad" value={data.heightCm} onChangeText={(heightCm) => update({ heightCm })} placeholder="e.g. 175" />
      <Field label="WEIGHT (KG)" keyboardType="decimal-pad" value={data.weightKg} onChangeText={(weightKg) => update({ weightKg })} placeholder="e.g. 70" />
    </>
  );
}

interface SingleChoiceStepProps<T extends string> {
  title: string;
  subtitle: string;
  options: Record<T, string>;
  value: T | null;
  onSelect: (value: T) => void;
}

function SingleChoiceStep<T extends string>({ title, subtitle, options, value, onSelect }: SingleChoiceStepProps<T>) {
  return (
    <>
      <StepHeading title={title} subtitle={subtitle} />
      <View style={styles.optionList}>
        {(Object.keys(options) as T[]).map((option) => (
          <OnboardingOption key={option} label={options[option]} selected={value === option} onPress={() => onSelect(option)} />
        ))}
      </View>
    </>
  );
}

function PreferencesStep({ data, update }: StepProps) {
  function togglePreference(preference: WorkoutPreference) {
    const preferences = data.workoutPreferences.includes(preference)
      ? data.workoutPreferences.filter((item) => item !== preference)
      : [...data.workoutPreferences, preference];
    update({ workoutPreferences: preferences });
  }

  return (
    <>
      <StepHeading title="What workouts do you enjoy?" subtitle="Select all that apply." />
      <View style={styles.optionList}>
        {(Object.keys(workoutPreferenceLabels) as WorkoutPreference[]).map((preference) => (
          <OnboardingOption key={preference} label={workoutPreferenceLabels[preference]} multiSelect selected={data.workoutPreferences.includes(preference)} onPress={() => togglePreference(preference)} />
        ))}
      </View>
    </>
  );
}

function ReviewStep({ data }: { data: OnboardingData }) {
  const rows = [
    ['Name', data.fullName],
    ['Age', data.age],
    ['Gender', data.gender ? genderLabels[data.gender] : 'Not selected'],
    ['Height', `${data.heightCm} cm`],
    ['Weight', `${data.weightKg} kg`],
    ['Goal', data.fitnessGoal ? goalLabels[data.fitnessGoal] : 'Not selected'],
    ['Fitness level', data.fitnessLevel ? fitnessLevelLabels[data.fitnessLevel] : 'Not selected'],
    ['Workouts', data.workoutPreferences.map((item) => workoutPreferenceLabels[item]).join(', ') || 'Not selected'],
    ['Frequency', data.workoutFrequency ? workoutFrequencyLabels[data.workoutFrequency] : 'Not selected'],
  ];

  return (
    <>
      <StepHeading title="You're all set" subtitle="Review your information before we create your personalized experience." />
      <View style={styles.reviewCard}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{label}</Text>
            <Text style={styles.reviewValue}>{value}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
}

function Field({ label, value, placeholder, onChangeText, keyboardType = 'default' }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={keyboardType === 'default' ? 'words' : 'none'}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#63756C"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#0A0F0D', flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  backIcon: { color: '#F3F6F4', fontSize: 36, fontWeight: '300', lineHeight: 32, width: 28 },
  logo: { color: '#B7F34A', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  topBarSpacer: { width: 28 },
  content: { flex: 1, paddingTop: 34 },
  heading: { marginBottom: 28 },
  title: { color: '#F3F6F4', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#8FA39B', fontSize: 15, lineHeight: 22, marginTop: 10 },
  field: { marginBottom: 20 },
  fieldLabel: { color: '#8FA39B', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  input: { backgroundColor: '#141C19', borderColor: '#24312B', borderRadius: 14, borderWidth: 1, color: '#F3F6F4', fontSize: 16, minHeight: 56, paddingHorizontal: 16 },
  optionList: { gap: 10 },
  error: { color: '#FCA5A5', fontSize: 14, fontWeight: '600', lineHeight: 20, marginTop: 20 },
  actions: { gap: 10, marginTop: 32 },
  reviewCard: { backgroundColor: '#141C19', borderColor: '#24312B', borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
  reviewRow: { borderBottomColor: '#24312B', borderBottomWidth: 1, gap: 12, paddingVertical: 14 },
  reviewLabel: { color: '#8FA39B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  reviewValue: { color: '#F3F6F4', flexShrink: 1, fontSize: 15, fontWeight: '600' },
});
