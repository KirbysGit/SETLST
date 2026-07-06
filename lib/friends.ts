import { supabase } from "./supabase";

export type Relationship = "none" | "outgoing" | "incoming" | "friends";

export interface RelationshipState {
  status: Relationship;
  friendshipId: string | null;
}

export async function getRelationship(otherUserId: string): Promise<RelationshipState> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === otherUserId) return { status: "none", friendshipId: null };

  const { data } = await supabase
    .from("friends")
    .select("id, requester_id, receiver_id, status")
    .or(
      `and(requester_id.eq.${user.id},receiver_id.eq.${otherUserId}),` +
      `and(requester_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .maybeSingle();

  if (!data) return { status: "none", friendshipId: null };

  if (data.status === "accepted") return { status: "friends", friendshipId: data.id };

  // pending — direction decides whether we sent it or received it
  const status: Relationship = data.requester_id === user.id ? "outgoing" : "incoming";
  return { status, friendshipId: data.id };
}

export async function sendFriendRequest(otherUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("friends")
    .insert({ requester_id: user.id, receiver_id: otherUserId, status: "pending" });

  if (error) throw error;
}

export async function acceptFriendRequest(friendshipId: string) {
  const { error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("id", friendshipId);

  if (error) throw error;
}

export async function declineFriendRequest(friendshipId: string) {
  // .select() makes the delete return affected rows — RLS-blocked deletes
  // otherwise "succeed" with zero rows and the request silently survives.
  const { data, error } = await supabase
    .from("friends")
    .delete()
    .eq("id", friendshipId)
    .select("id");

  if (error) throw error;
  if (!data?.length) {
    throw new Error(
      "The request wasn't removed — the friends table is likely missing its delete RLS policy."
    );
  }
}

// Cancelling a request you sent is the same row-delete as declining one.
export const cancelFriendRequest = declineFriendRequest;
