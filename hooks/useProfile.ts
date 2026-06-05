import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  home_gym: string | null;
  training_style: string | null;
  primary_goal: string | null;
  gym_frequency: string | null;
  experience_level: string | null;
  open_to: string[] | null;
  vibe: string | null;
  privacy: {
    goals_public: boolean;
    vibe_public: boolean;
    stats_public: boolean;
  };
}

const DEFAULT_PRIVACY = {
  goals_public: true,
  vibe_public: true,
  stats_public: true,
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        ...data,
        privacy: data.privacy ?? DEFAULT_PRIVACY,
      });
    }
    setLoading(false);
  }

  async function updatePrivacy(key: keyof UserProfile["privacy"], value: boolean) {
    if (!profile) return;

    const updated = { ...profile.privacy, [key]: value };
    setProfile((p) => p ? { ...p, privacy: updated } : p);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ privacy: updated })
      .eq("id", user.id);
  }

  useEffect(() => { load(); }, []);

  return { profile, loading, updatePrivacy, reload: load };
}
