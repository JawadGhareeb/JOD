import { Text, View } from "react-native";

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center bg-light-100 px-5 dark:bg-dark-300">
      <Text className="font-noto-semibold text-2xl text-dark-100 dark:text-light-50">الصفحة الرئيسية</Text>
    </View>
  );
}
