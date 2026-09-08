import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Check, Plus, Trash2, UsersRound } from "lucide-react-native";
import { useRouter } from "expo-router";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useCreateGroup } from "@/src/features/groups/queries";
import { GROUP_CATEGORIES, type GroupInviteCandidate } from "@/src/features/groups/types";
import type { MediaUploadFile } from "@/src/features/media/types";
import { useToast } from "@/src/providers/ToastProvider";
import { AdminsPickerModal } from "./AdminsPickerModal";
import { GroupImagePicker } from "./GroupImagePicker";

export function CreateGroupScreen() {
  const router = useRouter();
  const toast = useToast();
  const mutation = useCreateGroup();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([""]);
  const [invitedUsers, setInvitedUsers] = useState<GroupInviteCandidate[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [requiresPostApproval, setRequiresPostApproval] = useState(false);
  const [image, setImage] = useState<MediaUploadFile | null>(null);
  const [cover, setCover] = useState<MediaUploadFile | null>(null);

  const cleanRules = useMemo(() => rules.map((rule) => rule.trim()).filter(Boolean), [rules]);
  const canSubmit = name.trim().length >= 3 && description.trim().length >= 10 && purpose.trim().length >= 10 && categories.length > 0 && cleanRules.length > 0 && !mutation.isPending;

  const toggleCategory = (category: string) => setCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const updateRule = (index: number, value: string) => setRules((current) => current.map((rule, itemIndex) => itemIndex === index ? value : rule));
  const removeRule = (index: number) => setRules((current) => current.length === 1 ? [""] : current.filter((_, itemIndex) => itemIndex !== index));

  const submit = async () => {
    if (!canSubmit) {
      toast.error("أكمل الاسم والوصف والهدف واختر تصنيفاً واحداً على الأقل وأضف قانوناً.");
      return;
    }
    try {
      const group = await mutation.mutateAsync({ name: name.trim(), description: description.trim(), categories, location: location.trim(), rules: cleanRules, purpose: purpose.trim(), invitedUsers, requiresPostApproval, image, cover });
      toast.success("تم إرسال طلب إنشاء الفريق لإدارة جود.");
      router.replace({ pathname: "/groups/[id]", params: { id: group.id } });
    } catch {
      toast.error("تعذر إرسال طلب إنشاء الفريق. تحقق من البيانات وحاول مجدداً.");
    }
  };

  return (
    <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="إنشاء فريق تطوعي" />
      <View className="gap-4 pb-10">
        <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
          <GroupImagePicker image={image} onChange={setImage} label="شعار الفريق" hint="يظهر بجانب اسم الفريق وفي نتائج البحث." />
          <GroupImagePicker image={cover} onChange={setCover} label="خلفية الفريق" hint="صورة عريضة تظهر أعلى صفحة الفريق." cover />
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">معلومات الفريق</Text>
          <Input fullWidth value={name} onChangeText={setName} placeholder="اسم الفريق التطوعي" maxLength={120} showStatusIcon={false} />
          <Input fullWidth value={description} onChangeText={setDescription} placeholder="وصف الفريق" multiline maxLength={2000} showStatusIcon={false} />
          <Input fullWidth value={purpose} onChangeText={setPurpose} placeholder="ما الهدف من إنشاء هذا الفريق؟" multiline maxLength={1000} showStatusIcon={false} />
          <Input fullWidth value={location} onChangeText={setLocation} placeholder="الموقع أو المحافظة (اختياري)" maxLength={255} showStatusIcon={false} />
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">توجهات الفريق</Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">يمكن اختيار أكثر من تصنيف.</Text>
          <View className="flex-row-reverse flex-wrap gap-2">
            {GROUP_CATEGORIES.map((category) => {
              const selected = categories.includes(category);
              return <Pressable key={category} onPress={() => toggleCategory(category)} className={`flex-row-reverse items-center gap-1 rounded-full border px-3 py-2 ${selected ? "border-primary-400 bg-primary-400/10" : "border-gray-200 dark:border-dark-400"}`}>
                {selected ? <Check size={13} color="#16A34A" /> : null}<Text size="2xs" className={selected ? "text-primary-400" : "text-gray-600 dark:text-gray-300"}>{category}</Text>
              </Pressable>;
            })}
          </View>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <View className="flex-row-reverse items-center justify-between"><Text weight="semibold" size="sm">قوانين الفريق</Text><Pressable onPress={() => setRules((current) => [...current, ""])} className="flex-row-reverse items-center gap-1"><Plus size={15} color="#16A34A" /><Text size="2xs" className="text-primary-400">إضافة قانون</Text></Pressable></View>
          {rules.map((rule, index) => <View key={`rule-${index}`} className="flex-row-reverse items-center gap-2"><View className="flex-1"><Input fullWidth value={rule} onChangeText={(value) => updateRule(index, value)} placeholder={`القانون ${index + 1}`} maxLength={300} showStatusIcon={false} /></View><Pressable onPress={() => removeRule(index)} hitSlop={8}><Trash2 size={17} color="#E5484D" /></Pressable></View>)}
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">دعوة أعضاء</Text>
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">اختيارية. ابحث بالاسم أو اسم المستخدم أو البريد. أنت المالك ومدير الفريق بشكل افتراضي.</Text>
          <Button fullWidth variant="tertiary" onPress={() => setPickerOpen(true)}><UsersRound size={16} />{invitedUsers.length > 0 ? `تم اختيار ${invitedUsers.length} أعضاء` : "اختيار مستخدمين للدعوة"}</Button>
        </Card>

        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm">مراجعة منشورات الأعضاء</Text>
          <Pressable onPress={() => setRequiresPostApproval((value) => !value)} className={`flex-row-reverse items-center justify-between rounded-xl border p-3 ${requiresPostApproval ? "border-primary-400 bg-primary-400/5" : "border-gray-200 dark:border-dark-400"}`}>
            <View className="flex-1 pe-3"><Text size="xs" weight="medium">يجب موافقة مدير الفريق قبل النشر</Text><Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">إذا فعلته، منشورات الأعضاء تبقى قيد المراجعة حتى تقبلها. منشوراتك كمالك تنشر مباشرة.</Text></View>
            <View className={`h-6 w-11 rounded-full p-1 ${requiresPostApproval ? "bg-primary-400" : "bg-gray-300"}`}><View className={`size-4 rounded-full bg-white ${requiresPostApproval ? "self-end" : "self-start"}`} /></View>
          </Pressable>
        </Card>

        <Button fullWidth loading={mutation.isPending} disabled={!canSubmit} onPress={() => void submit()}>إرسال طلب إنشاء الفريق</Button>
        {!canSubmit && !mutation.isPending ? <Text size="2xs" className="text-center text-gray-500 dark:text-gray-300">الحقول المطلوبة: الاسم، الوصف، الهدف، تصنيف واحد على الأقل، وقانون واحد. الدعوات والصور والموقع اختيارية.</Text> : null}
      </View>
      <AdminsPickerModal visible={pickerOpen} selected={invitedUsers} onClose={() => setPickerOpen(false)} onConfirm={(users) => { setInvitedUsers(users); setPickerOpen(false); }} />
    </Container>
  );
}
