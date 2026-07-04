import { supabase } from "./supabase";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

async function requireUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function sendMessage(receiverId: string, body: string): Promise<Message> {
  const me = await requireUserId();

  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: me, receiver_id: receiverId, body })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

// Newest first — matches an inverted FlatList where index 0 renders at the bottom.
export async function fetchConversation(
  otherUserId: string,
  opts: { before?: string; limit?: number } = {}
): Promise<Message[]> {
  const me = await requireUserId();
  const { before, limit = 50 } = opts;

  let query = supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${me},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${me})`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) query = query.lt("created_at", before);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function markConversationRead(otherUserId: string) {
  const me = await requireUserId();

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", otherUserId)
    .eq("receiver_id", me)
    .is("read_at", null);
}

export async function fetchUnreadCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", user.id)
    .is("read_at", null);

  return count ?? 0;
}
