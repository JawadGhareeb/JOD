import { useLocalSearchParams, useRouter } from "expo-router";
import { HeartHandshake } from "lucide-react-native";
import { View } from "react-native";
import { mainImage } from "@/src/constants/images";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { openPostContact } from "@/src/features/posts/contact";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import { useCampaign, usePost } from "@/src/features/posts/queries";
import { Avatar } from "@/src/components/shared/Avatar";

export default function DonatePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : id;

  const { data: post, isLoading } = usePost(postId);
  const { data: campaign } = useCampaign(post?.campaignId);

  if (isLoading) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            جارِ تحميل بيانات الحملة...
          </Text>
        </View>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <KeyboardAvoider className="flex-1">
          <EmptyState title="تعذر العثور على المنشور المطلوب" image={mainImage} />
          <View className="mt-4">
            <Button fullWidth onPress={() => router.replace("/(tabs)/home")}>
              العودة إلى الرئيسية
            </Button>
          </View>
        </KeyboardAvoider>
      </Container>
    );
  }

  return (
    <KeyboardAvoider className="flex-1">
      <Container
        scrollable
        className="bg-light-100 dark:bg-dark-300"
        scrollViewProps={{
          contentContainerStyle: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 36,
          },
        }}
      >
        <View className="gap-5">
          <View className="items-center gap-3">
            <Logo variant="medium" showName />
            <View className="items-center gap-2">
              <Text variant="heading" weight="bold" rtlAlign="center">
                صفحة التبرع
              </Text>
              <Text size="sm" color="secondary" rtlAlign="center">
                أكمل بياناتك لإرسال طلب التبرع للحملة المناسبة.
              </Text>
            </View>
          </View>

          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-center gap-3">
              <Avatar name={post.publisher.name} size={44} />
              <View className="flex-1">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                  {campaign?.title || post.title || "حملة تبرع"}
                </Text>
                <Text size="xs" className="text-gray-500 dark:text-gray-300">
                  {post.publisher.name} • {post.location || post.publisher.city || "مدينة غير محددة"}
                </Text>
              </View>
              <View className="rounded-full bg-primary-400/15 px-3 py-1">
                <Text size="2xs" weight="medium" className="text-primary-400">
                  {HOME_POST_TYPE_LABELS[post.postType]}
                </Text>
              </View>
            </View>

            <Text size="sm" className="text-dark-100 dark:text-light-50">
              {post.content}
            </Text>

            {campaign ? (
              <View className="gap-1 rounded-xl bg-gray-50 p-3 dark:bg-dark-350">
                <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
                  {campaign.status === "active" ? "حملة نشطة" : campaign.status}
                </Text>
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                  التبرعات الحالية: {campaign.raisedAmount.toLocaleString("ar-SY")} من أصل{" "}
                  {campaign.goalAmount.toLocaleString("ar-SY")}
                </Text>
              </View>
            ) : null}

            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              بتاريخ {formatHomePostRelativeDate(post.createdAt)}
            </Text>
          </Card>

          <Card padding="lg" className="gap-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-center gap-2">
              <HeartHandshake size={20} color="#405d72" />
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                متابعة التبرع
              </Text>
            </View>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              تم حذف نموذج الإدخال من هذه الصفحة، ويمكنك المتابعة مباشرة عبر التواصل مع الجهة
              الناشرة للحملة.
            </Text>
            <Button fullWidth onPress={() => void openPostContact(post)}>
              التواصل للتبرع
            </Button>
          </Card>
        </View>
      </Container>
    </KeyboardAvoider>
  );
}
