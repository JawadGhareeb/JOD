import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { groupsApi } from "@/src/features/groups/api";
import { useGroup } from "@/src/features/groups/queries";
import { useToast } from "@/src/providers/ToastProvider";

export default function GroupCampaignCreatePage() {
  const { id: raw } = useLocalSearchParams<{ id?: string | string[] }>();
  const groupId = Array.isArray(raw) ? raw[0] : raw;
  const router = useRouter(); const toast = useToast(); const group = useGroup(groupId);
  const [title,setTitle]=useState(""); const [summary,setSummary]=useState(""); const [goal,setGoal]=useState(""); const [location,setLocation]=useState(""); const [busy,setBusy]=useState(false);
  const canSubmit = Boolean(groupId && group.data?.canCreateCampaign && title.trim().length>=4 && Number(goal)>0);
  const submit = async () => { if(!groupId || !canSubmit) return; setBusy(true); try { const campaign=await groupsApi.createCampaign(groupId,{ title:title.trim(), summary:summary.trim()||null, content:summary.trim()||null, goalAmount:Number(goal), location:location.trim()||group.data?.location||null }); toast.success("تم إنشاء حملة الفريق. أضف الآن منشور الحملة."); router.replace({ pathname:"/create-post", params:{ groupId, campaignId:campaign.id } }); } catch { toast.error("تعذر إنشاء حملة الفريق."); } finally { setBusy(false); } };
  return <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="إنشاء حملة للفريق"/><Card padding="md" className="gap-3 border-gray-200 dark:border-dark-400"><Text size="xs" className="text-gray-500">الحملة ستكون مملوكة للفريق، وإدارة التبرعات والتطوع تتم من مدير الفريق.</Text><Input fullWidth value={title} onChangeText={setTitle} placeholder="اسم الحملة" showStatusIcon={false}/><Input fullWidth multiline value={summary} onChangeText={setSummary} placeholder="وصف الحملة" showStatusIcon={false}/><Input fullWidth value={goal} onChangeText={setGoal} keyboardType="numeric" placeholder="الهدف المالي" showStatusIcon={false}/><Input fullWidth value={location} onChangeText={setLocation} placeholder="الموقع (اختياري)" showStatusIcon={false}/><Button fullWidth disabled={!canSubmit} loading={busy} onPress={()=>void submit()}>إنشاء الحملة ومتابعة النشر</Button></Card></Container>;
}
