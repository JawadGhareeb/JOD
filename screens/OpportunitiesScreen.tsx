import { OpportunityCard } from "@/components/pages";
import { Header } from "@/components/sections";
import { Container } from "@/components/ui";
import React from "react";
import { View } from "react-native";

const OpportunitiesScreen = () => {
  const opportunities = [
    {
      title: "مطور تطبيقات",
      description:
        "مطلوب مطور تطبيقات جوال بخبرة 3 سنوات في React Native وTypeScript",
      location: "الرياض",
    },
    {
      title: "مصمم جرافيك",
      description:
        "مطلوب مصمم جرافيك محترف للعمل على مشاريع خيرية وحملات توعوية",
      location: "جدة",
    },
    {
      title: "مدير مشاريع",
      description:
        "مطلوب مدير مشاريع لإدارة الحملات الخيرية والتطوعية بخبرة 5 سنوات",
      location: "الرياض",
    },
    {
      title: "محاسب",
      description:
        "مطلوب محاسب للعمل في الجمعيات الخيرية بخبرة في المحاسبة المالية",
      location: "الدمام",
    },
    {
      title: "منسق حملات",
      description: "مطلوب منسق حملات خيرية لتنظيم وإدارة الفعاليات التطوعية",
      location: "مكة المكرمة",
    },
    {
      title: "كاتب محتوى",
      description:
        "مطلوب كاتب محتوى عربي للعمل على المحتوى التسويقي للحملات الخيرية",
      location: "الرياض",
    },
    {
      title: "مصور فوتوغرافي",
      description: "مطلوب مصور فوتوغرافي لتوثيق الحملات الخيرية والفعاليات",
      location: "المدينة المنورة",
    },
    {
      title: "أخصائي اجتماعي",
      description:
        "مطلوب أخصائي اجتماعي للعمل مع الأسر المحتاجة وتقديم الدعم النفسي",
      location: "الرياض",
    },
    {
      title: "مترجم",
      description:
        "مطلوب مترجم للترجمة بين العربية والإنجليزية للمشاريع الدولية",
      location: "جدة",
    },
    {
      title: "مستشار قانوني",
      description:
        "مطلوب مستشار قانوني متخصص في القانون الخيري والمنظمات غير الربحية",
      location: "الرياض",
    },
  ];

  return (
    <Container>
      <Header pageTitle="فرص العمل" showBackButton={false} />
      <Container scrollable>
        <View className="gap-4">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              title={opportunity.title}
              description={opportunity.description}
              location={opportunity.location}
            />
          ))}
        </View>
      </Container>
    </Container>
  );
};

export default OpportunitiesScreen;
