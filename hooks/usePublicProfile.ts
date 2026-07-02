import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { UserProfile } from "./useProfile";
import { PresenceRow } from "./useGymPresence";
import { getRelationship, Relationship } from "../lib/friends";

interface PublicProfileData {
  profile: UserProfile | null;
  presence: PresenceRow | null;
  relationship: Relationship;
  friendshipId: string | null;
  loading: boolean;
  reload: () => Promise<void>;
}

export function usePublicProfile(userId: string): PublicProfileData {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [presence, setPresence] = useState<PresenceRow | null>(null);
  const [relationship, setRelationship] = useState<Relationship>("none");
  const [friendshipId, setFriendshipId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;

    const [profileRes, presenceRes, rel] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("presence").select("*").eq("user_id", userId).single(),
      getRelationship(userId),
    ]);

    setProfile(profileRes.data ?? null);
    setPresence(presenceRes.data ?? null);
    setRelationship(rel.status);
    setFriendshipId(rel.friendshipId);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  return { profile, presence, relationship, friendshipId, loading, reload: load };
}
