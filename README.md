# AlphaFit - AI-Powered Personal Fitness & Nutrition Assistant

AlphaFit is a Final Year Project (FYP) frontend for an AI-powered personal fitness and nutrition assistant. The current repository contains the completed welcome and onboarding experience built with React Native and Expo.

## Current Status

The current frontend includes:

- Welcome screen and onboarding entry point
- Seven-step onboarding flow for profile information
- Typed onboarding state with step validation and inline errors
- Back navigation with entered values preserved while the flow is mounted
- Single-select and multi-select options
- Progress indicator and review summary
- Loading state and accessible controls
- Placeholder home destination after onboarding completion

Onboarding data is currently held in temporary in-memory React state. It is not persisted when the flow is unmounted or restarted.

Backend and platform integrations are not connected yet. This repository does not currently implement Supabase, authentication, Zustand, persistent storage, ML APIs, or an AI Coach.

## Technology Stack

- React Native 0.86
- Expo SDK 57
- Expo Router
- TypeScript
- React 19
- React Native Web
- Metro Bundler

## Screens and Routes

| Route | Current purpose |
| --- | --- |
| `/` | Welcome screen and onboarding entry point |
| `/get-started` | Seven-step onboarding flow |
| `/sign-in` | Existing sign-in route placeholder |
| `/home` | Minimal placeholder destination after onboarding |

## Onboarding Flow

1. Basic information
2. Body metrics
3. Fitness goal
4. Fitness level
5. Workout preferences
6. Workout frequency
7. Review and finish

Finishing the review performs local profile handling and navigates to `/home`. It does not currently save data to Supabase or another database.

## Project Structure

```text
src/
  app/             Expo Router screens and layout
  components/      Reusable UI and onboarding components
  constants/       Theme constants
  hooks/           Color scheme and theme hooks
  services/        Current local profile service boundary
  types/           TypeScript onboarding types and labels
  utils/           Onboarding validation helpers
assets/            App icons, splash assets, and images
scripts/           Project maintenance scripts
```

## Setup

Use Node.js 22.13 or newer for Expo SDK 57.

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

### Expo Go

With the development server running, install Expo Go on a compatible device, connect the device and computer to the same network, then scan the QR code shown by Expo. You can also press `a` for an Android emulator or `i` for an iOS simulator when the required local tooling is installed.

### Web

Start the web target with:

```bash
npm run web
```

## Type Checking

Run the TypeScript check without emitting files:

```bash
npx tsc --noEmit
```

## Development and Contribution

Keep changes focused on the current frontend scope and preserve the existing onboarding behavior. Before opening a pull request:

1. Run `npx tsc --noEmit`.
2. Run the relevant Expo target and verify the onboarding flow manually.
3. Review `git diff` and confirm that generated files and secrets are not included.
4. Use a clear, focused commit message describing the change.

Never commit API keys, passwords, tokens, credentials, or private configuration. Local `.env` files are ignored; use a sanitized `.env.example` only for documenting future configuration names.

## Planned Integrations

Future work may include Supabase-backed profile persistence, authentication, Zustand state management, ML APIs, an AI Coach, and additional fitness and nutrition features. These are planned only and are not part of the current completed frontend.

## References

- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
