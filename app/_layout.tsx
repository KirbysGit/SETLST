import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Session } from "@supabase/supabase-js";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";

import { theme } from "../constants/theme";
import { DashboardStyleProvider } from "../contexts/DashboardStyleContext";
import { SpotifyProvider } from "../contexts/SpotifyContext";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { FriendRequestBanner } from "../components/shared/FriendRequestBanner";
import { supabase } from "../lib/supabase";

function useAuthRedirect(session: Session | null, ready: boolean) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inTabs = segments[0] === "(tabs)";

    async function redirect() {
      if (!session) {
        if (!inAuth) router.replace("/(auth)");
        return;
      }

      // Logged in — check onboarding state
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, onboarding_complete")
        .eq("id", session.user.id)
        .single();

      const hasProfile = !!profile?.display_name;
      const onboardingDone = !!profile?.onboarding_complete;

      if (!hasProfile && !inOnboarding) {
        // Brand new user — start from profile setup
        router.replace("/(onboarding)/profile-setup");
      } else if (hasProfile && !onboardingDone && !inOnboarding && !inTabs) {
        // Has profile but hasn't finished onboarding — resume at spotify
        router.replace("/(onboarding)/connect-spotify");
      } else if (inAuth) {
        // Returning user who is fully set up
        router.replace("/(tabs)");
      }
    }

    redirect();
  }, [session, ready, segments]);
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useAuthRedirect(session, ready);

  // Splash stays visible until fonts are in — avoids a system-font flash
  if (!fontsLoaded) return null;

  return (
    <DashboardStyleProvider>
      <SpotifyProvider>
        <StatusBar style="light" />
        <ErrorBoundary>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="user/[id]" />
            <Stack.Screen name="messages/[id]" />
            <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          </Stack>
          {/* Keyed by user so the realtime subscription (re)connects on login */}
          {session && <FriendRequestBanner key={session.user.id} />}
        </ErrorBoundary>
      </SpotifyProvider>
    </DashboardStyleProvider>
  );
}
