import { useEffect, useState } from "react";
import { Modal as RNModal, Pressable, ScrollView, View } from "react-native";
import { Check } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { appIcons } from "@/src/components/layout/iconMap";
import { Avatar } from "@/src/components/shared/Avatar";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { useAdminCandidates } from "@/src/features/groups/queries";
import type { GroupAdminCandidate } from "@/src/features/groups/types";

const CloseIcon = appIcons.close;
const SEARCH_DEBOUNCE_MS = 250;

type AdminsPickerModalProps = {
  visible: boolean;
  selected: GroupAdminCandidate[];
  onClose: () => void;
  onConfirm: (selected: GroupAdminCandidate[]) => void;
};

export function AdminsPickerModal({
  visible,
  selected,
  onClose,
  onConfirm,
}: AdminsPickerModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [draft, setDraft] = useState<GroupAdminCandidate[]>(selected);

  // Re-seed the draft each time the sheet opens so cancelling discards edits.
  useEffect(() => {
    if (visible) {
      setDraft(selected);
      setSearch("");
      setDebouncedSearch("");
    }
  }, [visible, selected]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const candidatesQuery = useAdminCandidates(debouncedSearch, visible);
  const candidates = candidatesQuery.data ?? [];

  const toggle = (user: GroupAdminCandidate) => {
    setDraft((current) =>
      current.some((item) => item.id === user.id)
        ? current.filter((item) => item.id !== user.id)
        : [...current, user],
    );
  };

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className={`max-h-[78%] w-full rounded-t-3xl ${isDark ? "bg-dark-500" : "bg-white"}`}
        >
          <View className="flex-row-reverse items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-400">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              اختر المشرفين
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
            >
              <CloseIcon size={18} color={isDark ? "#E5E7EB" : "#374151"} strokeWidth={2.25} />
            </Pressable>
          </View>

          <View className="gap-2 px-4 pt-3">
            <Input
              fullWidth
              showStatusIcon={false}
              value={search}
              onChangeText={setSearch}
              placeholder="ابحث بالاسم أو اسم المستخدم"
              placeholderTextColor="#9CA3AF"
            />
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {draft.length > 0 ? `${draft.length} مُختار` : "لم تختر أحداً بعد"}
            </Text>
          </View>

          <ScrollView className="px-4" contentContainerStyle={{ paddingVertical: 8 }}>
            {candidates.length === 0 ? (
              <View className="items-center py-10">
                <Text size="sm" className="text-gray-500 dark:text-gray-300">
                  {candidatesQuery.isLoading ? "جارِ البحث..." : "لا توجد نتائج."}
                </Text>
              </View>
            ) : (
              candidates.map((user) => {
                const isSelected = draft.some((item) => item.id === user.id);
                return (
                  <Pressable
                    key={user.id}
                    onPress={() => toggle(user)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={user.name}
                    className={`mb-2 flex-row-reverse items-center gap-3 rounded-xl border p-3 ${
                      isSelected
                        ? "border-primary-400 bg-primary-400/5"
                        : "border-gray-200 dark:border-dark-400"
                    }`}
                  >
                    <Avatar name={user.name} imageUrl={user.avatarUrl} size={36} />
                    <View className="flex-1">
                      <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
                        {user.name}
                      </Text>
                      <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
                        @{user.username}
                      </Text>
                    </View>
                    <View
                      className={`size-5 items-center justify-center rounded-md border ${
                        isSelected
                          ? "border-primary-400 bg-primary-400"
                          : "border-gray-300 dark:border-dark-400"
                      }`}
                    >
                      {isSelected ? <Check size={13} color="#FFFFFF" strokeWidth={3} /> : null}
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View className="border-t border-gray-200 px-4 py-3 dark:border-dark-400">
            <Button fullWidth onPress={() => onConfirm(draft)}>
              تأكيد
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
