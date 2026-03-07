import { PrivacyCard, PrivacySection } from "@/components/pages";
import { Header } from "@/components/sections";
import Text from "@/components/ui/Text";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

const Privacy = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const privacySections: PrivacySection[] = [
    {
      title: "مقدمة",
      content:
        "نحن في منصة عطاء نلتزم بحماية خصوصية المستخدمين. توضح هذه السياسة كيفية جمع البيانات واستخدامها وحمايتها أثناء استخدام التطبيق.",
    },
    {
      title: "المعلومات التي نجمعها",
      content:
        "نجمع المعلومات التالية:\n\n• بيانات الحساب: الاسم، رقم الهاتف، البريد الإلكتروني (إن وجد)\n• بيانات المنشورات: العنوان، الوصف، التصنيف، الموقع التقريبي\n• بيانات الجهاز والاستخدام: نوع الجهاز، نظام التشغيل، أحداث الاستخدام داخل التطبيق",
    },
    {
      title: "كيف نستخدم معلوماتك",
      content:
        "نستخدم بياناتك من أجل:\n\n• تشغيل ميزات التطبيق الأساسية\n• عرض منشورات وحملات مناسبة للمستخدم\n• إرسال الإشعارات المرتبطة بالمنشورات والحملات والأمان\n• تحسين الجودة والأداء وتجربة الاستخدام",
    },
    {
      title: "مشاركة المعلومات",
      content:
        "لا نقوم ببيع بياناتك أو تأجيرها. قد تتم مشاركة بعض البيانات في الحالات التالية:\n\n• مع موافقتك الصريحة\n• للامتثال للأنظمة والقوانين\n• مع مزودي خدمات موثوقين مرتبطين بتشغيل المنصة",
    },
    {
      title: "حماية البيانات",
      content:
        "نستخدم تدابير أمنية مناسبة لحماية البيانات، مثل:\n\n• تأمين الاتصال ونقل البيانات\n• التحكم في صلاحيات الوصول\n• المراجعة الدورية وإدارة الحوادث الأمنية",
    },
    {
      title: "حقوقك",
      content:
        "لديك الحق في:\n\n• الوصول إلى معلوماتك الشخصية\n• تصحيح المعلومات غير الصحيحة\n• حذف معلوماتك الشخصية\n• تقييد معالجة معلوماتك\n• نقل بياناتك إلى خدمة أخرى\n• الاعتراض على معالجة معلوماتك",
    },
    {
      title: "ملفات تعريف الارتباط",
      content:
        "نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك وتحسين تجربتك. يمكنك إدارة ملفات تعريف الارتباط من إعدادات المتصفح.",
    },
    {
      title: "الاحتفاظ بالبيانات",
      content:
        "نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتوفير الخدمات. قد نحتفظ ببعض المعلومات لفترات أطول للامتثال للقوانين.",
    },
    {
      title: "تغييرات السياسة",
      content:
        "قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر التطبيق أو البريد الإلكتروني. استمرار استخدامك للتطبيق بعد التغييرات يعني موافقتك على السياسة المحدثة.",
    },
    {
      title: "التواصل معنا",
      content:
        "إذا كان لديك أي سؤال حول سياسة الخصوصية، يمكنك التواصل معنا عبر:\n\n• البريد الإلكتروني: privacy@ataa.app\n• الهاتف: +966 50 123 4567\n• العنوان: الرياض، المملكة العربية السعودية",
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? "bg-dark-300" : "bg-gray-50"}`}>
      <Header pageTitle="سياسة الخصوصية" showBackButton={true} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <View className="px-4 mb-6">
          <View
            className={`${isDark ? "bg-dark-500" : "bg-primary-300"} rounded-2xl p-4`}
          >
            <View className="flex-row items-center gap-2">
              <icons.shield size={20} color="#6949ff" />
              <Text
                size="xs"
                weight="semibold"
                color="primary"
                className="text-primary-400"
                rtlAlign="left"
              >
                آخر تحديث
              </Text>
            </View>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-primary-400"}`}
              rtlAlign="left"
            >
              تم تحديث هذه السياسة في 15 ديسمبر 2024
            </Text>
          </View>
        </View>

        {privacySections.map((section, index) => (
          <PrivacyCard key={index} section={section} />
        ))}

        <View className="px-4 mb-6">
          <View
            className={`${isDark ? "bg-dark-500" : "bg-gray-100"} rounded-2xl p-4`}
          >
            <Text
              size="xs"
              color="secondary"
              className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}
              rtlAlign="center"
            >
              للاستفسارات حول الخصوصية، يرجى التواصل معنا
            </Text>
            <Text
              size="2xs"
              color="secondary"
              className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center mt-2`}
              rtlAlign="center"
            >
              privacy@ataa.app | +966 50 123 4567
            </Text>
          </View>
        </View>

        <View className="px-4">
          <View
            className={`${isDark ? "bg-dark-500" : "bg-primary-300"} rounded-2xl p-4`}
          >
            <View className="flex-row items-center gap-2">
              <icons.info size={20} color="#6949ff" />
              <Text size="xs" weight="semibold" color="accent" rtlAlign="left">
                إشعار قانوني
              </Text>
            </View>
            <Text
              size="xs"
              className={`${isDark ? "text-light-50" : "text-primary-400"}`}
              rtlAlign="left"
            >
              هذه السياسة جزء من شروط الاستخدام. باستخدام تطبيق عطاء، فإنك
              توافق على هذه السياسة.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Privacy;
