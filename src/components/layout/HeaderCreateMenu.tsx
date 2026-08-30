import { FileText, UsersRound } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { useRTL } from "@/src/providers/RTLProvider";
import { getPrimaryColor } from "@/src/theme";

export type CreateMenuAnchor = { x: number; y: number; width: number; height: number };

export const EMPTY_CREATE_MENU_ANCHOR: CreateMenuAnchor = { x: 0, y: 0, width: 0, height: 0 };

const MENU_WIDTH = 232;
const MENU_GAP = 8;
const SCREEN_PADDING = 12;
const ESTIMATED_MENU_HEIGHT = 152;

type CreateMenuItem = {
  key: "post" | "group";
  title: string;
  hint: string;
  Icon: typeof FileText;
};

const ITEMS: CreateMenuItem[] = [
  { key: "post", title: "منشور", hint: "شارك طلباً أو فرصة أو تحديثاً", Icon: FileText },
  { key: "group", title: "مجموعة", hint: "تُراجعها الإدارة قبل النشر", Icon: UsersRound },
];

type HeaderCreateMenuProps = {
  visible: boolean;
  anchor: CreateMenuAnchor;
  onClose: () => void;
  onSelect: (key: CreateMenuItem["key"]) => void;
};

export function HeaderCreateMenu({ visible, anchor, onClose, onSelect }: HeaderCreateMenuProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const { isRTL } = useRTL();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  // Prefer opening below the button; flip above when it would run off-screen.
  const below = anchor.y + anchor.height + MENU_GAP;
  const above = anchor.y - ESTIMATED_MENU_HEIGHT - MENU_GAP;
  const top =
    below + ESTIMATED_MENU_HEIGHT > windowHeight
      ? Math.max(SCREEN_PADDING, above)
      : Math.max(SCREEN_PADDING, below);

  // In RTL the menu hangs from the button's right edge, mirroring the post card menu.
  const left = Math.max(
    SCREEN_PADDING,
    Math.min(
      isRTL ? anchor.x + anchor.width - MENU_WIDTH : anchor.x,
      windowWidth - MENU_WIDTH - SCREEN_PADDING,
    ),
  );

  const rowClass = isRTL ? "flex-row-reverse" : "flex-row";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1" onPress={onClose} accessibilityLabel="إغلاق القائمة">
        <View
          style={{ top, left, width: MENU_WIDTH }}
          className="absolute z-30 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-400 dark:bg-dark-500"
          // Stop taps inside the menu from reaching the dismiss overlay.
          onStartShouldSetResponder={() => true}
        >
          {ITEMS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              accessibilityRole="button"
              accessibilityLabel={`إنشاء ${item.title}`}
              className={`${rowClass} items-center gap-3 rounded-lg px-3 py-2.5`}
            >
              <View className="size-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-dark-350">
                <item.Icon size={17} color={primaryColor} strokeWidth={2.25} />
              </View>
              <View className="flex-1">
                <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
                  {item.title}
                </Text>
                <Text size="2xs" className="mt-0.5 text-gray-500 dark:text-gray-300">
                  {item.hint}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
