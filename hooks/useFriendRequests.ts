import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { acceptFriendRequest, declineFriendRequest } from "../lib/friends";

export interface RequestRow {
  requester_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  home_gym: string | null;
  training_style: string | null;
  is_playing: boolean;
  track_name: string | null;
  artist: string | null;
  album_art: string | null;
  friendship_id: string;
}

export function useFriendRequests() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Incoming pending requests: someone asked to connect with me
    const { data: pending } = await supabase
      .from("friends")
      .select("id, requester_id")
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    if (!pending?.length) { setRequests([]); setLoading(false); return; }

    const requesterIds = pending.map((p) => p.requester_id);

    const [profilesRes, presenceRes] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username, avatar_url, home_gym, training_style").in("id", requesterIds),
      supabase.from("presence").select("user_id, is_playing, track_name, artist, album_art").in("user_id", requesterIds),
    ]);

    const profiles = profilesRes.data ?? [];
    const presenceMap = Object.fromEntries(
      (presenceRes.data ?? []).map((p) => [p.user_id, p])
    );
    const friendshipMap = Object.fromEntries(
      pending.map((p) => [p.requester_id, p.id])
    );

    const rows: RequestRow[] = profiles.map((p) => ({
      requester_id: p.id,
      display_name: p.display_name ?? "Setlster",
      username: p.username,
      avatar_url: p.avatar_url,
      home_gym: p.home_gym,
      training_style: p.training_style,
      is_playing: presenceMap[p.id]?.is_playing ?? false,
      track_name: presenceMap[p.id]?.track_name ?? null,
      artist: presenceMap[p.id]?.artist ?? null,
      album_art: presenceMap[p.id]?.album_art ?? null,
      friendship_id: friendshipMap[p.id],
    }));

    rows.sort((a, b) => a.display_name.localeCompare(b.display_name));

    setRequests(rows);
    setLoading(false);
  }

  async function accept(friendshipId: string) {
    await acceptFriendRequest(friendshipId);
    await load();
  }

  async function decline(friendshipId: string) {
    await declineFriendRequest(friendshipId);
    await load();
  }

  useEffect(() => { load(); }, []);

  return { requests, loading, reload: load, accept, decline };
}
