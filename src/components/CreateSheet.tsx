import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/src/theme";

interface CreateSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  onCreateDonation: () => void;
  onCreateVolunteer: () => void;
  onCreateJob: () => void;
}

const CreateOption = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable style={styles.option} onPress={onPress}>
    <Text style={styles.optionText}>{label}</Text>
  </Pressable>
);

export const CreateSheet = ({
  sheetRef,
  onCreateDonation,
  onCreateVolunteer,
  onCreateJob,
}: CreateSheetProps) => {
  const snapPoints = useMemo(() => ["36%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const close = () => sheetRef.current?.close();

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <View style={styles.content}>
        <Text style={styles.title}>إنشاء جديد</Text>

        <CreateOption
          label="إنشاء حملة تبرعات"
          onPress={() => {
            onCreateDonation();
            close();
          }}
        />

        <CreateOption
          label="إنشاء حملة تطوعية"
          onPress={() => {
            onCreateVolunteer();
            close();
          }}
        />

        <CreateOption
          label="إنشاء وظيفة"
          onPress={() => {
            onCreateJob();
            close();
          }}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  indicator: {
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    gap: spacing.m,
  },
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
    fontFamily: "NotoKufiArabic-Bold",
  },
  option: {
    minHeight: 50,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  optionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
