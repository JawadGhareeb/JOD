import { Image, View } from "react-native";
import Text from "@/src/components/ui/Text";

type AvatarProps = {
  name: string;
  size?: number;
  imageUrl?: string | null;
};

export function Avatar({ name, size = 44, imageUrl }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0])
    .join("");

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-primary-100 dark:bg-dark-350"
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-primary-100 dark:bg-dark-350"
    >
      <Text weight="bold" size="xs" className="text-primary-400">
        {initials || "؟"}
      </Text>
    </View>
  );
}
