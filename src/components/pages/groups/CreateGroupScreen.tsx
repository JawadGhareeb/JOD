import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Lock, MapPin, Users, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useCreateGroup } from "@/src/features/groups/queries";
import {
  GROUP_CATEGORIES,
  type GroupAdminCandidate,
  type GroupVisibility,
} from "@/src/features/groups/types";
import type { MediaUploadFile } from "@/src/features/media/types";
import { AdminsPickerModal } from "./AdminsPickerModal";
import { GroupImagePicker } from "./GroupImagePicker";
import { useCities } from "@/src/features/lookups/queries";
import { useToast } from "@/src/providers/ToastProvider";
import { getPrimaryColor } from "@/src/theme";

const VISIBILITY_OPTIONS: {
  value: GroupVisibility;
  label: string;
  hint: string;
}[] = [
  { value: "public", label: "عامة", hint: "يمكن لأي شخص رؤية المحتوى والانضمام فوراً." },
  { value: "private", label: "خاصة", hint: "المحتوى للأعضاء فقط، والانضمام بموافقة المشرفين." },
];

const MIN_RULES = 1;

export function CreateGroupScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");
  const createMutation = useCreateGroup();
  const citiesQuery = useCities();

  const [name, setName] = useState("");
  const [image, setImage] = useState<MediaUploadFile | null>(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<GroupVisibility>("public");
  const [rulesText, setRulesText] = useState("");
  const [purpose, setPurpose] = useState("");
  const [proposedAdmins, setProposedAdmins] = useState<GroupAdminCandidate[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAdminsOpen, setIsAdminsOpen] = useState(false);

  const categoryOptions: SelectionOption[] = useMemo(
    () => GROUP_CATEGORIES.map((item) => ({ label: item, value: item })),
    [],
  );
  const cityOptions: SelectionOption[] = useMemo(
    () => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })),
    [citiesQuery.data],
  );

  // One rule per line — simpler than a repeater and matches how people type lists.
  const rules = useMemo(
    () => rulesText.split("\n").map((line) => line.trim()).filter(Boolean),
    [rulesText],
  );

  const canSubmit =
    name.trim().length >= 3 &&
    description.trim().length >= 10 &&
    category.length > 0 &&
    location.length > 0 &&
    rules.length >= MIN_RULES &&
    purpose.trim().length >= 10 &&
    !createMutation.isPending;

  const submit = () => {
    if (!canSubmit) return;
    createMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        category,
        location,
        visibility,
        rules,
        purpose: purpose.trim(),
        proposedAdmins,
        image,
      },
      {
        onSuccess: () => {
          toast.success("تم إرسال طلب إنشاء المجموعة. بانتظار موافقة الإدارة.", "تم الإرسال");
          router.back();
        },
        onError: () => toast.error("تعذر إرسال الطلب. حاول مرة أخرى."),
      },
    );
  };

  return (
    <KeyboardAvoider className="flex-1">
      <Container
        scrollable
        className="bg-light-100 dark:bg-dark-300"
        scrollViewProps={{ contentContainerStyle: { paddingBottom: 36 } }}
      >
        <MenuPageHeader title="إنشاء مجموعة" />

        <View className="gap-3 px-4">
          <Card padding="md" className="gap-1 border-gray-200 dark:border-dark-400">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              طلب إنشاء، وليس إنشاءً فورياً
            </Text>
            <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
              تُراجع الإدارة كل طلب قبل نشر المجموعة. ستظهر لك ضمن «مجموعاتي» بحالة
              «بانتظار الموافقة» حتى تتم الموافقة.
            </Text>
          </Card>

          <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              معلومات المجموعة
            </Text>

            <GroupImagePicker image={image} onChange={setImage} />

            <Input
              fullWidth
              showStatusIcon={false}
              value={name}
              onChangeText={setName}
              placeholder="اسم المجموعة"
              maxLength={80}
            />
            <Input
              fullWidth
              multiline
              showStatusIcon={false}
              value={description}
              onChangeText={setDescription}
              placeholder="وصف مختصر لهدف المجموعة"
              maxLength={500}
            />

            <Pressable onPress={() => setIsCategoryOpen(true)}>
              <View pointerEvents="none">
                <Input
                  fullWidth
                  editable={false}
                  showStatusIcon={false}
                  rightIcon={<Users size={16} color={primaryColor} strokeWidth={2.25} />}
                  value={category}
                  placeholder="التصنيف"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Pressable>

            <Pressable onPress={() => setIsCityOpen(true)}>
              <View pointerEvents="none">
                <Input
                  fullWidth
                  editable={false}
                  showStatusIcon={false}
                  rightIcon={<MapPin size={16} color={primaryColor} strokeWidth={2.25} />}
                  value={location}
                  placeholder="المحافظة"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Pressable>
          </Card>

          <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              من يمكنه الانضمام؟
            </Text>
            {VISIBILITY_OPTIONS.map((option) => {
              const isSelected = visibility === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setVisibility(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.label}
                  className={`gap-1 rounded-xl border p-3 ${isSelected ? "border-primary-400 bg-primary-400/5" : "border-gray-200 dark:border-dark-400"}`}
                >
                  <View className="flex-row-reverse items-center gap-2">
                    <View
                      className={`size-4 rounded-full border-2 ${isSelected ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"}`}
                    />
                    <Text
                      size="xs"
                      weight="semibold"
                      className={isSelected ? "text-primary-400" : "text-dark-100 dark:text-light-50"}
                    >
                      {option.label}
                    </Text>
                    {option.value === "private" ? (
                      <Lock size={12} color="#9CA3AF" strokeWidth={2.25} />
                    ) : null}
                  </View>
                  <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
                    {option.hint}
                  </Text>
                </Pressable>
              );
            })}
          </Card>

          <Card padding="lg" className="gap-2 border-gray-200 dark:border-dark-400">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              قوانين المجموعة
            </Text>
            <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
              اكتب كل قانون في سطر مستقل. يوافق عليها الأعضاء قبل الانضمام.
            </Text>
            <Input
              fullWidth
              multiline
              showStatusIcon={false}
              value={rulesText}
              onChangeText={setRulesText}
              placeholder={"احترم جميع الأعضاء.\nلا تنشر طلبات تبرع شخصية."}
              maxLength={1000}
            />
            {rules.length > 0 ? (
              <Text size="2xs" className="text-primary-400">
                {rules.length} قانون
              </Text>
            ) : null}
          </Card>

          <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              معلومات للمراجعة
            </Text>
            <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
              تظهر للإدارة فقط، ولا تُعرض للأعضاء.
            </Text>
            <Input
              fullWidth
              multiline
              showStatusIcon={false}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="لماذا تريد إنشاء هذه المجموعة؟"
              maxLength={500}
            />
            <View className="gap-2 border-t border-gray-100 pt-3 dark:border-dark-400">
              <Text size="2xs" weight="semibold" className="text-dark-100 dark:text-light-50">
                المشرفون
              </Text>
              <Text size="2xs" className="leading-5 text-gray-500 dark:text-gray-300">
                أنت <Text size="2xs" weight="semibold" className="text-primary-400">مالك</Text> المجموعة.
                يمكنك اختيار مشرفين يساعدونك في إدارتها.
              </Text>

              <Pressable
                onPress={() => setIsAdminsOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="اختر المشرفين"
                className="flex-row-reverse items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-dark-400"
              >
                <Text size="xs" className="text-gray-500 dark:text-gray-300">
                  {proposedAdmins.length > 0
                    ? `${proposedAdmins.length} مشرف مُختار`
                    : "اختر المشرفين (اختياري)"}
                </Text>
                <Users size={16} color={primaryColor} strokeWidth={2.25} />
              </Pressable>

              {proposedAdmins.length > 0 ? (
                <View className="flex-row-reverse flex-wrap gap-2">
                  {proposedAdmins.map((admin) => (
                    <Pressable
                      key={admin.id}
                      onPress={() =>
                        setProposedAdmins((current) =>
                          current.filter((item) => item.id !== admin.id),
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`إزالة ${admin.name}`}
                      className="flex-row-reverse items-center gap-1.5 rounded-full bg-primary-400/10 px-3 py-1.5"
                    >
                      <Text size="2xs" className="text-primary-400">
                        {admin.name}
                      </Text>
                      <X size={11} color={primaryColor} strokeWidth={2.5} />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </Card>

          <Button
            fullWidth
            loading={createMutation.isPending}
            disabled={!canSubmit}
            onPress={submit}
          >
            إرسال الطلب
          </Button>
        </View>
      </Container>

      <SelectionModal
        visible={isCategoryOpen}
        title="اختر التصنيف"
        options={categoryOptions}
        selectedValue={category}
        onSelect={(value) => {
          setCategory(value);
          setIsCategoryOpen(false);
        }}
        onClose={() => setIsCategoryOpen(false)}
      />

      <SelectionModal
        visible={isCityOpen}
        title="اختر المحافظة"
        options={cityOptions}
        selectedValue={location}
        onSelect={(value) => {
          setLocation(value);
          setIsCityOpen(false);
        }}
        onClose={() => setIsCityOpen(false)}
      />

      <AdminsPickerModal
        visible={isAdminsOpen}
        selected={proposedAdmins}
        onClose={() => setIsAdminsOpen(false)}
        onConfirm={(next) => {
          setProposedAdmins(next);
          setIsAdminsOpen(false);
        }}
      />
    </KeyboardAvoider>
  );
}
