import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { theme } from "../constants/theme";
import { DashboardStyleProvider } from "../contexts/DashboardStyleContext";

export default function RootLayout() {
  return (
    <DashboardStyleProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: "modal" }} />
      </Stack>
    </DashboardStyleProvider>
  );
}
