Below is a complete SRS baseline tied to the approved BRD. I am resolving the remaining implementation ambiguities so that a developer cannot “interpret” them differently.

# **Rawabet Real Estate Brokerage Platform**

## **Software Requirements Specification (SRS)**

**Document ID:** RAW-SRS-001  
**Version:** 1.0  
**Related BRD:** RAW-BRD-001 v1.0  
**Product UI Language – Release 1:** Arabic (RTL)  
**Document Language:** English  
**Initial Market:** Kafr El Sheikh, Egypt  
**Target Hosting:** Hostinger Premium Shared Hosting  
**Target MVP:** Production-ready Release 1.0 within 5–8 working days  
**Application Type:** Responsive Web Application  
**Primary Architecture:** Laravel Monolith  
**Status:** Development Baseline

# **1\. Purpose**

This Software Requirements Specification converts the approved Rawabet Business Requirements into explicit implementation requirements.

The document defines:

-   Technical architecture.
-   Application modules.
-   Actors and authorization.
-   Functional behavior.
-   System workflows.
-   Database requirements.
-   Validation.
-   Security.
-   Audit.
-   Notifications.
-   Error handling.
-   UI behavior.
-   Backend behavior.
-   Routes/endpoints.
-   State transitions.
-   Release scope.
-   Deployment.
-   Testing.
-   Acceptance requirements.

The developer shall not replace any defined behavior with assumptions.

If implementation conflicts with this SRS, this SRS takes priority unless a written Change Request has been approved.

# **2\. System Definition**

Rawabet is a controlled real-estate brokerage application.

It is not an open classified marketplace.

The fundamental system flow is:

**Owner/Broker → Property Submission → Rawabet Review → Publication → Customer Interest → Rawabet Lead → Offline Brokerage**

All financial transactions, negotiation and brokerage settlement happen outside the platform.

# **3\. Release 1 Architecture**

## **3.1 Architecture Style**

Release 1 shall use a modular Laravel monolith.

Browser

|

v

Laravel Application

|

+-- Public Website

+-- Authentication

+-- Seller Portal

+-- Admin / Operations

+-- Lead CRM

+-- Notifications

+-- Configuration

|

v

MySQL Database

|

v

Local Hosted Media Storage

This architecture is explicitly selected because:

-   Shared hosting is the deployment target.
-   Budget is limited.
-   Release 1 must ship quickly.
-   The application does not currently require microservices.
-   There is no requirement for real-time sockets.
-   There is no need for a dedicated Node.js runtime.

# **4\. Approved Technology Stack**

**Layer**

**Technology**

Backend

Laravel

Programming Language

PHP

Public UI

Blade

Dynamic UI

Livewire

Lightweight JS

Alpine.js

Admin

Filament where appropriate

CSS

Tailwind CSS

Database

MySQL

Authentication

Laravel Session Authentication

Authorization

Laravel Policies/Gates + permission package

Permissions

Spatie Laravel Permission or equivalent approved OSS

Email

SMTP

Media Storage

Server filesystem

Cron

Hostinger Cron Jobs

Source Control

Git

Production Hosting

Hostinger Premium

HTTPS

Required

No paid infrastructure service is required for Release 1.

# **5\. Explicitly Prohibited Release 1 Dependencies**

The implementation must not require:

-   Next.js.
-   Node.js production server.
-   Redis.
-   Elasticsearch.
-   Meilisearch.
-   Firebase Authentication.
-   Auth0.
-   Supabase.
-   AWS.
-   Paid image-processing API.
-   Paid CRM.
-   WhatsApp Business API.
-   WebSockets.
-   Kubernetes.
-   External proprietary backend.

Any proposed addition requires written approval.

# **6\. User Types**

The application shall support the following actors.

**Code**

**Actor**

GST

Guest

CUS

Customer

OWN

Property Owner

BRK

Broker

REV

Property Reviewer

SAL

Sales User

OPS

Operations Manager

CNT

Content Manager

SAD

Super Admin

Owner and Broker are capabilities added to a normal registered account.

A person may therefore be:

**Customer + Owner**

or:

**Customer + Broker**

They do not need separate accounts.

# **7\. Authentication Decision — Release 1**

To remove ambiguity, Release 1 shall use:

## **External Users**

**Email OTP/passwordless authentication.**

The phone/WhatsApp number remains the primary business contact.

### **Registration**

Customer provides:

-   Name.
-   Mobile/WhatsApp number.
-   Email.
-   Governorate.
-   Area.
-   Privacy consent.

The system sends a 6-digit OTP to email.

After successful OTP:

-   Account is created/activated.
-   User is logged in automatically.
-   Current property journey continues.

### **Later Login**

User enters email.

System sends email OTP.

User enters OTP.

User is authenticated.

### **Why**

This avoids:

-   Password creation friction.
-   Forgotten-password workflow.
-   Unverified phone authentication.
-   WhatsApp API dependency.

WhatsApp OTP replaces or supplements this flow in Release 2.

# **8\. Internal Authentication**

Internal Rawabet employees shall use:

-   Email.
-   Password.

Internal users must not use the public passwordless customer flow.

Passwords shall be:

-   Hashed.
-   Never stored in plain text.
-   Never included in logs.

Super Admin creates internal users.

# **9\. OTP Technical Rules**

Email OTP shall:

-   Consist of 6 digits.
-   Expire after 10 minutes.
-   Be single-use.
-   Be hashed in storage.
-   Allow maximum 5 failed attempts.
-   Have 60-second resend cooldown.
-   Have a maximum configurable resend threshold.

After successful verification:

-   OTP becomes unusable.
-   Verification timestamp is stored.

# **10\. Registration Modal**

Unauthenticated visitor remains free to browse property cards and search.

An account shall be required when the visitor invokes the protected detailed-property journey such as:

**"رؤية المزيد"**

The registration interface must appear in a modal.

It shall not remove the user from the property context.

After verification:

1.  Modal closes.
2.  User becomes authenticated.
3.  Profile indicator updates.
4.  Intended property detail becomes available.

# **11\. Account State Machine**

Each account shall have separate state dimensions.

## **11.1 Account State**

ACTIVE

SUSPENDED

DISABLED

## **11.2 Email Verification State**

UNVERIFIED

VERIFIED

## **11.3 Seller Platform Verification**

NOT\_REQUESTED

PENDING

VERIFIED

REJECTED

These values must be stored separately.

# **12\. Seller Activation**

A registered customer may activate:

-   Owner capability.
-   Broker capability.

Selecting either shall display a verification invitation.

The user may dismiss it.

Verification is not mandatory to submit a property in Release 1.

Verification does not bypass property review.

# **13\. Authorization Model**

Authorization must be based on:

**Roles + Granular Permissions + Ownership Policies**

A user must pass all relevant backend checks.

Frontend visibility is not sufficient.

Example:

A Broker sees only their properties in the seller dashboard.

The backend must also prevent:

/properties/123/edit

from accessing another seller's property even if ID 123 is manually typed.

# **14\. Permission Groups**

## **User Permissions**

user.view

user.create

user.edit

user.disable

user.enable

user.verify

user.assign\_role

user.assign\_permission

## **Property Permissions**

property.create

property.view\_own

property.edit\_own

property.submit

property.view\_pending

property.review

property.edit\_pending

property.approve

property.reject

property.edit\_published

property.archive

property.mark\_sold

property.mark\_rented

property.view\_private\_source

## **Lead Permissions**

lead.view

lead.edit

lead.assign

lead.change\_status

lead.add\_note

lead.contact

## **Configuration Permissions**

settings.general

settings.branding

settings.contact

settings.legal

locations.manage

property\_types.manage

help.manage

## **Audit**

audit.view

# **15\. Role Templates**

Release 1 shall include default templates.

## **Property Reviewer**

Default:

-   property.view\_pending
-   property.review
-   property.edit\_pending
-   property.approve
-   property.reject
-   property.view\_private\_source

## **Sales User**

Default:

-   lead.view
-   lead.edit
-   lead.change\_status
-   lead.add\_note
-   lead.contact

## **Operations Manager**

Default:

-   Reviewer permissions.
-   lead.view.
-   audit.view where approved.

## **Content Manager**

Default:

-   settings.general
-   settings.branding
-   settings.legal
-   help.manage

Super Admin may modify actual effective permissions.

# **16\. User Creation — Internal**

## **SRS-USR-001**

Super Admin shall create internal users.

### **Inputs**

-   Full name.
-   Email.
-   Mobile.
-   Role template.
-   Permission checkboxes.
-   Account status.

### **Acceptance Criteria**

-   Email must be unique.
-   Permission configuration is saved.
-   User cannot grant permissions to themselves unless Super Admin.
-   Creation generates audit record.
-   New user receives setup information.

### **Errors**

Arabic admin UI:

**"البريد الإلكتروني مستخدم بالفعل."**

**"اختار صلاحية واحدة على الأقل أو قالب مستخدم."**

# **17\. User Disable**

Disabling account shall:

-   Terminate future authentication.
-   Preserve data.
-   Preserve history.
-   Preserve properties.
-   Preserve reviews.
-   Preserve Leads.
-   Preserve audit actions.

No cascade delete is allowed.

# **18\. Platform Verification**

## **SRS-VER-001**

Owner/Broker can request verification.

The request shall contain at minimum:

-   User ID.
-   Request date.
-   Status.
-   Reviewer.
-   Review date.
-   Internal note.

Release 1 may rely on Rawabet manually checking the person offline.

Uploading identity documents is not mandatory for Release 1.

# **19\. Verification Approval**

Authorized employee may approve platform verification.

Required permission:

user.verify

On approval:

-   seller\_verification\_status = VERIFIED
-   verified\_by stored.
-   verified\_at stored.
-   audit event created.
-   notification generated.
-   email notification generated.

# **20\. Verification Badge**

Internal seller portal shall show one of:

**"موثق من روابط"**

or:

**"الحساب غير موثق من روابط"**

The seller's identity shall not become visible on public property pages.

Public trust shall instead show:

**"تمت مراجعة العقار من روابط"**

where appropriate.

# **21\. Location Architecture**

Database hierarchy:

Governorate

|

v

City / Markaz

|

v

Area

Kafr El Sheikh shall be the only active governorate at launch.

The system must allow Super Admin to activate more.

# **22\. Governorate Entity**

Required fields:

id

name\_ar

slug

is\_active

created\_by

created\_at

updated\_at

Future localization may add:

name\_en

in Release 2.

# **23\. City Entity**

id

governorate\_id

name\_ar

is\_active

created\_at

updated\_at

# **24\. Area Entity**

id

city\_id

name\_ar

is\_active

created\_at

updated\_at

# **25\. Location Rules**

A property cannot use:

-   Disabled governorate.
-   Disabled city.
-   Disabled area.

Existing property records are not deleted if an area is later disabled.

Inactive locations become unavailable for new submissions/search selection.

# **26\. Property Type Architecture**

Property types shall not be hard-coded.

Initial records:

-   Apartment.
-   Villa.
-   Land.
-   Shop.
-   Office.

Entity:

property\_types

Fields:

id

name\_ar

slug

is\_active

min\_images

max\_images

created\_at

updated\_at

# **27\. Initial Media Limits**

**Type**

**Minimum**

**Maximum**

Apartment

3

12

Villa

5

20

Land

1

8

Shop

2

10

Office

2

10

Super Admin may change these.

# **28\. Transaction Types**

Release 1 supports configurable:

-   Sale.
-   Rent.

Entity:

transaction\_types

No code change should be required to disable one.

# **29\. Property Entity**

The properties table represents the stable business identity of a property.

Minimum fields:

id

reference\_number

seller\_id

property\_type\_id

transaction\_type\_id

current\_status

current\_published\_version\_id

created\_at

updated\_at

deleted\_at

Public editable data should primarily live in versions rather than overwriting the approved record.

# **30\. Property Version Entity**

property\_versions

Minimum fields:

id

property\_id

version\_number

title

description

governorate\_id

city\_id

area\_id

public\_location\_text

private\_address

price

area\_sqm

bedrooms

bathrooms

floor

finishing

status

submitted\_by

submitted\_at

reviewed\_by

reviewed\_at

review\_decision

rejection\_reason

created\_at

updated\_at

# **31\. Property Version Principle**

A published property must have:

current\_published\_version\_id

Seller modification after publication shall create a new version.

The existing published version remains public.

Example:

Property 101

v1 = APPROVED + PUBLIC

v2 = PENDING REVIEW

Public website still loads v1.

After v2 approval:

current\_published\_version\_id = v2

This requirement is mandatory.

# **32\. Property Status Values**

Business-level values:

DRAFT

PENDING\_REVIEW

PUBLISHED

REJECTED

PENDING\_REVISION

ARCHIVED

SOLD

RENTED

Version-level values may be:

DRAFT

PENDING

APPROVED

REJECTED

# **33\. Property Reference Number**

System-generated.

Example format:

RAW-KFS-000001

Requirements:

-   Unique.
-   Immutable.
-   Human-readable.
-   Never reused.

# **34\. Property Draft**

## **SRS-PROP-001**

Owner/Broker can create a draft.

Draft:

-   Not public.
-   Visible only to seller and authorized internal users.
-   May be incomplete.
-   Can be saved repeatedly.

# **35\. Property Input Fields**

The following are Release 1 fields.

## **Common Required Fields**

-   Property type.
-   Transaction type.
-   Governorate.
-   City/Markaz.
-   Area.
-   Public location.
-   Private detailed address.
-   Price.
-   Area in sqm.
-   Title.
-   Description.
-   Images.

## **Conditional Fields**

Bedrooms:

Required for Apartment/Villa where configured.

Bathrooms:

Applicable to Apartment/Villa/Office.

Floor:

Applicable where configured.

Finishing:

Applicable to configured property types.

Features:

Optional/configurable.

# **36\. Property Field Validation**

## **Price**

-   Required.
-   Numeric.
-   Greater than 0.
-   Reasonable database upper bound.

Error:

**"اكتب سعر صحيح للعقار."**

## **Area**

-   Required.
-   Numeric.
-   Greater than 0.

Error:

**"اكتب مساحة صحيحة للعقار."**

## **Title**

-   Required.
-   10–150 characters.

## **Description**

-   Required.
-   30–3000 characters.
-   Must pass forbidden-contact validation.

## **Address**

Private address:

-   Required for internal use unless business configuration changes.
-   Never public by default.

# **37\. Forbidden Seller Content**

Seller-controlled public fields must be checked for:

-   URLs.
-   Domain names.
-   Phone numbers.
-   Email addresses.
-   WhatsApp URLs.
-   Telegram.
-   Facebook.
-   Instagram.
-   TikTok.
-   External contact instructions.

The detection mechanism should combine:

-   Validation patterns.
-   Manual reviewer control.

No automated filter is assumed perfect.

Error:

**"مينفعش تضيف رقم تليفون أو رابط أو وسيلة تواصل داخل بيانات العقار. التواصل بيتم من خلال روابط."**

# **38\. Property Image Entity**

Suggested fields:

id

property\_version\_id

path

mime\_type

file\_size

sort\_order

is\_cover

created\_at

# **39\. Image Upload Validation**

Release 1 supports:

-   JPG.
-   JPEG.
-   PNG.
-   WEBP.

Maximum:

**2 MB per image**

Security checks:

-   MIME validation.
-   Extension validation.
-   Random file naming.
-   Non-executable storage.
-   Authorization against property.
-   Count limit.

# **40\. Image Ordering**

Seller shall be able to:

-   Reorder uploaded images.
-   Select a cover image.

If no cover is selected, system may automatically use first valid image.

# **41\. Video**

Release 1:

**Not included for seller property upload.**

Release 2:

-   Maximum one video.
-   Maximum 90 seconds.
-   Configurable file-size limit.
-   No external seller-provided video URL.

# **42\. Submit Property**

## **SRS-PROP-002**

Seller selects:

**"إرسال للمراجعة"**

Server shall:

1.  Validate authorization.
2.  Validate required fields.
3.  Validate location.
4.  Validate property type.
5.  Validate images.
6.  Validate content.
7.  Lock submitted version from uncontrolled changes.
8.  Set status Pending Review.
9.  Record submitted\_at.
10.  Send internal notification.
11.  Display confirmation.

Arabic:

**"تم إرسال العقار للمراجعة. فريق روابط هيراجع البيانات ويبلغك بالنتيجة."**

# **43\. Seller Property Dashboard**

Seller shall see only own properties.

Columns:

-   Property Reference.
-   Cover.
-   Type.
-   Location.
-   Price.
-   Status.
-   Last Update.
-   Latest Review Result.

Actions vary according to status.

# **44\. Seller Actions by Status**

## **Draft**

-   Edit.
-   Delete/Discard.
-   Submit.

## **Pending Review**

-   View.
-   No destructive editing unless submission is withdrawn if that feature is approved.

Release 1 does not require withdrawal.

## **Rejected**

-   View rejection reason.
-   Edit.
-   Resubmit.

## **Published**

-   View.
-   Request edit via new revision.
-   Mark Sold/Rented may be supported according to permission/workflow.

# **45\. Review Queue**

## **SRS-REV-001**

Authorized Reviewer sees records in:

-   Pending Review.
-   Pending Revision.

Columns:

-   Reference.
-   Seller.
-   Verification state.
-   Type.
-   Location.
-   Price.
-   Submitted at.
-   Waiting duration.

# **46\. Review Detail**

Reviewer shall see:

### **Property**

All submitted information.

### **Seller Internal Data**

-   Name.
-   Mobile.
-   WhatsApp.
-   Email.
-   Seller role.
-   Verification status.

### **Review**

-   Previous review history.
-   Previous rejection reason.
-   Version comparison where applicable.

### **Actions**

Permission dependent:

-   Edit.
-   Approve.
-   Reject.
-   Call Seller.
-   WhatsApp Seller.

# **47\. Reviewer Edit**

Reviewer may edit pending data only if:

property.edit\_pending

All important reviewer modifications shall be auditable.

Reviewer shall not accidentally transfer property ownership.

Changing seller\_id requires Super Admin-level handling and is not part of ordinary review.

# **48\. Property Approval**

## **SRS-REV-002**

Prerequisites:

-   User authenticated.
-   property.approve permission.
-   Property version currently pending.
-   Required data valid.

On approve:

1.  Version status → APPROVED.
2.  Review decision → APPROVED.
3.  reviewed\_by recorded.
4.  reviewed\_at recorded.
5.  Property published version updated.
6.  Property status → PUBLISHED.
7.  Audit created.
8.  In-app notification created.
9.  Email queued/sent.
10.  Public listing becomes available.

# **49\. Approval Concurrency**

The application must protect against two reviewers acting on the same version.

If already processed:

**"العقار اتراجع بالفعل بواسطة مستخدم آخر. حدّث الصفحة علشان تشوف آخر حالة."**

Use database-level state verification before update.

# **50\. Rejection**

## **SRS-REV-003**

Reject button must open modal.

Field:

**Rejection Reason**

Required.

Validation:

-   Minimum 10 characters.
-   Maximum 1000.
-   Cannot contain only whitespace.

If missing:

**"اكتب سبب الرفض قبل ما تكمل."**

On confirm:

-   Version → REJECTED.
-   Reason stored.
-   Reviewer stored.
-   Date stored.
-   Audit stored.
-   Seller notified.

# **51\. Seller Rejection Experience**

Seller dashboard shall display:

**"العقار محتاج تعديل قبل النشر."**

Then:

Reviewer reason.

Seller can edit rejected version into a new revision/resubmission.

Previous rejection must remain available historically.

# **52\. Published Property Revision**

## **SRS-REV-004**

When seller edits Published property:

System creates a new draft version cloned from current published version.

Example:

Current:

v3 APPROVED

Edit creates:

v4 DRAFT

Seller submits v4.

v4 → Pending Revision.

Public site remains on v3.

# **53\. Revision Approval**

When v4 approved:

-   v4 → APPROVED.
-   current\_published\_version\_id → v4.
-   Old versions remain history.
-   Public site immediately reads v4.

# **54\. Revision Rejection**

When v4 rejected:

-   v4 → REJECTED.
-   v3 remains published.
-   Seller sees reason.
-   Public site unaffected.

# **55\. Internal Published Edit**

Internal user may edit approved/public property directly only if:

property.edit\_published

This permission shall not be granted by default to normal reviewers.

Every direct edit must create an audit record containing old and new value.

# **56\. Critical Fields for Audit**

At minimum:

-   Price.
-   Title.
-   Description.
-   Public location.
-   Private address.
-   Images.
-   Property status.
-   Property type.
-   Transaction type.
-   Owner/source.
-   Publication.
-   Rejection.
-   Approval.

Even a one-word description change after submission should be auditable because contact information could be inserted.

# **57\. Public Property Query**

All guest/customer property retrieval shall apply:

status = PUBLISHED

AND current\_published\_version\_id IS NOT NULL

No frontend-only filtering.

# **58\. Public Property Card**

Card contains:

-   Cover.
-   Price.
-   Property type.
-   Transaction type.
-   Public location.
-   Area.
-   Rooms where applicable.
-   Reviewed-by-Rawabet indicator.
-   CTA.

No seller metadata.

# **59\. Search Filters**

Release 1:

-   Governorate.
-   City/Markaz.
-   Area.
-   Property Type.
-   Transaction Type.
-   Minimum Price.
-   Maximum Price.
-   Minimum Area.
-   Maximum Area.
-   Bedrooms where applicable.

# **60\. Filter Validation**

Examples:

If:

min\_price > max\_price

Error:

**"الحد الأدنى للسعر لازم يكون أقل من الحد الأقصى."**

Similarly for area.

Invalid/deactivated master IDs must be rejected server-side.

# **61\. Search Sorting**

Release 1:

-   Newest.
-   Lowest Price.
-   Highest Price.

Default:

Newest.

# **62\. Pagination**

Property listings must be paginated.

Recommended default:

12–20 records per page.

Do not load all properties in one request.

# **63\. Property Detail Gate**

The public browse layer may expose sufficient preview information.

Clicking:

**"رؤية المزيد"**

shall require authentication when configured for Release 1.

After registration/login, full approved detail becomes accessible.

# **64\. Full Property Detail**

Allowed:

-   Images.
-   Price.
-   Title.
-   Approved description.
-   Location.
-   Area.
-   Bedrooms.
-   Bathrooms.
-   Floor.
-   Finishing.
-   Features.
-   Rawabet trust message.
-   Rawabet contact actions.

Never allowed publicly:

-   seller\_id.
-   Seller name.
-   Seller mobile.
-   Seller WhatsApp.
-   Seller email.
-   Internal notes.
-   Private source metadata.
-   Review notes.
-   Private address unless explicitly approved as public.

# **65\. Public Data Leakage Test**

QA must inspect:

-   Page HTML.
-   Source.
-   Network responses.
-   Livewire payloads.
-   JSON.
-   Embedded JavaScript.
-   Data attributes.

Seller private data appearing anywhere is a Critical defect.

# **66\. Customer Profile**

Release 1 profile shall contain:

-   Name.
-   Mobile/WhatsApp.
-   Email.
-   Governorate.
-   Area.
-   Avatar.
-   Email verification state.
-   Seller capabilities.
-   Platform verification status where applicable.

# **67\. Default Avatar**

Upon registration:

-   Generate/use system default avatar.
-   No mandatory photo upload.

User avatar upload may be supported if schedule allows but is not core Release 1.

# **68\. Customer Profile Indicator**

Unauthenticated/incomplete user state may display the agreed subtle red indicator.

After authenticated account creation, UI shall update immediately.

Verification states must not be misrepresented.

A normal Customer account does not receive seller Platform Verified status unless they become Owner/Broker and complete verification.

# **69\. Lead Entity**

Suggested fields:

id

reference\_number

customer\_id

property\_id

status

source

contact\_channel

assigned\_to

created\_at

updated\_at

last\_activity\_at

closed\_at

# **70\. Lead Reference**

Example:

LEAD-000001

Must be unique.

# **71\. Lead Creation**

A Lead is created when customer performs relevant business-interest action.

Examples:

-   WhatsApp.
-   Call.
-   Interest form.

# **72\. WhatsApp Flow**

## **SRS-LEAD-001**

Authenticated customer clicks:

**"كلّمنا على واتساب"**

Backend:

1.  Verify user.
2.  Verify property remains Published.
3.  Find active Lead for customer + property.
4.  Create Lead if none.
5.  Add activity.
6.  Set channel = WHATSAPP.
7.  Set appropriate status/activity.
8.  Open Rawabet WhatsApp URL.

# **73\. WhatsApp Lead Status Accuracy**

Deep-link click means only:

**WhatsApp Contact Initiated**

It does not prove:

-   Message was sent.
-   Message was delivered.
-   Rawabet read the message.

Do not store false confirmation.

WhatsApp API in Release 2 may improve this.

# **74\. WhatsApp Message Template**

Initial:

**"أهلاً، أنا مهتم بالعقار رقم {REFERENCE} على روابط. محتاج أعرف تفاصيل أكتر."**

Template must use Rawabet contact number from Settings.

# **75\. Rawabet Contact Numbers**

Initial configuration:

-   01000920759
-   01000920749

They must be stored in settings.

No source template should contain hard-coded phone numbers.

# **76\. Call Flow**

Customer presses call.

System:

-   Finds/creates Lead.
-   Creates activity:  
    CALL\_CONTACT\_INITIATED
-   Opens tel URI to configured Rawabet number.

# **77\. Lead Deduplication**

An open Lead shall be unique logically for:

customer\_id + property\_id

Repeated contact:

-   Add Lead activity.
-   Update last\_activity\_at.
-   Do not create uncontrolled duplicates.

# **78\. Lead Statuses**

Release 1:

NEW

WHATSAPP\_CONTACT\_INITIATED

CALL\_CONTACT\_INITIATED

CONTACTED

FOLLOW\_UP

VIEWING

WON

LOST

A developer must not assume initiated means contacted.

Sales staff updates Contacted manually.

# **79\. Lead Activity Entity**

Suggested:

id

lead\_id

activity\_type

channel

description

created\_by

created\_at

Types include:

-   CREATED.
-   WHATSAPP\_CONTACT\_INITIATED.
-   CALL\_CONTACT\_INITIATED.
-   STATUS\_CHANGED.
-   NOTE\_ADDED.
-   ASSIGNED.

# **80\. Lead Notes**

Notes are internal.

Fields:

id

lead\_id

user\_id

body

created\_at

updated\_at

Never public.

# **81\. CRM Release 1 Screens**

Required:

## **Lead List**

Columns:

-   Reference.
-   Customer.
-   Mobile.
-   Property.
-   Status.
-   Channel.
-   Assigned user.
-   Last activity.
-   Created.

## **Lead Detail**

-   Customer.
-   Property.
-   Activity timeline.
-   Status.
-   Notes.
-   Call.
-   WhatsApp.

# **82\. Lead Assignment**

Release 1 may support manual assignment if implementation fits MVP schedule.

If omitted due time, all authorized Sales users may view Leads according to configured permission.

Automatic round-robin is Release 2.

# **83\. Dashboard**

Release 1 internal dashboard shall show:

-   Pending property count.
-   Published property count.
-   Rejected property count.
-   New Leads.
-   Follow-Up Leads.
-   Active sellers.

No advanced BI required.

# **84\. Notification Entity**

Suggested:

id

user\_id

type

title

body

related\_type

related\_id

read\_at

created\_at

# **85\. In-App Notifications**

Release 1 mandatory events:

-   Property submitted → internal.
-   Property approved → seller.
-   Property rejected → seller.
-   Revision approved → seller.
-   Revision rejected → seller.
-   Verification approved → seller.
-   Verification rejected → seller.

# **86\. Email Notifications**

Same critical events shall trigger email where appropriate.

Email failure must not roll back successful core transaction.

Example:

Property approval transaction succeeds.

Mail failure:

-   Logged.
-   Optional retry through cron if implemented.
-   User may still see in-app notification.

# **87\. Shared Hosting Email Queue Decision**

Because persistent Laravel queue workers are inappropriate on standard shared hosting:

Release 1 may:

-   Send essential emails synchronously, or
-   Use database queue + scheduled cron processing.

Developer must not require Supervisor.

# **88\. Settings Data**

Suggested key-value model:

system\_settings

Keys include:

site\_name

logo\_path

primary\_color

secondary\_color

primary\_whatsapp

secondary\_whatsapp

primary\_phone

support\_email

privacy\_policy\_ar

terms\_ar

about\_ar

home\_headline\_ar

home\_description\_ar

# **89\. Branding**

Super Admin can configure:

-   Logo.
-   Primary color.
-   Secondary/accent color.
-   Site name.

Primary design direction:

-   Professional green.
-   Neutral backgrounds.
-   Cairo.

HEX validation:

#\[0-9A-Fa-f\]{6}

# **90\. Legal Content**

Super Admin can edit:

-   Privacy Policy.
-   Terms and Conditions.
-   About Rawabet.

Rich text must be sanitized.

No arbitrary executable HTML/JavaScript.

# **91\. Help Resources**

Release 1:

-   One or more help entries.
-   PDF seller guide.
-   Admin-controlled.

Suggested entity:

help\_resources

Fields:

id

title

type

file\_path

url

is\_active

sort\_order

created\_at

Release 1:

PDF

Release 1.1:

YOUTUBE

Only Super Admin/authorized staff can manage links.

# **92\. Favorites — Release 1.1**

Entity:

favorites

Fields:

id

user\_id

property\_id

expires\_at

created\_at

Rule:

expires\_at = created\_at + 30 days

# **93\. Favorites Cleanup**

Daily cron may delete expired favorites.

UI:

**"العقار محفوظ عندك لمدة 30 يوم."**

Expired or unpublished property must not appear as normally available.

# **94\. Audit Log Entity**

Minimum fields:

id

actor\_id

action

entity\_type

entity\_id

field\_name

old\_value

new\_value

metadata

ip\_address

created\_at

# **95\. Audit Requirements**

Audit:

-   Append-only through application.
-   No user edit.
-   No user delete.
-   Super Admin view only unless permission granted.

# **96\. Permission Audit**

Every:

-   Role change.
-   Permission grant.
-   Permission removal.
-   User disable.
-   User enable.

shall create audit entries.

# **97\. Settings Audit**

Critical settings to audit:

-   Contact number changes.
-   Legal content changes.
-   Governorate activation.
-   System brand identity where relevant.

# **98\. UI Direction**

Release 1 shall be:

-   Arabic-only.
-   RTL.
-   Mobile-first.
-   Friendly semi-formal Arabic.
-   Visually consistent.
-   Not a generic Laravel admin design on public screens.

# **99\. Core Screens — Public**

Required:

P-01 Home

P-02 Property Listing

P-03 Property Detail

P-04 Registration/Login Modal

P-05 Email OTP Modal

P-06 Customer Profile

# **100\. Core Screens — Seller**

S-01 Seller Dashboard

S-02 My Properties

S-03 Create/Edit Property

S-04 Property Status Detail

S-05 Rejection Detail

S-06 Verification Status

# **101\. Core Screens — Internal**

A-01 Internal Login

A-02 Dashboard

A-03 Review Queue

A-04 Property Review Detail

A-05 Published Properties

A-06 Leads

A-07 Lead Detail

A-08 Users

A-09 User Create/Edit

A-10 Roles/Permissions

A-11 Verification Requests

A-12 Governorates

A-13 Cities/Areas

A-14 Property Types

A-15 Settings

A-16 Help Resources

A-17 Audit Log

# **102\. UI Form Requirements**

Every form shall:

-   Show clear Arabic labels.
-   Identify required fields.
-   Preserve valid values after validation failure.
-   Show errors beside relevant field.
-   Prevent double submit.
-   Show loading state where request takes noticeable time.

# **103\. Error Standard**

System must never display production stack traces.

## **403**

**"ما عندكش صلاحية لتنفيذ الإجراء ده."**

## **404**

**"المحتوى اللي بتدور عليه مش موجود أو مبقاش متاح."**

## **419 / Session Expired**

**"جلستك انتهت. سجّل دخول تاني وكمل."**

## **422 Validation**

Specific field errors.

## **500**

**"حصلت مشكلة غير متوقعة. جرّب مرة تانية، ولو المشكلة مستمرة تواصل مع فريق روابط."**

# **104\. Security — Authentication**

-   Laravel secure sessions.
-   Session regeneration on authentication.
-   Login throttling.
-   OTP throttling.
-   Secure cookie settings over HTTPS.
-   CSRF enabled.

# **105\. Security — Authorization**

All protected actions must use:

-   Middleware.
-   Policy.
-   Gate/permission checks.

Do not rely on controller UI assumptions.

# **106\. Security — IDOR**

Mandatory automated/manual tests shall attempt:

-   Broker A editing Broker B property.
-   Customer reading private property revision.
-   Sales accessing unauthorized settings.
-   Reviewer changing users without permission.

All must fail.

# **107\. Security — SQL Injection**

Use:

-   Eloquent.
-   Query Builder bindings.

Raw SQL must be justified and parameterized.

# **108\. Security — XSS**

All user-generated text shall be escaped by default.

Rich text must be sanitized.

No raw Blade output for user content without sanitization.

# **109\. Security — File Uploads**

Requirements:

-   MIME verification.
-   Extension whitelist.
-   Max size.
-   Randomized names.
-   Path traversal protection.
-   Non-executable storage.
-   No arbitrary SVG upload from external sellers in Release 1.

# **110\. Security — Sensitive Data**

Never log:

-   OTP.
-   Password.
-   Session cookie.
-   SMTP password.
-   Secret tokens.

# **111\. Security — Environment**

Production:

APP\_ENV=production

APP\_DEBUG=false

Required.

# **112\. Security — HTTPS**

All production traffic must use HTTPS.

HTTP should redirect to HTTPS.

# **113\. Security — External URLs**

Seller property forms must not accept arbitrary URL fields.

This is a deliberate privacy requirement.

# **114\. Database Index Requirements**

At minimum indexes on:

users.email

users.mobile

properties.reference\_number

properties.seller\_id

properties.current\_status

property\_versions.property\_id

property\_versions.status

property\_versions.governorate\_id

property\_versions.city\_id

property\_versions.area\_id

property\_versions.property\_type\_id

property\_versions.transaction\_type\_id

property\_versions.price

leads.customer\_id

leads.property\_id

leads.status

leads.created\_at

# **115\. Soft Deletion**

Recommended for:

-   Users.
-   Properties.
-   Leads where administrator deletion exists.

Do not physically delete published business records by default.

Archive instead.

# **116\. Data Retention**

Release 1:

No automatic deletion of:

-   Users.
-   Properties.
-   Leads.
-   Audit records.

Favorites expire in Release 1.1.

Future retention policies require business approval.

# **117\. Shared Hosting Performance**

Developer must avoid:

-   N+1 queries.
-   Unlimited datasets.
-   Processing huge images.
-   Heavy synchronous reporting.
-   Unnecessary eager loading.
-   Huge Livewire payloads.

# **118\. Caching**

Release 1 may use Laravel file/database cache.

No Redis requirement.

Appropriate cache candidates:

-   Active property types.
-   Active governorates.
-   Static settings.

Cache invalidation must happen after configuration changes.

# **119\. Media Performance**

Release 1:

No advanced image conversion requirement.

However:

-   Client-side preview.
-   Image count limits.
-   File size limits.
-   HTML lazy loading.
-   Reasonable dimensions encouraged.

Release 1.1 adds proper optimization.

# **120\. Cron Jobs**

Release 1 minimum cron may support:

-   Laravel scheduler.
-   Cleanup.
-   Email queue if database queue approach selected.

Hostinger-compatible cron only.

# **121\. Logging**

Log levels:

-   Error.
-   Warning.
-   Critical business failures.

Log rotation must be considered because shared hosting storage is limited.

Do not allow unbounded log growth.

# **122\. Backup**

System must be compatible with Hostinger backup.

Developer shall additionally provide database export procedure.

Before risky production migration:

-   Backup database.

# **123\. Database Migrations**

All schema changes must use Laravel migrations.

Manual production-only database changes are prohibited except emergency operations documented afterward.

# **124\. Seed Data**

Seed or installation process shall create:

-   Initial Super Admin.
-   Default roles.
-   Default permissions.
-   Initial property types.
-   Sale/Rent transaction types.
-   Kafr El Sheikh.
-   Required starter settings.

Production credentials shall not be committed in seed source.

# **125\. API Strategy**

Release 1 does not require a public REST API.

Routes may be standard server-rendered Laravel/Livewire.

Architecture should not prevent a future API.

Any JSON endpoint used internally must enforce the same permissions.

# **126\. Public Route Examples**

Logical routes may include:

/

/properties

/properties/{reference}

/login

/verify

/profile

Exact route naming may follow Laravel conventions.

# **127\. Seller Route Examples**

/seller

/seller/properties

/seller/properties/create

/seller/properties/{id}

/seller/properties/{id}/edit

/seller/verification

All protected by authentication and policies.

# **128\. Internal Routes**

Recommended prefix:

/admin

or Filament panel equivalent.

No security assumption shall be based on hidden URL.

# **129\. Release 1.0 Requirements**

Release 1.0 includes:

-   Accounts.
-   Email OTP.
-   Seller capability.
-   Manual platform verification.
-   Dynamic permissions.
-   Property submission.
-   Review.
-   Approval.
-   Rejection.
-   Revision versioning.
-   Public listing.
-   Search.
-   Filters.
-   Property details.
-   Lead creation.
-   WhatsApp deep link.
-   Call contact.
-   Basic CRM.
-   In-app notifications.
-   Email notifications.
-   Settings.
-   Locations.
-   Property types.
-   Basic audit.
-   Help PDF.
-   Responsive Arabic UI.
-   Deployment.

# **130\. Release 1.1 Requirements**

After MVP stabilization:

-   Favorites.
-   30-day expiry.
-   WebP conversion.
-   Server-side image resizing.
-   Better image optimization.
-   Improved review diff.
-   YouTube help tutorials.
-   Better notifications center.
-   Dashboard refinements.
-   Additional filter UX.
-   Bulk administrative actions where justified.

# **131\. Release 2.0 Requirements**

## **WhatsApp**

-   WhatsApp Business API.
-   OTP via WhatsApp.
-   Verified mobile status.
-   Delivery statuses where API allows.
-   Automated property approval/rejection notifications.

## **CRM**

-   Lead assignment.
-   Follow-up scheduling.
-   Reminders.
-   Advanced activity timeline.
-   Sales ownership.
-   Lead aging.
-   Advanced reports.
-   EspoCRM integration assessment.

## **Media**

-   Property video.
-   Maximum 90 sec.
-   Upload validation.

## **Localization**

-   English.
-   Language switcher.
-   Translation architecture.

## **Customer**

-   Saved searches.
-   Alerts.

# **132\. Release 3.0 Requirements**

-   Similar properties.
-   Rule-based recommendations.
-   Advanced analytics.
-   Conversion funnel.
-   Seller/source operational analytics.
-   Improved search ranking.
-   Duplicate property assistance.
-   Customer behavior insights.
-   PWA evaluation.

# **133\. Release 4.0 Requirements**

Potential:

-   AI matching.
-   AI descriptions.
-   AI Lead scoring.
-   Recommendation engine.
-   Native mobile apps.
-   External partner API.
-   Advanced market intelligence.

Release 4 is roadmap, not committed scope.

# **134\. Sprint Plan — Release 1**

Because target is 5–8 days, use execution micro-sprints.

## **Sprint 0 — Freeze**

Before development.

Deliver:

-   Approved BRD.
-   Approved SRS.
-   Screen list.
-   Git repo.
-   Hosting access.
-   SMTP.
-   Logo/colors.
-   Master-data list.

## **Sprint 1 — Day 1–2**

Authentication and System Foundation.

Deliver:

-   Laravel project.
-   DB.
-   Public/internal authentication.
-   Email OTP.
-   Users.
-   Profiles.
-   Roles.
-   Permissions.
-   Role templates.
-   Location master.
-   Property type master.
-   Settings base.

Acceptance:

Super Admin can create internal user and configure permissions.

External user can register/login.

## **Sprint 2 — Day 2–4**

Property Engine.

Deliver:

-   Property.
-   Versioning.
-   Seller dashboard.
-   Images.
-   Submit.
-   Review queue.
-   Review details.
-   Approve.
-   Reject reason.
-   Revisions.
-   Critical audit.

Acceptance:

Owner/Broker → Pending → Reviewer → Publish works.

## **Sprint 3 — Day 4–6**

Public Experience + Leads.

Deliver:

-   Home.
-   Property list.
-   Filters.
-   Search.
-   Property detail.
-   Customer gated flow.
-   WhatsApp.
-   Call.
-   Leads.
-   CRM screens.

Acceptance:

Guest → Registration → Property → Contact → Lead works.

## **Sprint 4 — Day 6–8**

Hardening.

Deliver:

-   Notifications.
-   Email.
-   Dashboard.
-   Settings.
-   Legal content.
-   Help PDF.
-   Responsive QA.
-   Security QA.
-   Deployment.
-   UAT.
-   Production fixes.

# **135\. Definition of Done**

A feature is not Done until:

-   Backend behavior implemented.
-   Authorization implemented.
-   Validation implemented.
-   Arabic UI implemented.
-   Acceptance criteria passed.
-   Security cases tested.
-   Error handling exists.
-   Responsive behavior checked.
-   Database migration committed.
-   Code committed.
-   No Critical or High open bug for that feature.

# **136\. Core Acceptance Test Matrix**

## **AT-001**

Broker creates property.

Expected:

Draft belongs only to Broker.

## **AT-002**

Broker submits complete property.

Expected:

Pending Review.

## **AT-003**

Broker submits phone in description.

Expected:

Rejected by validation/flagged according to final detection implementation.

## **AT-004**

Other Broker changes URL to property ID.

Expected:

403/404.

## **AT-005**

Reviewer without approve permission presses crafted approve request.

Expected:

## **AT-006**

Reviewer rejects without reason.

Expected:

422/block.

## **AT-007**

Reviewer approves property.

Expected:

Published.

## **AT-008**

Guest searches.

Expected:

Only Published.

## **AT-009**

Seller modifies published price.

Expected:

Public price unchanged.

## **AT-010**

Revision approved.

Expected:

New price public.

## **AT-011**

Revision rejected.

Expected:

Old price remains.

## **AT-012**

Customer chooses WhatsApp.

Expected:

Lead created/activity stored + Rawabet WhatsApp opens.

## **AT-013**

Customer repeats WhatsApp.

Expected:

Existing open Lead reused.

## **AT-014**

Public response inspected.

Expected:

No seller contact/source.

## **AT-015**

Super Admin activates new governorate.

Expected:

Appears in new forms/filters.

## **AT-016**

Disabled governorate.

Expected:

Unavailable for new records.

## **AT-017**

Internal published edit.

Expected:

Audit contains old/new values.

## **AT-018**

Disabled employee attempts login.

Expected:

Denied.

## **AT-019**

Email approval notification fails.

Expected:

Approval remains successful.

## **AT-020**

Production exception occurs.

Expected:

No stack trace.

# **137\. Performance Acceptance**

For MVP loads of approximately 500–2,000 visitors/day, implementation shall be designed to operate acceptably on Hostinger Premium assuming normal use and optimized media.

Targets should be treated as operational goals rather than strict contractual guarantees on shared hosting:

-   Normal public pages should typically respond within a few seconds.
-   Search must not perform unbounded full-table processing.
-   Pagination mandatory.
-   Images lazy loaded.
-   SQL queries indexed appropriately.

# **138\. Browser Acceptance**

Release 1 shall be checked on current modern:

-   Chrome Android.
-   Safari iOS.
-   Chrome Desktop.
-   Edge Desktop.

Firefox basic compatibility expected.

# **139\. Responsive Breakpoints**

Implementation may use Tailwind defaults.

At minimum verify:

-   360px mobile.
-   390/430px common mobile.
-   Tablet.
-   1366px desktop.
-   Large desktop.

# **140\. Accessibility Minimum**

Forms shall:

-   Use associated labels.
-   Support keyboard navigation.
-   Have visible focus.
-   Expose validation errors.
-   Maintain reasonable contrast.

# **141\. Source Code Requirements**

Developer must deliver:

-   Full source.
-   No obfuscation.
-   Git history.
-   Composer files.
-   package files if build tools used.
-   migrations.
-   seeders.
-   README.
-   .env.example.

No nulled/pirated packages.

# **142\. Repository Policy**

Repository must belong to project owner/company account.

Developer works as collaborator.

The only copy must never live in developer personal account.

# **143\. Open Source Package Register**

Before final acceptance, provide:

**Package**

**Purpose**

**License**

**Version**

No commercially restricted dependency without approval.

# **144\. Deployment Checklist**

Developer shall verify:

-   Domain configured.
-   SSL active.
-   PHP version correct.
-   Required extensions active.
-   DB configured.
-   APP\_KEY generated.
-   APP\_DEBUG false.
-   Storage writable.
-   Mail working.
-   Cron configured.
-   Migrations complete.
-   Admin created.
-   Backups confirmed.
-   Public files protected.
-   Error page tested.

# **145\. Handover Documentation**

README shall document:

1.  Local installation.
2.  Production installation.
3.  Database configuration.
4.  Environment variables.
5.  Mail configuration.
6.  Cron.
7.  Storage.
8.  Admin creation.
9.  Permissions.
10.  Backup.
11.  Deployment update procedure.

# **146\. Production Update Procedure**

Developer must provide safe update steps similar to:

Backup

Pull/upload code

Install dependencies

Run migrations

Clear/rebuild caches

Verify storage

Run smoke tests

Exact commands depend on Hostinger capabilities.

# **147\. Post-Launch Warranty**

Recommended contractual warranty:

**14 calendar days from production acceptance.**

Developer shall correct:

-   BRD/SRS nonconformance.
-   Bugs.
-   Security defects caused by implementation.
-   Regressions.

Not included:

-   New feature.
-   New workflow.
-   Client-requested redesign.
-   New integration.
-   New report.

# **148\. Release Blocking Defects**

Release cannot be accepted if:

-   Seller data exposed.
-   Approval bypass exists.
-   Authorization bypass exists.
-   Published revision incorrectly replaced.
-   Leads fail.
-   Public website unusable on mobile.
-   Debug enabled.
-   Source code missing.
-   Database corruption occurs.
-   Critical upload vulnerability exists.

# **149\. Severity**

**Severity**

**Meaning**

**Release**

Critical

Security/data/core outage

Block

High

Core workflow failure

Block

Medium

Workaround exists

Conditional

Low

Cosmetic/minor

Does not normally block

# **150\. Traceability Summary**

**SRS Area**

**BRD Area**

**Release**

Authentication

AUTH

1.0

Verification

VER

1.0

Permissions

RBAC

1.0

Locations

LOC

1.0

Property Types

TYPE

1.0

Property Submission

PROP

1.0

Review

REVIEW

1.0

Revision

REV

1.0

Public Website

PUBLIC

1.0

Privacy

PRIV

1.0

Leads

LEAD

1.0

CRM

CRM

1.0

Notifications

NOTIF

1.0

Settings

SETTINGS

1.0

Audit

AUDIT

1.0

Favorites

FAV

1.1

Image Optimization

IMG

1.1

WhatsApp API

WA

2.0

Advanced CRM

CRM-ADV

2.0

English

LANG

2.0

Video

MEDIA

2.0

Recommendations

REC

3.0

Analytics

ANALYTICS

3.0

AI

AI

4.0

# **151\. Final MVP Boundaries**

To meet the 5–8 working day deadline, the developer must not silently expand Release 1 into:

-   WhatsApp OTP.
-   Full EspoCRM integration.
-   Advanced reporting.
-   Property video.
-   AI.
-   English.
-   Favorites.
-   Advanced image processing.
-   Maps.
-   Online payment.
-   Commissions.
-   Native mobile application.
-   SEO project.
-   Real-time chat.

These belong to later versions unless scope/timeline is formally changed.

# **152\. Final Technical Acceptance Statement**

Release 1.0 is accepted only when the following business chain is functional in production:

Owner / Broker Account

↓

Create Property

↓

Upload Images

↓

Submit for Review

↓

Rawabet Reviewer

↓

Approve / Reject

↓

Published Approved Version

↓

Customer Browse

↓

Registration / Authentication

↓

Property Details

↓

WhatsApp / Call

↓

Lead Created

↓

Rawabet Sales Follow-Up

At no stage may customer-facing functionality expose seller contact information.

# **153\. Developer Acknowledgement**

The developer shall acknowledge:

I have reviewed RAW-SRS-001 and understand the required application states, data privacy boundaries, property versioning workflow, role and permission model, security requirements, release boundaries, acceptance criteria and deployment constraints. I will not substitute undocumented assumptions for stated requirements.

**Developer:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# **154\. Business Analyst Approval**

**Business Analyst:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# **END OF SRS**

**Document:** RAW-SRS-001  
**Version:** 1.0  
**Related BRD:** RAW-BRD-001 v1.0