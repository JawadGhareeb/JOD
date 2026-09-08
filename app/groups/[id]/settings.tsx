import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { useDeleteGroup, useGroup, useGroupMembers, useInviteGroupUsers, useRemoveGroupMember, useUpdateGroup } from "@/src/features/groups/queries";
import type { GroupInviteCandidate } from "@/src/features/groups/types";
import { AdminsPickerModal } from "@/src/components/pages/groups/AdminsPickerModal";

export default function GroupSettingsPage(){
 const {id:raw}=useLocalSearchParams<{id?:string|string[]}>(); const groupId=Array.isArray(raw)?raw[0]:raw; const router=useRouter(); const group=useGroup(groupId); const members=useGroupMembers(groupId); const update=useUpdateGroup(); const remove=useRemoveGroupMember(); const del=useDeleteGroup(); const invite=useInviteGroupUsers(); const [picker,setPicker]=useState(false); const [selected,setSelected]=useState<GroupInviteCandidate[]>([]);
 if(!groupId || !group.data?.isOwner) return <Container className="px-4"><MenuPageHeader title="إعدادات الفريق"/><Text>هذه الصفحة متاحة لمالك الفريق فقط.</Text></Container>;
 const toggleReview=()=>void update.mutateAsync({groupId,input:{requiresPostApproval:!group.data?.requiresPostApproval}});
 const deleteGroup=()=>Alert.alert("حذف الفريق","سيتم حذف الفريق ومحتواه المرتبط. هل أنت متأكد؟",[{text:"إلغاء",style:"cancel"},{text:"حذف",style:"destructive",onPress:()=>void del.mutateAsync(groupId).then(()=>router.replace("/(tabs)/groups"))}]);
 return <Container scrollable className="bg-light-100 px-4 dark:bg-dark-300"><MenuPageHeader title="إعدادات الفريق"/><View className="gap-3"><Card padding="md" className="gap-3"><Text weight="semibold">مراجعة المنشورات</Text><Button fullWidth variant="tertiary" loading={update.isPending} onPress={toggleReview}>{group.data.requiresPostApproval?"✓ المراجعة مفعلة — إيقافها":"المراجعة غير مفعلة — تفعيلها"}</Button></Card><Card padding="md" className="gap-3"><Text weight="semibold">الأعضاء</Text><Button fullWidth variant="tertiary" onPress={()=>setPicker(true)}>دعوة أعضاء جدد</Button>{(members.data??[]).filter(m=>m.role!=="owner").map(member=><View key={member.id} className="flex-row-reverse items-center justify-between border-b border-gray-100 py-2 dark:border-dark-400"><View><Text size="xs" weight="semibold">{member.name}</Text><Text size="2xs" className="text-gray-500">@{member.username}</Text></View><Button size="small" variant="tertiary" disabled={remove.isPending} onPress={()=>void remove.mutateAsync({groupId,userId:member.id})}>إزالة</Button></View>)}</Card><Button fullWidth variant="tertiary" onPress={deleteGroup}>حذف الفريق</Button></View><AdminsPickerModal visible={picker} selected={selected} onClose={()=>setPicker(false)} onConfirm={(users)=>{setSelected(users); setPicker(false); if(users.length) void invite.mutateAsync({groupId,userIds:users.map(u=>u.id)}).then(()=>setSelected([]));}}/></Container>;
}
