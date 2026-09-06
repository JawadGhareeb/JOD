import { Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Switch, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import Text from "@/src/components/ui/Text";
import { usePersonalizationOptions, usePersonalizationProfile, useUpdatePersonalization } from "@/src/features/personalization/queries";
import type { PersonalizationMissingField, UserIntent } from "@/src/features/personalization/types";
import { useToast } from "@/src/providers/ToastProvider";
import { MenuPageHeader } from "./MenuPageHeader";

function Choice({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} className={`flex-row-reverse items-center gap-2 rounded-xl border px-3 py-2 ${selected ? "border-primary-400 bg-primary-100 dark:bg-primary-400/10" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}><View className={`h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"}`}>{selected ? <Check size={12} color="#fff" /> : null}</View><Text size="xs" weight={selected ? "semibold" : "regular"}>{label}</Text></Pressable>;
}

const missingLabels: Record<PersonalizationMissingField, string> = {
  intent: "طريقة استخدام جود",
  interests: "الاهتمامات",
  preferredCity: "المدينة المفضلة",
  capabilities: "قدرات المساعدة",
};

export function PersonalizationSettingsScreen() {
  const toast = useToast();
  const optionsQuery = usePersonalizationOptions();
  const profileQuery = usePersonalizationProfile();
  const updateMutation = useUpdatePersonalization();
  const [hydrated, setHydrated] = useState(false);
  const [intent, setIntent] = useState<UserIntent | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [capabilityIds, setCapabilityIds] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [remoteHelpEnabled, setRemoteHelpEnabled] = useState(false);
  const categories = useMemo(() => optionsQuery.data?.categories ?? [], [optionsQuery.data]);

  useEffect(() => {
    if (!profileQuery.data || hydrated) return;
    setIntent(profileQuery.data.intent);
    setCategoryIds(profileQuery.data.interests.filter((item) => item.selectedByUser).map((item) => item.category.id));
    setCapabilityIds(profileQuery.data.capabilities.map((item) => item.id));
    setCity(profileQuery.data.preferredCity ?? "");
    setRemoteHelpEnabled(profileQuery.data.remoteHelpEnabled);
    setHydrated(true);
  }, [hydrated, profileQuery.data]);

  const toggle = (id: string, values: string[], setter: (value: string[]) => void) => setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);

  const save = async () => {
    try {
      await updateMutation.mutateAsync({ intent, categoryIds, capabilityIds, preferredCity: city.trim() || null, remoteHelpEnabled });
      toast.success("تم تحديث تفضيلات المحتوى وستنعكس على الاقتراحات القادمة.");
    } catch {
      toast.error("تعذر تحديث التفضيلات. حاول مرة أخرى.");
    }
  };

  if (optionsQuery.isLoading || profileQuery.isLoading || !hydrated) {
    return <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تخصيص المحتوى" /><View className="gap-2"><SkeletonBlock width="100%" height={120} radius={16} /><SkeletonBlock width="100%" height={220} radius={16} /><SkeletonBlock width="100%" height={180} radius={16} /></View></Container>;
  }

  if (optionsQuery.isError || profileQuery.isError || !optionsQuery.data || !profileQuery.data) {
    return <Container className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تخصيص المحتوى" /><View className="items-center gap-3 pt-8"><Text size="sm" rtlAlign="center">تعذر تحميل تفضيلات المحتوى.</Text><Button onPress={() => { void optionsQuery.refetch(); void profileQuery.refetch(); }}>إعادة المحاولة</Button></View></Container>;
  }

  const missing = profileQuery.data.missingFields ?? [];
  const showCapabilities = intent !== "receiver";

  return <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="تخصيص المحتوى" /><View className="gap-2 pb-10">{missing.length > 0 ? <Card padding="md" className="gap-2 border-primary-200 bg-primary-50 dark:border-primary-400/30 dark:bg-primary-400/10"><Text size="sm" weight="semibold">حسّن الاقتراحات لك</Text><Text size="xs" className="leading-6 text-gray-600 dark:text-gray-300">يمكنك إضافة: {missing.map((field) => missingLabels[field]).join("، ")}.</Text></Card> : null}<Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">عدّل فقط المعلومات التي تريد استخدامها لتحسين المحتوى ومطابقة طلبات المساعدة.</Text><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف تستخدم جود؟ {missing.includes("intent") ? "• غير محدد" : ""}</Text><View className="gap-2">{optionsQuery.data.intents.map((item) => <Choice key={item.value} selected={intent === item.value} label={item.label} onPress={() => setIntent(item.value as UserIntent)} />)}</View></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">اهتماماتي {missing.includes("interests") ? "• غير محددة" : ""}</Text><View className="flex-row-reverse flex-wrap gap-2">{categories.map((item) => <Choice key={item.id} selected={categoryIds.includes(item.id)} label={item.name} onPress={() => toggle(item.id, categoryIds, setCategoryIds)} />)}</View></Card>{showCapabilities ? <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف يمكنك المساعدة؟ {missing.includes("capabilities") ? "• غير محددة" : ""}</Text><View className="flex-row-reverse flex-wrap gap-2">{optionsQuery.data.capabilities.map((item) => <Choice key={item.id} selected={capabilityIds.includes(item.id)} label={item.name} onPress={() => toggle(item.id, capabilityIds, setCapabilityIds)} />)}</View></Card> : null}<Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400"><Input label={`المدينة المفضلة${missing.includes("preferredCity") ? " • غير محددة" : ""}`} value={city} onChangeText={setCity} placeholder="مثال: دمشق" fullWidth /><View className="flex-row-reverse items-center justify-between"><View className="flex-1 gap-1"><Text size="sm" weight="semibold">المساعدة عن بُعد</Text><Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">اسمح بمطابقة طلبات مساعدة خارج مدينتك عندما تكون المساعدة عن بُعد مناسبة.</Text></View><Switch value={remoteHelpEnabled} onValueChange={setRemoteHelpEnabled} /></View></Card><Button fullWidth loading={updateMutation.isPending} disabled={updateMutation.isPending} onPress={save}>حفظ التغييرات</Button></View></Container>;
}
