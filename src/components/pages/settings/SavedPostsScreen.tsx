import { useState } from "react";
import { FlatList, View } from "react-native";
import Text from "@/src/components/ui/Text";
import { HomePostCard } from "@/src/components/pages/home/HomePostCard";
import { mockMenuPayload } from "@/src/data/mockMenu";
import type { HomePost } from "@/src/types/home";
import { MenuPageHeader } from "./MenuPageHeader";

export function SavedPostsScreen() {
  const [savedPosts, setSavedPosts] = useState<HomePost[]>(mockMenuPayload.savedPosts);

  const handleUnsavePost = (post: HomePost) => {
    setSavedPosts((prev) => prev.filter((item) => item.id !== post.id));
  };

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="بوستات محفوظة" />

      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HomePostCard
            post={item}
            enableAuthorNavigation
            mode="saved"
            onUnsave={handleUnsavePost}
          />
        )}
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
