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
import type {
  DonationCampaign,
  JobItem,
  UserRole,
  VolunteeringCampaign,
} from "@/src/types/models";

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
  donations: DonationCampaign[];
  volunteeringCampaigns: VolunteeringCampaign[];
  jobs: JobItem[];
  closeItem: (type: ManagedType, id: string) => void;
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
  const [donations, setDonations] =
    useState<DonationCampaign[]>(mockDonationCampaigns);
  const [volunteeringCampaigns, setVolunteeringCampaigns] =
    useState<VolunteeringCampaign[]>(mockVolunteeringCampaigns);
  const [jobs, setJobs] = useState<JobItem[]>(mockJobs);

  const closeItem = useCallback((type: ManagedType, id: string) => {
    if (type === "donation") {
      setDonations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, statusTag: "اكتملت" } : item,
        ),
      );
      return;
    }

    if (type === "volunteer") {
      setVolunteeringCampaigns((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, statusTag: "اكتملت" } : item,
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
      donations,
      volunteeringCampaigns,
      jobs,
      closeItem,
      createDonationCampaign,
      createVolunteeringCampaign,
      createJob,
      publisherStats,
    }),
    [
      closeItem,
      createDonationCampaign,
      createJob,
      createVolunteeringCampaign,
      donations,
      jobs,
      publisherStats,
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
