import { mockHomePayload } from "@/src/data/mockHome";
import type { MenuDataPayload } from "@/src/types/menu";

export const mockMenuPayload: MenuDataPayload = {
  savedPosts: mockHomePayload.posts.filter((post) => post.saved).slice(0, 10),
  myDonations: [
    {
      id: "donation-1",
      campaignTitle: "حملة دعم العمليات الجراحية للأطفال",
      organization: "جمعية عطاء",
      donatedAmount: 250000,
      targetAmount: 700000,
      date: "2026-04-12",
      status: "active",
      flow: "contributed",
    },
    {
      id: "donation-2",
      campaignTitle: "حملة السلال الغذائية لشهر نيسان",
      organization: "فريق المتطوعين",
      donatedAmount: 120000,
      targetAmount: 120000,
      date: "2026-03-28",
      status: "completed",
      flow: "contributed",
    },
    {
      id: "donation-3",
      campaignTitle: "دعم علاجي للحالات الإسعافية",
      organization: "مبادرة يد الخير",
      donatedAmount: 180000,
      targetAmount: 250000,
      date: "2026-04-20",
      status: "scheduled",
      flow: "received",
    },
    {
      id: "donation-4",
      campaignTitle: "دعم أسرة متضررة من الحريق",
      organization: "مجتمع المتبرعين",
      donatedAmount: 95000,
      targetAmount: 600000,
      date: "2026-04-02",
      status: "active",
      flow: "received",
    },
  ],
};
