import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HeartHandshake, PhoneCall } from "lucide-react-native";
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
import {
  getHomePostById,
  getRelatedDonationCampaign,
} from "@/src/lib/engagement";
import { Avatar } from "@/src/components/shared/Avatar";
import { HOME_POST_TYPE_LABELS, formatHomePostRelativeDate } from "@/src/helpers/home";

const donationSchema = z.object({
  donationValue: z.string().trim().min(1, "يرجى إدخال قيمة أو نوع التبرع"),
  phoneNumber: z.string().trim().min(1, "رقم الهاتف مطلوب"),
  note: z.string().trim().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const defaultValues: DonationFormValues = {
  donationValue: "",
  phoneNumber: "0999999999",
  note: "",
};

export default function DonatePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const post = useMemo(() => getHomePostById(postId), [postId]);
  const campaign = useMemo(() => getRelatedDonationCampaign(post), [post]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      ...defaultValues,
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
                  التبرعات الحالية: {campaign.raisedAmount.toLocaleString("ar-SY")} ل.س
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
                بيانات التبرع
              </Text>
              <Text size="xs" className="text-gray-500 dark:text-gray-300">
                أدخل المبلغ أو نوع التبرع ورقم الهاتف للتواصل.
              </Text>
            </View>

            <Controller
              control={control}
              name="donationValue"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="قيمة التبرع أو نوعه"
                  placeholder="مثال: 50,000 ل.س أو سلة غذائية"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.donationValue?.message}
                  leftIcon={<HeartHandshake size={18} />}
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
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="ملاحظة اختيارية"
                  placeholder="أضف أي تفاصيل إضافية"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  showStatusIcon={false}
                  error={errors.note?.message}
                  fullWidth
                />
              )}
            />

            <Button fullWidth loading={isSubmitting} onPress={onSubmit}>
              إرسال طلب التبرع
            </Button>
          </Card>
        </View>

        <Dialog
          visible={isSuccessOpen}
          title="تم إرسال طلب التبرع"
          message="تم حفظ طلبك بنجاح وسيتم التواصل معك عند الحاجة."
          icon={<HeartHandshake size={26} color="#405d72" />}
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
