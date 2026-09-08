import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Container from "@/src/components/ui/Container";
import Input from "@/src/components/ui/Input";
import Text from "@/src/components/ui/Text";
import { MenuPageHeader } from "@/src/components/pages/settings/MenuPageHeader";
import { GROUP_CATEGORIES } from "@/src/features/groups/types";
import { useGroup, useUpdateGroup } from "@/src/features/groups/queries";

export default function EditGroupPage(){ const {id:raw}=useLocalSearchParams<{id?:string|string[]}>(); const groupId=Array.isArray(raw)?raw[0]:raw; const router=useRouter(); const query=useGroup(groupId); const update=useUpdateGroup(); const [name,setName]=useState(""); const [description,setDescription]=useState(""); const [purpose,setPurpose]=useState(""); const [location,setLocation]=useState(""); const [categories,setCategories]=useState<string[]>([]); const [rules,setRules]=useState<string[]>([""]);
 useEffect(()=>{const g=query.data;if(!g)return;setName(g.name);setDescription(g.description);setPurpose((g as any).purpose??g.description);setLocation(g.location);setCategories(g.categories??[g.category]);setRules(g.rules.length?g.rules:[""]);},[query.data]);
 if(!groupId || (query.data && !query.data.isOwner)) return <Container className="px-4"><MenuPageHeader title="تعديل الفريق"/><Text>التعديل متاح لمالك الفريق فقط.</Text></Container>;
 const submit=async()=>{await update.mutateAsync({groupId,input:{name:name.trim(),description:description.trim(),purpose:purpose.trim(),location:location.trim(),categories,rules:rules.map(r=>r.trim()).filter(Boolean)}});router.back();};
 return <Container scrollable className="px-4"><MenuPageHeader title="تعديل الفريق"/><View className="gap-3"><Card padding="md" className="gap-3"><Input fullWidth value={name} onChangeText={setName} placeholder="اسم الفريق" showStatusIcon={false}/><Input fullWidth multiline value={description} onChangeText={setDescription} placeholder="الوصف" showStatusIcon={false}/><Input fullWidth multiline value={purpose} onChangeText={setPurpose} placeholder="الهدف" showStatusIcon={false}/><Input fullWidth value={location} onChangeText={setLocation} placeholder="الموقع" showStatusIcon={false}/><View className="flex-row-reverse flex-wrap gap-2">{GROUP_CATEGORIES.map(c=><Pressable key={c} onPress={()=>setCategories(v=>v.includes(c)?v.filter(x=>x!==c):[...v,c])} className={`rounded-full border px-3 py-2 ${categories.includes(c)?"border-primary-400 bg-primary-400/10":"border-gray-200"}`}><Text size="2xs">{c}</Text></Pressable>)}</View>{rules.map((rule,i)=><Input key={i} fullWidth value={rule} onChangeText={v=>setRules(curr=>curr.map((r,j)=>j===i?v:r))} placeholder={`القانون ${i+1}`} showStatusIcon={false}/>)}<Button size="small" variant="tertiary" onPress={()=>setRules(v=>[...v,""])}>إضافة قانون</Button><Button fullWidth loading={update.isPending} disabled={name.trim().length<3||description.trim().length<10||purpose.trim().length<10||!categories.length||!rules.some(r=>r.trim())} onPress={()=>void submit()}>حفظ التعديلات</Button></Card></View></Container>; }
