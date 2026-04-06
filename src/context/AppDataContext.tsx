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
  JobApplication,
  JobItem,
  UserRole,
  VolunteeringCampaign,
} from "@/src/types/models";
import type {
  NotificationItem,
  NotificationPreferences,
} from "@/src/types/notifications";
import type { BlockedEntity, ReportItem, ReportStatus } from "@/src/types/reports";
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
  jobApplications: JobApplication[];
  reports: ReportItem[];
  blockedEntities: BlockedEntity[];
  notifications: NotificationItem[];
  notificationPreferences: NotificationPreferences;
  closeItem: (type: ManagedType, id: string) => void;
  createPost: (input: CreatePostInput) => PostItem;
  updatePostStatus: (postId: string, status: PostStatus) => void;
  toggleSavePost: (postId: string) => void;
  toggleFollowDonation: (campaignId: string) => void;
  submitDonationProof: (campaignId: string) => void;
  requestVolunteerJoin: (campaignId: string) => void;
  applyToJob: (jobId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateNotificationPreference: (
    key: Exclude<keyof NotificationPreferences, "doNotDisturb">,
    value: boolean,
  ) => void;
  setDoNotDisturb: (value: boolean) => void;
  submitReport: (input: {
    title: string;
    description: string;
    entityType: ReportItem["entityType"];
    entityId: string;
  }) => void;
  blockEntity: (input: {
    entityType: BlockedEntity["entityType"];
    id: string;
  }) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
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
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([
    {
      id: "app-j2",
      jobId: "j2",
      status: "in_review",
      appliedAt: "2026-03-01T10:30:00Z",
    },
    {
      id: "app-j3",
      jobId: "j3",
      status: "submitted",
      appliedAt: "2026-03-03T08:10:00Z",
    },
  ]);
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep-1",
      title: "بلاغ على حملة",
      description: "يوجد محتوى مضلل في تحديث الحملة.",
      status: "waiting_response",
      entityType: "campaign",
      entityId: "d2",
      createdAt: "2026-04-01T14:30:00Z",
    },
    {
      id: "rep-2",
      title: "بلاغ على وظيفة",
      description: "تفاصيل الإعلان غير مكتملة.",
      status: "in_progress",
      entityType: "job",
      entityId: "j3",
      createdAt: "2026-04-03T10:20:00Z",
    },
  ]);
  const [blockedEntities, setBlockedEntities] = useState<BlockedEntity[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "ntf-1",
      title: "تحديث حملة تتابعها",
      body: "تم نشر تحديث جديد على حملة سقيا القرى النائية.",
      category: "campaign",
      isRead: false,
      createdAt: "2026-04-05T09:20:00Z",
      referenceType: "donation",
      referenceId: "d1",
    },
    {
      id: "ntf-2",
      title: "حالة طلب وظيفي",
      body: "طلبك على وظيفة مصمم محتوى بصري أصبح قيد المراجعة.",
      category: "post",
      isRead: false,
      createdAt: "2026-04-04T13:15:00Z",
      referenceType: "job",
      referenceId: "j2",
    },
    {
      id: "ntf-3",
      title: "تحديث بلاغ",
      body: "بلاغك REP-3004 تم نقله إلى حالة بانتظار الرد.",
      category: "report",
      isRead: true,
      createdAt: "2026-04-02T11:10:00Z",
      referenceType: "report",
      referenceId: "rep-1",
    },
    {
      id: "ntf-4",
      title: "تنبيه نظام",
      body: "تم تحديث سياسة الاستخدام للتطبيق.",
      category: "system",
      isRead: true,
      createdAt: "2026-03-30T10:00:00Z",
    },
  ]);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>({
      campaign: true,
      post: true,
      report: true,
      system: true,
      doNotDisturb: false,
    });

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

  const applyToJob = useCallback((jobId: string) => {
    setJobApplications((prev) => {
      if (prev.some((application) => application.jobId === jobId)) {
        return prev;
      }

      return [
        {
          id: createId("app"),
          jobId,
          status: "submitted",
          appliedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const updateNotificationPreference = useCallback(
    (key: Exclude<keyof NotificationPreferences, "doNotDisturb">, value: boolean) => {
      setNotificationPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setDoNotDisturb = useCallback((value: boolean) => {
    setNotificationPreferences((prev) => ({ ...prev, doNotDisturb: value }));
  }, []);

  const submitReport = useCallback(
    (input: {
      title: string;
      description: string;
      entityType: ReportItem["entityType"];
      entityId: string;
    }) => {
      setReports((prev) => [
        {
          id: createId("rep"),
          title: input.title,
          description: input.description,
          status: "new",
          entityType: input.entityType,
          entityId: input.entityId,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [],
  );

  const blockEntity = useCallback(
    (input: { entityType: BlockedEntity["entityType"]; id: string }) => {
      setBlockedEntities((prev) => {
        const exists = prev.some(
          (item) => item.id === input.id && item.entityType === input.entityType,
        );
        if (exists) return prev;

        return [
          {
            id: input.id,
            entityType: input.entityType,
            blockedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
    [],
  );

  const updateReportStatus = useCallback((id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((report) => (report.id === id ? { ...report, status } : report)),
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
        deadline: "2026-06-01",
        requirements: [
          "تنسيق برامج مجتمعية",
          "متابعة الفرق التشغيلية",
          "إعداد تقارير أسبوعية",
        ],
        employmentTypeLabel: "وظيفة خيرية - دوام كامل",
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
      jobApplications,
      reports,
      blockedEntities,
      notifications,
      notificationPreferences,
      closeItem,
      createPost,
      updatePostStatus,
      toggleSavePost,
      toggleFollowDonation,
      submitDonationProof,
      requestVolunteerJoin,
      applyToJob,
      markNotificationRead,
      markAllNotificationsRead,
      updateNotificationPreference,
      setDoNotDisturb,
      submitReport,
      blockEntity,
      updateReportStatus,
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
      jobApplications,
      reports,
      blockedEntities,
      notifications,
      notificationPreferences,
      posts,
      publisherStats,
      savedPostIds,
      submittedDonationProofIds,
      applyToJob,
      markNotificationRead,
      markAllNotificationsRead,
      updateNotificationPreference,
      setDoNotDisturb,
      submitReport,
      blockEntity,
      updateReportStatus,
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
