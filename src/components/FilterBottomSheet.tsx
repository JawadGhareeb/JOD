import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  I18nManager,
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
import type { CampaignStatusTag, WorkType } from "@/src/types/models";

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

const donationStatuses: CampaignStatusTag[] = [
  "عاجلة",
  "اقتربت من الاكتمال",
  "اكتملت",
];

const workTypes: WorkType[] = ["دوام كامل", "دوام جزئي", "عن بعد"];

interface FilterBottomSheetProps {
  variant: "donation" | "volunteer" | "job";
  sheetRef: React.RefObject<BottomSheet | null>;
  cities: string[];
  donationFilters?: DonationFilters;
  volunteeringFilters?: VolunteeringFilters;
  jobFilters?: JobFilters;
  onDonationFiltersChange?: (value: DonationFilters) => void;
  onVolunteeringFiltersChange?: (value: VolunteeringFilters) => void;
  onJobFiltersChange?: (value: JobFilters) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
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
  sheetRef,
  cities,
  donationFilters,
  volunteeringFilters,
  jobFilters,
  onDonationFiltersChange,
  onVolunteeringFiltersChange,
  onJobFiltersChange,
}: FilterBottomSheetProps) => {
  const snapPoints = useMemo(() => ["64%"], []);
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

  const apply = () => {
    if (variant === "donation") {
      onDonationFiltersChange?.(draftDonation);
      close();
      return;
    }

    if (variant === "volunteer") {
      onVolunteeringFiltersChange?.(draftVolunteering);
      close();
      return;
    }

    onJobFiltersChange?.(draftJobs);
    close();
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
              key={status}
              label={status}
              active={draftDonation.status === status}
              onPress={() =>
                setDraftDonation((prev) => ({
                  ...prev,
                  status: prev.status === status ? null : status,
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
        <Text style={styles.title}>تصفية النتائج</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
    paddingBottom: spacing.m,
    gap: spacing.m,
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
