import { useEffect, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  fetchConversation,
  markConversationRead,
  Message,
  sendMessage,
} from "../lib/messages";

const PAGE_SIZE = 50;

export function useChat(otherUserId: string) {
  // Newest-first, for an inverted FlatList.
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const myIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!otherUserId) return;

    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      myIdRef.current = user.id;
      setMyId(user.id);

      const rows = await fetchConversation(otherUserId, { limit: PAGE_SIZE });
      if (cancelled) return;
      setMessages(rows);
      setHasMore(rows.length === PAGE_SIZE);
      setLoading(false);
      markConversationRead(otherUserId);

      channel = supabase
        .channel(`messages:${user.id}:${otherUserId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` },
          (payload) => {
            const msg = payload.new as Message;
            if (msg.sender_id !== otherUserId) return;
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [msg, ...prev]
            );
            // We're looking at the conversation, so it's read immediately.
            markConversationRead(otherUserId);
          }
        )
        .subscribe();
    }

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [otherUserId]);

  async function send(body: string) {
    const text = body.trim();
    const me = myIdRef.current;
    if (!text || !me) return;

    const temp: Message = {
      id: `temp-${Date.now()}`,
      sender_id: me,
      receiver_id: otherUserId,
      body: text,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((prev) => [temp, ...prev]);

    try {
      const saved = await sendMessage(otherUserId, text);
      setMessages((prev) => prev.map((m) => (m.id === temp.id ? saved : m)));
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      throw e;
    }
  }

  async function loadOlder() {
    const oldest = messages[messages.length - 1];
    if (!hasMore || !oldest) return;
    const older = await fetchConversation(otherUserId, {
      before: oldest.created_at,
      limit: PAGE_SIZE,
    });
    setMessages((prev) => [...prev, ...older]);
    setHasMore(older.length === PAGE_SIZE);
  }

  return { messages, myId, loading, hasMore, send, loadOlder };
}
