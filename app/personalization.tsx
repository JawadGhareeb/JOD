import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import Text from "@/src/components/ui/Text";
import { useCompleteOnboarding, usePersonalizationOptions } from "@/src/features/personalization/queries";
import type { AvailabilityStatus, UserIntent } from "@/src/features/personalization/types";
import { useToast } from "@/src/providers/ToastProvider";

function Choice({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} className={`flex-row-reverse items-center gap-2 rounded-xl border px-3 py-2 ${selected ? "border-primary-400 bg-primary-100 dark:bg-primary-400/10" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}><View className={`h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"}`}>{selected ? <Check size={12} color="#fff" /> : null}</View><Text size="xs" weight={selected ? "semibold" : "regular"}>{label}</Text></Pressable>;
}

export default function PersonalizationScreen() {
  const router = useRouter();
  const toast = useToast();
  const optionsQuery = usePersonalizationOptions();
  const completeMutation = useCompleteOnboarding();
  const [intent, setIntent] = useState<UserIntent>("both");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [capabilityIds, setCapabilityIds] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus | null>(null);
  const canSubmit = categoryIds.length > 0 && !completeMutation.isPending;
  const categories = useMemo(() => optionsQuery.data?.categories ?? [], [optionsQuery.data]);

  const toggle = (id: string, values: string[], setter: (value: string[]) => void) => setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);

  const submit = async () => {
    if (!canSubmit) return;
    try {
      await completeMutation.mutateAsync({ intent, categoryIds, capabilityIds, preferredCity: city.trim() || null, availabilityStatus });
      toast.success("تم حفظ تفضيلاتك وسنستخدمها لتحسين المحتوى المقترح.");
      router.replace("/(tabs)/home");
    } catch {
      toast.error("تعذر حفظ التفضيلات. حاول مرة أخرى.");
    }
  };

  if (optionsQuery.isLoading) {
    return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4"><SkeletonBlock width="58%" height={24} /><SkeletonBlock width="100%" height={110} radius={16} /><SkeletonBlock width="100%" height={220} radius={16} /><SkeletonBlock width="100%" height={180} radius={16} /></View></Container>;
  }

  if (optionsQuery.isError || !optionsQuery.data) {
    return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="items-center gap-3"><Text size="sm" rtlAlign="center">تعذر تحميل خيارات التخصيص.</Text><Button onPress={() => void optionsQuery.refetch()}>إعادة المحاولة</Button></View></Container>;
  }

  return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4 pb-10"><View className="gap-2"><Text variant="heading" weight="bold" rtlAlign="right">خصص تجربتك في جود</Text><Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">اختر اهتماماتك ونوع المساعدة التي تهمك. يمكنك تعديلها لاحقاً.</Text></View><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف تستخدم جود؟</Text><View className="gap-2">{optionsQuery.data.intents.map((item) => <Choice key={item.value} selected={intent === item.value} label={item.label} onPress={() => setIntent(item.value as UserIntent)} />)}</View></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">ما المجالات التي تهمك؟</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">اختر مجالاً واحداً على الأقل.</Text><View className="flex-row-reverse flex-wrap gap-2">{categories.map((item) => <Choice key={item.id} selected={categoryIds.includes(item.id)} label={item.name} onPress={() => toggle(item.id, categoryIds, setCategoryIds)} />)}</View></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف يمكنك المساعدة؟</Text><View className="flex-row-reverse flex-wrap gap-2">{optionsQuery.data.capabilities.map((item) => <Choice key={item.id} selected={capabilityIds.includes(item.id)} label={item.name} onPress={() => toggle(item.id, capabilityIds, setCapabilityIds)} />)}</View></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Input label="المدينة المفضلة" value={city} onChangeText={setCity} placeholder="مثال: دمشق" fullWidth /><Text size="sm" weight="semibold">وقت التوفر</Text><View className="flex-row-reverse flex-wrap gap-2">{optionsQuery.data.availabilityStatuses.map((item) => <Choice key={item.value} selected={availabilityStatus === item.value} label={item.label} onPress={() => setAvailabilityStatus(item.value as AvailabilityStatus)} />)}</View></Card><Button fullWidth disabled={!canSubmit} loading={completeMutation.isPending} onPress={submit}>حفظ ومتابعة</Button></View></Container>;
}
