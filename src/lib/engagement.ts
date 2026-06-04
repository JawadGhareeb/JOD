import { Alert, Linking } from "react-native";
import {
  mockDonationCampaigns,
  mockVolunteeringCampaigns,
} from "@/src/data/mockData";
import { mockHomePayload } from "@/src/data/mockHome";
import { HOME_POST_TYPE_LABELS } from "@/src/helpers/home";
import type { DonationCampaign, VolunteeringCampaign } from "@/src/types/models";
import type { HomePost } from "@/src/types/home";

type ContactSource = Pick<HomePost, "phoneNumber" | "whatsappNumber" | "publisher">;

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d+]/g, "");
}

function getDigitsOnlyPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

export function getHomePostById(postId?: string): HomePost | undefined {
  if (!postId) return undefined;
  return mockHomePayload.posts.find((post) => post.id === postId);
}

export function getRelatedDonationCampaign(
  post?: HomePost,
): DonationCampaign | undefined {
  if (!post) return undefined;
  return mockDonationCampaigns.find((campaign) => campaign.publisherId === post.publisher.id);
}

export function getRelatedVolunteeringCampaign(
  post?: HomePost,
): VolunteeringCampaign | undefined {
  if (!post) return undefined;
  return mockVolunteeringCampaigns.find((campaign) => campaign.publisherId === post.publisher.id);
}

export function getPostDisplayTitle(post?: HomePost): string {
  if (!post) {
    return "تفاصيل المنشور";
  }

  return post.title || HOME_POST_TYPE_LABELS[post.postType] || "تفاصيل المنشور";
}

export function getPostActionLabel(post?: HomePost): string {
  if (!post) return "عرض";

  switch (post.cta.type) {
    case "donate":
      return "تبرّع الآن";
    case "apply":
      return "قدّم الآن";
    case "contact":
      return "تواصل";
    case "details":
      return "عرض التفاصيل";
    default:
      return "عرض";
  }
}

export async function openPostContact(source: ContactSource): Promise<void> {
  const whatsappCandidate =
    source.whatsappNumber || source.phoneNumber || source.publisher.whatsappNumber || source.publisher.phoneNumber;
  const phoneCandidate = source.phoneNumber || source.publisher.phoneNumber;

  if (!whatsappCandidate && !phoneCandidate) {
    Alert.alert(
      "لا توجد وسيلة تواصل",
      "لم يتم العثور على رقم هاتف أو واتساب لهذا المنشور.",
    );
    return;
  }

  const whatsappDigits = getDigitsOnlyPhoneNumber(whatsappCandidate || "");
  if (whatsappDigits) {
    const whatsappAppUrl = `whatsapp://send?phone=${whatsappDigits}`;
    const whatsappWebUrl = `https://wa.me/${whatsappDigits}`;

    try {
      await Linking.openURL(whatsappAppUrl);
      return;
    } catch {
      // Fall back to browser/web link below.
    }

    try {
      await Linking.openURL(whatsappWebUrl);
      return;
    } catch {
      // Fall back to phone call below.
    }
  }

  const phoneNumber = normalizePhoneNumber(phoneCandidate || "");
  if (phoneNumber) {
    try {
      await Linking.openURL(`tel:${phoneNumber}`);
      return;
    } catch {
      Alert.alert(
        "تعذر فتح وسيلة التواصل",
        "لم نتمكن من فتح واتساب أو الاتصال الهاتفي الآن. حاول مرة أخرى لاحقًا.",
      );
      return;
    }
  }

  Alert.alert(
    "لا توجد وسيلة تواصل",
    "لم يتم العثور على رقم هاتف أو واتساب لهذا المنشور.",
  );
}
