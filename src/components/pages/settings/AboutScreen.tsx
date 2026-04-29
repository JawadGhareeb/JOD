import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const platformServices = [
  "نشر حملات التبرع والفرص التطوعية وطلبات المساعدة بصورة منظمة.",
  "متابعة تحديثات الحملات والأثر الفعلي عبر محتوى واضح ومباشر.",
  "تسهيل الوصول بين المتبرعين، المتطوعين، والجهات الموثوقة.",
];

const verificationFlow = [
  "مراجعة أولية للمحتوى قبل ظهوره ضمن الصفحات العامة.",
  "متابعة البلاغات المجتمعية والتعامل معها بسرعة.",
  "تحديثات دورية للحملات لرفع مستوى الشفافية والثقة.",
];

export function AboutScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="من نحن" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3 items-center">
          <Logo variant="small" />
        </View>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            منصة جود
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            منصة إنسانية تهدف لربط المحتاجين بالمتبرعين والمتطوعين عبر تجربة رقمية بسيطة،
            محتوى موثوق، ومسار واضح للوصول إلى الحالات الأكثر أولوية.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            رؤيتنا ورسالتنا
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            نعمل على بناء مجتمع رقمي متعاون يدعم العمل الإنساني بطريقة مستدامة. رسالتنا هي
            تسهيل المساهمة، رفع مستوى الشفافية، وتعزيز أثر المبادرات المحلية.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            ما الذي نقدمه؟
          </Text>
          <View className="mt-2 gap-1">
            {platformServices.map((service) => (
              <Text key={service} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
                • {service}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            كيف نتحقق من المحتوى؟
          </Text>
          <View className="mt-2 gap-1">
            {verificationFlow.map((step) => (
              <Text key={step} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">
                • {step}
              </Text>
            ))}
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            قيمنا
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            الشفافية، المسؤولية، والعمل الجماعي هي القيم الأساسية التي توجه قراراتنا داخل
            المنصة.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            الإصدار والتواصل
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-500 dark:text-gray-300">
            الإصدار الحالي: 1.0.0{"\n"}للتواصل: support@jod.org
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
