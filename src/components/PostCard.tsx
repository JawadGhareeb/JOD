import { Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";
import type { PostItem, PostStatus } from "@/src/types/posts";
import {
  formatPostDate,
  getPostStatusLabel,
  getPostStatusTheme,
  getPostTypeLabel,
} from "@/src/utils/postHelpers";

interface PostCardProps {
  post: PostItem;
  isSaved?: boolean;
  statusActions?: PostStatus[];
  onPressStatusAction?: (status: PostStatus) => void;
  onToggleSave?: () => void;
}

const Badge = ({
  label,
  backgroundColor,
  textColor,
}: {
  label: string;
  backgroundColor: string;
  textColor: string;
}) => (
  <View
    className="px-3 py-1 rounded-full"
    style={{ backgroundColor }}
  >
    <Text
      size="2xs"
      weight="semibold"
      style={{ color: textColor }}
      rtlAlign="center"
    >
      {label}
    </Text>
  </View>
);

export const PostCard = ({
  post,
  isSaved = false,
  statusActions = [],
  onPressStatusAction,
  onToggleSave,
}: PostCardProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const statusTheme = getPostStatusTheme(post.status);

  return (
    <Card className="mx-4 mb-3" padding="md" radius="xl">
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Badge
            label={getPostStatusLabel(post.status)}
            backgroundColor={statusTheme.bg}
            textColor={statusTheme.text}
          />
          <Badge
            label={getPostTypeLabel(post.type)}
            backgroundColor="#DBEAFE"
            textColor="#1E3A8A"
          />
        </View>

        <View className="gap-1">
          <Text
            size="sm"
            weight="semibold"
            className={`${isDark ? "text-light-50" : "text-gray-800"}`}
            rtlAlign="left"
          >
            {post.title}
          </Text>
          <Text
            size="xs"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            {post.description}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            size="2xs"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            {`${post.city}${post.area ? ` - ${post.area}` : ""}`}
          </Text>
          <Text
            size="2xs"
            className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
            rtlAlign="left"
          >
            {formatPostDate(post.createdAt)}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {post.tags.map((tag) => (
            <View
              key={`${post.id}-${tag}`}
              className={`${isDark ? "bg-dark-400" : "bg-gray-100"} px-2 py-1 rounded-full`}
            >
              <Text
                size="2xs"
                className={`${isDark ? "text-light-50" : "text-gray-600"}`}
                rtlAlign="left"
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {statusActions.length > 0 && onPressStatusAction ? (
          <View className="flex-row flex-wrap gap-2">
            {statusActions.map((nextStatus) => (
              <Button
                key={`${post.id}-${nextStatus}`}
                variant="secondary"
                size="small"
                onPress={() => onPressStatusAction(nextStatus)}
              >
                {getPostStatusLabel(nextStatus)}
              </Button>
            ))}
          </View>
        ) : null}

        {onToggleSave ? (
          <Button
            variant={isSaved ? "outline" : "secondary"}
            size="small"
            onPress={onToggleSave}
          >
            {isSaved ? "إزالة من المحفوظة" : "حفظ المنشور"}
          </Button>
        ) : null}
      </View>
    </Card>
  );
};
