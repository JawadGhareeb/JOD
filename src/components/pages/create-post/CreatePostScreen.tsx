import { useMemo, useState } from "react";
import { MapPin } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import type { CreatePostType } from "@/src/types/menu";
import { MenuPageHeader } from "../settings/MenuPageHeader";

const PlusIcon = appIcons.createPost;
const TitleIcon = appIcons.campaign;
const DescriptionIcon = appIcons.about;

const postTypes: Array<{ key: CreatePostType; label: string; hint: string }> = [
  { key: "volunteer", label: "فرصة تطوع", hint: "مناسب لطلبات المتطوعين" },
  { key: "donation", label: "حملة تبرع", hint: "مناسب لجمع التبرعات" },
  { key: "help", label: "طلب مساعدة", hint: "مناسب لحالات الدعم الفردية" },
];

const cityOptions: SelectionOption[] = [
  { label: "دمشق", value: "دمشق" },
  { label: "حلب", value: "حلب" },
  { label: "حمص", value: "حمص" },
  { label: "حماة", value: "حماة" },
  { label: "اللاذقية", value: "اللاذقية" },
  { label: "طرطوس", value: "طرطوس" },
  { label: "درعا", value: "درعا" },
  { label: "السويداء", value: "السويداء" },
  { label: "دير الزور", value: "دير الزور" },
  { label: "الرقة", value: "الرقة" },
  { label: "إدلب", value: "إدلب" },
];

type CreatePostScreenProps = {
  showPageHeader?: boolean;
};

export function CreatePostScreen({ showPageHeader = true }: CreatePostScreenProps = {}) {
  const [postType, setPostType] = useState<CreatePostType>("volunteer");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const typeHint = useMemo(
    () => postTypes.find((type) => type.key === postType)?.hint,
    [postType],
  );
  const canPublish = title.trim().length > 3 && city.trim().length > 1 && details.trim().length > 10;

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      {showPageHeader ? <MenuPageHeader title="نشر بوست" /> : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28, paddingTop: showPageHeader ? 0 : 12 }}
      >
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            قبل النشر
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-500 dark:text-gray-300">
            اكتب عنوان واضح، وصف مختصر ومباشر، وأضف صور حقيقية لزيادة موثوقية المنشور.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
            نوع المنشور
          </Text>

          <View className="flex-row-reverse gap-2">
            {postTypes.map((type) => {
              const isActive = postType === type.key;
              return (
                <Pressable
                  key={type.key}
                  onPress={() => setPostType(type.key)}
                  className={`flex-1 items-center justify-center rounded-xl border px-2 py-3 ${
                    isActive
                      ? "border-primary-400 bg-primary-400/10"
                      : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
                  }`}
                >
                  <Text
                    weight="medium"
                    size="2xs"
                    className={`text-center ${isActive ? "text-primary-400" : "text-dark-100 dark:text-light-50"}`}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text size="2xs" className="mt-3 text-gray-500 dark:text-gray-300">
            {typeHint}
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
            تفاصيل المنشور
          </Text>

          <View className="gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              عنوان المنشور *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<TitleIcon size={16} strokeWidth={2.25} />}
              value={title}
              onChangeText={setTitle}
              placeholder="مثال: حملة دعم طلاب المدارس"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              المدينة *
            </Text>
            <Pressable
              onPress={() => setIsCityModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="اختيار المدينة"
            >
              <View pointerEvents="none">
                <Input
                  fullWidth
                  editable={false}
                  showStatusIcon={false}
                  inputClassName="font-noto text-xs"
                  rightIcon={<MapPin size={16} strokeWidth={2.25} />}
                  value={city}
                  placeholder="اختر المدينة"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Pressable>

            <View className="mt-1 flex-row-reverse items-center justify-between">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                وصف المنشور *
              </Text>
              <Text size="2xs" className="text-gray-400 dark:text-gray-300">
                {details.trim().length}/300
              </Text>
            </View>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="min-h-[96px] font-noto text-xs"
              inputContainerClassName="min-h-[120px] items-start py-3"
              rightIcon={<DescriptionIcon size={16} strokeWidth={2.25} />}
              value={details}
              onChangeText={setDetails}
              placeholder="اشرح الهدف من المنشور، الفئة المستهدفة، وكيف يمكن المساعدة."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              maxLength={300}
            />
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <View className="mb-3 flex-row-reverse items-center justify-between">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              صور المنشور
            </Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              0/4 صور
            </Text>
          </View>
          <Text size="2xs" className="mb-2 text-gray-500 dark:text-gray-300">
            إضافة صورة واحدة على الأقل ترفع فرصة التفاعل
          </Text>
          <View className="flex-row-reverse gap-2">
            <Pressable className="h-24 flex-1 items-center justify-center rounded-xl border border-dashed border-primary-200 bg-primary-100/50 dark:border-dark-400 dark:bg-dark-500">
              <PlusIcon size={18} color="#405d72" strokeWidth={2.25} />
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                إضافة صورة
              </Text>
            </Pressable>
            <Pressable className="h-24 flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white dark:border-dark-400 dark:bg-dark-500">
              <PlusIcon size={18} color="#405d72" strokeWidth={2.25} />
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                إضافة صورة
              </Text>
            </Pressable>
          </View>
        </Card>

        <Card padding="sm" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            بالضغط على نشر الآن أنت توافق على سياسات المحتوى في المنصة.
          </Text>
        </Card>

        <View className="mb-2 flex-row-reverse items-stretch gap-2">
          <View className="min-w-0 flex-1">
            <Button fullWidth size="small" disabled={!canPublish}>
              نشر الآن
            </Button>
          </View>
          <View className="min-w-0 flex-1">
            <Button fullWidth size="small" variant="tertiary">
              حفظ كمسودة
            </Button>
          </View>
        </View>

        {!canPublish ? (
          <Text size="2xs" className="text-center text-gray-500 dark:text-gray-300">
            أكمل الحقول المطلوبة (العنوان، المدينة، الوصف) لتفعيل النشر.
          </Text>
        ) : null}
      </ScrollView>

      <SelectionModal
        visible={isCityModalOpen}
        title="اختيار المدينة"
        description="اختر المدينة المرتبطة بالمنشور."
        options={cityOptions}
        selectedValue={city}
        onSelect={(selectedCity) => {
          setCity(selectedCity);
          setIsCityModalOpen(false);
        }}
        onClose={() => setIsCityModalOpen(false)}
      />
    </View>
  );
}
