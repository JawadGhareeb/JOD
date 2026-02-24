import { Ionicons } from "@expo/vector-icons";
import { I18nManager, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "@/src/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onPressFilter?: () => void;
  activeFiltersCount?: number;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "ابحث...",
  onPressFilter,
  activeFiltersCount = 0,
}: SearchBarProps) => {
  const filterLabel =
    activeFiltersCount > 0 ? `فلترة (${activeFiltersCount})` : "فلترة";

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {onPressFilter ? (
        <Pressable style={styles.filterButton} onPress={onPressFilter}>
          <Ionicons
            name={I18nManager.isRTL ? "options-outline" : "options-outline"}
            size={16}
            color={colors.primary}
          />
          <Text style={styles.filterText}>{filterLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: spacing.s,
  },
  inputContainer: {
    flex: 1,
    minHeight: 46,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: spacing.s,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
    fontFamily: "NotoKufiArabic-Regular",
  },
  filterButton: {
    minHeight: 46,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.m,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
