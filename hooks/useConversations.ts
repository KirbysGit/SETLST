import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Message } from "../lib/messages";

export interface ConversationRow {
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  last_body: string;
  last_at: string;
  last_from_me: boolean;
  unread_count: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(500);

    if (!messages?.length) {
      setConversations([]);
      setTotalUnread(0);
      setLoading(false);
      return;
    }

    // Messages are newest-first, so the first one seen per counterpart is the latest.
    const byCounterpart = new Map<string, { last: Message; unread: number }>();
    for (const m of messages as Message[]) {
      const counterpart = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      const entry = byCounterpart.get(counterpart);
      const isUnread = m.receiver_id === user.id && m.read_at === null;
      if (!entry) {
        byCounterpart.set(counterpart, { last: m, unread: isUnread ? 1 : 0 });
      } else if (isUnread) {
        entry.unread += 1;
      }
    }

    const ids = [...byCounterpart.keys()];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", ids);

    const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

    const rows: ConversationRow[] = ids
      .map((id) => {
        const { last, unread } = byCounterpart.get(id)!;
        const profile = profileMap[id];
        return {
          user_id: id,
          display_name: profile?.display_name ?? "Setlster",
          username: profile?.username ?? null,
          avatar_url: profile?.avatar_url ?? null,
          last_body: last.body,
          last_at: last.created_at,
          last_from_me: last.sender_id === user.id,
          unread_count: unread,
        };
      })
      .sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime());

    setConversations(rows);
    setTotalUnread(rows.reduce((sum, r) => sum + r.unread_count, 0));
    setLoading(false);
  }

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    async function init() {
      await load();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      channel = supabase
        .channel(`messages-list:${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` },
          () => { load(); }
        )
        .subscribe();
    }

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, totalUnread, loading, reload: load };
}
