import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";
import { mockMenuPayload } from "@/src/data/mockMenu";
import { appIcons } from "@/src/components/layout/iconMap";
import type { DonationFlow } from "@/src/types/menu";
import { MenuPageHeader } from "./MenuPageHeader";

const DONATION_FLOW_LABELS: Record<DonationFlow, string> = {
  contributed: "تبرعات أنا متبرع فيها",
  received: "تبرعات وصلت إلي",
};

const HeartIcon = appIcons.myDonations;

function formatAmount(amount: number) {
  return `${amount.toLocaleString("en-US")} ل.س`;
}

export function MyDonationsScreen() {
  const [selectedFlow, setSelectedFlow] = useState<DonationFlow>("contributed");

  const filteredDonations = useMemo(
    () => mockMenuPayload.myDonations.filter((item) => item.flow === selectedFlow),
    [selectedFlow],
  );

  const flowItems = useMemo(() =>
    (Object.keys(DONATION_FLOW_LABELS) as DonationFlow[]).map((key) => ({
      key,
      label: DONATION_FLOW_LABELS[key],
      count: mockMenuPayload.myDonations.filter((item) => item.flow === key).length,
    })), []);

  const totalAmount = useMemo(
    () => filteredDonations.reduce((sum, item) => sum + item.donatedAmount, 0),
    [filteredDonations],
  );

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تبرعاتي" />

      <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-center justify-between">
          <View>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              {selectedFlow === "contributed" ? "إجمالي تبرعاتي" : "إجمالي المبالغ التي وصلتني"}
            </Text>
            <Text weight="semibold" size="base" className="mt-1 text-primary-400">
              {formatAmount(totalAmount)}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
            <HeartIcon size={20} color="#405d72" strokeWidth={2.25} />
          </View>
        </View>
      </Card>

      <View className="mb-3 flex-row-reverse gap-2">
        {flowItems.map((item) => {
          const isActive = selectedFlow === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setSelectedFlow(item.key)}
              className={`flex-1 rounded-2xl border px-3 py-3 ${
                isActive
                  ? "border-primary-400 bg-primary-400/15"
                  : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
              }`}
            >
              <View className="flex-row-reverse items-center justify-center gap-2">
                <Text
                  size="xs"
                  weight="medium"
                  className={isActive ? "text-primary-400" : "text-gray-500 dark:text-gray-300"}
                >
                  {item.label}
                </Text>
                <View
                  className={`size-5 items-center justify-center rounded-full ${
                    isActive ? "bg-primary-400" : "bg-gray-200 dark:bg-dark-350"
                  }`}
                >
                  <Text
                    size="2xs"
                    weight="medium"
                    className={isActive ? "text-light-50" : "text-gray-600 dark:text-gray-200"}
                  >
                    {item.count}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredDonations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const progress = Math.min(100, (item.donatedAmount / item.targetAmount) * 100);

          return (
            <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                {item.campaignTitle}
              </Text>

              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                {item.organization} • {item.date}
              </Text>

              <View className="mt-3 flex-row-reverse items-center justify-between">
                <Text size="xs" className="text-gray-600 dark:text-gray-200">
                  {selectedFlow === "contributed" ? "مساهمتي" : "المبلغ الواصل إلي"}: {formatAmount(item.donatedAmount)}
                </Text>
                <Text size="xs" className="text-gray-600 dark:text-gray-200">
                  الهدف: {formatAmount(item.targetAmount)}
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-dark-350">
                <View style={{ width: `${progress}%` }} className="h-full rounded-full bg-primary-400" />
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              {selectedFlow === "contributed"
                ? "لا توجد تبرعات قمت بها حالياً."
                : "لا توجد تبرعات وصلت إليك حالياً."}
            </Text>
          </View>
        }
      />
    </View>
  );
}
