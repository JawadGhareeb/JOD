import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  mockDonationCampaigns,
  mockJobs,
  mockVolunteeringCampaigns,
} from "@/src/data/mockData";
import { mockPosts, mockSavedPostIds } from "@/src/data/mockPosts";
import type {
  DonationCampaign,
  JobItem,
  UserRole,
  VolunteeringCampaign,
} from "@/src/types/models";
import type {
  CreatePostInput,
  PostItem,
  PostStatus,
} from "@/src/types/posts";

type ManagedType = "donation" | "volunteer" | "job";

interface PublisherStats {
  myCampaignsCount: number;
  totalRaised: number;
  applicants: number;
}

interface AppDataContextValue {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentPublisherId: string;
  posts: PostItem[];
  savedPostIds: string[];
  followedDonationIds: string[];
  submittedDonationProofIds: string[];
  donations: DonationCampaign[];
  volunteeringCampaigns: VolunteeringCampaign[];
  jobs: JobItem[];
  closeItem: (type: ManagedType, id: string) => void;
  createPost: (input: CreatePostInput) => PostItem;
  updatePostStatus: (postId: string, status: PostStatus) => void;
  toggleSavePost: (postId: string) => void;
  toggleFollowDonation: (campaignId: string) => void;
  submitDonationProof: (campaignId: string) => void;
  requestVolunteerJoin: (campaignId: string) => void;
  createDonationCampaign: () => void;
  createVolunteeringCampaign: () => void;
  createJob: () => void;
  publisherStats: PublisherStats;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const CURRENT_PUBLISHER_ID = "me";

const createId = (prefix: string) => `${prefix}-${Date.now()}`;

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [posts, setPosts] = useState<PostItem[]>(mockPosts);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(mockSavedPostIds);
  const [followedDonationIds, setFollowedDonationIds] = useState<string[]>([]);
  const [submittedDonationProofIds, setSubmittedDonationProofIds] = useState<
    string[]
  >([]);
  const [donations, setDonations] =
    useState<DonationCampaign[]>(mockDonationCampaigns);
  const [volunteeringCampaigns, setVolunteeringCampaigns] =
    useState<VolunteeringCampaign[]>(mockVolunteeringCampaigns);
  const [jobs, setJobs] = useState<JobItem[]>(mockJobs);

  const createPost = useCallback((input: CreatePostInput): PostItem => {
    const newPost: PostItem = {
      ...input,
      id: createId("p"),
      ownerId: CURRENT_PUBLISHER_ID,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);

    return newPost;
  }, []);

  const updatePostStatus = useCallback((postId: string, status: PostStatus) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, status } : post)),
    );
  }, []);

  const toggleSavePost = useCallback((postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [postId, ...prev],
    );
  }, []);

  const toggleFollowDonation = useCallback((campaignId: string) => {
    setFollowedDonationIds((prev) => {
      const isFollowing = prev.includes(campaignId);

      setDonations((donationPrev) =>
        donationPrev.map((campaign) => {
          if (campaign.id !== campaignId) return campaign;

          return {
            ...campaign,
            followersCount: Math.max(
              campaign.followersCount + (isFollowing ? -1 : 1),
              0,
            ),
          };
        }),
      );

      return isFollowing
        ? prev.filter((id) => id !== campaignId)
        : [campaignId, ...prev];
    });
  }, []);

  const submitDonationProof = useCallback((campaignId: string) => {
    setSubmittedDonationProofIds((prev) =>
      prev.includes(campaignId) ? prev : [campaignId, ...prev],
    );
  }, []);

  const requestVolunteerJoin = useCallback((campaignId: string) => {
    setVolunteeringCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId && campaign.joinStatus === "not_joined"
          ? { ...campaign, joinStatus: "pending" }
          : campaign,
      ),
    );
  }, []);

  const closeItem = useCallback((type: ManagedType, id: string) => {
    if (type === "donation") {
      setDonations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                statusTag: "اكتملت",
                campaignStatus: "completed",
                resultSummary:
                  item.resultSummary ??
                  "تم إغلاق الحملة بعد تحقيق أهدافها التشغيلية وتسليم الدعم للمستفيدين.",
              }
            : item,
        ),
      );
      return;
    }

    if (type === "volunteer") {
      setVolunteeringCampaigns((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                statusTag: "اكتملت",
                campaignStatus: "completed",
                joinStatus:
                  item.joinStatus === "accepted"
                    ? item.joinStatus
                    : "pending",
              }
            : item,
        ),
      );
      return;
    }

    setJobs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusTag: "اكتملت" } : item,
      ),
    );
  }, []);

  const createDonationCampaign = useCallback(() => {
    setDonations((prev) => [
      {
        id: createId("d"),
        title: "حملة جديدة لدعم الأسر",
        description: "تم إنشاء حملة تبرعات جديدة من لوحة الناشر.",
        orgName: "الناشر الحالي",
        verified: true,
        city: "الرياض",
        endDate: "2026-04-05",
        goalAmount: 150000,
        raisedAmount: 12000,
        campaignStatus: "active",
        donationChannelLabel: "رابط تبرع خارجي معتمد",
        donationChannelUrl: "https://jod.app/donate/new",
        followersCount: 0,
        statusTag: "باقي 20 أيام",
        publisherId: CURRENT_PUBLISHER_ID,
      },
      ...prev,
    ]);
  }, []);

  const createVolunteeringCampaign = useCallback(() => {
    setVolunteeringCampaigns((prev) => [
      {
        id: createId("v"),
        title: "فرصة تطوع جديدة",
        description: "تمت إضافة حملة تطوعية جديدة من لوحة الناشر.",
        city: "الرياض",
        date: "2026-03-27",
        time: "06:00 م",
        requiredVolunteers: 35,
        joinedVolunteers: 4,
        campaignStatus: "active",
        joinStatus: "not_joined",
        statusTag: "باقي 18 أيام",
        publisherId: CURRENT_PUBLISHER_ID,
      },
      ...prev,
    ]);
  }, []);

  const createJob = useCallback(() => {
    setJobs((prev) => [
      {
        id: createId("j"),
        title: "وظيفة جديدة - منسق برامج",
        description: "تم إنشاء وظيفة جديدة عبر لوحة الناشر.",
        orgName: "الناشر الحالي",
        city: "الرياض",
        workType: "دوام كامل",
        experienceYears: 2,
        postedAt: "الآن",
        statusTag: "باقي 30 أيام",
        publisherId: CURRENT_PUBLISHER_ID,
      },
      ...prev,
    ]);
  }, []);

  const publisherStats = useMemo<PublisherStats>(() => {
    const myDonations = donations.filter(
      (item) => item.publisherId === CURRENT_PUBLISHER_ID,
    );
    const myVolunteering = volunteeringCampaigns.filter(
      (item) => item.publisherId === CURRENT_PUBLISHER_ID,
    );
    const myJobs = jobs.filter((item) => item.publisherId === CURRENT_PUBLISHER_ID);

    return {
      myCampaignsCount: myDonations.length + myVolunteering.length + myJobs.length,
      totalRaised: myDonations.reduce((sum, item) => sum + item.raisedAmount, 0),
      applicants: myJobs.length * 9 + myVolunteering.length * 5,
    };
  }, [donations, volunteeringCampaigns, jobs]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      userRole,
      setUserRole,
      currentPublisherId: CURRENT_PUBLISHER_ID,
      posts,
      savedPostIds,
      followedDonationIds,
      submittedDonationProofIds,
      donations,
      volunteeringCampaigns,
      jobs,
      closeItem,
      createPost,
      updatePostStatus,
      toggleSavePost,
      toggleFollowDonation,
      submitDonationProof,
      requestVolunteerJoin,
      createDonationCampaign,
      createVolunteeringCampaign,
      createJob,
      publisherStats,
    }),
    [
      closeItem,
      createPost,
      createDonationCampaign,
      createJob,
      createVolunteeringCampaign,
      donations,
      followedDonationIds,
      jobs,
      posts,
      publisherStats,
      savedPostIds,
      submittedDonationProofIds,
      requestVolunteerJoin,
      submitDonationProof,
      toggleSavePost,
      toggleFollowDonation,
      updatePostStatus,
      userRole,
      volunteeringCampaigns,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
};
