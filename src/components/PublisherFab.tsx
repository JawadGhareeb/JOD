import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "@/src/theme";

interface PublisherFabProps {
  onPress: () => void;
}

export const PublisherFab = ({ onPress }: PublisherFabProps) => (
  <Pressable style={styles.fab} onPress={onPress}>
    <Ionicons name="add" size={28} color="#FFFFFF" />
  </Pressable>
);

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: spacing.xl + 20,
    left: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
});
