import { useState } from "react";
import { View } from "react-native";
import { FilterCountSlider } from "@/src/components/shared";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useGroupInvitations, useMyGroups, useRespondGroupInvitation } from "@/src/features/groups/queries";
import { GroupCard } from "./GroupCard";

const tabs = [
  { key: "owned", label: "مجموعاتي" },
  { key: "joined", label: "عضوياتي" },
  { key: "invitations", label: "دعواتي" },
] as const;
type TabKey = (typeof tabs)[number]["key"];

export function MyGroupsManagementScreen() {
  const [tab, setTab] = useState<TabKey>("owned");
  const owned = useMyGroups("owned");
  const joined = useMyGroups("joined");
  const invitations = useGroupInvitations();
  const respond = useRespondGroupInvitation();

  return (
    <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300">
      <MenuPageHeader title="مجموعاتي وفرق التطوع" />
      <FilterCountSlider items={tabs} selectedKey={tab} onSelect={setTab} />

      {tab === "owned" ? <View className="gap-3">{(owned.data ?? []).length ? owned.data?.map((group) => <GroupCard key={group.id} group={group} />) : <Empty text="ما عندك فرق أنشأتها بعد." />}</View> : null}
      {tab === "joined" ? <View className="gap-3">{(joined.data ?? []).length ? joined.data?.map((group) => <GroupCard key={group.id} group={group} />) : <Empty text="مو مشترك بأي فريق حالياً." />}</View> : null}
      {tab === "invitations" ? <View className="gap-3">{(invitations.data ?? []).length ? invitations.data?.map((invite) => <Card key={invite.id} padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="sm" weight="semibold">{invite.group?.name ?? "فريق تطوعي"}</Text><Text size="2xs" className="text-gray-500 dark:text-gray-300">دعاك {invite.invitedBy?.name ?? "أحد المستخدمين"} للانضمام للفريق.</Text><View className="flex-row-reverse gap-2"><View className="flex-1"><Button fullWidth size="small" loading={respond.isPending} onPress={() => void respond.mutateAsync({ id: invite.id, accept: true })}>قبول</Button></View><View className="flex-1"><Button fullWidth size="small" variant="tertiary" disabled={respond.isPending} onPress={() => void respond.mutateAsync({ id: invite.id, accept: false })}>رفض</Button></View></View></Card>) : <Empty text="ما عندك دعوات فرق حالياً." />}</View> : null}
    </Container>
  );
}

function Empty({ text }: { text: string }) {
  return <View className="items-center rounded-2xl border border-gray-200 p-8 dark:border-dark-400"><Text size="xs" className="text-gray-500 dark:text-gray-300">{text}</Text></View>;
}
