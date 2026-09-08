import { ScrollView, View } from "react-native";
import Card from "@/src/components/ui/Card";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "./MenuPageHeader";

const usageRules = [
  "يستخدم الحساب والمحتوى ضمن الأهداف الإنسانية والمجتمعية والتطوعية المشروعة التي صُممت لها المنصة.",
  "يلتزم المستخدم بإدخال معلومات صحيحة قدر الإمكان وعدم انتحال صفة شخص أو جهة أخرى.",
  "يمنع نشر المحتوى المضلل أو المسيء أو الاحتيالي أو الذي ينتهك حقوق الآخرين أو يعرض سلامتهم للخطر.",
  "يجب عدم نشر كلمات المرور أو رموز التحقق أو المعلومات المالية شديدة الحساسية ضمن المنشورات العامة.",
  "يجوز للمنصة تقييد أو إخفاء أو حذف المحتوى المخالف واتخاذ الإجراءات اللازمة لحماية المستخدمين وسلامة الخدمة.",
];

const collectedData = [
  "بيانات الحساب الأساسية مثل الاسم والبريد الإلكتروني ورقم الجوال والمدينة والصورة التعريفية عند إضافتها.",
  "المحتوى والنشاط داخل المنصة مثل المنشورات، طلبات المساعدة، عروض المساعدة، التبرعات، طلبات التطوع، التعليقات، المحفوظات والبلاغات.",
  "بيانات التفضيلات التي يختارها المستخدم لتحسين ترتيب وعرض المحتوى.",
  "بيانات تقنية وتشغيلية ضرورية للأمان واستمرارية الخدمة، مثل معلومات الجلسة وسجلات الأخطاء والاستخدام المرتبطة بالتطبيق.",
];

const dataUsage = [
  "إنشاء الحساب وتشغيل الميزات التي يطلبها المستخدم وتقديم المحتوى والخدمات المرتبطة بها.",
  "ربط الأطراف في مسارات المساعدة أو التبرع أو التطوع وإظهار بيانات التواصل فقط عندما يسمح سياق الميزة بذلك.",
  "تخصيص المحتوى، إرسال الإشعارات، وتحسين تجربة الاستخدام وأداء المنصة.",
  "مراجعة البلاغات، الحد من إساءة الاستخدام، حماية الحسابات، والتحقق من سلامة العمليات.",
  "الوفاء بالمتطلبات التشغيلية أو القانونية عند وجود أساس يقتضي ذلك.",
];

const userResponsibilities = [
  "حماية بيانات الدخول وعدم مشاركة رمز التحقق أو كلمة المرور مع أي شخص.",
  "مراجعة المعلومات قبل إرسال طلب أو عرض مساعدة أو تبرع أو طلب تطوع.",
  "استخدام وسائل التواصل المتاحة بحذر وعدم إرسال بيانات حساسة لا يحتاجها الطرف الآخر.",
  "الإبلاغ عن أي محتوى أو سلوك يشتبه بأنه مضلل أو مسيء أو مخالف.",
];

export function TermsPrivacyScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="الشروط والخصوصية" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-3 items-center"><Logo variant="small" /></View>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">قبول الشروط</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            باستخدام منصة جود فإنك توافق على الالتزام بهذه الشروط وسياسة الخصوصية أثناء استخدام الحساب والميزات المتاحة. إذا لم توافق على أي جزء منها، يمكنك التوقف عن استخدام الخدمة والتواصل معنا للاستفسار عن بيانات حسابك.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">ضوابط الاستخدام</Text>
          <View className="mt-2 gap-1">
            {usageRules.map((rule) => <Text key={rule} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {rule}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">الحساب ومسؤولية المستخدم</Text>
          <View className="mt-2 gap-1">
            {userResponsibilities.map((item) => <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {item}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">المساعدة والتبرع والتطوع</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            توفر جود أدوات لتنظيم الطلبات والعروض والتواصل والمتابعة. لا تمثل المنصة، ما لم يذكر خلاف ذلك داخل ميزة محددة، طرفاً في الاتفاقات أو التحويلات التي تتم خارجها، ولا تضمن اكتمال أي مساعدة أو تطوع أو تبرع. يتحمل الأطراف مسؤولية التحقق من التفاصيل قبل الالتزام أو مشاركة معلومات إضافية.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">البيانات التي نعالجها</Text>
          <View className="mt-2 gap-1">
            {collectedData.map((item) => <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {item}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">كيف نستخدم البيانات؟</Text>
          <View className="mt-2 gap-1">
            {dataUsage.map((item) => <Text key={item} size="xs" className="leading-6 text-gray-600 dark:text-gray-200">• {item}</Text>)}
          </View>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">مشاركة البيانات والخصوصية</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            لا نبيع بيانات المستخدمين. قد تتم مشاركة الحد الأدنى اللازم من البيانات مع الجهة أو المستخدم المرتبط مباشرة بمسار طلبه، أو مع مزودي خدمات تقنيين يساعدون في تشغيل المنصة، أو عندما يكون الإفصاح مطلوباً بموجب التزام قانوني. نعمل على تقليل البيانات الظاهرة للعامة قدر الإمكان بحسب طبيعة كل ميزة.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">الأمان والاحتفاظ</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            نستخدم ضوابط تقنية وتنظيمية مناسبة لحماية البيانات وتقليل الوصول غير المصرح به. نحتفظ بالبيانات بالقدر اللازم لتشغيل الحساب والميزات ومعالجة الالتزامات المرتبطة بها، وقد نحتفظ ببعض السجلات لفترة إضافية عندما تكون ضرورية للأمان أو المتطلبات القانونية.
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">حقوقك وخياراتك</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            يمكنك تحديث المعلومات المتاحة من إعدادات الحساب، والاستفسار عن طريقة استخدام بياناتك أو طلب تصحيحها أو التعامل معها وفق الإمكانات والمتطلبات النظامية المتاحة. للتواصل بشأن الخصوصية أو الحساب: support@jod.org
          </Text>
        </Card>

        <Card padding="md" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">تحديث السياسة</Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-600 dark:text-gray-200">
            قد يتم تحديث هذه الشروط والسياسة عند إضافة ميزات جديدة أو تغير المتطلبات التشغيلية. يظهر الإصدار المحدث داخل التطبيق، ويعد استمرار استخدام الخدمة بعد نشر التحديث قبولاً له ضمن الحدود المسموح بها.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
