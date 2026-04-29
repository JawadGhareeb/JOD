import { FlatList, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { mockMenuPayload } from "@/src/data/mockMenu";
import { MenuPageHeader } from "./MenuPageHeader";

export function SavedPostsScreen() {
  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="بوستات محفوظة" />

      <FlatList
        data={mockMenuPayload.savedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HomePostCard post={item} enableAuthorNavigation />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text size="sm" className="text-gray-500 dark:text-gray-300">
              لا توجد منشورات محفوظة حالياً.
            </Text>
          </View>
        }
      />
    </View>
  );
}
