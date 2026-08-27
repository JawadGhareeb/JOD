import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, ImagePlus, MapPin, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Alert, Animated, Image, Pressable, View } from "react-native";

import { appIcons } from "@/src/components/layout/iconMap";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import SelectionModal, { type SelectionOption } from "@/src/components/ui/SelectionModal";
import Text from "@/src/components/ui/Text";
import { useCities, usePostTypesLookup } from "@/src/features/lookups/queries";
import { API_TYPE_TO_POST_TYPE, POST_TYPE_TO_API_TYPE } from "@/src/features/posts/api";
import {
  useCategories,
  useCreatePost,
  useDeletePostImage,
  useMyPost,
  useReorderPostImages,
  useSubmitPost,
  useUpdatePost,
  useUploadPostImage,
} from "@/src/features/posts/queries";
import { CONTENT_AUDIENCE_OPTIONS } from "@/src/features/posts/types";
import type { ApiPostType, ContentAudience, CreatePostType, MobileImageFile } from "@/src/features/posts/types";
import { ApiClientError } from "@/src/lib/api-client";
import { getPrimaryColor } from "@/src/theme";
import { useCollapsibleHeaderScreen } from "@/src/providers/CollapsibleHeaderProvider";
import { useAuthGuard } from "@/src/providers/AuthGuardProvider";
import { useToast } from "@/src/providers/ToastProvider";
import { MenuPageHeader } from "../settings/MenuPageHeader";

const ImageIcon = ImagePlus;
const TitleIcon = appIcons.campaign;
const DescriptionIcon = appIcons.about;
const MAX_POST_IMAGES = 10;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

const readParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] || "" : value || "";
const isRemoteImage = (uri: string) => /^https?:\/\//i.test(uri);
const isCreateType = (value: string): value is ApiPostType =>
  value === "volunteer_opportunity" || value === "donation_campaign" || value === "help_request" || value === "service_offer";

function toUploadFile(uri: string, index: number): MobileImageFile {
  const filename = uri.split("?")[0].split("/").pop() || `image-${index + 1}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const type = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
  return { uri, name: filename, type };
}

type CreatePostScreenProps = { showPageHeader?: boolean };

export function CreatePostScreen({ showPageHeader = true }: CreatePostScreenProps = {}) {
  const params = useLocalSearchParams<{ mode?: string; postId?: string }>();
  const editMode = readParam(params.mode) === "edit";
  const editingPostId = readParam(params.postId);
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const toast = useToast();
  const { onScroll } = useCollapsibleHeaderScreen();
  const { colorScheme } = useColorScheme();
  const primaryColor = getPrimaryColor(colorScheme === "dark");

  const [postType, setPostType] = useState<CreatePostType>("volunteer");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [audience, setAudience] = useState<ContentAudience>("general");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activePostId, setActivePostId] = useState(editingPostId);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [initializedPostId, setInitializedPostId] = useState<string | null>(null);

  const citiesQuery = useCities();
  const postTypesQuery = usePostTypesLookup();
  const categoriesQuery = useCategories({ status: "active", target: "post" });
  const myPostQuery = useMyPost(activePostId || undefined);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const submitMutation = useSubmitPost();
  const uploadImageMutation = useUploadPostImage();
  const reorderImageMutation = useReorderPostImages();
  const deleteImageMutation = useDeletePostImage();

  useEffect(() => {
    const post = myPostQuery.data;
    if (!editMode || !post || initializedPostId === post.id) return;
    if (isCreateType(post.type)) setPostType(API_TYPE_TO_POST_TYPE[post.type]);
    setTitle(post.title ?? "");
    setDetails(post.details ?? "");
    setCity(post.city ?? "");
    setCategoryId(post.categoryId ?? "");
    setAudience(post.audience ?? "general");
    setSelectedImages(post.images ?? []);
    setActivePostId(post.id);
    setInitializedPostId(post.id);
  }, [editMode, initializedPostId, myPostQuery.data]);

  const postTypeOptions = useMemo(
    () => (postTypesQuery.data ?? [])
      .filter((item) => item.canCreate)
      .flatMap((item) => isCreateType(item.code) ? [{ key: API_TYPE_TO_POST_TYPE[item.code], label: item.label, hint: item.hint }] : []),
    [postTypesQuery.data],
  );
  const cityOptions: SelectionOption[] = useMemo(
    () => (citiesQuery.data ?? []).map((item) => ({ label: item.name, value: item.name })),
    [citiesQuery.data],
  );
  const categoryOptions: SelectionOption[] = useMemo(
    () => (categoriesQuery.data?.items ?? []).map((item) => ({ label: item.name, value: item.id, hint: item.description ?? undefined })),
    [categoriesQuery.data?.items],
  );

  const typeHint = postTypeOptions.find((item) => item.key === postType)?.hint;
  const selectedCategoryLabel = categoryOptions.find((item) => item.value === categoryId)?.label ?? "";
  const canPublish = title.trim().length >= 4 && details.trim().length >= 10 && city.trim().length >= 2;
  const isBusy = isSavingDraft || isPublishing || uploadImageMutation.isPending || reorderImageMutation.isPending || deleteImageMutation.isPending;
  const pageTitle = editMode ? "تعديل المنشور" : "إنشاء منشور";

  const buildCreateInput = (saveAsDraft: boolean) => ({
    type: POST_TYPE_TO_API_TYPE[postType],
    title: title.trim() || null,
    details: details.trim() || null,
    city: city.trim() || null,
    categoryId: categoryId || null,
    audience,
    saveAsDraft,
  });
  const buildUpdateInput = () => ({
    type: POST_TYPE_TO_API_TYPE[postType],
    title: title.trim() || null,
    details: details.trim() || null,
    city: city.trim() || null,
    categoryId: categoryId || null,
    audience,
  });

  const syncPostImages = async (postId: string) => {
    const desiredUris = [...selectedImages];
    const existingMedia = myPostQuery.data?.id === postId ? myPostQuery.data.imageMedia : [];
    const existingIds = new Set(existingMedia.map((item) => item.id));
    const localUris = desiredUris.filter((uri) => !isRemoteImage(uri));
    let updated = myPostQuery.data?.id === postId ? myPostQuery.data : undefined;

    if (localUris.length > 0) {
      updated = await uploadImageMutation.mutateAsync({ postId, images: localUris.map(toUploadFile) });
    } else if (!updated) {
      const refreshed = await myPostQuery.refetch();
      updated = refreshed.data;
    }

    if (!updated) return;
    const newMedia = updated.imageMedia.filter((item) => !existingIds.has(item.id)).sort((a, b) => a.position - b.position);
    const idByUri = new Map<string, string>();
    updated.imageMedia.forEach((item) => idByUri.set(item.url, item.id));
    localUris.forEach((uri, index) => { const media = newMedia[index]; if (media) idByUri.set(uri, media.id); });
    const orderedIds = desiredUris.map((uri) => idByUri.get(uri)).filter((id): id is string => Boolean(id));

    if (orderedIds.length === updated.imageMedia.length && orderedIds.length > 1) {
      const reordered = await reorderImageMutation.mutateAsync({ postId, imageIds: orderedIds });
      setSelectedImages(reordered.images);
    } else {
      setSelectedImages(updated.images);
    }
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= selectedImages.length || from === to) return;
    setSelectedImages((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handlePickImages = async () => {
    const remaining = MAX_POST_IMAGES - selectedImages.length;
    if (remaining <= 0) {
      Alert.alert("الحد الأقصى للصور", "يمكن إرفاق 10 صور كحد أقصى لكل منشور.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("إذن الصور مطلوب", "اسمح للتطبيق بالوصول إلى الصور حتى تتمكن من إرفاقها بالمنشور.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });
    if (result.canceled) return;

    const accepted: string[] = [];
    const rejected: string[] = [];
    result.assets.forEach((asset) => {
      const mime = asset.mimeType?.toLowerCase();
      const typeAllowed = !mime || mime === "image/jpeg" || mime === "image/png" || mime === "image/webp";
      const sizeAllowed = !asset.fileSize || asset.fileSize <= MAX_IMAGE_BYTES;
      if (typeAllowed && sizeAllowed) accepted.push(asset.uri);
      else rejected.push(asset.fileName ?? asset.uri.split("/").pop() ?? "صورة");
    });

    setSelectedImages((current) => [...new Set([...current, ...accepted])].slice(0, MAX_POST_IMAGES));
    if (rejected.length) Alert.alert("بعض الصور لم تُضف", `تحقق من الصيغة والحجم (5MB): ${rejected.join("، ")}`);
  };

  const handleRemoveImage = async (uri: string) => {
    if (activePostId && isRemoteImage(uri)) {
      try {
        let media = myPostQuery.data?.imageMedia.find((item) => item.url === uri);
        if (!media) {
          const refreshed = await myPostQuery.refetch();
          media = refreshed.data?.imageMedia.find((item) => item.url === uri);
        }

        if (!media) {
          Alert.alert("تعذر حذف الصورة", "تعذر العثور على بيانات الصورة المرفوعة. حدّث المنشور وحاول مرة أخرى.");
          return;
        }

        const updated = await deleteImageMutation.mutateAsync({ postId: activePostId, imageId: media.id });
        setSelectedImages(updated.images);
        return;
      } catch (error) {
        Alert.alert("تعذر حذف الصورة", error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE);
        return;
      }
    }

    setSelectedImages((current) => current.filter((item) => item !== uri));
  };

  const handleSaveDraft = async () => {
    if (!requireAuth()) return;
    setIsSavingDraft(true);
    try {
      let postId = activePostId;
      if (postId) {
        await updateMutation.mutateAsync({ postId, input: buildUpdateInput() });
      } else {
        const created = await createMutation.mutateAsync(buildCreateInput(true));
        postId = created.id;
        setActivePostId(postId);
      }
      await syncPostImages(postId);
      toast.success("تم حفظ بيانات المنشور والصور المرفوعة كمسودة.", "تم حفظ المسودة");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE, "تعذر حفظ المسودة");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!requireAuth() || !canPublish) return;
    setIsPublishing(true);
    try {
      let postId = activePostId;
      if (postId) {
        await updateMutation.mutateAsync({ postId, input: buildUpdateInput() });
      } else {
        const created = await createMutation.mutateAsync(buildCreateInput(true));
        postId = created.id;
        setActivePostId(postId);
      }
      await syncPostImages(postId);
      await submitMutation.mutateAsync(postId);
      toast.success("تم إرسال المنشور للمراجعة، وسيظهر بعد موافقة الإدارة.", "تم إرسال المنشور");
      if (editMode) router.back();
      else router.replace("/(tabs)/profile");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : GENERIC_ERROR_MESSAGE, "تعذر إرسال المنشور");
    } finally {
      setIsPublishing(false);
    }
  };

  if (editMode && myPostQuery.isLoading) {
    return <View className="flex-1 items-center justify-center bg-light-100 dark:bg-dark-300"><Text size="sm" className="text-gray-500 dark:text-gray-300">جارِ تحميل المنشور...</Text></View>;
  }

  return (
    <View className="flex-1 bg-light-100 px-4 dark:bg-dark-300">
      {showPageHeader ? <MenuPageHeader title={pageTitle} /> : null}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28, paddingTop: showPageHeader ? 0 : 12 }}
        onScroll={showPageHeader ? undefined : onScroll}
        scrollEventThrottle={showPageHeader ? undefined : 16}
      >
        {editMode && myPostQuery.data?.status === "rejected" && myPostQuery.data.rejectionReason ? (
          <Card padding="md" className="mb-3 border-error-300/30 bg-error-300/5">
            <Text weight="semibold" size="sm" className="text-error-300">سبب رفض المنشور</Text>
            <Text size="xs" className="mt-2 text-error-300">{myPostQuery.data.rejectionReason}</Text>
            <Text size="2xs" className="mt-2 text-gray-500 dark:text-gray-300">عدّل البيانات المطلوبة ثم استخدم «حفظ وإعادة الإرسال» لإرساله للمراجعة من جديد.</Text>
          </Card>
        ) : null}

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">نوع المنشور</Text>
          {postTypeOptions.length ? (
            <View className="flex-row-reverse gap-2">
              {postTypeOptions.map((item) => {
                const active = item.key === postType;
                return (
                  <Pressable key={item.key} onPress={() => setPostType(item.key)} className={`flex-1 items-center rounded-xl border px-2 py-3 ${active ? "border-primary-400 bg-primary-400/10" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}>
                    <Text size="2xs" weight="medium" className={active ? "text-primary-400" : "text-dark-100 dark:text-light-50"}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : <Text size="xs" className="text-gray-500 dark:text-gray-300">جارِ تحميل أنواع المنشورات...</Text>}
          {typeHint ? <Text size="2xs" className="mt-3 text-gray-500 dark:text-gray-300">{typeHint}</Text> : null}
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="mb-3 text-dark-100 dark:text-light-50">الجمهور المستهدف</Text>
          <View className="flex-row-reverse gap-2">
            {CONTENT_AUDIENCE_OPTIONS.map((option) => {
              const active = option.value === audience;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setAudience(option.value)}
                  className={`flex-1 items-center rounded-xl border px-2 py-3 ${active ? "border-primary-400 bg-primary-400/10" : "border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-500"}`}
                >
                  <Text size="2xs" weight="medium" className={active ? "text-primary-400" : "text-dark-100 dark:text-light-50"}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text size="2xs" className="mt-3 text-gray-500 dark:text-gray-300">
            اختر «طلاب» إذا كان هذا المنشور موجهاً لدعم الطلاب تحديداً — سيظهر في قسم دعم الطلاب بالإضافة إلى الرئيسية.
          </Text>
        </Card>

        <Card padding="md" className="mb-3 gap-3 border-gray-200 dark:border-dark-400">
          <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">تفاصيل المنشور</Text>
          <Input fullWidth showStatusIcon={false} rightIcon={<TitleIcon size={16} strokeWidth={2.25} />} value={title} onChangeText={setTitle} placeholder="عنوان المنشور" placeholderTextColor="#9CA3AF" />

          <Pressable onPress={() => setIsCityModalOpen(true)}><View pointerEvents="none"><Input fullWidth editable={false} showStatusIcon={false} rightIcon={<MapPin size={16} strokeWidth={2.25} />} value={city} placeholder="اختر المدينة" placeholderTextColor="#9CA3AF" /></View></Pressable>

          <Pressable onPress={() => setIsCategoryModalOpen(true)}><View pointerEvents="none"><Input fullWidth editable={false} showStatusIcon={false} value={selectedCategoryLabel} placeholder="التصنيف - اختياري" placeholderTextColor="#9CA3AF" /></View></Pressable>

          <Input fullWidth multiline showStatusIcon={false} rightIcon={<DescriptionIcon size={16} strokeWidth={2.25} />} value={details} onChangeText={setDetails} placeholder="اكتب تفاصيل المنشور" placeholderTextColor="#9CA3AF" inputClassName="min-h-[96px] font-noto text-xs" inputContainerClassName="min-h-[120px] items-start py-3" textAlignVertical="top" />
          {!canPublish ? <Text size="2xs" className="text-error-300">للنشر: العنوان 4 أحرف على الأقل، التفاصيل 10 أحرف على الأقل، والمدينة مطلوبة.</Text> : null}
        </Card>

        <Card padding="md" className="mb-3 border-gray-200 dark:border-dark-400">
          <View className="mb-2 flex-row-reverse items-center justify-between">
            <Text weight="semibold" size="sm" className="text-dark-100 dark:text-light-50">صور المنشور</Text>
            <Text size="2xs" className="text-gray-500 dark:text-gray-300">{selectedImages.length}/{MAX_POST_IMAGES}</Text>
          </View>
          <Text size="2xs" className="mb-3 text-gray-500 dark:text-gray-300">JPEG / PNG / WebP، وبحد أقصى 5MB للصورة. تُرفع الصور منفصلة عن بيانات المنشور.</Text>
          <View className="flex-row-reverse flex-wrap justify-between gap-y-2">
            {selectedImages.map((uri, index) => (
              <View key={`${uri}-${index}`} style={{ width: "48%" }} className="h-24 overflow-hidden rounded-xl bg-gray-200 dark:bg-dark-350">
                <Image source={{ uri }} className="h-full w-full" resizeMode="cover" />
                <Pressable disabled={isBusy} onPress={() => void handleRemoveImage(uri)} className="absolute left-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-gray-900/70"><X size={14} color="#FFFFFF" strokeWidth={2.5} /></Pressable>
                <View className="absolute bottom-2 left-2 right-2 flex-row items-center justify-between">
                  <Pressable disabled={isBusy || index === 0} onPress={() => moveImage(index, index - 1)} className="h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 disabled:opacity-30" accessibilityLabel="تحريك الصورة للأمام"><ChevronRight size={14} color="#FFFFFF" strokeWidth={2.5} /></Pressable>
                  <Text size="2xs" className="rounded-full bg-gray-900/70 px-2 py-1 text-white">{index + 1}</Text>
                  <Pressable disabled={isBusy || index === selectedImages.length - 1} onPress={() => moveImage(index, index + 1)} className="h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 disabled:opacity-30" accessibilityLabel="تحريك الصورة للخلف"><ChevronLeft size={14} color="#FFFFFF" strokeWidth={2.5} /></Pressable>
                </View>
              </View>
            ))}
            {selectedImages.length < MAX_POST_IMAGES ? (
              <Pressable disabled={isBusy} onPress={() => void handlePickImages()} style={{ width: "48%" }} className="h-24 items-center justify-center rounded-xl border border-dashed border-primary-200 bg-primary-100/50 dark:border-dark-400 dark:bg-dark-500">
                <ImageIcon size={18} color={primaryColor} strokeWidth={2.25} />
                <Text size="2xs" className="mt-1 text-gray-500 dark:text-gray-300">إضافة صور</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>

        <View className="mb-2 flex-row-reverse gap-2">
          <View className="flex-1"><Button fullWidth size="small" disabled={!canPublish || isBusy} loading={isPublishing} onPress={() => void handlePublish()}>{editMode ? "حفظ وإعادة الإرسال" : "إرسال المنشور"}</Button></View>
          <View className="flex-1"><Button fullWidth size="small" variant="tertiary" disabled={isBusy} loading={isSavingDraft} onPress={() => { if (requireAuth()) void handleSaveDraft(); }}>حفظ كمسودة</Button></View>
        </View>
      </Animated.ScrollView>

      <SelectionModal visible={isCityModalOpen} title="اختر المدينة" options={cityOptions} selectedValue={city} onSelect={(value) => { setCity(value); setIsCityModalOpen(false); }} onClose={() => setIsCityModalOpen(false)} />
      <SelectionModal visible={isCategoryModalOpen} title="تصنيف المنشور" options={categoryOptions} selectedValue={categoryId} onSelect={(value) => { setCategoryId(value); setIsCategoryModalOpen(false); }} onClose={() => setIsCategoryModalOpen(false)} />
    </View>
  );
}
