# JOD — متطلبات الباك إند للمجموعات والفرق التطوعية

## الهدف
هذا الملف يحدد ما يحتاجه تطبيق JOD من الباك إند لاستبدال الـmock الحالي لميزة Groups ببيانات حقيقية، ثم ما يلزم مستقبلًا لدعم Volunteer Teams.

> **مهم:** هذه وثيقة متطلبات فقط. لم يتم تعديل كود الباك إند ضمن هذه المهمة.

## 1. العقد الحالي الذي يتوقعه الموبايل
الفرونت إند يحتوي حاليًا أنواعًا لـ`Group`, `GroupProfile`, `GroupMember`, `GroupPost`, `GroupComment`, `GroupCommentThread`, `GroupRecommendation`, و`CreateGroupInput`.

الحالات الحالية:

```text
active | pending | rejected
```

الخصوصية:

```text
public | private
```

الأدوار:

```text
owner | admin | moderator | member
```

## 2. الكيانات الأساسية

### groups
حقول مقترحة:

```text
id
owner_id
organization_id nullable
name
description
category_id أو category
location
visibility: public|private
status: pending|active|rejected|suspended|archived
purpose
image_media_id nullable
cover_media_id nullable
rejection_reason nullable
approved_by nullable
approved_at nullable
created_at
updated_at
```

للتوسعة المستقبلية:

```text
kind: community|volunteer_team
```

### group_members

```text
id
group_id
user_id
role: owner|admin|moderator|member
status: active|left|removed
joined_at
created_at
updated_at
```

يجب وجود Unique constraint على `(group_id, user_id)`.

### group_join_requests
ضروري للمجموعات الخاصة:

```text
id
group_id
user_id
status: pending|approved|rejected|cancelled
reviewed_by nullable
reviewed_at nullable
rejection_reason nullable
created_at
updated_at
```

### group_rules
يمكن أن تكون JSON array، لكن يفضل جدول مستقل إذا أردنا ترتيبًا وتدقيقًا:

```text
id
group_id
text
position
created_at
updated_at
```

### group_posts

```text
id
group_id
author_id
body
status: published|hidden|deleted
is_pinned
likes_count
comments_count
created_at
updated_at
```

### group_comments

```text
id
post_id
author_id
parent_id nullable
body
likes_count
status
created_at
updated_at
```

الواجهة الحالية تعتمد مستوى رد واحد فقط؛ الرد على Reply يجب أن يرتبط بالـroot comment نفسه.

### likes
جداول أو علاقات لـ`group_post_likes` و`group_comment_likes` مع Unique على `(resource_id, user_id)`.

## 3. إنشاء المجموعة ومراجعة الإدارة

### إنشاء طلب

```http
POST /api/mobile/groups
```

Body مقترح:

```json
{
  "name": "فريق جود التطوعي",
  "description": "...",
  "category": "تطوع",
  "location": "دمشق",
  "visibility": "public",
  "rules": ["احترام الأعضاء"],
  "purpose": "سبب إنشاء المجموعة",
  "proposedAdminIds": ["user-1"]
}
```

السلوك المطلوب:

1. Authentication إلزامي.
2. إنشاء المجموعة بحالة `pending`.
3. إضافة المنشئ كـ`owner`.
4. عدم تفعيل المشرفين المقترحين نهائيًا قبل الموافقة.
5. عدم ظهور المجموعة في Public Discovery قبل الموافقة.
6. إرسال Notification للمستخدم أن الطلب قيد المراجعة.

### صورة المجموعة
يفضل الاستفادة من Media infrastructure الموجودة في JOD:

```http
POST /api/mobile/groups/{groupId}/image
```

### مراجعة Admin Dashboard

```http
GET  /api/admin/groups?status=pending
GET  /api/admin/groups/{id}
POST /api/admin/groups/{id}/approve
POST /api/admin/groups/{id}/reject
```

الرفض يستقبل `reason`. عند الموافقة يتم ضبط `status=active` وحفظ المراجع والتاريخ، وعند الرفض يحفظ `rejection_reason`. كلا القرارين يجب أن يرسلا إشعارًا للمالك.

## 4. Endpoints المطلوبة للموبايل

### Discovery وDetail

```http
GET /api/mobile/groups?page=1&perPage=20&search=&category=&location=&visibility=
GET /api/mobile/groups/suggested?page=1&perPage=20
GET /api/mobile/groups/mine?page=1&perPage=20
GET /api/mobile/groups/{id}
```

`mine` يجب أن يعيد المجموعات المنضم إليها المستخدم، إضافة إلى المجموعات التي يملكها حتى لو كانت `pending` أو `rejected`.

### Membership
للمجموعة العامة:

```http
POST   /api/mobile/groups/{id}/join
DELETE /api/mobile/groups/{id}/join
```

للمجموعة الخاصة:

```http
POST   /api/mobile/groups/{id}/join-requests
DELETE /api/mobile/groups/{id}/join-requests/me
GET    /api/mobile/groups/{id}/join-requests
POST   /api/mobile/groups/{id}/join-requests/{requestId}/approve
POST   /api/mobile/groups/{id}/join-requests/{requestId}/reject
```

كل Role/permission check يجب أن يكون Server-side.

### Members

```http
GET    /api/mobile/groups/{id}/members
PATCH  /api/mobile/groups/{id}/members/{userId}/role
DELETE /api/mobile/groups/{id}/members/{userId}
```

### Posts

```http
GET    /api/mobile/groups/{id}/posts?page=1&perPage=20
POST   /api/mobile/groups/{id}/posts
PATCH  /api/mobile/groups/{id}/posts/{postId}
DELETE /api/mobile/groups/{id}/posts/{postId}
POST   /api/mobile/groups/{id}/posts/{postId}/pin
DELETE /api/mobile/groups/{id}/posts/{postId}/pin
POST   /api/mobile/groups/posts/{postId}/like
DELETE /api/mobile/groups/posts/{postId}/like
```

### Comments

```http
GET    /api/mobile/groups/posts/{postId}/comments?page=1&perPage=30
POST   /api/mobile/groups/posts/{postId}/comments
PATCH  /api/mobile/groups/comments/{commentId}
DELETE /api/mobile/groups/comments/{commentId}
POST   /api/mobile/groups/comments/{commentId}/like
DELETE /api/mobile/groups/comments/{commentId}/like
```

Create comment:

```json
{ "parentId": null, "body": "تعليق" }
```

Reply:

```json
{ "parentId": "root-comment-id", "body": "رد" }
```

### Recommendations

```http
GET /api/mobile/groups/{id}/recommendations
```

يمكن أن تبدأ التوصيات باستخدام `group.category + group.location` وتعيد حملات وفرصًا ومجموعات مشابهة. يفضل أن يعيد الباك إند `reason` جاهزًا حتى لا تكون قاعدة التوصية hard-coded في التطبيق.

## 5. Response contract المهم للفرونت إند
List item يجب أن يحتوي على الأقل على:

```text
id, name, description, category, location, visibility,
membersCount, postsThisWeek, isMember, imageUrl,
organizationName, isVerifiedOrganization, rules,
status, rejectionReason, myRole
```

Detail يضيف:

```text
coverImageUrl, createdAt, postsCount, owner, admins, membersPreview
```

يفضل أن يرسل API timestamp حقيقي، ويتولى الفرونت إند تنسيقه، بدل نص formatted جاهز.

## 6. الصلاحيات
- `owner`: تعديل المجموعة، إدارة الأدوار والأعضاء والطلبات والمحتوى.
- `admin`: إدارة الأعضاء والمحتوى حسب السياسة.
- `moderator`: الإشراف على المحتوى وطلبات الانضمام حسب السياسة.
- `member`: النشر والتعليق والإعجاب حسب إعدادات المجموعة.

كل Authorization يجب أن يكون Server-side، ولا يعتمد على الدور الذي يرسله الفرونت إند.

## 7. الخصوصية
- العامة: تفاصيل ومحتوى عام حسب سياسة المنتج.
- الخاصة: النبذة والقوانين مرئية، المنشورات والتوصيات للأعضاء فقط.
- `pending`: لا تظهر في discovery، ويستطيع المالك رؤيتها في `mine`.
- `rejected`: لا تظهر للعامة، ويستطيع المالك رؤية سبب الرفض.
- القراءة العامة لا تحتاج Login؛ Join/Post/Comment/Like/Create تحتاج Authentication.

## 8. الإشعارات
يفضل إطلاق Events مثل:

```text
group.creation_submitted
group.approved
group.rejected
group.join_request_created
group.join_request_approved
group.join_request_rejected
group.member_role_changed
group.member_removed
group.comment_replied
```

ويتم ربطها بنظام Notifications/FCM الموجود في JOD، وليس إنشاء قناة منفصلة.

## 9. البلاغات مستقبلًا

```http
POST /api/mobile/groups/{id}/reports
POST /api/mobile/groups/posts/{postId}/reports
POST /api/mobile/groups/comments/{commentId}/reports
```

ويجب أن تظهر البلاغات في Admin Dashboard مع حالة المراجعة والإجراء المتخذ.

## 10. Volunteer Teams — توسعة مستقبلية
عند دعم:

```text
kind = volunteer_team
```

يمكن إضافة حقول مثل:

```text
skills_required
capacity
minimum_age nullable
coverage_areas
join_mode: open|approval
team_status: recruiting|full|paused
```

### volunteer_team_tasks

```text
id
group_id
title
description
location
starts_at
ends_at
required_volunteers
status
created_by
```

### volunteer_task_assignments

```text
task_id
user_id
status: requested|accepted|declined|completed|cancelled
checked_in_at nullable
completed_at nullable
```

Endpoints مبدئية:

```http
GET  /api/mobile/groups/{id}/tasks
POST /api/mobile/groups/{id}/tasks
POST /api/mobile/groups/{id}/tasks/{taskId}/join
POST /api/mobile/groups/{id}/tasks/{taskId}/leave
PATCH /api/mobile/groups/{id}/tasks/{taskId}/assignments/{userId}
```

يمكن ربط المهمة لاحقًا بـ`campaign_id` أو `post_id` إذا كان الفريق ينفذ حملة أو طلب مساعدة موجودًا أصلًا في JOD.

## 11. Pagination والأداء
كل list endpoint يجب أن يستخدم envelope المشروع المعتاد `{ data, meta }`. الأولوية: discovery، mine/suggested، members، posts، comments، join requests. العدادات مثل `membersCount` و`commentsCount` و`likesCount` يفضل أن تأتي محسوبة من الباك إند.

## 12. خطة تنفيذ مقترحة
1. **Core Groups:** migrations/models، create request، admin approve/reject، discovery/mine/detail، membership، image upload.
2. **Community:** posts/comments/likes، members/roles، recommendations، notifications.
3. **Moderation:** reports، suspension/archive، audit log.
4. **Volunteer Teams:** kind، skills/capacity، tasks/shifts، assignments، campaign/post linking.

## 13. Definition of Done
يعتبر Core Groups جاهزًا عندما يمكن إزالة `mock-store.ts` من الموبايل دون إعادة تصميم الشاشات، مع تحقق: إنشاء `pending`، مراجعة Admin، إخفاء pending/rejected عن discovery، private join request حقيقي، Role checks Server-side، تفاصيل كاملة، pagination للمنشورات والتعليقات، one-level replies، والإشعارات الأساسية.
