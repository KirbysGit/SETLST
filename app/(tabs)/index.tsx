import { StyleSheet, View } from "react-native";

import { DashboardStyleSwitcher } from "../../components/home/DashboardStyleSwitcher";
import {
  MapFocusedDashboard,
  MusicFocusedDashboard
} from "../../components/home/DashboardVariants";
import { Screen } from "../../components/layout/Screen";
import { theme } from "../../constants/theme";
import { useDashboardStyle } from "../../contexts/DashboardStyleContext";

export default function HomeScreen() {
  const { dashboardStyle } = useDashboardStyle();

  return (
    <View style={styles.root}>
      <Screen scroll contentContainerStyle={styles.screenContent}>
        {dashboardStyle === "map" ? <MapFocusedDashboard /> : <MusicFocusedDashboard />}
      </Screen>
      <DashboardStyleSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  screenContent: {
    paddingBottom: 154
  }
});
