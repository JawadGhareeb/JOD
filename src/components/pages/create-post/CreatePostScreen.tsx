import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, MapPin, X } from "lucide-react-native";
import { Alert, Image, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Dialog from "@/src/components/ui/Dialog";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { appIcons } from "@/src/components/layout/iconMap";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import type { CreatePostType } from "@/src/types/menu";
import { MenuPageHeader } from "../settings/MenuPageHeader";

type PendingExitAction = () => void;

const ImageIcon = ImagePlus;
const TitleIcon = appIcons.campaign;
const DescriptionIcon = appIcons.about;

const postTypes: { key: CreatePostType; label: string; hint: string }[] = [
  { key: "volunteer", label: "فرصة تطوع", hint: "مناسب لطلبات المتطوعين" },
  { key: "donation", label: "حملة تبرع", hint: "مناسب لجمع التبرعات" },
  { key: "help", label: "طلب مساعدة", hint: "مناسب لحالات الدعم الفردية" },
];

const cityOptions: SelectionOption[] = [
  { label: "دمشق", value: "دمشق" },
  { label: "حلب", value: "حلب" },
  { label: "حمص", value: "حمص" },
  { label: "حماة", value: "حماة" },
  { label: "اللاذقية", value: "اللاذقية" },
  { label: "طرطوس", value: "طرطوس" },
  { label: "درعا", value: "درعا" },
  { label: "السويداء", value: "السويداء" },
  { label: "دير الزور", value: "دير الزور" },
  { label: "الرقة", value: "الرقة" },
  { label: "إدلب", value: "إدلب" },
];

type CreatePostScreenProps = {
  showPageHeader?: boolean;
};

const readParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const isCreatePostType = (value: string): value is CreatePostType =>
  postTypes.some((type) => type.key === value);

export function CreatePostScreen({ showPageHeader = true }: CreatePostScreenProps = {}) {
  const params = useLocalSearchParams<{
    mode?: string;
    postId?: string;
    postType?: string;
    title?: string;
    details?: string;
    city?: string;
    images?: string;
  }>();
  const [postType, setPostType] = useState<CreatePostType>("volunteer");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [baselineSnapshot, setBaselineSnapshot] = useState("");
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const pendingExitActionRef = useRef<PendingExitAction | null>(null);
  const isDiscardExitConfirmedRef = useRef(false);
  const router = useRouter();
  const navigation = useNavigation();
  const { contentAnimatedStyle, onScroll } = useCollapsibleHeaderScreen();

  const editMode = readParam(params.mode) === "edit";
  const editingPostId = readParam(params.postId);

  useEffect(() => {
    if (!editMode) return;

    const paramPostType = readParam(params.postType);
    const paramTitle = readParam(params.title);
    const paramDetails = readParam(params.details);
    const paramCity = readParam(params.city);
    const paramImages = readParam(params.images);

    if (isCreatePostType(paramPostType)) {
      setPostType(paramPostType);
    }

    setTitle(paramTitle);
    setDetails(paramDetails);
    setCity(paramCity);
    setSelectedImages(paramImages.split("|").filter(Boolean));
  }, [editMode, params.city, params.details, params.images, params.postType, params.title]);

  const typeHint = useMemo(
    () => postTypes.find((type) => type.key === postType)?.hint,
    [postType],
  );
  const canPublish = title.trim().length > 3 && city.trim().length > 1 && details.trim().length > 10;
  const pageTitle = editMode ? "تعديل بوست" : "نشر بوست";
  const submitLabel = editMode ? "إعادة إرسال للمراجعة" : "نشر الآن";

  const initialSnapshot = useMemo(() => {
    const paramPostType = readParam(params.postType);
    const initialPostType = editMode && isCreatePostType(paramPostType) ? paramPostType : "volunteer";

    return JSON.stringify({
      postType: initialPostType,
      title: editMode ? readParam(params.title) : "",
      details: editMode ? readParam(params.details) : "",
      city: editMode ? readParam(params.city) : "",
      images: editMode ? readParam(params.images).split("|").filter(Boolean).join("|") : "",
    });
  }, [editMode, params.city, params.details, params.images, params.postType, params.title]);

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        postType,
        title,
        details,
        city,
        images: selectedImages.filter(Boolean).join("|"),
      }),
    [city, details, postType, selectedImages, title],
  );

  useEffect(() => {
    setBaselineSnapshot(initialSnapshot);
  }, [initialSnapshot]);

  const hasUnsavedChanges = currentSnapshot !== (baselineSnapshot || initialSnapshot);

  const requestPageExit = useCallback(
    (exitAction: PendingExitAction) => {
      if (!hasUnsavedChanges) {
        exitAction();
        return;
      }

      pendingExitActionRef.current = exitAction;
      setIsDiscardConfirmOpen(true);
    },
    [hasUnsavedChanges],
  );

  const handleHeaderBackPress = useCallback(() => {
    requestPageExit(() => router.back());
  }, [requestPageExit, router]);

  const handleCancelDiscardExit = useCallback(() => {
    pendingExitActionRef.current = null;
    setIsDiscardConfirmOpen(false);
  }, []);

  const handleConfirmDiscardExit = useCallback(() => {
    const pendingExitAction = pendingExitActionRef.current;
    pendingExitActionRef.current = null;
    isDiscardExitConfirmedRef.current = true;
    setIsDiscardConfirmOpen(false);

    pendingExitAction?.();

    requestAnimationFrame(() => {
      isDiscardExitConfirmedRef.current = false;
    });
  }, []);

  useEffect(() => {
    const guardedNavigation = navigation as unknown as {
      addListener?: (eventName: string, listener: (event: any) => void) => () => void;
      dispatch?: (action: unknown) => void;
    };

    const unsubscribe = guardedNavigation.addListener?.("beforeRemove", (event: any) => {
      if (!hasUnsavedChanges || isDiscardExitConfirmedRef.current || isDiscardConfirmOpen) return;

      event.preventDefault();
      pendingExitActionRef.current = () => guardedNavigation.dispatch?.(event.data.action);
      setIsDiscardConfirmOpen(true);
    });

    return unsubscribe;
  }, [hasUnsavedChanges, isDiscardConfirmOpen, navigation]);

  useEffect(() => {
    const parentNavigation = (navigation as any).getParent?.();
    if (!parentNavigation?.addListener) return;

    const unsubscribe = parentNavigation.addListener("tabPress", (event: any) => {
      if (!hasUnsavedChanges || isDiscardExitConfirmedRef.current || isDiscardConfirmOpen) return;

      const parentState = parentNavigation.getState?.();
      const targetRoute = parentState?.routes?.find((route: any) => route.key === event.target);
      const currentRoute = parentState?.routes?.[parentState.index];

      if (!targetRoute || targetRoute.key === currentRoute?.key) return;

      event.preventDefault();
      pendingExitActionRef.current = () => parentNavigation.navigate(targetRoute.name, targetRoute.params);
      setIsDiscardConfirmOpen(true);
    });

    return unsubscribe;
  }, [hasUnsavedChanges, isDiscardConfirmOpen, navigation]);

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "إذن الصور مطلوب",
        "اسمح للتطبيق بالوصول للصور حتى تقدر تضيف صور للمنشور.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 0,
      quality: 0.85,
    });

    if (result.canceled) return;

    const pickedImages = result.assets
      .map((asset) => asset.uri)
      .filter((uri): uri is string => Boolean(uri));

    setSelectedImages((current) => {
      const uniqueImages = [...current, ...pickedImages].filter(
        (uri, index, list) => list.indexOf(uri) === index,
      );
      return uniqueImages;
    });
  };

  const handleRemoveImage = (imageUri: string) => {
    setSelectedImages((current) => current.filter((uri) => uri !== imageUri));
  };

  const handleSubmitPress = () => {
    if (!canPublish) return;
    setIsSubmitConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmittingPost(true);

    setTimeout(() => {
      setBaselineSnapshot(currentSnapshot);
      setIsSubmittingPost(false);
      setIsSubmitConfirmOpen(false);
      Alert.alert(
        editMode ? "تم إرسال التعديلات" : "تم نشر المنشور",
        editMode ? "تم إرسال المنشور بعد التعديل للمراجعة." : "تم تجهيز المنشور للنشر.",
      );
    }, 500);
  };

  const handleSaveDraft = () => {
    setBaselineSnapshot(currentSnapshot);
    Alert.alert("تم حفظ المسودة", "تم حفظ بيانات المنشور كمسودة مؤقتة.");
  };

  return (
    <Animated.View className="flex-1 bg-light-100 px-4 dark:bg-dark-300" style={!showPageHeader ? contentAnimatedStyle : undefined}>
      {showPageHeader ? <MenuPageHeader title={pageTitle} onBackPress={handleHeaderBackPress} /> : null}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28, paddingTop: showPageHeader ? 0 : 12 }}
        onScroll={showPageHeader ? undefined : onScroll}
        scrollEventThrottle={showPageHeader ? undefined : 16}
      >
        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
            {editMode ? "تعديل منشور مرفوض" : "قبل النشر"}
          </Text>
          <Text size="xs" className="mt-2 leading-6 text-gray-500 dark:text-gray-300">
            {editMode
              ? `عدّل بيانات المنشور${editingPostId ? ` رقم ${editingPostId}` : ""} ثم أعد إرساله للمراجعة.`
              : "اكتب عنوان واضح، وصف مختصر ومباشر، وأضف صور حقيقية لزيادة موثوقية المنشور."}
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
            نوع المنشور
          </Text>

          <View className="flex-row-reverse gap-2">
            {postTypes.map((type) => {
              const isActive = postType === type.key;
              return (
                <Pressable
                  key={type.key}
                  onPress={() => setPostType(type.key)}
                  className={`flex-1 items-center justify-center rounded-xl border px-2 py-3 ${
                    isActive
                      ? "border-primary-400 bg-primary-400/10"
                      : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"
                  }`}
                >
                  <Text
                    weight="medium"
                    size="2xs"
                    className={`text-center ${isActive ? "text-primary-400" : "text-dark-100 dark:text-light-50"}`}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text size="2xs" className="mt-3 text-gray-500 dark:text-gray-300">
            {typeHint}
          </Text>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">
            تفاصيل المنشور
          </Text>

          <View className="gap-2">
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              عنوان المنشور *
            </Text>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="font-noto text-xs"
              rightIcon={<TitleIcon size={16} strokeWidth={2.25} />}
              value={title}
              onChangeText={setTitle}
              placeholder="مثال: حملة دعم طلاب المدارس"
              placeholderTextColor="#9CA3AF"
            />

            <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
              المدينة *
            </Text>
            <Pressable
              onPress={() => setIsCityModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="اختيار المدينة"
            >
              <View pointerEvents="none">
                <Input
                  fullWidth
                  editable={false}
                  showStatusIcon={false}
                  inputClassName="font-noto text-xs"
                  rightIcon={<MapPin size={16} strokeWidth={2.25} />}
                  value={city}
                  placeholder="اختر المدينة"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Pressable>

            <View className="mt-1 flex-row-reverse items-center justify-between">
              <Text size="2xs" className="text-gray-500 dark:text-gray-300">
                وصف المنشور *
              </Text>
              <Text size="2xs" className="text-gray-400 dark:text-gray-300">
                {details.trim().length}/300
              </Text>
            </View>
            <Input
              fullWidth
              showStatusIcon={false}
              inputClassName="min-h-[96px] font-noto text-xs"
              inputContainerClassName="min-h-[120px] items-start py-3"
              rightIcon={<DescriptionIcon size={16} strokeWidth={2.25} />}
              value={details}
              onChangeText={setDetails}
              placeholder="اشرح الهدف من المنشور، الفئة المستهدفة، وكيف يمكن المساعدة."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              maxLength={300}
            />
          </View>
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <View className="mb-3 flex-row-reverse items-center justify-between">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">
              صور المنشور
            </Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">
              {selectedImages.length} صور
            </Text>
          </View>
          <Text size="2xs" className="mb-2 text-gray-500 dark:text-gray-300">
            يمكنك إضافة أي عدد من الصور من المعرض. إضافة صورة واحدة على الأقل ترفع فرصة التفاعل.
          </Text>
          <View className="flex-row-reverse flex-wrap justify-between gap-y-2">
            {selectedImages.map((imageUri, index) => (
              <View
                key={`${imageUri}-${index}`}
                style={{ width: "48%" }}
                className="h-24 overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350"
              >
                <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
                <Pressable
                  onPress={() => handleRemoveImage(imageUri)}
                  className="absolute left-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-gray-900/70"
                  accessibilityRole="button"
                  accessibilityLabel="حذف الصورة"
                >
                  <X size={14} color="#FFFFFF" strokeWidth={2.5} />
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={handlePickImages}
              style={{ width: "48%" }}
              className="h-24 items-center justify-center rounded-xl border border-dashed border-primary-200 bg-primary-100/50 dark:border-dark-400 dark:bg-dark-500"
              accessibilityRole="button"
              accessibilityLabel="إضافة صور للمنشور"
            >
              <ImageIcon size={18} color="#405d72" strokeWidth={2.25} />
              <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">
                إضافة صور
              </Text>
            </Pressable>
          </View>
        </Card>

        <Card padding="sm" className="mb-2 border-gray-200 dark:border-dark-400">
          <Text size="2xs" className="text-gray-500 dark:text-gray-300">
            بالضغط على {submitLabel} أنت توافق على سياسات المحتوى في المنصة.
          </Text>
        </Card>

        <View className="mb-2 flex-row-reverse items-stretch gap-2">
          <View className="min-w-0 flex-1">
            <Button fullWidth size="small" disabled={!canPublish} onPress={handleSubmitPress}>
              {submitLabel}
            </Button>
          </View>
          <View className="min-w-0 flex-1">
            <Button
              fullWidth
              size="small"
              variant="tertiary"
              onPress={handleSaveDraft}
            >
              حفظ كمسودة
            </Button>
          </View>
        </View>

        {!canPublish ? (
          <Text size="2xs" className="text-center text-gray-500 dark:text-gray-300">
            أكمل الحقول المطلوبة (العنوان، المدينة، الوصف) لتفعيل النشر.
          </Text>
        ) : null}
      </Animated.ScrollView>

      <SelectionModal
        visible={isCityModalOpen}
        title="اختيار المدينة"
        description="اختر المدينة المرتبطة بالمنشور."
        options={cityOptions}
        selectedValue={city}
        onSelect={(selectedCity) => {
          setCity(selectedCity);
          setIsCityModalOpen(false);
        }}
        onClose={() => setIsCityModalOpen(false)}
      />

      <Dialog
        visible={isSubmitConfirmOpen}
        title={editMode ? "تأكيد التعديلات" : "تأكيد النشر"}
        message={
          editMode
            ? "هل أنت متأكد أنك تريد اعتماد هذه التعديلات وإعادة إرسال المنشور للمراجعة؟"
            : "هل أنت متأكد أنك تريد نشر هذا المنشور بالبيانات والصور الحالية؟"
        }
        icon={<ImageIcon size={28} color="#405d72" strokeWidth={2.25} />}
        onClose={() => {
          if (!isSubmittingPost) {
            setIsSubmitConfirmOpen(false);
          }
        }}
        cancelable={!isSubmittingPost}
        buttons={[
          {
            text: editMode ? "متابعة التعديل" : "تراجع",
            variant: "tertiary",
            onPress: () => setIsSubmitConfirmOpen(false),
          },
          {
            text: editMode ? "تأكيد التعديلات" : "نشر الآن",
            variant: "primary",
            loading: isSubmittingPost,
            onPress: handleConfirmSubmit,
          },
        ]}
      />
      <Dialog
        visible={isDiscardConfirmOpen}
        title="تغييرات غير محفوظة"
        titleColor="error"
        message="عندك تغييرات غير محفوظة. إذا خرجت الآن ستفقد التعديلات الحالية."
        icon={<X size={28} color="#DC2626" strokeWidth={2.25} />}
        onClose={handleCancelDiscardExit}
        buttons={[
          {
            text: "كمل التعديلات",
            variant: "tertiary",
            onPress: handleCancelDiscardExit,
          },
          {
            text: "الخروج بدون حفظ",
            variant: "primary",
            className: "bg-error-300 shadow-error-300/30",
            onPress: handleConfirmDiscardExit,
          },
        ]}
      />

    </Animated.View>
  );
}
