import { 
  Governorate, 
  City, 
  Area, 
  PropertyType, 
  TransactionType, 
  User, 
  Property, 
  Lead, 
  SystemSetting, 
  HelpResource, 
  AuditLog, 
  AppNotification 
} from '../types';

export const INITIAL_GOVERNORATES: Governorate[] = [
  {
    id: 'gov-kfs',
    name_ar: 'كفر الشيخ',
    slug: 'kafr-el-sheikh',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'gov-ghr',
    name_ar: 'الغربية',
    slug: 'gharbia',
    is_active: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'gov-alex',
    name_ar: 'الإسكندرية',
    slug: 'alexandria',
    is_active: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }
];

export const INITIAL_CITIES: City[] = [
  { id: 'city-kfs-1', governorate_id: 'gov-kfs', name_ar: 'مدينة كفر الشيخ', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-2', governorate_id: 'gov-kfs', name_ar: 'دسوق', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-3', governorate_id: 'gov-kfs', name_ar: 'فوه', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-4', governorate_id: 'gov-kfs', name_ar: 'مطوبس', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-5', governorate_id: 'gov-kfs', name_ar: 'بلطيم ومصيف بلطيم', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-6', governorate_id: 'gov-kfs', name_ar: 'بيلا', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-7', governorate_id: 'gov-kfs', name_ar: 'سيدي سالم', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'city-kfs-8', governorate_id: 'gov-kfs', name_ar: 'الحامول', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

export const INITIAL_AREAS: Area[] = [
  // كفر الشيخ
  { id: 'area-101', city_id: 'city-kfs-1', name_ar: 'حي المهندسين', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-102', city_id: 'city-kfs-1', name_ar: 'منطقة سخا / المحطة', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-103', city_id: 'city-kfs-1', name_ar: 'القنطرة البيضاء', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-104', city_id: 'city-kfs-1', name_ar: 'منطقة المحاربين الجديدة', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-105', city_id: 'city-kfs-1', name_ar: 'شارع الخليفة المأمون', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-106', city_id: 'city-kfs-1', name_ar: 'حي الأطباء / الـ 47', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  
  // دسوق
  { id: 'area-201', city_id: 'city-kfs-2', name_ar: 'وسط البلد وميدان سيدي إبراهيم الدسوقي', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-202', city_id: 'city-kfs-2', name_ar: 'شارع الجيش والكورنيش', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-203', city_id: 'city-kfs-2', name_ar: 'منطقة المساكن الجديدة', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  
  // بلطيم
  { id: 'area-301', city_id: 'city-kfs-5', name_ar: 'شاطئ النرجس', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-302', city_id: 'city-kfs-5', name_ar: 'شاطئ الأمل', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'area-303', city_id: 'city-kfs-5', name_ar: 'مدينة بلطيم المركزية', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },

  // فوه
  { id: 'area-401', city_id: 'city-kfs-3', name_ar: 'كورنيش النيل بفوه والآثار الإسلامية', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  
  // مطوبس
  { id: 'area-501', city_id: 'city-kfs-4', name_ar: 'الشارع الرئيسي والقناطر', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },

  // بيلا
  { id: 'area-601', city_id: 'city-kfs-6', name_ar: 'شارع بورسعيد وحي السلام', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },

  // سيدي سالم
  { id: 'area-701', city_id: 'city-kfs-7', name_ar: 'شارع المركز والجمهورية', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },

  // الحامول
  { id: 'area-801', city_id: 'city-kfs-8', name_ar: 'شارع العاشر من رمضان وحي الأمل', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
];

export const INITIAL_PROPERTY_TYPES: PropertyType[] = [
  { id: 'type-apt', name_ar: 'شقة سكنية', slug: 'apartment', min_images: 3, max_images: 12, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-villa', name_ar: 'فيلا مستقلة', slug: 'villa', min_images: 5, max_images: 20, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-duplex', name_ar: 'دوبلكس وبنتهاوس', slug: 'duplex', min_images: 4, max_images: 15, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-chalet', name_ar: 'شاليه ومصيف', slug: 'chalet', min_images: 3, max_images: 12, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-land', name_ar: 'قطعة أرض', slug: 'land', min_images: 1, max_images: 8, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-shop', name_ar: 'محل وتجاري', slug: 'shop', min_images: 2, max_images: 10, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-office', name_ar: 'مكتب وعيادة', slug: 'office', min_images: 2, max_images: 10, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'type-building', name_ar: 'عمارة ومبنى كامل', slug: 'building', min_images: 4, max_images: 16, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
];

export const INITIAL_TRANSACTION_TYPES: TransactionType[] = [
  { id: 'tx-sale', name_ar: 'بيع', slug: 'sale', is_active: true },
  { id: 'tx-rent', name_ar: 'إيجار', slug: 'rent', is_active: true },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'إدارة روابط العقارية',
    email: 'admin@rawabet.com',
    mobile: '01000920759',
    email_verified_at: '2026-01-01T10:00:00Z',
    account_status: 'ACTIVE',
    role: 'SUPER_ADMIN',
    last_login_at: '2026-09-01T08:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-reviewer-1',
    name: 'م. كريم عادل (مراجع عقارات)',
    email: 'reviewer@rawabet.com',
    mobile: '01000920749',
    email_verified_at: '2026-01-02T10:00:00Z',
    account_status: 'ACTIVE',
    role: 'PROPERTY_REVIEWER',
    custom_permissions: [
      'property.view_pending',
      'property.review',
      'property.edit_pending',
      'property.approve',
      'property.reject',
      'property.view_private_source'
    ],
    last_login_at: '2026-09-01T07:30:00Z',
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'user-sales-1',
    name: 'سارة يوسف (مسؤول مبيعات)',
    email: 'sales@rawabet.com',
    mobile: '01023456780',
    email_verified_at: '2026-01-03T10:00:00Z',
    account_status: 'ACTIVE',
    role: 'SALES_USER',
    custom_permissions: [
      'lead.view',
      'lead.edit',
      'lead.change_status',
      'lead.add_note',
      'lead.contact'
    ],
    last_login_at: '2026-09-01T06:45:00Z',
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 'user-owner-1',
    name: 'محمد الدسوقي (مالك عقار)',
    email: 'owner@example.com',
    mobile: '01012345678',
    email_verified_at: '2026-02-01T12:00:00Z',
    account_status: 'ACTIVE',
    role: 'CUSTOMER',
    seller_profile: {
      id: 'seller-own-1',
      user_id: 'user-owner-1',
      seller_type: 'OWNER',
      verification_status: 'VERIFIED',
      verification_requested_at: '2026-02-01T12:10:00Z',
      verified_at: '2026-02-02T09:00:00Z',
      verified_by: 'user-admin-1',
      verification_note: 'تم التحقق من صفة المالك وسند الملكية بنجاح'
    },
    user_profile: {
      id: 'prof-own-1',
      user_id: 'user-owner-1',
      governorate_id: 'gov-kfs',
      city_id: 'city-kfs-1',
      area_id: 'area-101',
      preferred_language: 'ar',
      created_at: '2026-02-01T12:00:00Z',
      updated_at: '2026-02-01T12:00:00Z'
    },
    last_login_at: '2026-09-01T05:00:00Z',
    created_at: '2026-02-01T12:00:00Z',
    updated_at: '2026-02-02T09:00:00Z'
  },
  {
    id: 'user-broker-1',
    name: 'مكتب النخبة للتسويق العقاري (وسيط)',
    email: 'broker@example.com',
    mobile: '01098765432',
    email_verified_at: '2026-03-01T14:00:00Z',
    account_status: 'ACTIVE',
    role: 'CUSTOMER',
    seller_profile: {
      id: 'seller-brk-1',
      user_id: 'user-broker-1',
      seller_type: 'BROKER',
      verification_status: 'PENDING',
      verification_requested_at: '2026-08-25T11:00:00Z'
    },
    user_profile: {
      id: 'prof-brk-1',
      user_id: 'user-broker-1',
      governorate_id: 'gov-kfs',
      city_id: 'city-kfs-2',
      area_id: 'area-202',
      preferred_language: 'ar',
      created_at: '2026-03-01T14:00:00Z',
      updated_at: '2026-03-01T14:00:00Z'
    },
    last_login_at: '2026-08-30T10:00:00Z',
    created_at: '2026-03-01T14:00:00Z',
    updated_at: '2026-08-25T11:00:00Z'
  },
  {
    id: 'user-cust-1',
    name: 'أحمد مصطفى (مشتري / عميل)',
    email: 'customer@example.com',
    mobile: '01123456789',
    email_verified_at: '2026-04-10T16:00:00Z',
    account_status: 'ACTIVE',
    role: 'CUSTOMER',
    user_profile: {
      id: 'prof-cust-1',
      user_id: 'user-cust-1',
      governorate_id: 'gov-kfs',
      city_id: 'city-kfs-1',
      area_id: 'area-104',
      preferred_language: 'ar',
      created_at: '2026-04-10T16:00:00Z',
      updated_at: '2026-04-10T16:00:00Z'
    },
    last_login_at: '2026-09-01T04:20:00Z',
    created_at: '2026-04-10T16:00:00Z',
    updated_at: '2026-04-10T16:00:00Z'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-101',
    reference_number: 'RAW-KFS-000001',
    seller_id: 'user-owner-1',
    property_type_id: 'type-apt',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-101-1',
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-05-12T14:30:00Z',
    versions: [
      {
        id: 'ver-101-1',
        property_id: 'prop-101',
        version_number: 1,
        title: 'شقة فاخرة بحي المهندسين تشطيب ألترا سوبر لوكس إطلالة مفتوحة',
        description: 'شقة سكنية متميزة جداً في أرقى مناطق كفر الشيخ بحي المهندسين، قريبة من مجمع الخدمات والمدارس. تتكون من 3 غرف نوم واسعة وريسبشن 3 قطع و2 حمام ومطبخ كبير مجهز. العمارة حديثة ومدخل فندقي مع مصعدين وإنتركم مرئي.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-101',
        public_location_text: 'حي المهندسين - كفر الشيخ بالقرب من الحديقة المركزية',
        private_address: 'برج الأندلس، شارع 15 متفرع من شارع المهندسين الرئيسي، الدور الرابع شقة 8',
        price: 1850000,
        area_sqm: 165,
        bedrooms: 3,
        bathrooms: 2,
        floor: 'الدور الرابع',
        finishing: 'ألترا سوبر لوكس',
        features: ['مصعد', 'عداد غاز طبيعي', 'عداد كهرباء كارت', 'حصة بالأرض', 'شرفة واسعة', 'أمن وحراسة'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-05-10T10:30:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-05-12T14:30:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-05-10T10:00:00Z',
        updated_at: '2026-05-12T14:30:00Z',
        media: [
          {
            id: 'med-101-1',
            property_version_id: 'ver-101-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-05-10T10:05:00Z'
          },
          {
            id: 'med-101-2',
            property_version_id: 'ver-101-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-05-10T10:05:00Z'
          },
          {
            id: 'med-101-3',
            property_version_id: 'ver-101-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-05-10T10:05:00Z'
          },
          {
            id: 'med-101-4',
            property_version_id: 'ver-101-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 4,
            is_cover: false,
            created_at: '2026-05-10T10:05:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-101-1',
        property_id: 'prop-101',
        property_version_id: 'ver-101-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'تم مراجعة الصور ومطابقة السعر مع متوسطات حي المهندسين. العقار ممتاز ومستوفي الشروط.',
        created_at: '2026-05-12T14:30:00Z'
      }
    ]
  },
  {
    id: 'prop-102',
    reference_number: 'RAW-KFS-000002',
    seller_id: 'user-broker-1',
    property_type_id: 'type-villa',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-102-1',
    created_at: '2026-06-01T11:00:00Z',
    updated_at: '2026-06-03T15:00:00Z',
    versions: [
      {
        id: 'ver-102-1',
        property_id: 'prop-102',
        version_number: 1,
        title: 'فيلا مستقلة راقية بسخا مع حديقة خاصة ومدخل سيارة',
        description: 'فيلا عائلية مميزة بمنطقة سخا الهادئة بكفر الشيخ. مساحة الأرض 320 متر والمباني على دورين وروف بمساحة 450 متر إجمالي. تشطيب كامل وتصميم كلاسيكي فاخر، حديقة منسقة وغرفة حارس خاصة.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-102',
        public_location_text: 'سخا - كفر الشيخ بالقرب من معهد البحوث والنوادي',
        private_address: 'تقسيم الزهور، فيلا رقم 14 بجوار نادي المعلمين بسخا',
        price: 5200000,
        area_sqm: 320,
        bedrooms: 5,
        bathrooms: 4,
        floor: 'أرضي + أول + روف',
        finishing: 'سوبر لوكس',
        features: ['حديقة خاصة', 'جراج خاص', 'روف مجهز', 'غرفة خادمة / حارس', 'خزان مياه خاص', 'موقع هادئ'],
        version_status: 'APPROVED',
        submitted_by: 'user-broker-1',
        submitted_at: '2026-06-01T11:30:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-06-03T15:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-06-01T11:00:00Z',
        updated_at: '2026-06-03T15:00:00Z',
        media: [
          {
            id: 'med-102-1',
            property_version_id: 'ver-102-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-06-01T11:05:00Z'
          },
          {
            id: 'med-102-2',
            property_version_id: 'ver-102-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-06-01T11:05:00Z'
          },
          {
            id: 'med-102-3',
            property_version_id: 'ver-102-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-06-01T11:05:00Z'
          },
          {
            id: 'med-102-4',
            property_version_id: 'ver-102-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 4,
            is_cover: false,
            created_at: '2026-06-01T11:05:00Z'
          },
          {
            id: 'med-102-5',
            property_version_id: 'ver-102-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 5,
            is_cover: false,
            created_at: '2026-06-01T11:05:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-102-1',
        property_id: 'prop-102',
        property_version_id: 'ver-102-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'تم التواصل مع الوسيط والتأكد من إمكانية المعاينة بالتنسيق المباشر.',
        created_at: '2026-06-03T15:00:00Z'
      }
    ]
  },
  {
    id: 'prop-103',
    reference_number: 'RAW-KFS-000003',
    seller_id: 'user-owner-1',
    property_type_id: 'type-shop',
    transaction_type_id: 'tx-rent',
    current_status: 'PENDING_REVISION',
    current_published_version_id: 'ver-103-1', // Notice: public site still shows version 1 (18,000 EGP), while version 2 (16,000 EGP) is pending review!
    created_at: '2026-07-01T09:00:00Z',
    updated_at: '2026-08-28T16:00:00Z',
    versions: [
      {
        id: 'ver-103-1',
        property_id: 'prop-103',
        version_number: 1,
        title: 'محل تجاري للإيجار بموقع حيوي على شارع الجيش بدسوق',
        description: 'محل تجاري مميز وواجهة عريضة 6 متر وارتفاع 4 متر، يصلح لجميع الأنشطة التجارية (صيدلية، ملابس، توكيل). مجهز بعداد تجاري ودورة مياه وسيراميك كامل.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-2',
        area_id: 'area-202',
        public_location_text: 'شارع الجيش الرئيسي - دسوق بالقرب من البنوك',
        private_address: 'شارع الجيش، عمارة الأطباء، المحل القبلي رقم 2',
        price: 18000,
        area_sqm: 65,
        bathrooms: 1,
        floor: 'أرضي تجاري',
        finishing: 'سوبر لوكس',
        features: ['واجهة زجاجية سيكوريت', 'عداد كهرباء تجاري 3 فاز', 'مياه وصرف خاص', 'موقع ذو كثافة مرورية عالية'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-07-01T09:30:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-07-02T12:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-07-01T09:00:00Z',
        updated_at: '2026-07-02T12:00:00Z',
        media: [
          {
            id: 'med-103-1',
            property_version_id: 'ver-103-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-07-01T09:05:00Z'
          },
          {
            id: 'med-103-2',
            property_version_id: 'ver-103-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-07-01T09:05:00Z'
          }
        ]
      },
      {
        id: 'ver-103-2',
        property_id: 'prop-103',
        version_number: 2,
        title: 'محل تجاري للإيجار بموقع حيوي على شارع الجيش بدسوق - تخفيض السعر',
        description: 'محل تجاري مميز وواجهة عريضة 6 متر وارتفاع 4 متر، يصلح لجميع الأنشطة التجارية (صيدلية، ملابس، براند). مجهز بعداد تجاري ودورة مياه وسيراميك كامل مع فترة سماح للتجهيز شهر كامل.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-2',
        area_id: 'area-202',
        public_location_text: 'شارع الجيش الرئيسي - دسوق بالقرب من البنوك والتوكيلات',
        private_address: 'شارع الجيش، عمارة الأطباء، المحل القبلي رقم 2',
        price: 16000, // Reduced from 18,000 to 16,000 in proposed revision!
        area_sqm: 65,
        bathrooms: 1,
        floor: 'أرضي تجاري',
        finishing: 'سوبر لوكس',
        features: ['واجهة زجاجية سيكوريت', 'عداد كهرباء تجاري 3 فاز', 'مياه وصرف خاص', 'موقع ذو كثافة مرورية عالية', 'فترة سماح للتجهيز'],
        version_status: 'PENDING',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-08-28T16:00:00Z',
        created_at: '2026-08-28T15:30:00Z',
        updated_at: '2026-08-28T16:00:00Z',
        media: [
          {
            id: 'med-103-2-1',
            property_version_id: 'ver-103-2',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-08-28T15:35:00Z'
          },
          {
            id: 'med-103-2-2',
            property_version_id: 'ver-103-2',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-08-28T15:35:00Z'
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'prop-104',
    reference_number: 'RAW-KFS-000004',
    seller_id: 'user-broker-1',
    property_type_id: 'type-apt',
    transaction_type_id: 'tx-rent',
    current_status: 'PENDING_REVIEW',
    current_published_version_id: null,
    created_at: '2026-08-31T14:00:00Z',
    updated_at: '2026-08-31T14:30:00Z',
    versions: [
      {
        id: 'ver-104-1',
        property_id: 'prop-104',
        version_number: 1,
        title: 'شقة مفروشة للإيجار السنوي بمنطقة المحاربين الجديدة كفر الشيخ',
        description: 'شقة مفروشة بالكامل فرش راقي وجديد، تكييفات لجميع الغرف، أجهزة كهربائية كاملة وشاشة سمارت. تناسب المهندسين أو الشركات أو العائلات الراقية. قريبة جدا من الجامعة والنوادي.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-104',
        public_location_text: 'منطقة المحاربين الجديدة - كفر الشيخ خلف مديرية الأمن',
        private_address: 'برج الزهور، شارع 10، الدور الثالث علوي',
        price: 8500,
        area_sqm: 135,
        bedrooms: 3,
        bathrooms: 1,
        floor: 'الدور الثالث',
        finishing: 'سوبر لوكس',
        features: ['مفروشة بالكامل', 'مكيفة بالكامل', 'غاز طبيعي', 'إنترنت سريع', 'مصعد شغال'],
        version_status: 'PENDING',
        submitted_by: 'user-broker-1',
        submitted_at: '2026-08-31T14:30:00Z',
        created_at: '2026-08-31T14:00:00Z',
        updated_at: '2026-08-31T14:30:00Z',
        media: [
          {
            id: 'med-104-1',
            property_version_id: 'ver-104-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-08-31T14:05:00Z'
          },
          {
            id: 'med-104-2',
            property_version_id: 'ver-104-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-08-31T14:05:00Z'
          },
          {
            id: 'med-104-3',
            property_version_id: 'ver-104-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-08-31T14:05:00Z'
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'prop-105',
    reference_number: 'RAW-KFS-000005',
    seller_id: 'user-owner-1',
    property_type_id: 'type-land',
    transaction_type_id: 'tx-sale',
    current_status: 'REJECTED',
    current_published_version_id: null,
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-21T11:00:00Z',
    versions: [
      {
        id: 'ver-105-1',
        property_id: 'prop-105',
        version_number: 1,
        title: 'قطعة أرض مباني مرخصة بشارع الخليفة المأمون',
        description: 'قطعة أرض فضاء مساحة 200 متر على شارع رئيسي عرض 12 متر. كردون مباني ومسجلة شهر عقاري وجاهزة للبناء الفوري.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-105',
        public_location_text: 'شارع الخليفة المأمون - كفر الشيخ',
        private_address: 'خلف برج التحرير، قطعة أرض رقم 45',
        price: 3400000,
        area_sqm: 200,
        version_status: 'REJECTED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-08-20T10:30:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-08-21T11:00:00Z',
        review_decision: 'REJECTED',
        rejection_reason: 'الصور المرفوعة غير واضحة لقطعة الأرض وحدودها، كما نرجو توضيح ترخيص الشارع وإعادة إرسال الصور بوضوح نهاراً.',
        created_at: '2026-08-20T10:00:00Z',
        updated_at: '2026-08-21T11:00:00Z',
        media: [
          {
            id: 'med-105-1',
            property_version_id: 'ver-105-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 524288,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-08-20T10:05:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-105-1',
        property_id: 'prop-105',
        property_version_id: 'ver-105-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'REJECTED',
        reason: 'الصور المرفوعة غير واضحة لقطعة الأرض وحدودها، كما نرجو توضيح ترخيص الشارع وإعادة إرسال الصور بوضوح نهاراً.',
        internal_note: 'تم التواصل مع المالك وأبدى استعداده لإرسال صور واضحة غداً.',
        created_at: '2026-08-21T11:00:00Z'
      }
    ]
  },
  {
    id: 'prop-106',
    reference_number: 'RAW-KFS-000006',
    seller_id: 'user-owner-1',
    property_type_id: 'type-apt',
    transaction_type_id: 'tx-sale',
    current_status: 'DRAFT',
    current_published_version_id: null,
    created_at: '2026-09-01T06:00:00Z',
    updated_at: '2026-09-01T06:30:00Z',
    versions: [
      {
        id: 'ver-106-1',
        property_id: 'prop-106',
        version_number: 1,
        title: 'شقة للبيع بمنطقة القنطرة البيضاء (مسودة)',
        description: 'شقة نصف تشطيب مساحة 120 متر، الدور الثاني، واجهة بحرية غير مجروحة.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-103',
        public_location_text: 'القنطرة البيضاء - كفر الشيخ',
        private_address: 'شارع السلام، عمارة 12',
        price: 950000,
        area_sqm: 120,
        bedrooms: 2,
        bathrooms: 1,
        floor: 'الدور الثاني',
        finishing: 'نصف تشطيب',
        features: ['واجهة بحرية', 'عداد كهرباء قديم'],
        version_status: 'DRAFT',
        submitted_by: 'user-owner-1',
        submitted_at: null,
        created_at: '2026-09-01T06:00:00Z',
        updated_at: '2026-09-01T06:30:00Z',
        media: []
      }
    ],
    reviews: []
  },
  {
    id: 'prop-107',
    reference_number: 'RAW-KFS-000007',
    seller_id: 'user-owner-1',
    property_type_id: 'type-apt',
    transaction_type_id: 'tx-rent',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-107-1',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-01T09:00:00Z',
    versions: [
      {
        id: 'ver-107-1',
        property_id: 'prop-107',
        version_number: 1,
        title: 'شقة مفروشة راقية للإيجار الشهري بشارع الخليفة المأمون',
        description: 'شقة سكنية مفروشة بالكامل بأرقى مناطق كفر الشيخ، موقع متميز بجوار مجمع الخدمات والمدارس، مكيفة بالكامل مع مصعد وأمن على مدار الساعة.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-105',
        public_location_text: 'شارع الخليفة المأمون - مدينة كفر الشيخ',
        private_address: 'برج الأندلس - الدور الخامس شقة 502',
        price: 6500,
        area_sqm: 135,
        bedrooms: 3,
        bathrooms: 2,
        floor: 'الدور الخامس',
        finishing: 'ألترا سوبر لوكس',
        features: ['فرش فاخر', 'مكيفة بالكامل', 'مصعد حديث', 'غاز طبيعي', 'حراسة 24 ساعة', 'إنترنت فايبر'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T08:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T09:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T08:00:00Z',
        updated_at: '2026-09-01T09:00:00Z',
        media: [
          {
            id: 'med-107-1',
            property_version_id: 'ver-107-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T08:10:00Z'
          },
          {
            id: 'med-107-2',
            property_version_id: 'ver-107-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T08:10:00Z'
          },
          {
            id: 'med-107-3',
            property_version_id: 'ver-107-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-09-01T08:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-107-1',
        property_id: 'prop-107',
        property_version_id: 'ver-107-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'تمت معاينة الشقة والتأكد من جودة الفرش وصحة العقود القانونية والترخيص.',
        created_at: '2026-09-01T09:00:00Z'
      }
    ]
  },
  {
    id: 'prop-108',
    reference_number: 'RAW-KFS-000008',
    seller_id: 'user-owner-1',
    property_type_id: 'type-villa',
    transaction_type_id: 'tx-rent',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-108-1',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T11:00:00Z',
    versions: [
      {
        id: 'ver-108-1',
        property_id: 'prop-108',
        version_number: 1,
        title: 'فيلا فخمة للإيجار السكني أو الإداري بحي الأطباء كفر الشيخ',
        description: 'فيلا مستقلة طابقين وحديقة خاصة وموقف سيارات خاص، تصلح مقراً لشركة كبرى أو عيادات أو سكن عائلي راقٍ، موقع استراتيجي هادئ.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-106',
        public_location_text: 'حي الأطباء والـ 47 - كفر الشيخ',
        private_address: 'شارع الزهور فيلا 9',
        price: 25000,
        area_sqm: 420,
        bedrooms: 6,
        bathrooms: 4,
        floor: 'طابقين مع حديقة',
        finishing: 'ألترا سوبر لوكس',
        features: ['حديقة خاصة 150م', 'كراج خاص لـ 3 سيارات', 'واجهة مودرن', 'مدخل رخام ملكي', 'كاميرات مراقبة', 'تكييف مركزي جزئي'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T10:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T11:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T11:00:00Z',
        media: [
          {
            id: 'med-108-1',
            property_version_id: 'ver-108-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T10:10:00Z'
          },
          {
            id: 'med-108-2',
            property_version_id: 'ver-108-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T10:10:00Z'
          },
          {
            id: 'med-108-3',
            property_version_id: 'ver-108-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-09-01T10:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-108-1',
        property_id: 'prop-108',
        property_version_id: 'ver-108-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'الفيلا مطابقة لكافة المعايير الهندسية ومعتمدة رسمياً.',
        created_at: '2026-09-01T11:00:00Z'
      }
    ]
  },
  {
    id: 'prop-109',
    reference_number: 'RAW-KFS-000009',
    seller_id: 'user-owner-1',
    property_type_id: 'type-duplex',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-109-1',
    created_at: '2026-09-01T11:30:00Z',
    updated_at: '2026-09-01T12:30:00Z',
    versions: [
      {
        id: 'ver-109-1',
        property_id: 'prop-109',
        version_number: 1,
        title: 'دوبلكس فاخر مع روف خاص وتراس بانوراما بمنطقة المحاربين الجديدة',
        description: 'دوبلكس مساحة 280م² (الدور الخامس والسادس مع روف خاص)، سلم داخلي خشب زان، إطلالة مفتوحة وموقع استثنائي بالقرب من جميع المحاور الرئيسية.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-104',
        public_location_text: 'منطقة المحاربين الجديدة - كفر الشيخ',
        private_address: 'برج النخبة شارع النصر',
        price: 3200000,
        area_sqm: 280,
        bedrooms: 4,
        bathrooms: 3,
        floor: 'الدور الخامس والسادس + روف',
        finishing: 'ألترا سوبر لوكس',
        features: ['روف خاص مجهز', 'سلم داخلي خشب زان', 'أرضيات باركيه مستورد', 'حصة بالأرض والكراج', 'مصعد ميتسوبيشي', 'عدادات منفصلة'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T11:45:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T12:30:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T11:30:00Z',
        updated_at: '2026-09-01T12:30:00Z',
        media: [
          {
            id: 'med-109-1',
            property_version_id: 'ver-109-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T11:40:00Z'
          },
          {
            id: 'med-109-2',
            property_version_id: 'ver-109-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T11:40:00Z'
          },
          {
            id: 'med-109-3',
            property_version_id: 'ver-109-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-09-01T11:40:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-109-1',
        property_id: 'prop-109',
        property_version_id: 'ver-109-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'عقار قانوني مميز مع رخصة بناء كاملة ومطابقة على الطبيعة.',
        created_at: '2026-09-01T12:30:00Z'
      }
    ]
  },
  {
    id: 'prop-110',
    reference_number: 'RAW-KFS-000010',
    seller_id: 'user-owner-1',
    property_type_id: 'type-chalet',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-110-1',
    created_at: '2026-09-01T13:00:00Z',
    updated_at: '2026-09-01T14:00:00Z',
    versions: [
      {
        id: 'ver-110-1',
        property_id: 'prop-110',
        version_number: 1,
        title: 'شاليه صف أول مباشر على البحر بمصيف بلطيم شاطئ النرجس',
        description: 'شاليه مميز جداً بإطلالة بانورامية كاملة على شاطئ البحر الأبيض المتوسط مباشرة، تشطيب حديث، جاهز للتسليم الفوري والاستمتاع بالمصيف أو الاستثمار السياحي.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-5',
        area_id: 'area-301',
        public_location_text: 'شاطئ النرجس - مصيف بلطيم',
        private_address: 'كورنيش النرجس عمارة الأمل شاليه 3',
        price: 1450000,
        area_sqm: 95,
        bedrooms: 2,
        bathrooms: 1,
        floor: 'الدور الأول فوق الأرضي',
        finishing: 'سوبر لوكس',
        features: ['صف أول على البحر مباشرة', 'بلكونة كبيرة بإطلالة بحرية', 'مجهز بالكامل بالأثاث', 'مسجل ومرخص', 'عائد استثماري صيفي مرتفع'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T13:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T14:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T13:00:00Z',
        updated_at: '2026-09-01T14:00:00Z',
        media: [
          {
            id: 'med-110-1',
            property_version_id: 'ver-110-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T13:10:00Z'
          },
          {
            id: 'med-110-2',
            property_version_id: 'ver-110-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T13:10:00Z'
          },
          {
            id: 'med-110-3',
            property_version_id: 'ver-110-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 3,
            is_cover: false,
            created_at: '2026-09-01T13:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-110-1',
        property_id: 'prop-110',
        property_version_id: 'ver-110-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'الشاليه مسجل بمجلس مدينة بلطيم ومطابق لتقرير المعاينة الهندسية.',
        created_at: '2026-09-01T14:00:00Z'
      }
    ]
  },
  {
    id: 'prop-111',
    reference_number: 'RAW-KFS-000011',
    seller_id: 'user-owner-1',
    property_type_id: 'type-land',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-111-1',
    created_at: '2026-09-01T14:30:00Z',
    updated_at: '2026-09-01T15:30:00Z',
    versions: [
      {
        id: 'ver-111-1',
        property_id: 'prop-111',
        version_number: 1,
        title: 'قطعة أرض مباني مميزة 240م² وجهة بحرية بحي المهندسين',
        description: 'قطعة أرض مباني داخل الحيز العمراني المعتمد بحي المهندسين بكفر الشيخ، واجهة 14 متر على شارع 12 متر، صالحة للبناء الفوري لبرج سكني أو فيلا، كاملة المرافق.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-101',
        public_location_text: 'حي المهندسين - كفر الشيخ',
        private_address: 'شارع المهندسين الرئيسي قطعة 45',
        price: 4300000,
        area_sqm: 240,
        bedrooms: 0,
        bathrooms: 0,
        floor: 'أرض فضاء للبناء',
        finishing: 'أرض فضاء',
        features: ['داخل الحيز العمراني', 'رخصة بناء سارية', 'واجهة 14 متر', 'شارع رئيسي 12م', 'كاملة المرافق (مياه، كهرباء، صرف، غاز)', 'مسجلة شهر عقاري'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T14:45:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T15:30:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T14:30:00Z',
        updated_at: '2026-09-01T15:30:00Z',
        media: [
          {
            id: 'med-111-1',
            property_version_id: 'ver-111-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T14:40:00Z'
          },
          {
            id: 'med-111-2',
            property_version_id: 'ver-111-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T14:40:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-111-1',
        property_id: 'prop-111',
        property_version_id: 'ver-111-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'تم فحص الكروكي المساحي ومطابقة إحداثيات قطعة الأرض على الخريطة التخطيطية.',
        created_at: '2026-09-01T15:30:00Z'
      }
    ]
  },
  {
    id: 'prop-112',
    reference_number: 'RAW-KFS-000012',
    seller_id: 'user-owner-1',
    property_type_id: 'type-shop',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-112-1',
    created_at: '2026-09-01T16:00:00Z',
    updated_at: '2026-09-01T17:00:00Z',
    versions: [
      {
        id: 'ver-112-1',
        property_id: 'prop-112',
        version_number: 1,
        title: 'محل تجاري تمليك واجهة 8م بموقع حيوي وسط مدينة كفر الشيخ',
        description: 'محل تجاري مساحة 65م² بواجهة زجاجية سيكوريت عريضة على شارع تجاري رئيسي عالي الكثافة المرورية، يصلح لكافة الأنشطة (صيدلية، بنك، توكيل ملابس، مطعم وكافيه).',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-102',
        public_location_text: 'منطقة سخا والمحطة التجارية - كفر الشيخ',
        private_address: 'شارع المحطة التجاري برج الصفا محل 2',
        price: 3650000,
        area_sqm: 65,
        bedrooms: 0,
        bathrooms: 1,
        floor: 'الدور الأرضي مرتفع',
        finishing: 'سوبر لوكس',
        features: ['واجهة سيكوريت 8م', 'عداد تجاري 3 فاز', 'حمام خاص', 'رخصة تجارية سارية', 'كثافة تجارية عالية'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T16:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T17:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T16:00:00Z',
        updated_at: '2026-09-01T17:00:00Z',
        media: [
          {
            id: 'med-112-1',
            property_version_id: 'ver-112-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T16:10:00Z'
          },
          {
            id: 'med-112-2',
            property_version_id: 'ver-112-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T16:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-112-1',
        property_id: 'prop-112',
        property_version_id: 'ver-112-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'الرخصة التجارية معتمدة والعقار جاهز للتسليم والتشغيل.',
        created_at: '2026-09-01T17:00:00Z'
      }
    ]
  },
  {
    id: 'prop-113',
    reference_number: 'RAW-KFS-000013',
    seller_id: 'user-owner-1',
    property_type_id: 'type-office',
    transaction_type_id: 'tx-rent',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-113-1',
    created_at: '2026-09-01T17:30:00Z',
    updated_at: '2026-09-01T18:30:00Z',
    versions: [
      {
        id: 'ver-113-1',
        property_id: 'prop-113',
        version_number: 1,
        title: 'عيادة ومقر إداري مجهز ببرج الأطباء شارع الخليفة المأمون',
        description: 'مقر إداري مجهز كعيادة طبية أو مكتب استشارات هندسية / قانونية، مقسم إلى ريسبشن استقبال واسع وغرفتي كشف ومكتب، مجهز بوصلات الشبكات والتكييفات.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-1',
        area_id: 'area-105',
        public_location_text: 'شارع الخليفة المأمون - كفر الشيخ',
        private_address: 'برج الأطباء التخصصي - الدور الثاني مكتب 204',
        price: 8500,
        area_sqm: 110,
        bedrooms: 3,
        bathrooms: 2,
        floor: 'الدور الثاني إداري',
        finishing: 'ألترا سوبر لوكس',
        features: ['برج إداري مخصص', '2 مصعد للمرضى والعملاء', 'استراحة انتظار واسعة', 'إنترنت فايبر', 'موقع استراتيجي معروف'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T17:45:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T18:30:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T17:30:00Z',
        updated_at: '2026-09-01T18:30:00Z',
        media: [
          {
            id: 'med-113-1',
            property_version_id: 'ver-113-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T17:40:00Z'
          },
          {
            id: 'med-113-2',
            property_version_id: 'ver-113-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T17:40:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-113-1',
        property_id: 'prop-113',
        property_version_id: 'ver-113-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'الترخيص الإداري ساري والبرج متوافق مع اشتراطات السلامة والعيادات.',
        created_at: '2026-09-01T18:30:00Z'
      }
    ]
  },
  {
    id: 'prop-114',
    reference_number: 'RAW-KFS-000014',
    seller_id: 'user-owner-1',
    property_type_id: 'type-building',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-114-1',
    created_at: '2026-09-01T19:00:00Z',
    updated_at: '2026-09-01T20:00:00Z',
    versions: [
      {
        id: 'ver-114-1',
        property_id: 'prop-114',
        version_number: 1,
        title: 'عمارة سكنية وتجارية كاملة 5 أدوار بكورنيش دسوق ومجمع البنوك',
        description: 'فرصة استثمارية نادرة: عمارة قائمة 5 أدوار على مساحة أرض 200م² بكورنيش النيل بدسوق، الدور الأرضي محلات تجارية مؤجرة، و8 شقق سكنية بعائد شهري مجزٍ جداً.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-2',
        area_id: 'area-202',
        public_location_text: 'شارع الجيش والكورنيش - دسوق',
        private_address: 'شارع الجيش عمارة 18 ناصية',
        price: 7800000,
        area_sqm: 1000,
        bedrooms: 16,
        bathrooms: 10,
        floor: 'مبنى كامل (أرضي + 4 أدوار متكررة)',
        finishing: 'سوبر لوكس بالكامل',
        features: ['عمارة كاملة ناصية', 'محلات تجارية بالأرضي', 'عائد إيجاري شهري مرتفع', 'رخصة بناء كاملة', 'مسجلة شهر عقاري', 'إطلالة نيلية'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T19:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T20:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T19:00:00Z',
        updated_at: '2026-09-01T20:00:00Z',
        media: [
          {
            id: 'med-114-1',
            property_version_id: 'ver-114-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T19:10:00Z'
          },
          {
            id: 'med-114-2',
            property_version_id: 'ver-114-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T19:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-114-1',
        property_id: 'prop-114',
        property_version_id: 'ver-114-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'تمت مراجعة العقود وسندات الملكية والرخصة الرسمية وكافة المرافق.',
        created_at: '2026-09-01T20:00:00Z'
      }
    ]
  },
  {
    id: 'prop-115',
    reference_number: 'RAW-KFS-000015',
    seller_id: 'user-owner-1',
    property_type_id: 'type-chalet',
    transaction_type_id: 'tx-rent',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-115-1',
    created_at: '2026-09-01T20:30:00Z',
    updated_at: '2026-09-01T21:30:00Z',
    versions: [
      {
        id: 'ver-115-1',
        property_id: 'prop-115',
        version_number: 1,
        title: 'شاليه مجهز للإيجار اليومي والموسمي بشاطئ الأمل بلطيم',
        description: 'شاليه عائلي فاخر قريب جداً من الشاطئ (خطوات للبحر)، مكيف بالكامل مع شاشة ذكية وإنترنت ومطبخ مجهز، موقع هادئ وخدمات متكاملة.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-5',
        area_id: 'area-302',
        public_location_text: 'شاطئ الأمل - مصيف بلطيم',
        private_address: 'شارع النخيل شاليه رقم 14',
        price: 1200,
        area_sqm: 85,
        bedrooms: 2,
        bathrooms: 1,
        floor: 'الدور الأرضي بحديقة صغيرة',
        finishing: 'سوبر لوكس',
        features: ['قريب من البحر', 'حديقة خاصة صغيرة', 'مكيف بالكامل', 'فرش فندقي نظيف', 'مطبخ وأجهزة حديثة'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T20:45:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T21:30:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T20:30:00Z',
        updated_at: '2026-09-01T21:30:00Z',
        media: [
          {
            id: 'med-115-1',
            property_version_id: 'ver-115-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T20:40:00Z'
          },
          {
            id: 'med-115-2',
            property_version_id: 'ver-115-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T20:40:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-115-1',
        property_id: 'prop-115',
        property_version_id: 'ver-115-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'الشاليه مؤهل للإيجار الفندقي والموسمي بامتياز.',
        created_at: '2026-09-01T21:30:00Z'
      }
    ]
  },
  {
    id: 'prop-116',
    reference_number: 'RAW-KFS-000016',
    seller_id: 'user-owner-1',
    property_type_id: 'type-office',
    transaction_type_id: 'tx-sale',
    current_status: 'PUBLISHED',
    current_published_version_id: 'ver-116-1',
    created_at: '2026-09-01T22:00:00Z',
    updated_at: '2026-09-01T23:00:00Z',
    versions: [
      {
        id: 'ver-116-1',
        property_id: 'prop-116',
        version_number: 1,
        title: 'مكتب إداري تمليك فاخر بإطلالة نيلية ساحرة بكورنيش فوه',
        description: 'مكتب إداري تمليك مساحة 85م² بإطلالة مباشرة على فرع رشيد لنهر النيل بمدينة فوه الأثرية، مناسب للشركات، المكاتب الهندسية ومكاتب المحاسبة والخدمات.',
        governorate_id: 'gov-kfs',
        city_id: 'city-kfs-3',
        area_id: 'area-401',
        public_location_text: 'كورنيش النيل بفوه والآثار - فوه',
        private_address: 'كورنيش النيل برج النيل الدور الثالث',
        price: 1350000,
        area_sqm: 85,
        bedrooms: 2,
        bathrooms: 1,
        floor: 'الدور الثالث',
        finishing: 'سوبر لوكس',
        features: ['إطلالة مباشرة على نهر النيل', 'موقع استراتيجي وسط المرافق', 'مصعد حديث', 'حصة في الأرض', 'رخصة إدارية'],
        version_status: 'APPROVED',
        submitted_by: 'user-owner-1',
        submitted_at: '2026-09-01T22:15:00Z',
        reviewed_by: 'user-reviewer-1',
        reviewed_at: '2026-09-01T23:00:00Z',
        review_decision: 'APPROVED',
        created_at: '2026-09-01T22:00:00Z',
        updated_at: '2026-09-01T23:00:00Z',
        media: [
          {
            id: 'med-116-1',
            property_version_id: 'ver-116-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 1,
            is_cover: true,
            created_at: '2026-09-01T22:10:00Z'
          },
          {
            id: 'med-116-2',
            property_version_id: 'ver-116-1',
            media_type: 'IMAGE',
            path: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
            mime_type: 'image/jpeg',
            file_size: 1048576,
            sort_order: 2,
            is_cover: false,
            created_at: '2026-09-01T22:10:00Z'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-116-1',
        property_id: 'prop-116',
        property_version_id: 'ver-116-1',
        reviewer_id: 'user-reviewer-1',
        reviewer_name: 'م. كريم عادل (مراجع عقارات)',
        decision: 'APPROVED',
        internal_note: 'المكتب معتمد ومرخص إدارياً وجاهز للتنازل الفوري.',
        created_at: '2026-09-01T23:00:00Z'
      }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    reference_number: 'LEAD-000001',
    customer_id: 'user-cust-1',
    customer_name: 'أحمد مصطفى',
    customer_mobile: '01123456789',
    customer_email: 'customer@example.com',
    property_id: 'prop-101',
    property_reference: 'RAW-KFS-000001',
    property_title: 'شقة فاخرة بحي المهندسين تشطيب ألترا سوبر لوكس إطلالة مفتوحة',
    status: 'WHATSAPP_CONTACT_INITIATED',
    source: 'Website Detail Page',
    contact_channel: 'WHATSAPP',
    assigned_to: 'user-sales-1',
    assigned_user_name: 'سارة يوسف (مسؤول مبيعات)',
    last_activity_at: '2026-08-30T16:45:00Z',
    created_at: '2026-08-30T16:45:00Z',
    activities: [
      {
        id: 'act-1',
        lead_id: 'lead-001',
        activity_type: 'CREATED',
        channel: 'WHATSAPP',
        description: 'تم إنشاء الطلب آلياً عند ضغط العميل على زر الواتساب للعقار RAW-KFS-000001',
        created_by: 'user-cust-1',
        created_by_name: 'أحمد مصطفى',
        created_at: '2026-08-30T16:45:00Z'
      },
      {
        id: 'act-2',
        lead_id: 'lead-001',
        activity_type: 'WHATSAPP_CONTACT_INITIATED',
        channel: 'WHATSAPP',
        description: 'بدء المحادثة عبر واتساب من خلال روابط مع نص الاستفسار المعتمد',
        created_by: 'user-cust-1',
        created_by_name: 'أحمد مصطفى',
        created_at: '2026-08-30T16:45:00Z'
      }
    ],
    notes: [
      {
        id: 'note-1',
        lead_id: 'lead-001',
        user_id: 'user-sales-1',
        user_name: 'سارة يوسف',
        body: 'العميل مهتم بالشراء كاش ومستعد لمعاينة العقار يوم الخميس القادم بعد الظهر.',
        created_at: '2026-08-31T10:15:00Z'
      }
    ]
  },
  {
    id: 'lead-002',
    reference_number: 'LEAD-000002',
    customer_id: 'user-cust-1',
    customer_name: 'أحمد مصطفى',
    customer_mobile: '01123456789',
    customer_email: 'customer@example.com',
    property_id: 'prop-102',
    property_reference: 'RAW-KFS-000002',
    property_title: 'فيلا مستقلة راقية بسخا مع حديقة خاصة ومدخل سيارة',
    status: 'FOLLOW_UP',
    source: 'Website Detail Page',
    contact_channel: 'CALL',
    assigned_to: 'user-sales-1',
    assigned_user_name: 'سارة يوسف (مسؤول مبيعات)',
    last_activity_at: '2026-09-01T06:00:00Z',
    created_at: '2026-08-29T11:20:00Z',
    activities: [
      {
        id: 'act-3',
        lead_id: 'lead-002',
        activity_type: 'CREATED',
        channel: 'CALL',
        description: 'تم إنشاء الطلب عند ضغط العميل على زر الاتصال الهاتفي بروابط',
        created_by: 'user-cust-1',
        created_by_name: 'أحمد مصطفى',
        created_at: '2026-08-29T11:20:00Z'
      },
      {
        id: 'act-4',
        lead_id: 'lead-002',
        activity_type: 'STATUS_CHANGED',
        description: 'تم تغيير حالة الطلب من اتصال مبدئي إلى متابعة بعد التحدث مع العميل هاتفياً',
        created_by: 'user-sales-1',
        created_by_name: 'سارة يوسف',
        created_at: '2026-08-29T12:00:00Z'
      }
    ],
    notes: [
      {
        id: 'note-2',
        lead_id: 'lead-002',
        user_id: 'user-sales-1',
        user_name: 'سارة يوسف',
        body: 'تم التوضيح للعميل بأن الفيلا مسجلة وأن السعر قابل للتفاوض البسيط مع المالك.',
        created_at: '2026-08-29T12:05:00Z'
      }
    ]
  }
];

export const INITIAL_SETTINGS: SystemSetting = {
  site_name: 'روابط | منصة الوساطة العقارية الموثوقة',
  primary_color: '#059669', // Emerald 600
  secondary_color: '#0f172a', // Slate 900
  primary_phone: '01000920759', // Official BRD/SRS contact number 1
  secondary_phone: '01000920749', // Official BRD/SRS contact number 2
  primary_whatsapp: '201000920759',
  secondary_whatsapp: '201000920749',
  whatsapp_phone: '01000920759',
  official_address: 'كفر الشيخ، حي المحافظة، أمام ديوان عام المحافظة',
  support_email: 'contact@rawabet-eg.com',
  home_headline_ar: 'عقارك المناسب في كفر الشيخ أقرب مما تتخيل',
  home_description_ar: 'منصة رقمية موثوقة للوساطة العقارية. جميع العقارات يتم مراجعتها وتوثيقها من فريق روابط لضمان أفضل تجربة بيع وشراء وإيجار بأمان تام.',
  privacy_policy_ar: `نحن في منصة "روابط" نلتزم بحماية خصوصية جميع المستخدمين سواء كانوا ملاكاً، وسطاء، أو باحثين عن عقارات.
1. سرية بيانات البائعين: لا يتم نشر أرقام هواتف الملاك أو الوسطاء أو عناوينهم التفصيلية إطلاقاً على الواجهات العامة.
2. دور روابط كوسيط معتمد: تتم كافة المعاينات والتواصل عبر فريق مبيعات روابط لحماية الطرفين وضمان الجدية.
3. معالجة البيانات: تُستخدم بيانات الاتصال المسجلة فقط لتوثيق الحسابات ومتابعة الطلبات ولن يتم بيعها أو مشاركتها مع أي طرف خارجي.`,
  terms_ar: `شروط الاستخدام لمنصة روابط للوساطة العقارية:
1. يلتزم المالك والوسيط بتقديم بيانات صحيحة ودقيقة وصور حقيقية ومحدثة للعقار.
2. يمنع منعاً باتاً إدراج أرقام تليفونات أو روابط خارجية أو وسائل تواصل في نص الوصف أو العنوان.
3. يخضع كل عقار للمراجعة والتدقيق الإداري من قبل فريق روابط قبل اعتماده للنشر للجمهور.
4. تحتفظ إدارة روابط بحق رفض أو طلب تعديل أي عقار لا يستوفي معايير الجودة ومحددات الموقع.`,
  about_ar: `منصة "روابط" هي المنصة الرقمية الأولى المتخصصة في الوساطة العقارية الموثوقة بمحافظة كفر الشيخ. تأسست لتقديم تجربة عقارية احترافية وسلسة تربط بين العرض والطلب بأعلى معايير الشفافية والأمان والسرعة.`,
  updated_at: '2026-01-01T00:00:00Z'
};

export const INITIAL_HELP_RESOURCES: HelpResource[] = [
  {
    id: 'help-1',
    title: 'دليل المالك والوسيط: كيفية تصوير ورفع العقار باحترافية وسرعة اعتماده',
    resource_type: 'PDF',
    path: '/documents/rawabet-seller-guide.pdf',
    url: '#',
    content_ar: `نصائح مهمة لضمان سرعة قبول عقارك على منصة روابط:
1. التقط الصور نهاراً في إضاءة طبيعية واضحة تبرز مساحة الغرف والريسبشن.
2. احرص على تصوير الواجهة الخارجية ومدخل العمارة والشارع العام.
3. تجنب وضع علامات مائية أو أرقام هواتف على الصور لضمان عدم رفضها.
4. اذكر كافة المواصفات بدقة (المساحة، الأدوار، التشطيب، العدادات، التراخيص).
5. حدد موقع العقار بدقة (المحافظة والمركز والحي) مع العنوان الخاص لفريق التفتيش.`,
    is_active: true,
    sort_order: 1
  },
  {
    id: 'help-2',
    title: 'فيديو توضيحي: خطوات توثيق الحساب وإرسال التعديلات للمراجعة',
    resource_type: 'YOUTUBE',
    url: 'https://youtube.com',
    content_ar: 'شرح مرئي مبسط لآلية نظام النسخ (Versioning) وكيف تحافظ على عقارك منشوراً أثناء إرسال تعديل جديد.',
    is_active: true,
    sort_order: 2
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    actor_id: 'user-admin-1',
    actor_name: 'إدارة روابط',
    actor_role: 'SUPER_ADMIN',
    action: 'SYSTEM_INITIALIZATION',
    entity_type: 'SYSTEM',
    entity_id: 'SYSTEM_SETTINGS',
    old_value: null,
    new_value: 'تهيئة النظام وتعيين أرقام التواصل 01000920759 / 01000920749 وتفعيل كفر الشيخ',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'aud-002',
    actor_id: 'user-reviewer-1',
    actor_name: 'م. كريم عادل',
    actor_role: 'PROPERTY_REVIEWER',
    action: 'PROPERTY_APPROVED',
    entity_type: 'PROPERTY',
    entity_id: 'prop-101',
    field_name: 'current_status',
    old_value: 'PENDING_REVIEW',
    new_value: 'PUBLISHED',
    created_at: '2026-05-12T14:30:00Z'
  },
  {
    id: 'aud-003',
    actor_id: 'user-reviewer-1',
    actor_name: 'م. كريم عادل',
    actor_role: 'PROPERTY_REVIEWER',
    action: 'PROPERTY_REJECTED',
    entity_type: 'PROPERTY',
    entity_id: 'prop-105',
    field_name: 'current_status',
    old_value: 'PENDING_REVIEW',
    new_value: 'REJECTED',
    metadata: { reason: 'الصور المرفوعة غير واضحة لقطعة الأرض وحدودها' },
    created_at: '2026-08-21T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'user-owner-1',
    type: 'PROPERTY_APPROVED',
    title: 'تهانينا! تمت الموافقة على عقارك',
    body: 'تمت مراجعة ونشر عقارك رقم RAW-KFS-000001 على منصة روابط بنجاح.',
    related_type: 'PROPERTY',
    related_id: 'prop-101',
    read_at: '2026-05-12T15:00:00Z',
    created_at: '2026-05-12T14:30:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-owner-1',
    type: 'PROPERTY_REJECTED',
    title: 'تنبيه: العقار محتاج شوية تعديلات',
    body: 'العقار رقم RAW-KFS-000005 بحاجة لتعديل الصور وإعادة إرساله للمراجعة.',
    related_type: 'PROPERTY',
    related_id: 'prop-105',
    read_at: null,
    created_at: '2026-08-21T11:00:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'user-reviewer-1',
    type: 'PROPERTY_SUBMITTED',
    title: 'عقار جديد قيد المراجعة',
    body: 'تم إرسال العقار رقم RAW-KFS-000004 للمراجعة من قبل الوسيط.',
    related_type: 'PROPERTY',
    related_id: 'prop-104',
    read_at: null,
    created_at: '2026-08-31T14:30:00Z'
  }
];
