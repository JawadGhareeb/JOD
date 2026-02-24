import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  I18nManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { colors, radius, shadows, spacing } from "@/src/theme";

interface PublisherMenuProps {
  show: boolean;
  onEdit: () => void;
  onClose: () => void;
  onStats: () => void;
  onManage: () => void;
  manageLabel: string;
}

interface ActionRowProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
}

const ActionRow = ({ label, icon, onPress, danger }: ActionRowProps) => (
  <Pressable style={styles.actionRow} onPress={onPress}>
    <Text style={[styles.actionText, danger ? styles.dangerText : null]}>{label}</Text>
    <MaterialIcons
      name={icon}
      size={18}
      color={danger ? colors.danger : colors.textSecondary}
    />
  </Pressable>
);

export const PublisherMenu = ({
  show,
  onEdit,
  onClose,
  onStats,
  onManage,
  manageLabel,
}: PublisherMenuProps) => {
  const [visible, setVisible] = useState(false);

  if (!show) {
    return null;
  }

  const runAndClose = (action: () => void) => {
    setVisible(false);
    action();
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} hitSlop={10}>
        <MaterialIcons
          name="more-vert"
          size={22}
          color={colors.textSecondary}
          style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
        />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.menu} onPress={() => undefined}>
            <ActionRow
              label="تعديل"
              icon="edit"
              onPress={() => runAndClose(onEdit)}
            />
            <ActionRow
              label="إغلاق"
              icon="cancel"
              danger
              onPress={() => runAndClose(onClose)}
            />
            <ActionRow
              label="عرض الإحصاءات"
              icon="query-stats"
              onPress={() => runAndClose(onStats)}
            />
            <ActionRow
              label={manageLabel}
              icon="groups"
              onPress={() => runAndClose(onManage)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "flex-start",
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.l,
  },
  menu: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingVertical: spacing.s,
    ...shadows.card,
  },
  actionRow: {
    minHeight: 44,
    paddingHorizontal: spacing.l,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-Regular",
  },
  dangerText: {
    color: colors.danger,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
