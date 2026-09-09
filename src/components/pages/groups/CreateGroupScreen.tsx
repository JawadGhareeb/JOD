import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Check, MapPin, Plus, Trash2, UsersRound } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { z } from "zod";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useCreateGroup } from "@/src/features/groups/queries";
import { GROUP_CATEGORIES, type GroupInviteCandidate } from "@/src/features/groups/types";
import { APP_ERROR_MESSAGES, FORM_ERROR_MESSAGES, getArabicErrorMessage } from "@/src/constants/error-messages";
import type { MediaUploadFile } from "@/src/features/media/types";
import { useToast } from "@/src/providers/ToastProvider";
import { AdminsPickerModal } from "./AdminsPickerModal";
import { GroupImagePicker } from "./GroupImagePicker";

const GOVERNORATE_OPTIONS: SelectionOption[] = [
  { label: "دمشق", value: "Damascus" },
  { label: "ريف دمشق", value: "Rif Dimashq" },
  { label: "حلب", value: "Aleppo" },
  { label: "حمص", value: "Homs" },
  { label: "حماة", value: "Hama" },
  { label: "اللاذقية", value: "Latakia" },
  { label: "طرطوس", value: "Tartus" },
  { label: "إدلب", value: "Idlib" },
  { label: "دير الزور", value: "Deir ez-Zor" },
  { label: "الرقة", value: "Raqqa" },
  { label: "الحسكة", value: "Hasakah" },
  { label: "درعا", value: "Daraa" },
  { label: "السويداء", value: "As-Suwayda" },
  { label: "القنيطرة", value: "Quneitra" },
];

const mediaFileSchema = z.object({
  uri: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
});

const inviteCandidateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

const groupFormSchema = z.object({
  name: z.string().trim().min(3, FORM_ERROR_MESSAGES.group.nameMin).max(120, FORM_ERROR_MESSAGES.group.nameMax),
  description: z.string().trim().min(10, FORM_ERROR_MESSAGES.group.descriptionMin).max(2000, FORM_ERROR_MESSAGES.group.descriptionMax),
  purpose: z.string().trim().min(10, FORM_ERROR_MESSAGES.group.purposeMin).max(1000, FORM_ERROR_MESSAGES.group.purposeMax),
  location: z.string().min(1, FORM_ERROR_MESSAGES.group.locationRequired).refine(
    (value) => GOVERNORATE_OPTIONS.some((option) => option.value === value),
    FORM_ERROR_MESSAGES.group.locationInvalid,
  ),
  categories: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.group.categoryRequired).max(8, FORM_ERROR_MESSAGES.group.categoryMax),
  rules: z.array(z.string().trim().min(1, FORM_ERROR_MESSAGES.group.ruleRequired).max(300, FORM_ERROR_MESSAGES.group.ruleMaxLength)).min(1, FORM_ERROR_MESSAGES.group.rulesRequired).max(20, FORM_ERROR_MESSAGES.group.rulesMax),
  invitedUsers: z.array(inviteCandidateSchema).min(1, FORM_ERROR_MESSAGES.group.inviteRequired).max(30, FORM_ERROR_MESSAGES.group.inviteMax),
  requiresPostApproval: z.boolean(),
  image: mediaFileSchema.nullable().refine((value) => value !== null, FORM_ERROR_MESSAGES.group.imageRequired),
});

type GroupFormInput = z.input<typeof groupFormSchema>;
type GroupFormValues = z.output<typeof groupFormSchema>;

export function CreateGroupScreen() {
  const router = useRouter();
  const toast = useToast();
  const mutation = useCreateGroup();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormInput, unknown, GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      purpose: "",
      location: "",
      categories: [],
      rules: [""],
      invitedUsers: [],
      requiresPostApproval: false,
      image: null,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const categories = watch("categories");
  const rules = watch("rules");
  const invitedUsers = watch("invitedUsers");
  const requiresPostApproval = watch("requiresPostApproval");
  const image = watch("image") as MediaUploadFile | null;
  const location = watch("location");
  const selectedLocationLabel = GOVERNORATE_OPTIONS.find((option) => option.value === location)?.label ?? "";

  const toggleCategory = (category: string) => {
    const next = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];
    setValue("categories", next, { shouldDirty: true, shouldValidate: true });
  };

  const updateRule = (index: number, value: string) => {
    setValue(
      "rules",
      rules.map((rule, itemIndex) => (itemIndex === index ? value : rule)),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeRule = (index: number) => {
    const next = rules.length === 1 ? [""] : rules.filter((_, itemIndex) => itemIndex !== index);
    setValue("rules", next, { shouldDirty: true, shouldValidate: true });
  };

  const submitValidForm = handleSubmit(
    async (values) => {
      try {
        const group = await mutation.mutateAsync({
          name: values.name.trim(),
          description: values.description.trim(),
          categories: values.categories,
          location: values.location,
          rules: values.rules.map((rule: string) => rule.trim()),
          purpose: values.purpose.trim(),
          invitedUsers: values.invitedUsers as GroupInviteCandidate[],
          requiresPostApproval: values.requiresPostApproval,
          image: values.image as MediaUploadFile,
        });
        toast.success("تم إرسال طلب إنشاء الفريق لإدارة جود.");
        router.replace({ pathname: "/groups/[id]", params: { id: group.id } });
      } catch (error) {
        toast.error(getArabicErrorMessage(error, APP_ERROR_MESSAGES.groups.create));
      }
    },
  );

  const onSubmit = async () => {
    const formIsValid = await trigger();
    if (!formIsValid) {
      toast.error(FORM_ERROR_MESSAGES.requiredFields);
      return;
    }
    await submitValidForm();
  };

  const busy = isSubmitting || mutation.isPending;

  return (
    <Container scrollable className="bg-light-100 dark:bg-dark-300">
      <MenuPageHeader title="إنشاء فريق تطوعي" />
      <View className="gap-4 pb-10">
        <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
          <View>
            <GroupImagePicker
              image={image}
              onChange={(file) => setValue("image", file, { shouldDirty: true, shouldValidate: true })}
              label="شعار الفريق *"
              hint="مطلوب، ويظهر بجانب اسم الفريق وفي نتائج البحث."
            />
            {errors.image?.message ? <Text size="2xs" className="mt-1 text-error-300">{errors.image.message}</Text> : null}
          </View>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">معلومات الفريق</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input fullWidth label="اسم الفريق *" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="اسم الفريق التطوعي" maxLength={120} error={errors.name?.message} showStatusIcon={false} />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input fullWidth label="وصف الفريق *" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="اكتب وصفاً واضحاً للفريق" multiline maxLength={2000} error={errors.description?.message} showStatusIcon={false} />
            )}
          />
          <Controller
            control={control}
            name="purpose"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input fullWidth label="هدف إنشاء الفريق *" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="ما الهدف من إنشاء هذا الفريق؟" multiline maxLength={1000} error={errors.purpose?.message} showStatusIcon={false} />
            )}
          />
          <Pressable onPress={() => setLocationPickerOpen(true)} accessibilityRole="button" accessibilityLabel="اختر المحافظة">
            <View pointerEvents="none">
              <Input
                fullWidth
                editable={false}
                label="المحافظة *"
                value={selectedLocationLabel}
                placeholder="اختر المحافظة السورية"
                error={errors.location?.message}
                rightIcon={<MapPin size={16} strokeWidth={2.25} />}
                showStatusIcon={false}
              />
            </View>
          </Pressable>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">توجهات الفريق *</Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">اختر توجهاً واحداً على الأقل، ويمكن اختيار أكثر من توجه.</Text>
          <View className="flex-row-reverse flex-wrap gap-2">
            {GROUP_CATEGORIES.map((category) => {
              const selected = categories.includes(category);
              return (
                <Pressable
                  key={category}
                  onPress={() => toggleCategory(category)}
                  className={`flex-row-reverse items-center gap-1 rounded-full border px-3 py-2 ${selected ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}
                >
                  {selected ? <Check size={13} color="#16A34A" /> : null}
                  <Text size="2xs" className={selected ? "text-primary-400" : "text-gray-600 dark:text-gray-300"}>{category}</Text>
                </Pressable>
              );
            })}
          </View>
          {errors.categories?.message ? <Text size="2xs" className="text-error-300">{errors.categories.message}</Text> : null}
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between">
            <Text weight="semibold" size="sm">قوانين الفريق *</Text>
            <Pressable
              onPress={() => setValue("rules", [...rules, ""], { shouldDirty: true, shouldValidate: true })}
              disabled={rules.length >= 20}
              className="flex-row-reverse items-center gap-1"
            >
              <Plus size={15} color="#16A34A" />
              <Text size="2xs" className="text-primary-400">إضافة قانون</Text>
            </Pressable>
          </View>
          {rules.map((rule, index) => (
            <View key={`rule-${index}`}>
              <View className="flex-row-reverse items-center gap-2">
                <View className="flex-1">
                  <Input
                    fullWidth
                    value={rule}
                    onChangeText={(value) => updateRule(index, value)}
                    placeholder={`القانون ${index + 1}`}
                    maxLength={300}
                    error={errors.rules?.[index]?.message}
                    showStatusIcon={false}
                  />
                </View>
                <Pressable onPress={() => removeRule(index)} hitSlop={8} accessibilityLabel={`حذف القانون ${index + 1}`}>
                  <Trash2 size={17} color="#E5484D" />
                </Pressable>
              </View>
            </View>
          ))}
          {typeof errors.rules?.message === "string" ? <Text size="2xs" className="text-error-300">{errors.rules.message}</Text> : null}
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">دعوة أعضاء *</Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">اختر مستخدماً واحداً على الأقل. أنت المالك ومدير الفريق بشكل افتراضي.</Text>
          <Button fullWidth variant="tertiary" onPress={() => setPickerOpen(true)}>
            <UsersRound size={16} />
            {invitedUsers.length > 0 ? `تم اختيار ${invitedUsers.length} أعضاء` : "اختيار مستخدمين للدعوة"}
          </Button>
          {errors.invitedUsers?.message ? <Text size="2xs" className="text-error-300">{errors.invitedUsers.message}</Text> : null}
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">مراجعة منشورات الأعضاء</Text>
          <Pressable
            onPress={() => setValue("requiresPostApproval", !requiresPostApproval, { shouldDirty: true })}
            className={`flex-row-reverse items-center justify-between rounded-xl border p-3 ${requiresPostApproval ? "border-primary-400 bg-primary-400/5" : "border-gray-200 dark:border-dark-400"}`}
          >
            <View className="flex-1 pe-3">
              <Text size="xs" weight="medium">يجب موافقة مدير الفريق قبل النشر</Text>
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">إذا فعلته، منشورات الأعضاء تبقى قيد المراجعة حتى تقبلها. منشوراتك كمالك تنشر مباشرة.</Text>
            </View>
            <View className={`h-6 w-11 rounded-full p-1 ${requiresPostApproval ? "bg-primary-400" : "bg-gray-300"}`}>
              <View className={`size-4 rounded-full bg-white ${requiresPostApproval ? "self-end" : "self-start"}`} />
            </View>
          </Pressable>
        </Card>

        <Button fullWidth loading={busy} disabled={busy} onPress={() => void onSubmit()}>
          إرسال طلب إنشاء الفريق
        </Button>
        <Text size="2xs" className="text-center text-gray-500 dark:text-gray-300">جميع الحقول أعلاه مطلوبة. عند الضغط على الإرسال ستظهر الأخطاء تحت أي حقل غير مكتمل.</Text>
      </View>

      <AdminsPickerModal
        visible={pickerOpen}
        selected={invitedUsers as GroupInviteCandidate[]}
        onClose={() => setPickerOpen(false)}
        onConfirm={(users) => {
          setValue("invitedUsers", users, { shouldDirty: true, shouldValidate: true });
          setPickerOpen(false);
        }}
      />
      <SelectionModal
        visible={locationPickerOpen}
        title="اختر المحافظة السورية"
        options={GOVERNORATE_OPTIONS}
        selectedValue={location}
        onSelect={(value) => {
          setValue("location", value, { shouldDirty: true, shouldValidate: true });
          setLocationPickerOpen(false);
        }}
        onClose={() => setLocationPickerOpen(false)}
      />
    </Container>
  );
}
