import { useRouter } from "expo-router";
import { Check, MapPin } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import Text from "@/src/components/ui/Text";
import { useCities } from "@/src/features/lookups/queries";
import { useCompleteOnboarding, usePersonalizationOptions, useSkipPersonalizationOnboarding } from "@/src/features/personalization/queries";
import type { CompleteOnboardingInput, UserIntent } from "@/src/features/personalization/types";
import { useToast } from "@/src/providers/ToastProvider";

function Choice({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} className={`flex-row-reverse items-center gap-2 rounded-xl border px-3 py-2 ${selected ? "border-primary-400 bg-primary-100 dark:bg-primary-400/10" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}><View className={`h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"}`}>{selected ? <Check size={12} color="#fff" /> : null}</View><Text size="xs" weight={selected ? "semibold" : "regular"}>{label}</Text></Pressable>;
}

export default function PersonalizationScreen() {
  const router = useRouter();
  const toast = useToast();
  const optionsQuery = usePersonalizationOptions();
  const completeMutation = useCompleteOnboarding();
  const skipMutation = useSkipPersonalizationOnboarding();
  const [intent, setIntent] = useState<UserIntent | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [capabilityIds, setCapabilityIds] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [touched, setTouched] = useState({ intent: false, interests: false, capabilities: false, preferredCity: false });
  const isBusy = completeMutation.isPending || skipMutation.isPending;
  const categories = useMemo(() => optionsQuery.data?.categories ?? [], [optionsQuery.data]);
  const showCapabilities = intent !== "receiver";
  const citiesQuery = useCities();
  const cityOptions: SelectionOption[] = useMemo(
    () => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })),
    [citiesQuery.data],
  );

  const toggle = (id: string, values: string[], setter: (value: string[]) => void) => setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);

  const submit = async () => {
    if (isBusy) return;
    const payload: CompleteOnboardingInput = {};
    if (touched.intent) payload.intent = intent;
    if (touched.interests) payload.categoryIds = categoryIds;
    if (touched.capabilities) payload.capabilityIds = capabilityIds;
    if (touched.preferredCity) payload.preferredCity = city.trim() || null;

    try {
      await completeMutation.mutateAsync(payload);
      toast.success("تم حفظ اختياراتك وسنستخدمها لتحسين المحتوى المقترح.");
      router.replace("/(tabs)/home");
    } catch {
      toast.error("تعذر حفظ التفضيلات. بقيت اختياراتك محفوظة على الشاشة للمحاولة مجدداً.");
    }
  };

  const skip = async () => {
    if (isBusy) return;
    try {
      await skipMutation.mutateAsync();
      toast.info("يمكنك تخصيص المحتوى لاحقاً من الإعدادات.");
      router.replace("/(tabs)/home");
    } catch {
      toast.error("تعذر تخطي خطوة التخصيص. حاول مرة أخرى.");
    }
  };

  if (optionsQuery.isLoading) {
    return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4"><SkeletonBlock width="58%" height={24} /><SkeletonBlock width="100%" height={110} radius={16} /><SkeletonBlock width="100%" height={220} radius={16} /><SkeletonBlock width="100%" height={180} radius={16} /></View></Container>;
  }

  if (optionsQuery.isError || !optionsQuery.data) {
    return <Container className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="items-center gap-3"><Text size="sm" rtlAlign="center">تعذر تحميل خيارات التخصيص.</Text><Button onPress={() => void optionsQuery.refetch()}>إعادة المحاولة</Button></View></Container>;
  }

  return <Container scrollable className="bg-light-100 px-4 pt-6 dark:bg-dark-300"><View className="gap-4 pb-10"><View className="gap-2"><Text variant="heading" weight="bold" rtlAlign="right">خصص تجربتك في جود</Text><Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">كل المعلومات اختيارية. اختر ما يناسبك الآن أو تخطَّ الخطوة وأكملها لاحقاً.</Text></View><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف تستخدم جود؟</Text><View className="gap-2">{optionsQuery.data.intents.map((item) => <Choice key={item.value} selected={intent === item.value} label={item.label} onPress={() => { setIntent(item.value as UserIntent); setTouched((value) => ({ ...value, intent: true })); }} />)}</View></Card><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">ما المجالات التي تهمك؟</Text><View className="flex-row-reverse flex-wrap gap-2">{categories.map((item) => <Choice key={item.id} selected={categoryIds.includes(item.id)} label={item.name} onPress={() => { toggle(item.id, categoryIds, setCategoryIds); setTouched((value) => ({ ...value, interests: true })); }} />)}</View></Card>{showCapabilities ? <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">كيف يمكنك المساعدة؟</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">اختياري، ويفيد في مطابقة طلبات المساعدة المناسبة لقدراتك.</Text><View className="flex-row-reverse flex-wrap gap-2">{optionsQuery.data.capabilities.map((item) => <Choice key={item.id} selected={capabilityIds.includes(item.id)} label={item.name} onPress={() => { toggle(item.id, capabilityIds, setCapabilityIds); setTouched((value) => ({ ...value, capabilities: true })); }} />)}</View></Card> : null}<Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Pressable onPress={() => setIsCityModalOpen(true)} accessibilityRole="button" accessibilityLabel="اختر المدينة المفضلة"><View pointerEvents="none"><Input label="المدينة المفضلة" editable={false} showStatusIcon={false} rightIcon={<MapPin size={16} strokeWidth={2.25} />} value={city} placeholder="اختر المدينة" fullWidth /></View></Pressable></Card><Button fullWidth disabled={isBusy} loading={completeMutation.isPending} onPress={submit}>حفظ ومتابعة</Button><Button fullWidth variant="tertiary" disabled={isBusy} loading={skipMutation.isPending} onPress={skip}>تخطي الآن</Button><Text size="2xs" rtlAlign="center" className="text-gray-500 dark:text-gray-300">التخصيص غير إلزامي، ويمكن لجود تحسين الاقتراحات تدريجياً من تفاعلك.</Text><SelectionModal visible={isCityModalOpen} title="اختر المدينة المفضلة" options={cityOptions} selectedValue={city} onSelect={(value) => { setCity(value); setTouched((state) => ({ ...state, preferredCity: true })); setIsCityModalOpen(false); }} onClose={() => setIsCityModalOpen(false)} /></View></Container>;
}
