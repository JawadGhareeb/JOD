import { Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Switch, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import Text from "@/src/components/ui/Text";
import { APP_ERROR_MESSAGES, getArabicErrorMessage } from "@/src/constants/error-messages";
import { useCities } from "@/src/features/lookups/queries";
import { usePersonalizationOptions, usePersonalizationProfile, useUpdatePersonalization } from "@/src/features/personalization/queries";
import type { PersonalizationMissingField, UserIntent } from "@/src/features/personalization/types";
import { useToast } from "@/src/providers/ToastProvider";
import { MenuPageHeader } from "./MenuPageHeader";

function Choice({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row-reverse items-center gap-2 rounded-xl border px-3 py-2 ${
        selected
          ? "border-primary-400 bg-primary-100 dark:bg-primary-400/10"
          : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
      }`}
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"
        }`}
      >
        {selected ? <Check size={12} color="#fff" /> : null}
      </View>
      <Text size="xs" weight={selected ? "semibold" : "regular"}>
        {label}
      </Text>
    </Pressable>
  );
}

const missingLabels: Record<PersonalizationMissingField, string> = {
  intent: "طريقة استخدام جود",
  interests: "الاهتمامات",
  preferredCity: "مدينة",
  capabilities: "قدرات المساعدة",
};

type FieldErrors = {
  interests?: string;
  capabilities?: string;
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
  const [cities, setCities] = useState<string[]>([]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [remoteHelpEnabled, setRemoteHelpEnabled] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const categories = useMemo(() => optionsQuery.data?.categories ?? [], [optionsQuery.data]);
  const citiesQuery = useCities();
  const cityOptions: SelectionOption[] = useMemo(() => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })), [citiesQuery.data]);
  const showCapabilities = intent !== "receiver";

  useEffect(() => {
    if (!profileQuery.data || hydrated) return;
    setIntent(profileQuery.data.intent);
    setCategoryIds(profileQuery.data.interests.filter((item) => item.selectedByUser).map((item) => item.category.id));
    setCapabilityIds(profileQuery.data.capabilities.map((item) => item.id));
    setCities(profileQuery.data.preferredCities?.length ? profileQuery.data.preferredCities : profileQuery.data.preferredCity ? [profileQuery.data.preferredCity] : []);
    setRemoteHelpEnabled(profileQuery.data.remoteHelpEnabled);
    setHydrated(true);
  }, [hydrated, profileQuery.data]);

  const toggle = (id: string, values: string[], setter: (value: string[]) => void, field: keyof FieldErrors) => {
    const next = values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
    setter(next);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (categoryIds.length === 0) {
      errors.interests = "اختر اهتماماً واحداً على الأقل.";
    }
    if (showCapabilities && capabilityIds.length === 0) {
      errors.capabilities = "اختر طريقة مساعدة واحدة على الأقل.";
    }
    return errors;
  };

  const save = async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(errors.interests ?? errors.capabilities ?? "أكمل الحقول المطلوبة قبل الحفظ.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        intent,
        categoryIds,
        capabilityIds: showCapabilities ? capabilityIds : [],
        preferredCities: cities,
        remoteHelpEnabled,
      });
      toast.success("تم تحديث تفضيلات المحتوى وستنعكس على الاقتراحات القادمة.");
    } catch (error) {
      toast.error(getArabicErrorMessage(error, APP_ERROR_MESSAGES.preferences.update));
    }
  };

  if (optionsQuery.isLoading || profileQuery.isLoading || !hydrated) {
    return (
      <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
        <MenuPageHeader title="تخصيص المحتوى" />
        <View className="gap-2">
          <SkeletonBlock width="100%" height={120} radius={16} />
          <SkeletonBlock width="100%" height={220} radius={16} />
          <SkeletonBlock width="100%" height={180} radius={16} />
        </View>
      </Container>
    );
  }

  if (optionsQuery.isError || profileQuery.isError || !optionsQuery.data || !profileQuery.data) {
    return (
      <Container className="bg-light-100 px-4 dark:bg-dark-300">
        <MenuPageHeader title="تخصيص المحتوى" />
        <View className="items-center gap-3 pt-8">
          <Text size="sm" rtlAlign="center">
            تعذر تحميل تفضيلات المحتوى.
          </Text>
          <Button
            onPress={() => {
              void optionsQuery.refetch();
              void profileQuery.refetch();
            }}
          >
            إعادة المحاولة
          </Button>
        </View>
      </Container>
    );
  }

  const missing = profileQuery.data.missingFields ?? [];

  return (
    <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="تخصيص المحتوى" />
      <View className="gap-2 pb-10">
        {missing.length > 0 ? (
          <Card padding="md" className="gap-2 border-primary-200 bg-primary-50 dark:border-primary-400/30 dark:bg-primary-400/10">
            <Text size="sm" weight="semibold">
              حسّن الاقتراحات لك
            </Text>
            <Text size="xs" className="leading-6 text-gray-600 dark:text-gray-300">
              يمكنك إضافة: {missing.map((field) => missingLabels[field]).join("، ")}.
            </Text>
          </Card>
        ) : null}

        <Text size="xs" className="leading-6 text-gray-500 dark:text-gray-300">
          عدّل فقط المعلومات التي تريد استخدامها لتحسين المحتوى ومطابقة طلبات المساعدة.
        </Text>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text size="sm" weight="semibold">
            كيف تستخدم جود؟ {missing.includes("intent") ? "• غير محدد" : ""}
          </Text>
          <View className="gap-2">
            {optionsQuery.data.intents.map((item) => (
              <Choice
                key={item.value}
                selected={intent === item.value}
                label={item.label}
                onPress={() => {
                  setIntent(item.value as UserIntent);
                  if (item.value === "receiver") {
                    setFieldErrors((current) => ({ ...current, capabilities: undefined }));
                  }
                }}
              />
            ))}
          </View>
        </Card>

        <Card
          padding="md"
          className={`gap-3 dark:border-dark-400 ${
            fieldErrors.interests ? "border-error-300" : "border-gray-200"
          }`}
        >
          <Text size="sm" weight="semibold">
            اهتماماتي *{missing.includes("interests") ? " • غير محددة" : ""}
          </Text>
          <View className="flex-row-reverse flex-wrap gap-2">
            {categories.map((item) => (
              <Choice
                key={item.id}
                selected={categoryIds.includes(item.id)}
                label={item.name}
                onPress={() => toggle(item.id, categoryIds, setCategoryIds, "interests")}
              />
            ))}
          </View>
          {fieldErrors.interests ? (
            <Text size="2xs" className="text-error-300">
              {fieldErrors.interests}
            </Text>
          ) : null}
        </Card>

        {showCapabilities ? (
          <Card
            padding="md"
            className={`gap-3 dark:border-dark-400 ${
              fieldErrors.capabilities ? "border-error-300" : "border-gray-200"
            }`}
          >
            <Text size="sm" weight="semibold">
              كيف يمكنك المساعدة؟ *{missing.includes("capabilities") ? " • غير محددة" : ""}
            </Text>
            <View className="flex-row-reverse flex-wrap gap-2">
              {optionsQuery.data.capabilities.map((item) => (
                <Choice
                  key={item.id}
                  selected={capabilityIds.includes(item.id)}
                  label={item.name}
                  onPress={() => toggle(item.id, capabilityIds, setCapabilityIds, "capabilities")}
                />
              ))}
            </View>
            {fieldErrors.capabilities ? (
              <Text size="2xs" className="text-error-300">
                {fieldErrors.capabilities}
              </Text>
            ) : null}
          </Card>
        ) : null}

        <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
          <Pressable onPress={() => setIsCityModalOpen(true)} accessibilityRole="button" accessibilityLabel="اختر مدينة">
            <View pointerEvents="none">
              <Input label="مدينة" value={cities.join("، ")} editable={false} showStatusIcon={false} placeholder="اختر مدينة أو أكثر" fullWidth />
            </View>
          </Pressable>
          <View className="flex-row-reverse items-center justify-between">
            <View className="flex-1 gap-1">
              <Text size="sm" weight="semibold">
                المساعدة عن بُعد
              </Text>
              <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
                اسمح بمطابقة طلبات مساعدة خارج مدينتك عندما تكون المساعدة عن بُعد مناسبة.
              </Text>
            </View>
            <Switch value={remoteHelpEnabled} onValueChange={setRemoteHelpEnabled} />
          </View>
        </Card>

        <Button fullWidth loading={updateMutation.isPending} disabled={updateMutation.isPending} onPress={save}>
          حفظ التغييرات
        </Button>
        <SelectionModal visible={isCityModalOpen} title="اختر المدن" description="يمكنك اختيار أكثر من مدينة لتخصيص المحتوى القريب منك." options={cityOptions} multiple selectedValues={cities} onSelect={(value) => setCities((current) => current.includes(value) ? current.filter((city) => city !== value) : [...current, value])} onClose={() => setIsCityModalOpen(false)} />
      </View>
    </Container>
  );
}
