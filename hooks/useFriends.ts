import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface FriendRow {
  friend_id: string;
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
  status: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Get all accepted friendships where user is either side
    const { data: friendships } = await supabase
      .from("friends")
      .select("id, requester_id, receiver_id, status")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!friendships?.length) { setLoading(false); return; }

    // Get the other person's ID from each friendship
    const friendIds = friendships.map((f) =>
      f.requester_id === user.id ? f.receiver_id : f.requester_id
    );

    // Fetch profiles + presence for each friend
    const [profilesRes, presenceRes] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username, avatar_url, home_gym, training_style").in("id", friendIds),
      supabase.from("presence").select("user_id, is_playing, track_name, artist, album_art").in("user_id", friendIds),
    ]);

    const profiles = profilesRes.data ?? [];
    const presenceMap = Object.fromEntries(
      (presenceRes.data ?? []).map((p) => [p.user_id, p])
    );
    const friendshipMap = Object.fromEntries(
      friendships.map((f) => {
        const fid = f.requester_id === user.id ? f.receiver_id : f.requester_id;
        return [fid, { id: f.id, status: f.status }];
      })
    );

    const rows: FriendRow[] = profiles.map((p) => ({
      friend_id: p.id,
      display_name: p.display_name ?? "Setlster",
      username: p.username,
      avatar_url: p.avatar_url,
      home_gym: p.home_gym,
      training_style: p.training_style,
      is_playing: presenceMap[p.id]?.is_playing ?? false,
      track_name: presenceMap[p.id]?.track_name ?? null,
      artist: presenceMap[p.id]?.artist ?? null,
      album_art: presenceMap[p.id]?.album_art ?? null,
      friendship_id: friendshipMap[p.id]?.id,
      status: friendshipMap[p.id]?.status,
    }));

    // Sort: playing first, then alphabetical
    rows.sort((a, b) => {
      if (a.is_playing && !b.is_playing) return -1;
      if (!a.is_playing && b.is_playing) return 1;
      return a.display_name.localeCompare(b.display_name);
    });

    setFriends(rows);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return { friends, loading, reload: load };
}
