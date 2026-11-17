# Calmify Mobile (React Native + Expo + TypeScript)

Mobile client for the Calmify wellness platform. It talks to the existing
Spring Boot + JWT backend.

## Features
- Register / login with JWT (stored in the device keystore via `expo-secure-store`)
- Daily mood check-in (1-5 scale + optional note)
- Mood history with average score and pull-to-refresh
- Auto logout when the backend returns 401/403

## Setup

```bash
# 1. Create a fresh Expo TypeScript project
npx create-expo-app@latest calmify-mobile --template blank-typescript
cd calmify-mobile

# 2. Install dependencies (expo install picks versions that match your SDK)
npx expo install expo-secure-store expo-status-bar react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/bottom-tabs

# 3. Copy App.tsx and the src/ folder from this scaffold into the project (overwrite App.tsx)

# 4. Point the app at your backend: edit BASE_URL in src/api.ts
#    Android emulator: http://10.0.2.2:8080
#    Physical phone:   http://<your-PC-LAN-IP>:8080  (same Wi-Fi)

# 5. Run, then scan the QR code with the Expo Go app
npx expo start
```

## Backend endpoints expected
Adjust paths/fields in `src/api.ts` to match your Spring controllers.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | /api/auth/register | name, email, password | `{ token }` |
| POST | /api/auth/login | email, password | `{ token }` |
| GET | /api/mood | - | `[{ id, mood, note, createdAt }]` |
| POST | /api/mood | mood, note | saved entry |

Authenticated calls send `Authorization: Bearer <token>`.

## Project structure
```
App.tsx                 navigation + auth gate
src/api.ts              fetch client, token storage
src/auth.tsx            AuthContext (signIn / signUp / signOut)
src/screens/            Login, Mood check-in, History
```

## Next steps (ideas)
- Camera screen that sends a frame to the TensorFlow stress-detection endpoint
- Mood chart (e.g. react-native-svg) and push-notification reminders
- Deploy backend (EC2) and swap BASE_URL to the HTTPS URL
