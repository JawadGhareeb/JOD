import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/src/theme";

export const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-Regular",
    textAlign: "center",
  },
});
