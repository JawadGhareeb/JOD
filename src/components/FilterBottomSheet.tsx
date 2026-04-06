import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  I18nManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import type {
  DonationFilters,
  JobFilters,
  VolunteeringFilters,
} from "@/src/types/filters";
import type { CampaignLifecycleStatus, WorkType } from "@/src/types/models";

const defaultDonationFilters: DonationFilters = {
  city: null,
  status: null,
  minGoal: null,
  endingSoon: false,
};

const defaultVolunteeringFilters: VolunteeringFilters = {
  city: null,
  dateRange: "all",
  seatsAvailable: false,
};

const defaultJobFilters: JobFilters = {
  city: null,
  workType: null,
  experienceYears: null,
};

const donationStatuses: {
  value: CampaignLifecycleStatus;
  label: string;
}[] = [
  { value: "active", label: "نشطة" },
  { value: "completed", label: "مكتملة" },
];

const workTypes: WorkType[] = ["دوام كامل", "دوام جزئي", "عن بعد"];

interface FilterBottomSheetProps {
  variant: "donation" | "volunteer" | "job";
  visible: boolean;
  onClose: () => void;
  cities: string[];
  donationFilters?: DonationFilters;
  volunteeringFilters?: VolunteeringFilters;
  jobFilters?: JobFilters;
  onDonationFiltersChange?: (value: DonationFilters) => void;
  onVolunteeringFiltersChange?: (value: VolunteeringFilters) => void;
  onJobFiltersChange?: (value: JobFilters) => void;
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const Pill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable style={[styles.pill, active ? styles.pillActive : null]} onPress={onPress}>
    <Text style={[styles.pillText, active ? styles.pillTextActive : null]}>{label}</Text>
  </Pressable>
);

export const FilterBottomSheet = ({
  variant,
  visible,
  onClose,
  cities,
  donationFilters,
  volunteeringFilters,
  jobFilters,
  onDonationFiltersChange,
  onVolunteeringFiltersChange,
  onJobFiltersChange,
}: FilterBottomSheetProps) => {
  const [draftDonation, setDraftDonation] =
    useState<DonationFilters>(defaultDonationFilters);
  const [draftVolunteering, setDraftVolunteering] =
    useState<VolunteeringFilters>(defaultVolunteeringFilters);
  const [draftJobs, setDraftJobs] = useState<JobFilters>(defaultJobFilters);

  useEffect(() => {
    if (donationFilters) {
      setDraftDonation(donationFilters);
    }
  }, [donationFilters]);

  useEffect(() => {
    if (volunteeringFilters) {
      setDraftVolunteering(volunteeringFilters);
    }
  }, [volunteeringFilters]);

  useEffect(() => {
    if (jobFilters) {
      setDraftJobs(jobFilters);
    }
  }, [jobFilters]);

  const apply = () => {
    if (variant === "donation") {
      onDonationFiltersChange?.(draftDonation);
      onClose();
      return;
    }

    if (variant === "volunteer") {
      onVolunteeringFiltersChange?.(draftVolunteering);
      onClose();
      return;
    }

    onJobFiltersChange?.(draftJobs);
    onClose();
  };

  const reset = () => {
    if (variant === "donation") {
      setDraftDonation(defaultDonationFilters);
      onDonationFiltersChange?.(defaultDonationFilters);
      return;
    }

    if (variant === "volunteer") {
      setDraftVolunteering(defaultVolunteeringFilters);
      onVolunteeringFiltersChange?.(defaultVolunteeringFilters);
      return;
    }

    setDraftJobs(defaultJobFilters);
    onJobFiltersChange?.(defaultJobFilters);
  };

  const commonCitySection = (
    <Section title="المدينة">
      <View style={styles.pillsWrap}>
        <Pill
          label="الكل"
          active={
            variant === "donation"
              ? !draftDonation.city
              : variant === "volunteer"
                ? !draftVolunteering.city
                : !draftJobs.city
          }
          onPress={() => {
            if (variant === "donation") {
              setDraftDonation((prev) => ({ ...prev, city: null }));
              return;
            }

            if (variant === "volunteer") {
              setDraftVolunteering((prev) => ({ ...prev, city: null }));
              return;
            }

            setDraftJobs((prev) => ({ ...prev, city: null }));
          }}
        />

        {cities.map((city) => (
          <Pill
            key={city}
            label={city}
            active={
              variant === "donation"
                ? draftDonation.city === city
                : variant === "volunteer"
                  ? draftVolunteering.city === city
                  : draftJobs.city === city
            }
            onPress={() => {
              if (variant === "donation") {
                setDraftDonation((prev) => ({ ...prev, city }));
                return;
              }

              if (variant === "volunteer") {
                setDraftVolunteering((prev) => ({ ...prev, city }));
                return;
              }

              setDraftJobs((prev) => ({ ...prev, city }));
            }}
          />
        ))}
      </View>
    </Section>
  );

  const donationContent = (
    <>
      <Section title="الحالة">
        <View style={styles.pillsWrap}>
          {donationStatuses.map((status) => (
            <Pill
              key={status.value}
              label={status.label}
              active={draftDonation.status === status.value}
              onPress={() =>
                setDraftDonation((prev) => ({
                  ...prev,
                  status: prev.status === status.value ? null : status.value,
                }))
              }
            />
          ))}
        </View>
      </Section>

      <Section title="أقل مبلغ مستهدف">
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={draftDonation.minGoal?.toString() ?? ""}
          placeholder="مثال: 200000"
          placeholderTextColor={colors.textMuted}
          onChangeText={(value) =>
            setDraftDonation((prev) => ({
              ...prev,
              minGoal: value ? Number(value) : null,
            }))
          }
        />
      </Section>

      <Section title="تنتهي قريباً">
        <View style={styles.switchRow}>
          <Text style={styles.labelText}>عرض الحملات التي تنتهي خلال 10 أيام</Text>
          <Switch
            value={draftDonation.endingSoon}
            onValueChange={(value) =>
              setDraftDonation((prev) => ({ ...prev, endingSoon: value }))
            }
            thumbColor="#FFFFFF"
            trackColor={{ true: colors.primary, false: "#C5D2DE" }}
          />
        </View>
      </Section>
    </>
  );

  const volunteeringContent = (
    <>
      <Section title="نطاق التاريخ">
        <View style={styles.pillsWrap}>
          <Pill
            label="الكل"
            active={draftVolunteering.dateRange === "all"}
            onPress={() =>
              setDraftVolunteering((prev) => ({ ...prev, dateRange: "all" }))
            }
          />
          <Pill
            label="خلال أسبوع"
            active={draftVolunteering.dateRange === "week"}
            onPress={() =>
              setDraftVolunteering((prev) => ({ ...prev, dateRange: "week" }))
            }
          />
          <Pill
            label="خلال شهر"
            active={draftVolunteering.dateRange === "month"}
            onPress={() =>
              setDraftVolunteering((prev) => ({ ...prev, dateRange: "month" }))
            }
          />
        </View>
      </Section>

      <Section title="المقاعد المتاحة">
        <View style={styles.switchRow}>
          <Text style={styles.labelText}>عرض الحملات التي ما زال بها مقاعد</Text>
          <Switch
            value={draftVolunteering.seatsAvailable}
            onValueChange={(value) =>
              setDraftVolunteering((prev) => ({ ...prev, seatsAvailable: value }))
            }
            thumbColor="#FFFFFF"
            trackColor={{ true: colors.primary, false: "#C5D2DE" }}
          />
        </View>
      </Section>
    </>
  );

  const jobsContent = (
    <>
      <Section title="نوع العمل">
        <View style={styles.pillsWrap}>
          <Pill
            label="الكل"
            active={!draftJobs.workType}
            onPress={() => setDraftJobs((prev) => ({ ...prev, workType: null }))}
          />

          {workTypes.map((workType) => (
            <Pill
              key={workType}
              label={workType}
              active={draftJobs.workType === workType}
              onPress={() =>
                setDraftJobs((prev) => ({
                  ...prev,
                  workType: prev.workType === workType ? null : workType,
                }))
              }
            />
          ))}
        </View>
      </Section>

      <Section title="سنوات الخبرة (حد أقصى)">
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={draftJobs.experienceYears?.toString() ?? ""}
          placeholder="مثال: 3"
          placeholderTextColor={colors.textMuted}
          onChangeText={(value) =>
            setDraftJobs((prev) => ({
              ...prev,
              experienceYears: value ? Number(value) : null,
            }))
          }
        />
      </Section>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
            <Text style={styles.title}>تصفية النتائج</Text>
            <View style={styles.closeButtonPlaceholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {commonCitySection}
            {variant === "donation" ? donationContent : null}
            {variant === "volunteer" ? volunteeringContent : null}
            {variant === "job" ? jobsContent : null}
          </ScrollView>

          <View style={styles.actionsRow}>
            <Pressable style={styles.secondaryButton} onPress={reset}>
              <Text style={styles.secondaryButtonText}>إعادة ضبط</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={apply}>
              <Text style={styles.primaryButtonText}>تطبيق</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheetContainer: {
    maxHeight: "86%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: spacing.m,
    gap: spacing.m,
  },
  headerRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F6FA",
  },
  closeButtonPlaceholder: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-Bold",
  },
  scrollContent: {
    gap: spacing.m,
    paddingBottom: spacing.s,
  },
  section: {
    gap: spacing.s,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: "NotoKufiArabic-SemiBold",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  sectionBody: {
    gap: spacing.s,
  },
  pillsWrap: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  pill: {
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    backgroundColor: "#F7FAFD",
    justifyContent: "center",
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-Regular",
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  input: {
    minHeight: 42,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
    fontFamily: "NotoKufiArabic-Regular",
  },
  switchRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.s,
  },
  labelText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: "NotoKufiArabic-Regular",
  },
  actionsRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    gap: spacing.s,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "NotoKufiArabic-Bold",
  },
});
