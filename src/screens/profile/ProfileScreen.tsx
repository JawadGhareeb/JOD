import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "@/src/context";
import { colors, radius, shadows, spacing } from "@/src/theme";
import { formatCurrency } from "@/src/utils/formatters";

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { userRole, setUserRole, publisherStats } = useAppData();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.s }]}> 
      <Text style={styles.title}>الملف الشخصي</Text>

      <View style={styles.card}>
        <Text style={styles.name}>مستخدم تجريبي</Text>
        <Text style={styles.email}>user@jod.app</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>الدور الحالي</Text>
        <View style={styles.roleRow}>
          <Text style={styles.roleLabel}>ناشر</Text>
          <Switch
            value={userRole === "publisher"}
            onValueChange={(value) => setUserRole(value ? "publisher" : "user")}
            thumbColor="#FFFFFF"
            trackColor={{ true: colors.primary, false: "#C5D2DE" }}
          />
          <Text style={styles.roleLabel}>مستخدم</Text>
        </View>
      </View>

      {userRole === "publisher" ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>لوحة الناشر</Text>
          <View style={styles.statsGrid}>
            <Stat label="حملاتي" value={publisherStats.myCampaignsCount.toString()} />
            <Stat label="إجمالي المحصّل" value={formatCurrency(publisherStats.totalRaised)} />
            <Stat label="المتقدمون" value={publisherStats.applicants.toString()} />
          </View>
        </View>
      ) : null}

      <Pressable style={styles.card}>
        <View style={styles.settingsRow}>
          <MaterialIcons name="chevron-left" size={22} color={colors.textMuted} />
          <Text style={styles.sectionTitle}>الإعدادات</Text>
        </View>
      </Pressable>
    </View>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  title: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.l,
    gap: spacing.s,
    ...shadows.card,
  },
  name: {
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  email: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  roleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-Regular",
  },
  statsGrid: {
    gap: spacing.s,
  },
  statItem: {
    borderRadius: radius.card,
    backgroundColor: "#F7FAFD",
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
  },
  statValue: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Bold",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    fontFamily: "NotoKufiArabic-Regular",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
