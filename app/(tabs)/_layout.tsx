import { Tabs } from "expo-router";
import { ColorValue, Text } from "react-native";

import { theme } from "../../constants/theme";
import { useDashboardStyle } from "../../contexts/DashboardStyleContext";

function TabIcon({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 13, fontWeight: "900", letterSpacing: 0 }}>{label}</Text>;
}

export default function TabLayout() {
  const { dashboardStyle } = useDashboardStyle();
  const activeColor = dashboardStyle === "music" ? theme.colors.purple : theme.colors.teal;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          height: 82,
          paddingTop: 9,
          paddingBottom: 12,
          backgroundColor: theme.colors.black,
          borderTopColor: theme.colors.border
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon label="H" color={color} />
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => <TabIcon label="F" color={color} />
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <TabIcon label="M" color={color} />
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: "Forum",
          tabBarIcon: ({ color }) => <TabIcon label="#" color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon label="P" color={color} />
        }}
      />
    </Tabs>
  );
}
