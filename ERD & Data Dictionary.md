# **Rawabet - Project**

# **ERD & Data Dictionary**

**Document ID:** RAW-DATA-001  
**Related SRS:** RAW-SRS-001  
**Release:** 1.0  
**Database:** MySQL  
**Architecture:** Laravel Monolith

# **1\. Data Architecture Principles**

The database shall follow these principles:

-   No public property record stores seller contact information directly.
-   Seller information must be referenced through internal relations.
-   Published property data must use versioning.
-   User roles and permissions must remain independent.
-   Critical history must not be overwritten.
-   Soft deletion shall be used where appropriate.
-   Foreign key integrity shall be enforced.
-   Public IDs shall not expose sequential internal database assumptions where avoidable.
-   Every business entity shall contain timestamps.
-   Critical status transitions shall be auditable.

  
  
  
  
  
  
  
  

# **2\. Core ERD**

users

|

+-------------------------+

| |

v v

user\_profiles seller\_profiles

|

|

v

properties

|

v

property\_versions

|

+-------------+-------------+

| |

v v

property\_media property\_reviews

|

|

v

public property

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

customers/users

|

v

leads

|

+----+------+

| |

v v

lead\_notes lead\_activities

Configuration:

governorates

|

cities

|

areas

property\_types

transaction\_types

property\_features

Security:

users

|

roles

|

permissions

users

|

audit\_logs

  
  
  
  
  
  
  
  

# **3\. Table: users**

Purpose:

Stores all authenticated identities.

**Field**

**Type**

**Null**

**Rule**

id

BIGINT

No

PK

name

VARCHAR(100)

No

email

VARCHAR(190)

No

Unique

mobile

VARCHAR(20)

No

Indexed

email\_verified\_at

DATETIME

Yes

account\_status

ENUM

No

ACTIVE/SUSPENDED/DISABLED

avatar\_path

VARCHAR(255)

Yes

last\_login\_at

DATETIME

Yes

created\_at

TIMESTAMP

No

updated\_at

TIMESTAMP

No

deleted\_at

TIMESTAMP

Yes

Soft Delete

### **Indexes**

-   UNIQUE(email)
-   INDEX(mobile)
-   INDEX(account\_status)

  
  
  
  
  
  

# **4\. Table: user\_profiles**

**Field**

**Type**

id

BIGINT

user\_id

BIGINT FK

governorate\_id

BIGINT FK

city\_id

BIGINT FK nullable

area\_id

BIGINT FK nullable

preferred\_language

VARCHAR

created\_at

TIMESTAMP

updated\_at

TIMESTAMP

Release 1:

preferred\_language = ar

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **5\. Table: seller\_profiles**

Created when Customer activates Owner/Broker capability.

**Field**

**Type**

id

BIGINT

user\_id

BIGINT

seller\_type

ENUM

verification\_status

ENUM

verification\_requested\_at

DATETIME

verified\_at

DATETIME

verified\_by

BIGINT nullable

verification\_note

TEXT nullable

seller\_type:

OWNER

BROKER

verification\_status:

NOT\_REQUESTED

PENDING

VERIFIED

REJECTED

  
  
  
  
  
  
  
  

# **6\. Tables: roles / permissions**

Recommended:

Spatie Laravel Permission tables.

Additional Rawabet rule:

Role templates must not prevent custom permissions per employee.

# **7\. Table: governorates**

**Field**

**Type**

id

BIGINT

name\_ar

VARCHAR(100)

slug

VARCHAR(120)

is\_active

BOOLEAN

created\_by

BIGINT

created\_at

TIMESTAMP

updated\_at

TIMESTAMP

Initial record:

كفر الشيخ

ACTIVE

  
  
  
  
  

# **8\. Table: cities**

**Field**

**Type**

id

BIGINT

governorate\_id

BIGINT FK

name\_ar

VARCHAR

is\_active

BOOLEAN

# **9\. Table: areas**

**Field**

**Type**

id

BIGINT

city\_id

BIGINT FK

name\_ar

VARCHAR

is\_active

BOOLEAN

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **10\. Table: property\_types**

**Field**

**Type**

id

BIGINT

name\_ar

VARCHAR

slug

VARCHAR

min\_images

INT

max\_images

INT

is\_active

BOOLEAN

Initial:

-   شقة
-   فيلا
-   أرض
-   محل
-   مكتب

  

# **11\. Table: transaction\_types**

Initial:

-   بيع
-   إيجار

Fields:

id

name\_ar

slug

is\_active

# **12\. Table: properties**

This is the permanent identity of a property.

**Field**

**Type**

id

BIGINT

reference\_number

VARCHAR

seller\_id

BIGINT FK users

property\_type\_id

BIGINT

transaction\_type\_id

BIGINT

current\_status

ENUM

current\_published\_version\_id

BIGINT nullable

created\_at

TIMESTAMP

updated\_at

TIMESTAMP

deleted\_at

TIMESTAMP nullable

Reference:

RAW-KFS-000001

Statuses:

DRAFT

PENDING\_REVIEW

PUBLISHED

REJECTED

PENDING\_REVISION

ARCHIVED

SOLD

RENTED

  
  

# **13\. Table: property\_versions**

This table is mandatory.

Every significant submitted modification creates a version.

**Field**

**Type**

id

BIGINT

property\_id

BIGINT

version\_number

INT

title

VARCHAR(150)

description

TEXT

governorate\_id

BIGINT

city\_id

BIGINT

area\_id

BIGINT

public\_location\_text

VARCHAR

private\_address

VARCHAR

price

DECIMAL

area\_sqm

DECIMAL

bedrooms

SMALLINT nullable

bathrooms

SMALLINT nullable

floor

VARCHAR nullable

finishing

VARCHAR nullable

version\_status

ENUM

submitted\_by

BIGINT

submitted\_at

DATETIME nullable

reviewed\_by

BIGINT nullable

reviewed\_at

DATETIME nullable

review\_decision

ENUM nullable

rejection\_reason

TEXT nullable

Version status:

DRAFT

PENDING

APPROVED

REJECTED

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **14\. Why Versioning Is Mandatory**

Example:

Published:

Property RAW-KFS-123

Version 1

Price = 1,000,000

Seller changes price:

Version 2

Price = 900,000

Pending Review

Public remains:

Version 1

1,000,000

After approval:

Current Published Version = 2

This prevents unapproved changes appearing publicly.

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **15\. Table: property\_media**

**Field**

**Type**

id

BIGINT

property\_version\_id

BIGINT

media\_type

ENUM

path

VARCHAR

mime\_type

VARCHAR

file\_size

BIGINT

sort\_order

INT

is\_cover

BOOLEAN

created\_at

TIMESTAMP

Release 1:

media\_type = IMAGE

Release 2:

VIDEO

  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **16\. Table: property\_reviews**

**Field**

**Type**

id

BIGINT

property\_id

BIGINT

property\_version\_id

BIGINT

reviewer\_id

BIGINT

decision

ENUM

reason

TEXT nullable

internal\_note

TEXT nullable

created\_at

TIMESTAMP

decision:

APPROVED

REJECTED

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **17\. Table: leads**

**Field**

**Type**

id

BIGINT

reference\_number

VARCHAR

customer\_id

BIGINT

property\_id

BIGINT

status

ENUM

source

VARCHAR

contact\_channel

ENUM

assigned\_to

BIGINT nullable

last\_activity\_at

DATETIME

closed\_at

DATETIME nullable

created\_at

TIMESTAMP

Statuses:

NEW

WHATSAPP\_CONTACT\_INITIATED

CALL\_CONTACT\_INITIATED

CONTACTED

FOLLOW\_UP

VIEWING

WON

LOST

  
  
  
  

# **18\. Lead uniqueness**

Do not create endless duplicate Leads.

Logical rule:

customer\_id

+

property\_id

+

open lead status

If open Lead exists:

create activity instead.

# **19\. Table: lead\_activities**

**Field**

**Type**

id

BIGINT

lead\_id

BIGINT

activity\_type

ENUM

channel

ENUM nullable

description

TEXT nullable

created\_by

BIGINT nullable

created\_at

TIMESTAMP

  
  
  
  
  

# **20\. Table: lead\_notes**

**Field**

**Type**

id

BIGINT

lead\_id

BIGINT

user\_id

BIGINT

body

TEXT

created\_at

TIMESTAMP

Internal only.

# **21\. Table: notifications**

**Field**

**Type**

id

BIGINT

user\_id

BIGINT

type

VARCHAR

title

VARCHAR

body

TEXT

related\_type

VARCHAR nullable

related\_id

BIGINT nullable

read\_at

DATETIME nullable

created\_at

TIMESTAMP

# **22\. Table: audit\_logs**

**Field**

**Type**

id

BIGINT

actor\_id

BIGINT

action

VARCHAR

entity\_type

VARCHAR

entity\_id

BIGINT

field\_name

VARCHAR nullable

old\_value

LONGTEXT nullable

new\_value

LONGTEXT nullable

metadata

JSON nullable

ip\_address

VARCHAR nullable

created\_at

TIMESTAMP

No normal delete/update.

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **23\. Table: system\_settings**

Recommended:

key

value

type

updated\_by

updated\_at

Examples:

site\_name

primary\_color

secondary\_color

primary\_phone

primary\_whatsapp

secondary\_whatsapp

support\_email

privacy\_policy\_ar

terms\_ar

about\_ar

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  

# **24\. Table: help\_resources**

**Field**

**Type**

id

BIGINT

title

VARCHAR

resource\_type

ENUM

path

VARCHAR nullable

url

VARCHAR nullable

is\_active

BOOLEAN

sort\_order

INT

Release 1:

PDF.

Later:

YOUTUBE.

# **25\. Release 1.1 Table: favorites**

id

user\_id

property\_id

expires\_at

created\_at

Unique:

user\_id + property\_id

  

# **DOCUMENT 2**

# **Screen & UI Specification**

**Document ID:** RAW-UI-001

ده من أهم المستندات اللي تعرضها على العميل.

العميل لازم يعتمد:

-   Screens.
-   Flow.
-   Text.
-   Main Buttons.
-   Data visible/hidden.

مش لازم يشوف Database.

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **A. PUBLIC SCREENS**

## **P-01 Home**

### **Purpose**

Allow customer to start search quickly.

### **Components**

Header:

-   Logo.
-   Search access.
-   Login/Profile.
-   Contact.

Hero:

Arabic headline.

Search:

-   المحافظة.
-   المدينة.
-   المنطقة.
-   نوع العقار.
-   بيع/إيجار.
-   السعر.

Sections:

-   أحدث العقارات.
-   لماذا روابط؟
-   CTA.

### **Mobile**

Search must remain easy to use.

# **P-02 Property Listing**

### **Card**

Shows:

-   Cover.
-   Price.
-   Type.
-   Area.
-   Size.
-   Bedrooms.
-   Transaction.
-   Reviewed badge.
-   View More.

Must never show:

-   seller.
-   broker.
-   phone.

# **P-03 Property Details**

Before authentication:

show preview.

CTA:

**رؤية المزيد**

If Guest:

registration modal.

After login:

show full approved public information.

Contact:**كلّمنا على واتساب, اتصل بينا**

# **P-04 Registration Modal**

Fields:

-   الاسم.
-   رقم واتساب.
-   البريد الإلكتروني.
-   المحافظة.
-   المنطقة.
-   موافقة على الشروط.

CTA:

**كمّل**

# **P-05 Email OTP Modal**

6 boxes or single numeric input.

Buttons:

**تأكيد**

**إرسال الكود تاني**

Countdown.

  
  
  
  
  
  
  
  
  
  
  

# **P-06 Profile**

Shows:

-   Name.
-   Mobile.
-   Email.
-   Location.
-   Account capabilities.

Button:

**أنا مالك عقار**

**أنا وسيط عقاري**

# **SELLER SCREENS**

# **S-01 Seller Dashboard**

Widgets:

-   عقاراتي.
-   تحت المراجعة.
-   منشورة.
-   محتاجة تعديل.

Primary CTA:

**أضف عقار جديد**

  
  
  
  
  

# **S-02 My Properties**

Columns/cards:

-   Reference.
-   Cover.
-   Location.
-   Price.
-   Status.
-   Last Update.

# **S-03 Property Form**

Use steps to improve UX:

### **Step 1**

نوع العقار والمعاملة.

### **Step 2**

الموقع.

### **Step 3**

المواصفات.

### **Step 4**

الوصف والمميزات.

### **Step 5**

الصور.

### **Step 6**

Review & Submit.

Buttons:**حفظ كمسودة, إرسال للمراجعة**

# **S-04 Property Status**

Show timeline:

تم إنشاء العقار

↓

تم الإرسال

↓

قيد المراجعة

↓

تمت الموافقة

or rejection.

# **S-05 Rejected Property**

Display prominent message:

**العقار محتاج شوية تعديلات**

Reason.

CTA:

**تعديل وإعادة الإرسال**

# **S-06 Verification**

Unverified:

**وثّق حسابك مع روابط**

Buttons:

**طلب التوثيق**

**مش دلوقتي**

# **INTERNAL SCREENS**

# **A-01 Internal Login**

Email.

Password.

No public registration.

# **A-02 Dashboard**

Cards:

-   Pending Properties.
-   Published.
-   Rejected.
-   New Leads.
-   Follow Ups.
-   Sellers.

# **A-03 Review Queue**

Filters:

-   Date.
-   Type.
-   Seller.
-   Verification.
-   Location.

  

# **A-04 Property Review**

Left/center:

Property content.

Right sidebar:

Seller private information.

Actions:

**اتصال**

**واتساب**

**تعديل**

**موافقة**

**رفض**

Reject opens required modal.

# **A-05 Property Revision Compare**

Example:

**Field**

**Published**

**Proposed**

Price

1M

900K

Description

Old

New

Changed fields highlighted.

  

# **A-06 Leads**

Filters:

-   Status.
-   Date.
-   Property.
-   Assigned Agent.

# **A-07 Lead Detail**

Shows:

Customer.

Property.

Status.

Timeline.

Notes.

Call.

WhatsApp.

# **A-08 Users**

Columns:

-   User.
-   Account Type.
-   Verification.
-   Status.
-   Created.

# **A-09 Internal User Form**

-   Name.
-   Email.
-   Phone.
-   Role template.
-   Permission checkboxes.

# **A-10 Permissions**

Groups:

Users.

Properties.

Leads.

Content.

Settings.

Audit.

# **A-11 Verification Requests**

Shows:

Seller.

Phone.

Email.

Type.

Request date.

Actions: Approve, Reject

# **A-12 Locations**

Hierarchical administration:

Governorates → Cities → Areas.

# **A-13 Property Types**

Configure:

Name.

Active.

Min Images.

Max Images.

# **A-14 Settings**

Tabs:

### **Brand**

Logo/colors.

### **Contact**

Phone/WhatsApp/email.

### **Legal**

Privacy/Terms/About.

### **General**

Site text.

# **A-15 Help Resources**

Upload PDF.

Release 1.1:

YouTube.

# **A-16 Audit Log**

Filters:

-   User.
-   Action.
-   Entity.
-   Date.

Read only.

# **DOCUMENT 3**

# **QA Test Cases & UAT**

**Document ID:** RAW-QA-001

دي النسخة اللي الـDeveloper/QA ياخدها.

العميل تعرض عليه فقط UAT Business Scenarios.

  
  
  

# **Test Case Format**

Every Test Case must have:

Test ID

Requirement ID

Module

Precondition

Steps

Expected Result

Actual Result

Status

Severity

Evidence

Tester

Date

# **QA-AUTH-001**

**Scenario:** Guest browsing.

Precondition:

No login.

Steps:

1.  Open site.
2.  Search properties.

Expected:

Only published properties displayed.

  
  
  
  

# **QA-AUTH-002**

Registration validation.

Steps:

1.  Click View More.
2.  Leave name empty.
3.  Submit.

Expected:

Arabic field validation.

# **QA-AUTH-003**

Duplicate email.

Expected:

Existing account message.

# **QA-AUTH-004**

Invalid OTP.

Expected:

Login rejected.

Attempt count incremented.

  
  
  

# **QA-AUTH-005**

Expired OTP.

Expected:

Rejected.

# **QA-SEC-001**

Broker A opens Broker B edit URL.

Expected:

403/404.

Severity if fails:

**Critical**

# **QA-SEC-002**

Public property page source inspection.

Search for seller:

-   Phone.
-   Email.
-   ID.

Expected:

Not present.

Severity:

Critical.

# **QA-SEC-003**

Reviewer without approve permission sends manual approve POST request.

Expected:

# **QA-SEC-004**

Upload PHP renamed JPG.

Expected:

Rejected.

# **QA-PROP-001**

Save incomplete draft.

Expected:

Successful.

# **QA-PROP-002**

Submit incomplete property.

Expected:

Blocked.

# **QA-PROP-003**

Insufficient images.

Expected:

Blocked.

# **QA-PROP-004**

Too many images.

Expected:

Blocked.

# **QA-PROP-005**

Phone in description.

Expected:

Blocked/flagged based on implemented protection.

# **QA-REV-001**

Reviewer approves pending property.

Expected:

Published.

# **QA-REV-002**

Reviewer rejects without reason.

Expected:

Cannot proceed.

# **QA-REV-003**

Reviewer rejects with reason.

Expected:

Seller receives reason.

# **QA-VERS-001**

Seller edits Published price.

Expected:

Old price stays public.

# **QA-VERS-002**

New revision approval.

Expected:

New price becomes public.

# **QA-VERS-003**

Revision rejection.

Expected:

Old published version remains public.

# **QA-LEAD-001**

Customer clicks WhatsApp.

Expected:

Lead created.

WhatsApp opens.

# **QA-LEAD-002**

Same customer clicks again.

Expected:

Activity added, duplicate open Lead not created.

# **QA-LEAD-003**

Customer contacts different property.

Expected:

New Lead.

# **QA-LOC-001**

Inactive governorate.

Expected:

Not visible.

# **QA-LOC-002**

Activate governorate.

Expected:

Appears in forms and filters.

# **QA-AUDIT-001**

Admin changes published price.

Expected:

Old + new value recorded.

# **QA-AUDIT-002**

Super Admin removes permission.

Expected:

Audit record.

# **QA-ERR-001**

Force server exception.

Expected:

No stack trace.

# **QA-MOB-001**

360px mobile.

Expected:

No horizontal overflow.

Primary journey usable.

# **UAT — WHAT YOU SHOW TO CLIENT**

خلي العميل يوافق على حوالي 12–15 سيناريو فقط.

## **UAT-01**

مالك يسجل ويدخل.

## **UAT-02**

المالك يرفع عقار.

## **UAT-03**

العقار يدخل Pending.

## **UAT-04**

الفريق يراجعه.

## **UAT-05**

رفض بدون سبب ممنوع.

## **UAT-06**

سبب الرفض يصل للمالك.

## **UAT-07**

المالك يعدل ويرسل مجددًا.

## **UAT-08**

الفريق يوافق.

## **UAT-09**

العقار يظهر للعميل.

## **UAT-10**

العميل لا يرى بيانات المالك.

## **UAT-11**

العميل يسجل من Popup.

## **UAT-12**

يضغط WhatsApp وينشأ Lead.

## **UAT-13**

Sales يتابع Lead.

## **UAT-14**

المالك يغير عقار منشور ولا يتغير Public قبل الموافقة.

## **UAT-15**

Super Admin يضيف محافظة جديدة.

لو العميل وافق على الـ15 دول، يبقى Core Business Model متحقق.

# **DOCUMENT 4**

# **Scope of Work / Developer Delivery Agreement**

**Document ID:** RAW-SOW-001

ده أهم مستند في التعامل مع الـFreelancer.

# **1\. Project**

Rawabet Real Estate Brokerage Platform.

# **2\. Developer Responsibility**

Developer responsible for:

-   Database.
-   Backend.
-   Frontend.
-   Admin.
-   Responsive implementation.
-   Integration.
-   Deployment.
-   Testing.
-   Bug fixing.
-   Source handover.

# **3\. Release 1 Deadline**

Target:

**5–8 working days**

starting after:

-   BRD approval.
-   SRS approval.
-   UI screens approved.
-   Hosting access available.

# **4\. Exact Release 1 Scope**

Include:

-   Authentication.
-   Customer accounts.
-   Owner/Broker capabilities.
-   Email OTP.
-   Seller verification.
-   Roles.
-   Permissions.
-   Property submission.
-   Images.
-   Review.
-   Approval.
-   Rejection.
-   Revision versioning.
-   Public website.
-   Search.
-   Filters.
-   Details.
-   Leads.
-   WhatsApp contact.
-   Phone contact.
-   Dashboard.
-   Notifications.
-   Email.
-   Locations.
-   Settings.
-   Audit.
-   Deployment.

Anything not included:

Change Request.

# **5\. Explicit Exclusions**

-   WhatsApp API.
-   Video processing.
-   English.
-   Mobile application.
-   Advanced CRM.
-   AI.
-   SEO project.
-   Payment.
-   Commissions.
-   Maps.
-   Chat.
-   Advanced analytics.

  
  
  
  
  

# **6\. Payment Milestones**

بناءً على الاتفاق اللي قلته:

## **Milestone 1 — 25%**

At project start.

Conditions:

-   Developer agreement signed.
-   Repo created under your ownership.
-   Work started.

# **Milestone 2 — 25%**

After complete Release Candidate is delivered to Staging.

Not simply "developer says finished."

Conditions:

-   All MVP modules available.
-   Core UAT can be executed.
-   No unfinished placeholder screen.
-   Source code committed.
-   Staging deployed.

  
  
  
  
  
  
  
  
  

# **Milestone 3 — 50%**

After:

**14-day post-production stabilization period.**

Conditions:

-   Production deployed.
-   No Critical defects.
-   No High defects.
-   BRD/SRS scope delivered.
-   Full source delivered.
-   Handover completed.
-   Documentation delivered.

أنا هنا فاهم ليه أنت عايز تمسك 50%؛ ده يحميك جدًا. لكن لازم المطور يوافق عليه كتابيًا من البداية.

# **7\. Bug Warranty**

14 days.

Bug means:

Existing approved requirement does not behave according to BRD/SRS.

Bug does not mean:

Client wants additional behavior.

  
  
  
  
  
  
  
  

# **8\. Source Code Ownership**

Mandatory:

Developer must not:

-   Obfuscate code.
-   Lock code.
-   Add license lock.
-   Keep repo only on personal GitHub.
-   Use pirated packages.
-   Use nulled plugins.
-   Use developer-controlled SaaS.

# **9\. Git Requirements**

Repository belongs to you/company.

Developer receives collaborator access.

Mandatory:

-   Meaningful commits.
-   Main branch protected as practical.
-   Source pushed daily.

لا تنتظر آخر يوم عشان تاخد الكود.

  
  
  
  
  
  
  
  
  

# **10\. Deployment Ownership**

Everything must be under accounts controlled by you/client:

-   Hostinger.
-   Domain.
-   SMTP.
-   Git.
-   Future WhatsApp API.

Never developer personal accounts.

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **11\. Required Deliverables**

Before final payment:

### **Code**

-   Full source.

### **Database**

-   Migrations.
-   Seeders.

### **Environment**

-   .env.example.

### **Documentation**

-   README.
-   Installation.
-   Deployment.
-   Cron.
-   Email.
-   Storage.
-   Backup.

### **Accounts**

-   Super Admin.
-   Credentials handed over securely.

### **Test**

-   QA results.
-   UAT result.

  
  
  

# **12\. Freelancer Security Clause**

Developer shall not:

-   Create hidden admin account.
-   Create backdoor.
-   Upload web shell.
-   Retain unauthorized access.
-   Send project data to external services.
-   Copy production DB.
-   install unauthorized tracking.
-   add external scripts without approval.

# **13\. Third Party Code**

Developer provides list:

**Package**

**Version**

**License**

**Purpose**

No paid package without approval.

No GPL/commercial license issue should be hidden.

  
  
  
  
  
  
  
  
  
  
  
  

# **14\. Acceptance Criteria for Final Payment**

Final payment released only when:

-   Production is working.
-   Source code available.
-   Core UAT passes.
-   No Critical defects.
-   No High defects.
-   Private seller data protected.
-   Permissions verified.
-   Revision workflow verified.
-   Leads work.
-   Mobile works.
-   Backup procedure delivered.
-   14-day warranty completed.

# **15\. Change Requests**

Anything new goes through:

Request

↓

BA Review

↓

Impact

↓

Cost

↓

Timeline

↓

Approval

↓

Implementation

No verbal scope change.