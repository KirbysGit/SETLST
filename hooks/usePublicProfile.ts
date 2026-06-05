import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { UserProfile } from "./useProfile";
import { PresenceRow } from "./useGymPresence";

interface PublicProfileData {
  profile: UserProfile | null;
  presence: PresenceRow | null;
  loading: boolean;
}

export function usePublicProfile(userId: string): PublicProfileData {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [presence, setPresence] = useState<PresenceRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      const [profileRes, presenceRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("presence").select("*").eq("user_id", userId).single(),
      ]);

      setProfile(profileRes.data ?? null);
      setPresence(presenceRes.data ?? null);
      setLoading(false);
    }

    load();
  }, [userId]);

  return { profile, presence, loading };
}
