export type PostType = "offer" | "request";

export type PostStatus =
  | "pending"
  | "published"
  | "in_progress"
  | "completed"
  | "rejected"
  | "removed";

export type PickupMethod = "direct" | "delivery" | "dropoff";

export type ContactMethod = "phone" | "whatsapp" | "both";

export interface PostItem {
  id: string;
  title: string;
  description: string;
  type: PostType;
  status: PostStatus;
  category: string;
  tags: string[];
  city: string;
  area?: string;
  pickupMethod: PickupMethod;
  contactMethod: ContactMethod;
  ownerId: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface CreatePostInput {
  title: string;
  description: string;
  type: PostType;
  category: string;
  tags: string[];
  city: string;
  area?: string;
  pickupMethod: PickupMethod;
  contactMethod: ContactMethod;
}
