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
const TYPING_THROTTLE_MS = 1500;
const TYPING_EXPIRE_MS = 3500;

export function useChat(otherUserId: string) {
  // Newest-first, for an inverted FlatList.
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);
  const myIdRef = useRef<string | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const lastTypingSentRef = useRef(0);
  const typingExpireRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!otherUserId) return;

    let channel: RealtimeChannel | null = null;
    let typingChannel: RealtimeChannel | null = null;
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
            setPeerTyping(false);
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [msg, ...prev]
            );
            // We're looking at the conversation, so it's read immediately.
            markConversationRead(otherUserId);
          }
        )
        .subscribe();

      // Ephemeral typing signals — broadcast only, nothing touches the DB.
      // Both parties derive the same channel name via the sorted pair key.
      const pairKey = [user.id, otherUserId].sort().join(":");
      typingChannel = supabase
        .channel(`typing:${pairKey}`)
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (payload?.userId === user.id) return;
          if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
          setPeerTyping(!!payload?.typing);
          if (payload?.typing) {
            typingExpireRef.current = setTimeout(() => setPeerTyping(false), TYPING_EXPIRE_MS);
          }
        })
        .subscribe();
      typingChannelRef.current = typingChannel;
    }

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (typingChannel) supabase.removeChannel(typingChannel);
      if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
      typingChannelRef.current = null;
    };
  }, [otherUserId]);

  function broadcastTyping(typing: boolean) {
    const me = myIdRef.current;
    const ch = typingChannelRef.current;
    if (!me || !ch) return;
    ch.send({ type: "broadcast", event: "typing", payload: { userId: me, typing } });
  }

  // Call on every keystroke; throttled so we don't spam the channel.
  function notifyTyping() {
    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_THROTTLE_MS) return;
    lastTypingSentRef.current = now;
    broadcastTyping(true);
  }

  async function send(body: string) {
    const text = body.trim();
    const me = myIdRef.current;
    if (!text || !me) return;

    lastTypingSentRef.current = 0;
    broadcastTyping(false);

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
      // Keep the temp id so the row doesn't remount (and re-run its pop-in).
      setMessages((prev) =>
        prev.map((m) => (m.id === temp.id ? { ...saved, id: temp.id } : m))
      );
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

  return { messages, myId, loading, hasMore, peerTyping, send, notifyTyping, loadOlder };
}
