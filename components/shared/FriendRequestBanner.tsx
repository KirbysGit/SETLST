import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";
import { Avatar } from "./Avatar";
import { theme } from "../../constants/theme";

const SHOW_MS = 5000;

interface IncomingRequest {
  name: string;
  avatarUrl: string | null;
}

export function FriendRequestBanner() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const [request, setRequest] = useState<IncomingRequest | null>(null);
  const translateY = useRef(new Animated.Value(-140)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref so the realtime callback sees the current route without resubscribing
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      channel = supabase
        .channel(`friend-request-banner:${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "friends", filter: `receiver_id=eq.${user.id}` },
          async (payload) => {
            const row = payload.new as { requester_id: string; status: string };
            if (row.status !== "pending") return;
            // The Friends tab shows requests live already — no banner needed there
            if (segmentsRef.current[1] === "friends") return;

            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("id", row.requester_id)
              .single();

            setRequest({
              name: profile?.display_name ?? "Someone",
              avatarUrl: profile?.avatar_url ?? null,
            });
          }
        )
        .subscribe();
    }

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!request) return;

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 16,
      stiffness: 160,
    }).start();

    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(dismiss, SHOW_MS);
  }, [request]);

  function dismiss() {
    Animated.timing(translateY, {
      toValue: -140,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setRequest(null));
  }

  function open() {
    dismiss();
    router.push("/(tabs)/friends");
  }

  if (!request) return null;

  return (
    <Animated.View
      style={[styles.banner, { top: insets.top + 8, transform: [{ translateY }] }]}
    >
      <TouchableOpacity style={styles.inner} onPress={open} activeOpacity={0.85}>
        <Avatar name={request.name} imageUrl={request.avatarUrl} size={38} />
        <Text style={styles.text} numberOfLines={2}>
          <Text style={styles.name}>{request.name}</Text> wants to connect 🤝
        </Text>
        <Text style={styles.action}>View</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 100,
    borderRadius: 16,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.purple + "50",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  text: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  name: {
    color: theme.colors.text,
    fontWeight: "800",
  },
  action: {
    color: theme.colors.purple,
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 6,
  },
});
