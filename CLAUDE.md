# SETLST

Music-driven gym social discovery app. "See who's at your gym. Discover their vibe. Connect through the music."

V1 deliberately avoids exact location tracking / live gym maps (legal/liability). Instead it's an "active at your gym" presence feed: who's currently at your home gym, what they're listening to (via Spotify), and lightweight social (friends, profile, future messaging). See [background.md](background.md) for full product vision, V1 scope, and open product questions.

## Stack

- **Expo Router** (SDK 54 — pinned; do not upgrade without checking Expo Go's App Store version first, this caused peer-dep breakage before)
- **Supabase** — auth, Postgres + RLS, Realtime (`postgres_changes`), Storage (avatar uploads)
- **Spotify Web API** — PKCE OAuth via `expo-auth-session`, token persisted in AsyncStorage
- **React Native** 0.81 / React 19, `expo-linear-gradient`, `expo-image-picker`, `@expo/vector-icons` (Ionicons)

## Commands

```
npx expo start --clear   # dev server (use npx, not npm)
npm run android           # expo start --android
npm run ios               # expo start --ios
npm run web                # expo start --web
npm run typecheck          # tsc --noEmit
```

Run on a physical device via Expo Go (SDK 54 build) — scan the QR from the terminal.

## Environment

Secrets live in `.env` (gitignored), exposed via `EXPO_PUBLIC_` prefix:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SPOTIFY_CLIENT_ID`

Never hardcode these in source — they were exposed in git history once already and keys had to be rotated.

## Routing structure (Expo Router, file-based)

```
app/
  _layout.tsx              # root: auth-state redirect logic (see below)
  (auth)/                  # index (landing), login, signup
  (onboarding)/             # profile-setup -> connect-spotify -> choose-gym -> goals-intro -> goals
  (tabs)/                   # index (home/feed), friends, messages (stub), forum (coming soon), profile
  user/[id].tsx              # public profile by user id
  settings.tsx
```

`app/_layout.tsx` redirects based on profile completeness:
- no `display_name` → `/(onboarding)/profile-setup`
- has profile but `!onboarding_complete` → `/(onboarding)/connect-spotify`
- fully onboarded and in `(auth)` → `/(tabs)`

## Key systems

**Gym presence** (`hooks/useGymPresence.ts`) — polls Spotify currently-playing every 30s, upserts to a `presence` table, plus a Supabase Realtime subscription on channel `gym-feed:${homeGym}` (NOT `presence:*` — that prefix is reserved by Supabase's built-in presence system). Manual pull-to-refresh has a 10s cooldown to protect the Spotify API quota.

**Privacy** — `profiles.privacy` is a `jsonb` column (`goals_public`, `vibe_public`, `stats_public` toggles). `hooks/useProfile.ts` writes instantly on toggle. `components/profile/PublicProfileView.tsx` is the shared rendering component for both your own profile preview and any other user's `/user/[id]` page — it respects these flags.

**Spotify** (`lib/spotify.ts`, `contexts/SpotifyContext.tsx`) — PKCE flow. `spotifyFetch()` handles 204 No Content (nothing currently playing) by returning `null` — don't `.json()` blindly. Auth response is handled in a `useEffect`, never call `router.replace()` during render (caused a "Cannot update a component" crash before).

**Messaging** — `app/(tabs)/messages.tsx` is currently a placeholder stub. The Friends tab's ✉ button routes to `/messages/[id]` which does not exist yet — needs to be built.

## Known gotchas (don't relitigate these)

- `CREATE POLICY IF NOT EXISTS` isn't valid Postgres — use `DROP POLICY IF EXISTS` then `CREATE POLICY`.
- Inserting a test profile requires inserting into `auth.users` first (FK constraint on `profiles.id`).
- `profiles` RLS needs an explicit "authenticated users can view any profile" select policy, or other users' profiles 404 ("Profile Not Found").
- `expo-image-picker`'s `allowsEditing: true` crop UI is broken on at least one Android device (Pixel) — gated to `Platform.OS === "ios"`.
- Tab bar must use `useSafeAreaInsets()` bottom inset for height/padding, not a hardcoded height — otherwise the bar is unreachable under Android gesture-nav (no home button).
- Keyboard covering form fields: wrap content in `ScrollView` inside `KeyboardAvoidingView`, don't rely on `KeyboardAvoidingView` alone.
- After structural JSX tag changes, clear Metro cache (`npx expo start --clear`) if errors look stale/mismatched.

## Brand assets (`images/`)

- `v1_app_icon.png` — icon only, for small/corner placements
- `v1_wordmark_white.png` — text only ("SETLST"), for headers
- `v1_horiz_lockup.png` — icon + text side by side (legacy, currently unused — superseded by stacked/wordmark split)
- `v1_stacked.png` — icon above text, for hero/splash placements (landing, login)

## Code style

- No comments unless explaining non-obvious *why* (a workaround, a hidden constraint).
- Match existing component patterns: functional components, `StyleSheet.create` at file bottom, `theme` from `constants/theme.ts` for all colors/spacing — never hardcode hex values inline.
