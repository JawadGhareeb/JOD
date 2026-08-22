import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react-native";
import { Image, View } from "react-native";
import { mainImage } from "@/src/constants/images";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import { EmptyState } from "@/src/components/ui/EmptyState";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import { getPostActionLabel, getPostDisplayTitle, openPostContact } from "@/src/features/posts/contact";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/features/posts/helpers";
import { useCampaign, usePost } from "@/src/features/posts/queries";

export default function PostDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : id;

  const { data: post, isLoading, isError } = usePost(postId);
  const { data: campaign } = useCampaign(post?.campaignId);

  const handlePrimaryAction = async () => {
    if (!post) return;

    if (post.cta.type === "donate") {
      router.push({ pathname: "/donate/[id]", params: { id: post.id } });
      return;
    }

    if (post.cta.type === "apply") {
      router.push({ pathname: "/apply/[id]", params: { id: post.id } });
      return;
    }

    if (post.cta.type === "contact") {
      await openPostContact(post);
    }
  };

  if (isLoading) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <View className="items-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-300">
            جارِ تحميل تفاصيل المنشور...
          </Text>
        </View>
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="bg-light-100 px-4 pt-4 dark:bg-dark-300">
        <EmptyState title="تعذر العثور على تفاصيل المنشور" image={mainImage} />
        <View className="mt-4">
          <Button fullWidth onPress={() => router.replace("/(tabs)/home")}>
            العودة إلى الرئيسية
          </Button>
        </View>
      </Container>
    );
  }

  const title = getPostDisplayTitle(post);
  const actionLabel = getPostActionLabel(post);
  const canShowAction =
    post.cta.type === "donate" || post.cta.type === "apply" || post.cta.type === "contact";

  return (
    <Container
      scrollable
      className="bg-light-100 dark:bg-dark-300"
      scrollViewProps={{
        contentContainerStyle: {
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 36,
          gap: 16,
        },
      }}
    >
      <View className="items-center gap-3">
        <Logo variant="medium" showName />
        <Text variant="heading" weight="bold" rtlAlign="center">
          تفاصيل المنشور
        </Text>
      </View>

      <Card padding="md" className="gap-4 border-gray-200 dark:border-dark-400">
        <View className="flex-row-reverse items-start justify-between gap-3">
          <View className="flex-1 gap-2">
            <Text variant="heading" weight="bold" rtlAlign="right">
              {title}
            </Text>
            <View className="flex-row-reverse flex-wrap items-center gap-2">
              <View className="rounded-full bg-primary-400/15 px-3 py-1">
                <Text size="2xs" weight="medium" className="text-primary-400">
                  {HOME_POST_TYPE_LABELS[post.postType]}
                </Text>
              </View>
              {post.publisher.verified ? (
                <View className="flex-row-reverse items-center gap-1 rounded-full bg-success-100/15 px-3 py-1">
                  <ShieldCheck size={12} color="#16A34A" />
                  <Text size="2xs" weight="medium" className="text-success-100">
                    موثق
                  </Text>
                </View>
              ) : null}
              {post.cta.state ? (
                <View className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-350">
                  <Text size="2xs" weight="medium" className="text-gray-500 dark:text-gray-300">
                    {post.cta.state === "closed"
                      ? "مغلق"
                      : post.cta.state === "submitted"
                        ? "تم التقديم"
                        : "متاح"}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <Avatar name={post.publisher.name} size={48} />
        </View>

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-1">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              {post.publisher.name}
            </Text>
            <Text size="xs" className="text-gray-500 dark:text-gray-300">
              @{post.publisher.username}
            </Text>
          </View>
          <View className="items-end gap-1">
            <View className="flex-row-reverse items-center gap-1">
              <MapPin size={14} color="#9CA3AF" />
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {post.location || post.publisher.city || "مدينة غير محددة"}
              </Text>
            </View>
            <View className="flex-row-reverse items-center gap-1">
              <CalendarDays size={14} color="#9CA3AF" />
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {formatHomePostRelativeDate(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
        <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
          الوصف
        </Text>
        <Text size="sm" className="leading-7 text-dark-100 dark:text-light-50">
          {post.content}
        </Text>

        {post.images.length > 0 ? (
          <View className="gap-2">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              الصور
            </Text>
            <View className="gap-2">
              {post.images.map((imageUri) => (
                <View key={imageUri} className="h-48 overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350">
                  <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Card>

      {campaign ? (
        <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            معلومات الحملة
          </Text>
          <View className="gap-1">
            <Text size="xs" weight="semibold" className="text-dark-100 dark:text-light-50">
              {campaign.title}
            </Text>
            {campaign.goalAmount > 0 ? (
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                تم جمع {campaign.raisedAmount.toLocaleString("ar-SY")} من أصل{" "}
                {campaign.goalAmount.toLocaleString("ar-SY")}
              </Text>
            ) : null}
            {campaign.applicantsCount > 0 ? (
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {campaign.applicantsCount} متطوع مسجّل
              </Text>
            ) : null}
            {campaign.beneficiariesCount > 0 ? (
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                {campaign.beneficiariesCount} مستفيد
              </Text>
            ) : null}
          </View>
        </Card>
      ) : null}

      {canShowAction ? (
        <Button fullWidth onPress={() => void handlePrimaryAction()}>
          {actionLabel}
        </Button>
      ) : null}
    </Container>
  );
}
