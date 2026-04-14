import { ScrollView, View } from "react-native";
import { mockHomePayload } from "@/src/data/mockHome";
import Text from "@/src/components/ui/Text";
import { SectionHeader } from "@/src/components/shared/SectionHeader";
import { HomePostCard } from "./HomePostCard";

export function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-light-100 px-4 pt-4 dark:bg-dark-300"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >

      <SectionHeader title="آخر المنشورات" actionLabel="عرض الكل" />
      <View>
        {mockHomePayload.posts.map((post) => (
          <HomePostCard key={post.id} post={post} />
        ))}
      </View>
    </ScrollView>
  );
}
