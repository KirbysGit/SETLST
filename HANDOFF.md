# Handoff — SETLST

Last updated: 2026-07-05

## Where things stand

**The V1 feature set is functionally complete.** Full loop works end-to-end: sign up → onboarding (profile, Spotify, gym, goals) → live gym presence feed → view profiles → send/accept friend requests → realtime friends-only messaging with unread badges. App icon + splash are configured in `app.json`. Landing page redesigned with product preview.

**It is NOT production ready.** The gaps are stability, backend hardening, and publishing mechanics — not features. See the gates below.

## 🚫 Scope freeze

No new features until launch. Not streaks, not waves, not forum, not stats. The V1 feature set is: **presence · profiles · friends · messaging**. Everything else is V1.1+. If a new idea comes up, add it to "Post-launch backlog" at the bottom and move on.

## Gate A — Stabilize (goal: app doesn't embarrass us in front of a tester)

- [ ] **Root error boundary** in `app/_layout.tsx` — crash shows a branded "something went wrong / tap to reload" screen, not a red box.
- [ ] **Full two-device test** of the complete loop (signup → onboard → presence → request → accept → chat both directions → unread clears). Messaging SQL is applied but the live two-account test hasn't been run yet.
- [ ] **Kill dead buttons.** Login screen has Apple/Google/Phone social buttons that do nothing, and the profile has a Wave button that does nothing. Remove or clearly disable — dead buttons read as "broken app."
- [ ] **Signup screen parity.** `app/(auth)/signup.tsx` is barebones compared to the styled login screen. One polish pass to match.
- [ ] **Empty/edge states**: no home gym set, gym with 0 others active, Spotify disconnected/expired token. Verify each renders something intentional.

## Gate B — Backend hardening (goal: we'd be comfortable with a stranger poking at it)

- [ ] **RLS audit — every table.** `friends` and `messages` have proper policies. Verify `presence` and `profiles` (select/insert/update each) and the `avatars` Storage bucket policies. Write the result down here.
- [ ] **Supabase free-tier pausing.** Project already auto-paused once (DNS dies, app looks broken). Before any real testers: upgrade to Pro, or accept manually resuming.
- [ ] **Email confirmation** — decide: on (safer, adds signup friction) or off (faster testing). Check current Supabase Auth setting; it's whatever the default was.
- [ ] **Account deletion** — required by Apple App Store (and good practice on Play). Needs a settings entry that deletes auth user + profile + presence + friendships + messages.

## Gate C — Publish mechanics (goal: installable by a stranger)

- [ ] **Spotify production quota.** The Spotify app is in Development Mode — max 25 manually-allowlisted users. Apply for Extended Quota Mode early; approval takes time and requires a privacy policy. **This is the longest-lead-time item — start it first.**
- [ ] **Privacy policy + terms** (one page each, hosted anywhere public). Required by both stores and by Spotify's developer policy. Must cover: Spotify listening data, gym association, messaging.
- [ ] **EAS Build** production profile (`eas.json`) — Expo Go is dev-only; testers need a real build.
- [ ] **Store accounts**: Google Play ($25 one-time) — Android first since all testing is on a Pixel. Apple ($99/yr) can wait for V1.1.
- [ ] **Closed beta** via Play Console internal testing track (up to 100 testers, fastest review path).

## Design-pass verdict

No full redesign needed — theme tokens are consistent and the recent screens (landing, chat, friends) hold up. The punch list is Gate A's signup-parity + dead-buttons items, and that's it. Resist restyling working screens; that's the "constant building" trap.

## Post-launch backlog (V1.1+)

- Streaks / weekly goals (was in original V1 criteria — consciously deferred to ship)
- Wave feature (needs push notifications)
- Push notifications (Expo Notifications + EAS)
- Forum (currently a "coming soon" tab)
- Stats row on profile (currently "—" placeholders)
- Message requests from non-friends
- Realtime unread badge (currently 30s poll)

## Recently shipped (don't rebuild these)

- **Friend requests** — `lib/friends.ts`, `hooks/useFriendRequests.ts`; Connect button is a real state machine (Connect → Requested → Accept → ✓ Friends); Requests section in Friends tab. RLS enforced.
- **Messaging** — `lib/messages.ts`, `hooks/useChat.ts` / `useConversations.ts` / `useUnreadCount.ts`, `app/messages/[id].tsx` chat screen, conversation list in Messages tab, tab badge. Supabase Realtime delivery, friends-only via `are_friends()` RLS. The old dead ✉ route is fixed.
- **App identity** — `app.json` icon / splash / adaptive icon / background color (custom icon only visible in real builds, not Expo Go).
- **Landing redesign** — preview card, feature pills, ambient glows, pinned CTA.

## Environment / access notes

- `.env` holds Supabase URL/anon key + Spotify Client ID (gitignored; rotated once after a history leak — never hardcode).
- Supabase: messaging + friends SQL applied manually via dashboard SQL editor (no migration files in repo — SQL lives in the plan docs / PR descriptions).
- GitHub: `https://github.com/KirbysGit/SETLST.git`, branch `master`.
- Dev server: `npx expo start --clear` (npx, not npm).
- Known pre-existing typecheck errors in `goals.tsx`, `GymPulse.tsx`, `AnimatedWaveform.tsx` — cosmetic, not blockers, but fair game during Gate A.
