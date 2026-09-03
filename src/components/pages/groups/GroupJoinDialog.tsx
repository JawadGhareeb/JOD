import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Check } from "lucide-react-native";
import Dialog from "@/src/components/ui/Dialog";
import Text from "@/src/components/ui/Text";
import type { Group } from "@/src/features/groups/types";

type GroupJoinDialogProps = {
  group: Group;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function GroupJoinDialog({ group, visible, onClose, onConfirm }: GroupJoinDialogProps) {
  const [agreed, setAgreed] = useState(false);

  // Consent must be re-given every time — a stale `true` from a previous group
  // would let someone join without seeing these rules at all.
  useEffect(() => {
    if (visible) setAgreed(false);
  }, [visible]);

  return (
    <Dialog
      visible={visible}
      title="الانضمام إلى الفريق التطوعي"
      onClose={onClose}
      cancelable
      buttons={[
        { text: "إلغاء", variant: "tertiary", onPress: onClose },
        {
          text: "انضمام",
          variant: "primary",
          onPress: () => {
            if (!agreed) return;
            onConfirm();
          },
          className: agreed ? "" : "opacity-40",
        },
      ]}
    >
      <View className="gap-3">
        <Text size="xs" rtlAlign="right" className="text-gray-600 dark:text-gray-200">
          قبل الانضمام إلى <Text weight="semibold" className="text-primary-400">{group.name}</Text>،
          اطّلع على قوانين الفريق:
        </Text>

        <ScrollView className="max-h-44" showsVerticalScrollIndicator={false}>
          <View className="gap-2 rounded-xl bg-gray-50 p-3 dark:bg-dark-350">
            {group.rules.map((rule, index) => (
              <View key={rule} className="flex-row-reverse items-start gap-2">
                <Text size="2xs" weight="semibold" className="text-primary-400">
                  {index + 1}.
                </Text>
                <Text size="2xs" className="flex-1 leading-5 text-gray-600 dark:text-gray-200">
                  {rule}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <Pressable
          onPress={() => setAgreed((current) => !current)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="أوافق على قوانين الفريق"
          className="flex-row-reverse items-center gap-2 py-1"
        >
          <View
            className={`size-5 items-center justify-center rounded-md border ${
              agreed ? "border-primary-400 bg-primary-400" : "border-gray-300 dark:border-dark-400"
            }`}
          >
            {agreed ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
          </View>
          <Text size="xs" className="flex-1 text-dark-100 dark:text-light-50">
            أوافق على قوانين الفريق
          </Text>
        </Pressable>

      </View>
    </Dialog>
  );
}
