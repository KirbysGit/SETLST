# Handoff — SETLST

Last updated: 2026-06-30

## Where things stand

V1 core loop is functional end-to-end: sign up → onboarding (profile, Spotify connect, gym choice, goals) → dashboard with live gym presence feed → friends list → public profile pages. Brand assets (icon, wordmark, stacked lockup) are wired into all auth/onboarding/dashboard screens. Tab bar is fixed for Android gesture-nav devices (Pixel) using `useSafeAreaInsets`.

## What's NOT done yet

1. **Connect button is a placeholder.** On `components/profile/PublicProfileView.tsx`, the "Connect" action does not create a real friend request row in Supabase yet. Need a `friend_requests` (or similar) table + accept/decline flow.
2. **Messaging doesn't exist.** `app/(tabs)/messages.tsx` is a static "coming soon"-style stub. The Friends tab's ✉ button routes to `/messages/[id]`, which has no route file — tapping it will 404. Needs a real chat screen + Supabase table (or Realtime channel) for messages.
3. **No error boundaries.** An unhandled crash anywhere currently takes down the whole app with the default red screen / no graceful fallback.
4. **No empty-gym state.** Behavior when a user hasn't set a home gym yet (or their gym has 0 other active users) hasn't been explicitly designed — check current behavior before assuming it's handled.
5. **App icon / splash screen not configured in `app.json`.** Still using Expo defaults — the new brand assets (`images/v1_app_icon.png` etc.) haven't been wired into the native app icon / splash config.
6. **Wave feature** (distinct from Connect) was discussed as a V2 item gated behind push notifications — not started.
7. Untested on a physical Android emulator (Android Studio) — all testing so far has been via Expo Go on a Pixel.

## Recently fixed (don't re-debug these)

- Asset path bug: `v1_wordmark.png` was referenced but the actual file on disk is `v1_wordmark_white.png` — fixed in `AppHeader.tsx` and `goals-intro.tsx`.
- Tab bar unreachable on Pixel gesture-nav — fixed via `useSafeAreaInsets()`, see [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx).
- See [CLAUDE.md](CLAUDE.md) "Known gotchas" section for the full list of previously-hit bugs (RLS policy syntax, FK constraints on test inserts, Spotify 204 handling, reserved Realtime channel prefix, etc.) — check there before re-debugging something that looks familiar.

## Next logical steps (pick one)

- Wire up real friend requests (unblocks Connect button + makes Friends tab fully real instead of relying on manually-seeded test data).
- Build out `/messages/[id]` as a real per-friend chat screen.
- Configure `app.json` icon/splash with the new brand assets — quick win, very visible polish.
- Add a basic error boundary at the root layout level.

## Environment / access notes

- `.env` holds Supabase URL/anon key and Spotify Client ID, gitignored. If a fresh clone needs these, they're not in this repo — get them from the project owner directly (they were rotated once after an earlier accidental commit).
- GitHub remote: `https://github.com/KirbysGit/SETLST.git`, branch `master`.
- Dev server: `npx expo start --clear` (not `npm expo start` — that's not a valid command).
