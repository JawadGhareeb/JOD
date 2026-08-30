import { Image, View } from "react-native";
import Text from "@/src/components/ui/Text";

type GroupAvatarProps = {
  readonly name: string;
  readonly imageUrl: string | null;
  readonly size?: number;
};

/** Square group picture, falling back to the first letter of the name. */
export function GroupAvatar({ name, imageUrl, size = 48 }: GroupAvatarProps) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 4 }}
        className="bg-primary-100 dark:bg-dark-350"
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 4 }}
      className="items-center justify-center bg-primary-100 dark:bg-dark-350"
    >
      <Text weight="bold" size={size >= 64 ? "xl" : "base"} className="text-primary-400">
        {name.charAt(0)}
      </Text>
    </View>
  );
}
