import { ScrollView, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import Card from "@/src/components/ui/Card";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import Button from "@/src/components/ui/Button";
import { getPrimaryColor } from "@/src/theme";
import { MenuPageHeader } from "./MenuPageHeader";

type FaqItem = {
  title: string;
  hint: string;
  Icon: (typeof appIcons)[keyof typeof appIcons];
  route: Href;
};

const faqItems: FaqItem[] = [
  {
    title: "كيف أضيف منشور جديد؟",
    hint: "دليل عملي خطوة بخطوة لنشر منشور واضح وموثوق.",
    Icon: appIcons.createPost,
    route: { pathname: "/blogs/[id]", params: { id: "blog-6" } },
  },
  {
    title: "كيف أتابع حالة التبرع؟",
    hint: "كيفية قراءة التحديثات وفهم نسبة الإنجاز والأثر.",
    Icon: appIcons.myDonations,
    route: { pathname: "/blogs/[id]", params: { id: "blog-3" } },
  },
  {
    title: "كيف أتواصل مع الجهة الناشرة؟",
    hint: "أفضل الممارسات للتواصل وطلب المعلومات قبل التبرع.",
    Icon: appIcons.comments,
    route: { pathname: "/blogs/[id]", params: { id: "blog-1" } },
  },
  {
    title: "كيف أبلغ عن محتوى غير مناسب؟",
    hint: "متى تستخدم البلاغ، وما البيانات التي تفيد فريق المراجعة.",
    Icon: appIcons.shield,
    route: { pathname: "/blogs/[id]", params: { id: "blog-12" } },
  },
];

const ArrowIcon = appIcons.chevronLeft;

export function HelpCenterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="مركز المساعدة" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3 items-center">
          <Logo variant="small" />
        </View>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            أكثر الأسئلة شيوعًا
          </Text>
          <View className="mt-3 gap-2">
            {faqItems.map((item) => (
              <Card
                key={item.title}
                padding="sm"
                className="border-gray-200 dark:border-dark-400"
                onPress={() => router.push(item.route)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View className="flex-row-reverse items-center justify-between">
                  <View className="flex-1 flex-row-reverse items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-dark-350">
                      <item.Icon size={18} color={primaryColor} strokeWidth={2.25} />
                    </View>
                    <View className="flex-1">
                      <Text
                        weight="semibold"
                        size="sm"
                        className="text-dark-100 dark:text-light-50"
                      >
                        {item.title}
                      </Text>
                      <Text size="xs" className="text-gray-500 dark:text-gray-300">
                        {item.hint}
                      </Text>
                    </View>
                  </View>
                  <ArrowIcon size={16} color="#9CA3AF" strokeWidth={2.25} />
                </View>
              </Card>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            تواصل معنا
          </Text>
          <Text size="xs" className="mt-2 text-gray-500 dark:text-gray-300">
            support@jod.org
          </Text>
          <View className="mt-3">
            <Button fullWidth size="small">فتح تذكرة دعم</Button>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
