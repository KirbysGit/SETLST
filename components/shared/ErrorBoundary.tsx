import { Component, PropsWithChildren } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { GradientButton } from "./GradientButton";
import { theme } from "../../constants/theme";

const stacked = require("../../images/v1_stacked.png");

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error("ErrorBoundary caught:", error);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Image source={stacked} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          An unexpected error interrupted the session. Your data is safe — try again.
        </Text>
        <GradientButton size="md" label="Try again" onPress={this.reset} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontFamily: theme.fonts.extrabold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
});
