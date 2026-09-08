import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const platformServices = [
  "طلبات المساعدة: مساحة منظمة لشرح الاحتياج واستقبال عروض المساعدة ومتابعة حالة الطلب.",
  "حملات الدعم والتبرع: عرض الحملات ومتابعة تقدمها والتحديثات المرتبطة بها بصورة واضحة.",
  "فرص التطوع: ربط المستخدمين بالفرص المتاحة ومتابعة طلبات المشاركة وحالتها.",
  "الفرق التطوعية: إنشاء فرق مجتمعية، تنظيم الأعضاء والأدوار، ونشر المبادرات والأنشطة.",
  "المحتوى التوعوي: مقالات وفيديوهات ومحتوى معرفي يساهم في نشر الوعي وتشجيع العمل المجتمعي.",
];

const howItWorks = [
  "ينشئ المستخدم أو الجهة المحتوى المناسب ويضيف المعلومات اللازمة بوضوح.",
  "تخضع أنواع المحتوى التي تتطلب مراجعة لإجراءات الإشراف قبل أو أثناء ظهورها حسب طبيعتها.",
  "يتفاعل المجتمع من خلال التقديم أو عرض المساعدة أو التبرع أو التطوع وفق المسار المتاح.",
  "تُحدّث الحالات والإشعارات لتوضيح ما تم على الطلب أو الحملة أو فرصة التطوع.",
];

const principles = [
  "الشفافية: إظهار حالة الطلبات والحملات والتحديثات بصورة مفهومة.",
  "الخصوصية: تقليل إظهار بيانات التواصل الحساسة وحصرها في السياق الذي يحتاجها.",
  "المسؤولية: تشجيع المعلومات الصحيحة والإبلاغ عن المحتوى المخالف أو المضلل.",
  "التعاون: تسهيل الوصول بين الأفراد والفرق والمنظمات لخدمة المبادرات الإنسانية والمجتمعية.",
];

export function AboutScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="من نحن" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3 items-center"><Logo variant="small" /></View>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">منصة جود</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            جود منصة رقمية مجتمعية تهدف إلى تسهيل الوصول إلى فرص المساعدة والتطوع والدعم، وربط الأفراد والفرق التطوعية والمنظمات ضمن تجربة واضحة ومنظمة. صُممت المنصة لتقريب الاحتياج من القادر على المساهمة، مع أدوات للمتابعة والإشعارات وإدارة المحتوى.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">رؤيتنا</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            بناء بيئة رقمية موثوقة تساعد المجتمع على التعاون بصورة أسرع وأكثر وضوحاً، وتمنح المبادرات الإنسانية والتطوعية مساحة منظمة للوصول إلى الأشخاص المناسبين.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">رسالتنا</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            تسهيل طلب المساعدة وتقديمها، دعم العمل التطوعي، تحسين وضوح رحلة المستخدم، وتمكين المنظمات والفرق من إدارة مبادراتها ومحتواها بطريقة عملية ومسؤولة.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">ماذا نقدم؟</Text>
          <View className="mt-2 gap-1">
            {platformServices.map((service) => <Text key={service} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {service}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">كيف تعمل جود؟</Text>
          <View className="mt-2 gap-1">
            {howItWorks.map((step, index) => <Text key={step} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">{index + 1}. {step}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">مبادئنا</Text>
          <View className="mt-2 gap-1">
            {principles.map((item) => <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {item}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">دور المنصة</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            جود توفر الأدوات الرقمية للتواصل والتنظيم والمتابعة، ولا تعني إتاحة المحتوى وحدها ضمان نتيجة المساعدة أو صحة أي اتفاق يتم خارج المسارات التي تديرها المنصة. ننصح المستخدم دائماً بالتحقق من المعلومات وعدم مشاركة بيانات حساسة إلا عند الحاجة.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">التواصل</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-500 dark:text-gray-300">
            للاستفسارات المتعلقة بالمنصة أو الخصوصية: support@jod.org{"\n"}الإصدار الحالي: 1.0.0
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
