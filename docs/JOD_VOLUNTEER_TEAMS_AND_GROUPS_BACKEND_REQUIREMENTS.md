# JOD — متطلبات الباك إند لميزة الفرق التطوعية

> مصدر الحقيقة للمنتج: يوجد نوع واحد فقط وهو **الفريق التطوعي العام**. اسم الكيان التقني يمكن أن يبقى `groups`.

## 1. مبادئ العقد النهائي

لا يجب أن يحتوي عقد الفريق على:

- `type` أو `kind` لاختيار `group | volunteer_team`.
- `visibility`.
- `private`.
- `joinPolicy`.
- `invite_only`.
- `group_join_requests`.

كل فريق يتم اعتماده من إدارة JOD يصبح عامًا وقابلًا للاكتشاف.

## 2. الكيانات الأساسية

### groups

الحقول الأساسية:

```text
id
owner_id
organization_id nullable
name
description
category
location
status: pending|active|rejected|suspended|archived
purpose nullable
rules json nullable
proposed_admin_ids json nullable
rejection_reason nullable
suspension_reason nullable
submitted_at nullable
reviewed_at nullable
reviewed_by nullable
created_at
updated_at
deleted_at nullable
```

ملاحظات:

- لا يوجد `kind`.
- لا يوجد `visibility`.
- `category` حاليًا يمكن أن تكون قيمة نصية وفق البنية الحالية؛ إذا تم توحيدها لاحقًا مع lookup IDs يجب تحديث العقد على الطرفين معًا.
- يمكن إعادة استخدام Media system للـavatar والـcover.

### group_members

```text
id
group_id
user_id
role: owner|admin|moderator|member
status: active|left|removed
joined_at
left_at nullable
created_at
updated_at
```

يجب وجود Unique Constraint على `(group_id, user_id)`.

### group_posts

```text
id
group_id
author_id
body
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
created_at
updated_at
```

الردود مستوى واحد فقط؛ إذا تم الرد على Reply، يربط الباك إند الرد بالـroot comment.

### group_post_likes / group_comment_likes

Unique Constraint على المستخدم والمورد لمنع الإعجاب المكرر.

## 3. إنشاء الفريق ومراجعة الإدارة

### إنشاء الطلب

```http
POST /api/mobile/groups
```

Body:

```json
{
  "name": "فريق جود التطوعي",
  "description": "...",
  "category": "تعليم",
  "location": "دمشق",
  "rules": ["احترام الأعضاء"],
  "purpose": "تنظيم مبادرات تعليمية",
  "proposedAdminIds": ["user-1"]
}
```

السلوك:

1. Authentication إلزامي.
2. إنشاء `groups` بحالة `pending`.
3. إضافة المنشئ كـ`owner` فعال.
4. حفظ المشرفين المقترحين مؤقتًا.
5. الفريق لا يظهر في Public Discovery قبل الموافقة.
6. إرسال إشعار للمنشئ بأن الطلب قيد المراجعة.
7. إرسال إشعار للإدارة بوجود طلب جديد.

### البحث عن مشرفين مقترحين

```http
GET /api/mobile/groups/admin-candidates?search=
```

يعيد مستخدمين فعالين يمكن اختيارهم عند الإنشاء، مع استبعاد المستخدم الحالي.

### مراجعة Admin Dashboard

تحت `/api/v1/admin`:

```http
GET    /groups?status=pending
GET    /groups/{group}
POST   /groups/{group}/approve
POST   /groups/{group}/reject
DELETE /groups/{group}
```

Approve:

- مسموح للحالات القابلة للمراجعة فقط.
- يغير الحالة إلى `active`.
- يحفظ `reviewed_at` و`reviewed_by`.
- يفعّل المشرفين المقترحين حسب السياسة.
- يرسل إشعارًا للمالك.

Reject:

```json
{ "rejectionReason": "..." }
```

- يغير الحالة إلى `rejected`.
- يحفظ السبب والمراجع والتاريخ.
- يرسل إشعارًا للمالك.

## 4. القراءة العامة والاكتشاف

Public endpoints:

```http
GET /api/mobile/groups
GET /api/mobile/groups/suggested
GET /api/mobile/groups/{group}
GET /api/mobile/groups/{group}/members
GET /api/mobile/groups/{group}/posts
GET /api/mobile/groups/{group}/recommendations
GET /api/mobile/groups/posts/{post}/comments
```

قائمة الفرق العامة تعرض `active` فقط.

الفلاتر الأساسية:

```text
search
category
location
page
perPage
```

لا يوجد فلتر `kind` أو `visibility`.

## 5. فرقي

Authentication:

```http
GET /api/mobile/me/groups
```

يجب أن يعيد:

- الفرق التي يملكها المستخدم.
- الفرق التي هو عضو فعال فيها.
- فريق المالك حتى لو كان `pending` أو `rejected`.

## 6. الانضمام والمغادرة

```http
POST   /api/mobile/groups/{group}/join
DELETE /api/mobile/groups/{group}/join
```

القواعد:

- الانضمام يحتاج Authentication.
- لا يسمح بالانضمام إلا لفريق `active`.
- الانضمام مباشر، ولا ينشئ Join Request.
- الضغط المتكرر لا يجب أن ينشئ عضوية مكررة.
- المالك عضو فعال تلقائيًا.
- لا يسمح للمالك بمغادرة فريقه عبر Leave العادي.

## 7. الأعضاء والأدوار

الأدوار:

```text
owner | admin | moderator | member
```

قراءة الأعضاء:

```http
GET /api/mobile/groups/{group}/members
```

إدارة الأعضاء والأدوار يمكن إضافتها/إكمالها ضمن المرحلة التالية:

```http
PATCH  /api/mobile/groups/{group}/members/{userId}/role
DELETE /api/mobile/groups/{group}/members/{userId}
```

قواعد مهمة:

- لا يمكن إزالة الـOwner قبل نقل الملكية أو تنفيذ سياسة بديلة واضحة.
- لا يمكن إعطاء صلاحيات أعلى من صلاحية المنفذ إذا كانت السياسة تمنع ذلك.
- كل التحقق Server-side.

## 8. منشورات الفريق

### القراءة

```http
GET /api/mobile/groups/{group}/posts
```

متاحة للعامة عندما يكون الفريق `active`.

### الإنشاء

```http
POST /api/mobile/groups/{group}/posts
```

يتطلب:

- Authentication.
- عضوية فعالة.
- فريق `active`.

### إعجاب المنشور

```http
POST   /api/mobile/groups/posts/{post}/like
DELETE /api/mobile/groups/posts/{post}/like
```

يجب أن يكون Idempotent قدر الإمكان وأن يعيد حالة الإعجاب والعداد النهائي.

## 9. التعليقات

```http
GET    /api/mobile/groups/posts/{post}/comments
POST   /api/mobile/groups/posts/{post}/comments
POST   /api/mobile/groups/comments/{comment}/like
DELETE /api/mobile/groups/comments/{comment}/like
```

إنشاء تعليق:

```json
{ "parentId": null, "body": "تعليق" }
```

Reply:

```json
{ "parentId": "root-comment-id", "body": "رد" }
```

القراءة عامة لفريق `active`، بينما الإنشاء والإعجاب يحتاجان Authentication + Membership.

## 10. التوصيات

```http
GET /api/mobile/groups/{group}/recommendations
```

يمكن استخدام:

- `group.category`.
- `group.location`.

لإعادة حملات أو فرص أو فرق مشابهة. إذا تمت مقارنة الحملات بالتصنيف، يجب استخدام علاقة Category الفعلية وعدم افتراض وجود عمود نصي غير موجود.

## 11. Response contract للموبايل

### List item

```text
id
name
description
category
location
membersCount
postsThisWeek
postsCount
isMember
myRole
imageUrl
coverImageUrl
organizationName
isVerifiedOrganization
rules
status
rejectionReason
createdAt
createdAtLabel
```

### Detail يضيف

```text
owner
admins
membersPreview
purpose
```

لا يعاد `kind` أو `visibility`.

## 12. Authentication / Authorization

الضيف يستطيع:

- اكتشاف الفرق `active`.
- فتح التفاصيل.
- مشاهدة الأعضاء والمنشورات والتعليقات والتوصيات العامة.

Authentication مطلوب لـ:

- إنشاء فريق.
- عرض `me/groups`.
- الانضمام والمغادرة.
- إنشاء منشور.
- تعليق أو إعجاب.
- إدارة الأعضاء والأدوار.

لا يعتمد الباك إند على إخفاء الأزرار في الفرونت.

## 13. الإشعارات

الأحداث الأساسية:

```text
group.submitted
group.approved
group.rejected
group.member_role_changed
group.member_removed
```

عند الإنشاء:

- Notify Admins: طلب فريق جديد.
- Notify Creator: الطلب قيد المراجعة.

وعند approve/reject يصل قرار الإدارة لصاحب الفريق.

## 14. Media

استخدام Media infrastructure الحالية في JOD.

مطلوب:

- avatar/image.
- cover.
- لاحقًا media لمنشورات الفريق عند الحاجة.

## 15. الحماية من الحالات المتعارضة

معالجة:

- مستخدم يحاول Join وهو عضو أصلًا.
- عضو يحاول Leave مرتين.
- Owner يحاول Leave.
- Join لفريق `pending/rejected/suspended/archived`.
- إنشاء Post لفريق غير `active`.
- تفاعل مستخدم غير عضو مع Post/Comment.
- Approve مكرر على فريق `active`.
- Reject على حالة غير قابلة للرفض.
- الوصول العام إلى `pending/rejected` من مستخدم ليس المالك.

## 16. Pagination والأداء

Pagination مطلوبة في:

- Discovery.
- Mine/Suggested.
- Members.
- Posts.
- Comments.

العدادات مثل `membersCount`, `postsCount`, `likesCount`, `commentsCount` تأتي من الباك إند ولا يعاد حسابها في الواجهة.

## 17. Admin Dashboard

لوحة الإدارة تدعم:

- Pending review.
- Active teams.
- Rejected teams.
- البحث والتصفية بالتصنيف والحالة.
- فتح التفاصيل.
- Approve.
- Reject مع reason.
- Delete/soft delete حسب السياسة.

لا يوجد فلتر Privacy أو Type.

## 18. المهام التطوعية — مرحلة لاحقة

المهام تضاف فوق نفس `groups` ولا تستخدم `kind=volunteer_team`.

### volunteer_tasks

```text
id
group_id
created_by
title
description
location
starts_at
ends_at
required_volunteers
capacity nullable
status: open|full|completed|cancelled
campaign_id nullable
post_id nullable
created_at
updated_at
```

### volunteer_task_assignments

```text
task_id
user_id
status: requested|accepted|declined|completed|cancelled
checked_in_at nullable
completed_at nullable
```

يمكن لاحقًا إضافة `skills_required` أو جداول مهارات منفصلة.

## 19. ترتيب التنفيذ المعتمد

### المرحلة الأساسية

1. `groups` + memberships.
2. طلب إنشاء `pending`.
3. Admin approve/reject.
4. Discovery / Suggested / Mine / Detail.
5. Direct Join / Leave.
6. Members read.
7. Notifications.
8. Media.

### الطبقة الاجتماعية

1. Group posts.
2. Comments + one-level replies.
3. Post likes.
4. Comment likes.
5. Recommendations.

### الإدارة المتقدمة

1. Member role management.
2. Remove member.
3. Edit team profile/media.
4. Reports / suspension / audit.

### التشغيل التطوعي

1. Tasks.
2. Shifts/assignments.
3. Capacity/skills.
4. Campaign/post linking.

> مصطلحات Core/Social/Operations هي طبقات تنفيذ فقط، وليست أنواعًا مختلفة من الفرق.