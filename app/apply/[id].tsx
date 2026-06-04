import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BriefcaseBusiness, PhoneCall, UserRound, MapPin } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { mainImage } from "@/src/constants/images";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Dialog from "@/src/components/ui/Dialog";
import { EmptyState } from "@/src/components/ui/EmptyState";
import Input from "@/src/components/ui/Input";
import KeyboardAvoider from "@/src/components/ui/KeyboardAvoider";
import Logo from "@/src/components/ui/Logo";
import Text from "@/src/components/ui/Text";
import { Avatar } from "@/src/components/shared/Avatar";
import {
  getHomePostById,
  getRelatedVolunteeringCampaign,
} from "@/src/lib/engagement";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/helpers/home";

const applicationSchema = z.object({
  fullName: z.string().trim().min(1, "الاسم الكامل مطلوب"),
  phoneNumber: z.string().trim().min(1, "رقم الهاتف مطلوب"),
  city: z.string().trim().min(1, "المدينة مطلوبة"),
  reason: z.string().trim().min(1, "رسالة التقديم مطلوبة"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const defaultValues: ApplicationFormValues = {
  fullName: "",
  phoneNumber: "0999999999",
  city: "",
  reason: "",
};

export default function ApplyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const post = useMemo(() => getHomePostById(postId), [postId]);
  const campaign = useMemo(() => getRelatedVolunteeringCampaign(post), [post]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      ...defaultValues,
      fullName: post?.publisher.name || "",
      city: post?.publisher.city || defaultValues.city,
      phoneNumber: post?.phoneNumber || post?.publisher.phoneNumber || defaultValues.phoneNumber,
    },
  });

  const onSubmit = handleSubmit(() => {
    setIsSuccessOpen(true);
  });

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
                صفحة التقديم
              </Text>
              <Text size="sm" color="secondary" rtlAlign="center">
                أرسل طلبك للفرصة المناسبة مع بيانات التواصل الأساسية.
              </Text>
            </View>
          </View>

          <Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400">
            <View className="flex-row-reverse items-center gap-3">
              <Avatar name={post.publisher.name} size={44} />
              <View className="flex-1">
                <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                  {campaign?.title || post.title || "فرصة تطوعية"}
                </Text>
                <Text size="xs" className="text-gray-500 dark:text-gray-300">
                  {post.publisher.name} • {post.publisher.city || "مدينة غير محددة"}
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
                  {campaign.statusTag}
                </Text>
                <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                  عدد المتطوعين: {campaign.joinedVolunteers} / {campaign.requiredVolunteers}
                </Text>
              </View>
            ) : null}

            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              بتاريخ {formatHomePostRelativeDate(post.createdAt)}
            </Text>
          </Card>

          <Card padding="lg" className="gap-4 border-gray-200 dark:border-dark-400">
            <View className="gap-1">
              <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
                بيانات التقديم
              </Text>
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                املأ الحقول التالية لإرسال طلبك.
              </Text>
            </View>

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="الاسم الكامل"
                  placeholder="الاسم الكامل"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  leftIcon={<UserRound size={18} />}
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="رقم الهاتف"
                  placeholder="0999999999"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  error={errors.phoneNumber?.message}
                  leftIcon={<PhoneCall size={18} />}
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="المدينة"
                  placeholder="المدينة"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.city?.message}
                  leftIcon={<MapPin size={18} />}
                  fullWidth
                />
              )}
            />

            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="رسالة التقديم أو السبب"
                  placeholder="اكتب سبب التقديم أو رسالة قصيرة"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  showStatusIcon={false}
                  error={errors.reason?.message}
                  inputClassName="min-h-[96px] text-xs"
                  inputContainerClassName="min-h-[120px] py-3"
                  fullWidth
                />
              )}
            />

            <Button fullWidth loading={isSubmitting} onPress={onSubmit}>
              إرسال طلب التقديم
            </Button>
          </Card>
        </View>

        <Dialog
          visible={isSuccessOpen}
          title="تم إرسال طلب التقديم"
          message="تم حفظ طلبك بنجاح وسيتم التواصل معك قريبًا."
          icon={<BriefcaseBusiness size={26} color="#405d72" />}
          onClose={() => {
            setIsSuccessOpen(false);
            router.replace("/(tabs)/home");
          }}
          buttons={[
            {
              text: "العودة إلى الرئيسية",
              variant: "primary",
              onPress: () => {
                setIsSuccessOpen(false);
                router.replace("/(tabs)/home");
              },
            },
          ]}
        />
      </Container>
    </KeyboardAvoider>
  );
}
