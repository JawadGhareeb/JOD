import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import Card from "@/src/components/ui/Card";
import { CardSkeleton } from "@/src/components/ui/LoadingSkeleton";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useDonation } from "@/src/features/donations/queries";
import type { DonationStatus } from "@/src/features/donations/types";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

const statusLabels: Record<DonationStatus, string> = {
  pending: "بانتظار التواصل",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const formatAmount = (amount: number) =>
  `${amount.toLocaleString("ar-SY", { maximumFractionDigits: 2 })} ل.س`;

export default function DonationDetailsPage() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const donationId = Array.isArray(id) ? id[0] : id;
  const query = useDonation(donationId);
  const donation = query.data;

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تفاصيل التبرع" />
      {query.isLoading ? (
        <View className="gap-3">
          <CardSkeleton height={130} margin={0} />
          <CardSkeleton height={260} margin={0} />
        </View>
      ) : query.isError || !donation ? (
        <Card padding="md" className="border-gray-200 dark:border-dark-400">
          <Text size="sm" rtlAlign="center" className="text-error-300">
            تعذر تحميل تفاصيل التبرع.
          </Text>
        </Card>
      ) : (
        <View className="gap-3">
          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-start justify-between gap-3">
              <View className="flex-1">
                <Text weight="semibold" size="base" className="text-dark-100 dark:text-light-50">
                  {donation.campaignTitle}
                </Text>
                <Text size="xs" className="mt-1 text-gray-500 dark:text-gray-300">
                  {donation.organizationName ?? donation.organization ?? "منظمة غير محددة"}
                </Text>
              </View>
              <View className="rounded-full bg-primary-400/10 px-3 py-1">
                <Text size="2xs" weight="medium" className="text-primary-400">
                  {statusLabels[donation.status]}
                </Text>
              </View>
            </View>
            <Text weight="bold" size="lg" className="text-primary-400">
              {formatAmount(donation.amount)}
            </Text>
          </Card>

          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <DetailRow label="طريقة التواصل" value={donation.contactMethod} />
            <DetailRow label="طريقة الدفع" value={donation.paymentMethod} />
            <DetailRow label="رقم الهاتف" value={donation.phone} />
            <DetailRow label="المدينة" value={donation.city} />
            {donation.notes ? <DetailRow label="ملاحظات" value={donation.notes} /> : null}
            {donation.cancelReason ? (
              <DetailRow label="سبب الإلغاء" value={donation.cancelReason} error />
            ) : null}
          </Card>

          <Card padding="md" className="gap-2 border-gray-200 dark:border-dark-400">
            <Text weight="semibold" size="sm" className="mb-1 text-dark-100 dark:text-light-50">
              مسار الطلب
            </Text>
            <TimelineRow label="تم إرسال طلب التبرع" date={donation.createdAt} active />
            <TimelineRow label="تم بدء التواصل" date={donation.contactedAt} active={Boolean(donation.contactedAt)} />
            <TimelineRow label="تم الاتفاق" date={donation.agreedAt} active={Boolean(donation.agreedAt)} />
            <TimelineRow label="تم تأكيد استلام التبرع" date={donation.completedAt} active={Boolean(donation.completedAt)} success={Boolean(donation.completedAt)} />
            {donation.cancelledAt ? (
              <TimelineRow label="تم إلغاء الطلب" date={donation.cancelledAt} active error />
            ) : null}
          </Card>
        </View>
      )}
    </View>
  );
}

function DetailRow({
  label,
  value,
  error = false,
}: {
  label: string;
  value: string | null | undefined;
  error?: boolean;
}) {
  return (
    <View className="flex-row-reverse items-start justify-between gap-3 border-b border-gray-100 pb-2 dark:border-dark-400">
      <Text size="2xs" className="text-gray-500 dark:text-gray-300">
        {label}
      </Text>
      <Text
        size="xs"
        className={error ? "max-w-[65%] text-error-300" : "max-w-[65%] text-dark-100 dark:text-light-50"}
      >
        {value || "-"}
      </Text>
    </View>
  );
}

function TimelineRow({
  label,
  date,
  active,
  success = false,
  error = false,
}: {
  label: string;
  date: string | null;
  active: boolean;
  success?: boolean;
  error?: boolean;
}) {
  const stateClass = error
    ? "text-error-300"
    : success
      ? "text-success-100"
      : active
        ? "text-primary-400"
        : "text-gray-400";
  return (
    <View className="flex-row-reverse items-start justify-between gap-3 py-1">
      <Text size="2xs" weight="medium" className={stateClass}>
        {active ? "✓" : "○"} {label}
      </Text>
      <Text size="2xs" className="text-gray-400">
        {date ? formatRelativeDateAr(date) : ""}
      </Text>
    </View>
  );
}
