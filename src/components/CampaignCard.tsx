import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radius, shadows, spacing } from "@/src/theme";
import type {
  DonationCampaign,
  JobItem,
  VolunteeringCampaign,
} from "@/src/types/models";
import { daysUntil } from "@/src/utils/date";
import { formatCurrency, toPercent } from "@/src/utils/formatters";
import { PublisherMenu } from "./PublisherMenu";
import { StatusBadge, TypeChip } from "./Chips";

type Variant = "donation" | "volunteer" | "job";

interface SharedProps {
  onPrimaryAction: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onAddToCalendar?: () => void;
  showPublisherMenu?: boolean;
  onEdit?: () => void;
  onClose?: () => void;
  onStats?: () => void;
  onManage?: () => void;
}

interface DonationProps extends SharedProps {
  type: "donation";
  data: DonationCampaign;
}

interface VolunteerProps extends SharedProps {
  type: "volunteer";
  data: VolunteeringCampaign;
}

interface JobProps extends SharedProps {
  type: "job";
  data: JobItem;
}

export type CampaignCardProps = DonationProps | VolunteerProps | JobProps;

const actionLabelByType: Record<Variant, string> = {
  donation: "تبرّع الآن",
  volunteer: "انضم للحملة",
  job: "قدّم الآن",
};

const manageLabelByType: Record<Variant, string> = {
  donation: "إدارة المتبرعين",
  volunteer: "إدارة المتطوعين",
  job: "إدارة المتقدمين",
};

export const CampaignCard = (props: CampaignCardProps) => {
  const { type, showPublisherMenu = false } = props;
  const title = props.data.title;
  const description = props.data.description;

  const renderMeta = () => {
    if (type === "donation") {
      return (
        <View style={styles.metaRow}>
          <MetaItem icon="location-on" text={props.data.city} />
          <MetaItem
            icon="schedule"
            text={`ينتهي ${new Date(props.data.endDate).toLocaleDateString("ar-SA")}`}
          />
        </View>
      );
    }

    if (type === "volunteer") {
      return (
        <View style={styles.metaRow}>
          <MetaItem icon="location-on" text={props.data.city} />
          <MetaItem icon="event" text={props.data.date} />
          <MetaItem icon="access-time" text={props.data.time} />
        </View>
      );
    }

    return (
      <View style={styles.metaRow}>
        <MetaItem icon="location-on" text={props.data.city} />
        <MetaItem icon="business" text={props.data.orgName} />
        <MetaItem icon="schedule" text={props.data.postedAt} />
      </View>
    );
  };

  const renderVariantDetails = () => {
    if (type === "donation") {
      const percentage = toPercent(props.data.raisedAmount, props.data.goalAmount);
      const remainingDays = daysUntil(props.data.endDate);
      const remainingLabel =
        remainingDays >= 0 ? `باقي ${remainingDays} أيام` : "انتهت الحملة";

      return (
        <View style={styles.variantBlock}>
          <Text style={styles.valueText}>
            {`تم جمع ${formatCurrency(props.data.raisedAmount)} من ${formatCurrency(props.data.goalAmount)} (${percentage}%)`}
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                I18nManager.isRTL ? { right: 0 } : { left: 0 },
                { width: `${percentage}%` },
              ]}
            />
          </View>

          <Text style={styles.metaSingleText}>{remainingLabel}</Text>
        </View>
      );
    }

    if (type === "volunteer") {
      const remainingSeats = Math.max(
        props.data.requiredVolunteers - props.data.joinedVolunteers,
        0,
      );

      return (
        <View style={styles.variantBlock}>
          <Text style={styles.valueText}>
            {`انضم ${props.data.joinedVolunteers} من ${props.data.requiredVolunteers} متطوع`}
          </Text>
          <Text style={styles.metaSingleText}>{`المتبقي ${remainingSeats} مكان`}</Text>
        </View>
      );
    }

    return (
      <View style={styles.variantBlock}>
        <Text style={styles.valueText}>{props.data.orgName}</Text>
        <Text style={styles.metaSingleText}>
          {`${props.data.workType} - ${props.data.experienceYears} سنوات خبرة`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.chipsRow}>
          <TypeChip type={type} />
          <StatusBadge status={props.data.statusTag} />
        </View>

        <PublisherMenu
          show={showPublisherMenu}
          onEdit={props.onEdit ?? (() => undefined)}
          onClose={props.onClose ?? (() => undefined)}
          onStats={props.onStats ?? (() => undefined)}
          onManage={props.onManage ?? (() => undefined)}
          manageLabel={manageLabelByType[type]}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
        {description}
      </Text>

      {renderMeta()}
      {renderVariantDetails()}

      <Pressable style={styles.primaryButton} onPress={props.onPrimaryAction}>
        <Text style={styles.primaryButtonText}>{actionLabelByType[type]}</Text>
      </Pressable>

      <View style={styles.secondaryActions}>
        {type === "donation" ? (
          <>
            <SecondaryAction label="مشاركة" icon="share-social" onPress={props.onShare} />
            <SecondaryAction label="حفظ" icon="bookmark" onPress={props.onSave} />
          </>
        ) : (
          <>
            <SecondaryAction label="حفظ" icon="bookmark" onPress={props.onSave} />
            {type === "volunteer" ? (
              <SecondaryAction
                label="أضف للتقويم"
                icon="calendar"
                onPress={props.onAddToCalendar}
              />
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const SecondaryAction = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) => (
  <Pressable style={styles.secondaryButton} onPress={onPress}>
    <Ionicons name={icon} size={15} color={colors.textSecondary} />
    <Text style={styles.secondaryText}>{label}</Text>
  </Pressable>
);

const MetaItem = ({
  icon,
  text,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
}) => (
  <View style={styles.metaItem}>
    <MaterialIcons name={icon} size={14} color={colors.textMuted} />
    <Text style={styles.metaText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.l,
    gap: spacing.s,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.s,
  },
  chipsRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: spacing.s,
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: "NotoKufiArabic-Bold",
  },
  description: {
    fontSize: 13,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: "NotoKufiArabic-Regular",
  },
  metaRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  metaItem: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: "NotoKufiArabic-Regular",
  },
  variantBlock: {
    gap: 6,
  },
  valueText: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: "NotoKufiArabic-SemiBold",
  },
  metaSingleText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: I18nManager.isRTL ? "right" : "left",
    fontFamily: "NotoKufiArabic-Regular",
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: "#E2EAF1",
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "NotoKufiArabic-Bold",
  },
  secondaryActions: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  secondaryButton: {
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 6,
  },
  secondaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "NotoKufiArabic-SemiBold",
  },
});
