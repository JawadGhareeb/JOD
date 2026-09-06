import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const usageRules = [
  "استخدام المنصة يجب أن يكون ضمن الأهداف الإنسانية والتطوعية فقط.",
  "يمنع نشر أي محتوى مضلل أو مسيء أو منتحل لصفة جهة أخرى.",
  "يلتزم المستخدم بتقديم معلومات صحيحة عند إنشاء منشور أو طلب دعم.",
];

const collectedData = [
  "بيانات الحساب الأساسية: الاسم، البريد الإلكتروني، ورقم الجوال.",
  "بيانات النشاط داخل التطبيق: المنشورات، التفاعلات، والمحفوظات.",
  "بيانات تقنية ضرورية لتحسين الأداء وحماية الحسابات من الاستخدام غير المصرح.",
];

const dataUsage = [
  "عرض المحتوى المناسب وتحسين تجربة المستخدم داخل التطبيق.",
  "إرسال إشعارات مرتبطة بالحساب أو تحديثات الحملات التي تهم المستخدم.",
  "مراجعة البلاغات وتعزيز إجراءات الأمان ومنع إساءة الاستخدام.",
];

export function TermsPrivacyScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="الشروط والخصوصية" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3 items-center">
          <Logo variant="small" />
        </View>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            سياسة الاستخدام
          </Text>
          <View className="mt-2 gap-1">
            {usageRules.map((rule) => (
              <Text key={rule} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
                • {rule}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            البيانات التي نجمعها
          </Text>
          <View className="mt-2 gap-1">
            {collectedData.map((item) => (
              <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
                • {item}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            كيف نستخدم البيانات
          </Text>
          <View className="mt-2 gap-1">
            {dataUsage.map((item) => (
              <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
                • {item}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            حماية الخصوصية
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            لا نقوم ببيع بيانات المستخدمين لأي طرف ثالث. يتم حفظ البيانات ضمن أنظمة آمنة مع
            ضوابط وصول داخلية، ويتم مشاركة الحد الأدنى الضروري فقط عند الحاجة التشغيلية أو
            القانونية.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            حقوق المستخدم
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            يمكنك طلب تحديث بياناتك أو حذفها أو الاستفسار عن طريقة المعالجة عبر مركز
            المساعدة أو البريد: support@jod.org
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
