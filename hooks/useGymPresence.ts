import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";
import { spotifyFetch, getSpotifyTokens } from "../lib/spotify";

export interface PresenceRow {
  user_id: string;
  gym: string;
  track_name: string;
  artist: string;
  album_art: string | null;
  is_playing: boolean;
  display_name: string;
  updated_at: string;
}

interface GymPresence {
  own: PresenceRow | null;
  others: PresenceRow[];
  gym: string | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
  cooldownSeconds: number; // > 0 means on cooldown
}

const POLL_INTERVAL_MS = 30_000;
const REFRESH_COOLDOWN_MS = 10_000;

export function useGymPresence(): GymPresence {
  const [own, setOwn] = useState<PresenceRow | null>(null);
  const [others, setOthers] = useState<PresenceRow[]>([]);
  const [gym, setGym] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastRefreshRef = useRef<number>(0);
  const userIdRef = useRef<string | null>(null);
  const gymRef = useRef<string | null>(null);
  const displayNameRef = useRef<string>("");

  // ─── Fetch + upsert current Spotify track ─────────────────────────────────
  async function syncSpotify() {
    const tokens = await getSpotifyTokens();
    if (!tokens || !userIdRef.current || !gymRef.current) return;

    try {
      let track = null;
      let isPlaying = false;

      const current = await spotifyFetch("/me/player/currently-playing");
      if (current?.item?.name) {
        track = current.item;
        isPlaying = current.is_playing ?? false;
      } else {
        const recent = await spotifyFetch("/me/player/recently-played?limit=1");
        track = recent?.items?.[0]?.track ?? null;
        isPlaying = false;
      }

      if (!track) return;

      const row = {
        user_id: userIdRef.current,
        gym: gymRef.current,
        track_name: track.name,
        artist: track.artists?.map((a: any) => a.name).join(", ") ?? "",
        album_art: track.album?.images?.[0]?.url ?? null,
        is_playing: isPlaying,
        display_name: displayNameRef.current,
        updated_at: new Date().toISOString(),
      };

      await supabase.from("presence").upsert(row, { onConflict: "user_id" });
      setOwn(row as PresenceRow);
    } catch (e) {
      // Silently fail
    }
  }

  // ─── Manual refresh with 10s cooldown ─────────────────────────────────────
  async function refresh() {
    const now = Date.now();
    const elapsed = now - lastRefreshRef.current;
    if (elapsed < REFRESH_COOLDOWN_MS) return; // still on cooldown, ignore

    lastRefreshRef.current = now;
    setRefreshing(true);

    // Start countdown timer
    setCooldownSeconds(10);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldownSeconds((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    await syncSpotify();
    setRefreshing(false);
  }

  // ─── Resolve the user's current home gym ──────────────────────────────────
  // Runs on mount AND every time the screen regains focus, so a gym change
  // made in the profile tab re-points the feed without an app restart.
  const checkGym = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    userIdRef.current = user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("home_gym, display_name")
      .eq("id", user.id)
      .single();

    displayNameRef.current = profile?.display_name ?? user.email?.split("@")[0] ?? "Setlster";

    const homeGym = profile?.home_gym ?? null;
    if (!homeGym) setLoading(false);
    setGym((prev) => (prev === homeGym ? prev : homeGym));
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkGym();
    }, [checkGym])
  );

  // ─── Wire feed + realtime + polling to the current gym ────────────────────
  // Re-runs whenever gym changes: old channel/interval torn down, new ones up.
  useEffect(() => {
    gymRef.current = gym;
    if (!gym) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function wire() {
      const userId = userIdRef.current;
      if (!userId) return;

      const { data: rows } = await supabase
        .from("presence")
        .select("*")
        .eq("gym", gym);

      if (cancelled) return;

      const allRows = (rows ?? []) as PresenceRow[];
      setOwn(allRows.find((r) => r.user_id === userId) ?? null);
      setOthers(
        allRows
          .filter((r) => r.user_id !== userId)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
      setLoading(false);

      channel = supabase
        .channel(`gym-feed:${gym}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "presence", filter: `gym=eq.${gym}` },
          (payload) => {
            const updated = payload.new as PresenceRow;
            if (!updated) return;

            if (updated.user_id === userIdRef.current) {
              setOwn(updated);
            } else {
              setOthers((prev) => {
                const without = prev.filter((r) => r.user_id !== updated.user_id);
                return [updated, ...without].sort(
                  (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
              });
            }
          }
        )
        .subscribe();

      await syncSpotify();
      lastRefreshRef.current = Date.now();
      intervalRef.current = setInterval(syncSpotify, POLL_INTERVAL_MS);
    }

    wire();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gym]);

  // Cooldown timer cleanup on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  return { own, others, gym, loading, refreshing, refresh, cooldownSeconds };
}
