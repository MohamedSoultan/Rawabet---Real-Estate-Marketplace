import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Lock, 
  Sparkles,
  ChevronLeft,
  Building2,
  Briefcase
} from 'lucide-react';

export const UsersAndRolesView: React.FC = () => {
  const { currentUser, users, toggleUserStatus, updateUserPermissions, createInternalUser, hasPermission } = useApp();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const canManageUsers = isSuperAdmin || hasPermission('PERM_MANAGE_USERS');

  // Filter accessible users based on hierarchy
  const visibleUsers = useMemo(() => {
    return users;
  }, [users]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(() => visibleUsers[0] || null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New employee / custom role form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRole, setNewRole] = useState<UserRole | 'CUSTOM_ROLE'>('PROPERTY_REVIEWER');
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([
    'PERM_APPROVE_PROPERTIES',
    'PERM_REJECT_PROPERTIES',
    'PERM_VIEW_PRIVATE_SELLER_INFO'
  ]);

  const standardPermissions = [
    { key: 'PERM_APPROVE_PROPERTIES', label: 'اعتماد ونشر العقارات من طابور المراجعة', category: 'العقارات', restrictedToSuper: false },
    { key: 'PERM_REJECT_PROPERTIES', label: 'رفض العقارات وتدوين أسباب الرفض', category: 'العقارات', restrictedToSuper: false },
    { key: 'PERM_VIEW_PRIVATE_SELLER_INFO', label: 'الاطلاع على أرقام هواتف الملاك والعناوين الدقيقة', category: 'الخصوصية', restrictedToSuper: false },
    { key: 'PERM_MANAGE_LEADS', label: 'إدارة وتعيين طلبات المعاينة (Leads CRM)', category: 'المبيعات', restrictedToSuper: false },
    { key: 'PERM_VERIFY_SELLERS', label: 'منح ورفض شارات توثيق البائعين والمكاتب', category: 'التوثيق', restrictedToSuper: false },
    { key: 'PERM_MANAGE_LOCATIONS', label: 'إضافة وتعديل وتفعيل المحافظات والمدن والمناطق', category: 'المواقع', restrictedToSuper: false },
    { key: 'PERM_MANAGE_TAXONOMY', label: 'إدارة أنواع العقارات والمعاملات', category: 'التصنيفات', restrictedToSuper: false },
    { key: 'PERM_MANAGE_USERS', label: 'إدارة المستخدمين وتعيين الأدوار (RBAC)', category: 'المستخدمين', restrictedToSuper: true },
    { key: 'PERM_MANAGE_SYSTEM_SETTINGS', label: 'تعديل أرقام الهواتف الرسمية وإعدادات النظام', category: 'النظام', restrictedToSuper: true },
    { key: 'PERM_VIEW_AUDIT_LOGS', label: 'الاطلاع على سجل التدقيق والعمليات الحساسة', category: 'التدقيق', restrictedToSuper: false },
  ];

  // Filtered users according to search & filter
  const filteredUsers = useMemo(() => {
    return visibleUsers.filter(u => {
      const matchSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile.includes(searchQuery);

      if (!matchSearch) return false;

      if (roleFilter === 'ALL') return true;
      if (roleFilter === 'STAFF') {
        return ['SUPER_ADMIN', 'PROPERTY_REVIEWER', 'SALES_USER', 'OPERATIONS_MANAGER', 'CONTENT_MANAGER'].includes(u.role);
      }
      if (roleFilter === 'SELLERS') {
        return u.seller_profile !== undefined;
      }
      if (roleFilter === 'CUSTOMERS') {
        return u.role === 'CUSTOMER' && !u.seller_profile;
      }
      return u.role === roleFilter;
    });
  }, [visibleUsers, searchQuery, roleFilter]);

  // Keep selected user in sync
  React.useEffect(() => {
    if (selectedUser && !filteredUsers.some(u => u.id === selectedUser.id)) {
      setSelectedUser(filteredUsers[0] || null);
    } else if (!selectedUser && filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
    }
  }, [filteredUsers, selectedUser]);

  // Security barrier if unpermitted
  if (!canManageUsers) {
    return (
      <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900">
          غير مصرح لك بإدارة المستخدمين والأدوار
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
          هذا القسم متاح فقط لمدراء النظام الأعلى (Super Admin) أو المسؤولين الممنوحين لصلاحية <code>PERM_MANAGE_USERS</code>.
        </p>
      </div>
    );
  }

  const handlePermToggle = (user: User, permKey: string) => {
    // Cannot edit Super Admin if not Super Admin
    if (user.role === 'SUPER_ADMIN' && !isSuperAdmin) {
      setToastMsg('عفواً، لا يمكنك تعديل صلاحيات مدير النظام الأعلى.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    const currentPerms = user.custom_permissions || [];
    const updated = currentPerms.includes(permKey)
      ? currentPerms.filter(p => p !== permKey)
      : [...currentPerms, permKey];
    
    updateUserPermissions(user.id, updated);
    setToastMsg(`تم تحديث الصلاحيات بنجاح للمستخدم ${user.name}`);
    setTimeout(() => setToastMsg(null), 3000);
    setSelectedUser({ ...user, custom_permissions: updated });
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newMobile.trim()) return;

    const assignedRole: UserRole = newRole === 'CUSTOM_ROLE' ? 'OPERATIONS_MANAGER' : newRole;

    createInternalUser({
      name: newName.trim(),
      email: newEmail.trim(),
      mobile: newMobile.trim(),
      role: assignedRole,
      account_status: 'ACTIVE',
      custom_permissions: selectedPerms
    });

    const roleName = newRole === 'CUSTOM_ROLE' ? (customRoleTitle || 'دور مخصص') : newRole;
    setToastMsg(`تم إنشاء حساب "${newName}" بصفة (${roleName}) وبصلاحيات مخصصة بنجاح.`);
    setShowCreateModal(false);
    setNewName('');
    setNewEmail('');
    setNewMobile('');
    setCustomRoleTitle('');
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getRoleLabel = (user: User) => {
    if (user.role === 'SUPER_ADMIN') return 'مدير النظام (Super Admin)';
    if (user.role === 'PROPERTY_REVIEWER') return 'مراجع عقارات (Reviewer)';
    if (user.role === 'SALES_USER') return 'مسؤول مبيعات (Sales CRM)';
    if (user.role === 'OPERATIONS_MANAGER') return 'مدير عمليات (Operations)';
    if (user.role === 'CONTENT_MANAGER') return 'مدير محتوى (Content)';
    if (user.seller_profile?.seller_type === 'REAL_ESTATE_OFFICE') return 'مكتب وسيط عقاري';
    if (user.seller_profile?.seller_type === 'INDIVIDUAL_OWNER') return 'مالك عقار فردي';
    return 'عميل مسجل';
  };

  const getRoleBadgeStyle = (user: User) => {
    if (user.role === 'SUPER_ADMIN') return 'bg-purple-100 text-purple-900 border-purple-200';
    if (user.role === 'PROPERTY_REVIEWER') return 'bg-blue-100 text-blue-900 border-blue-200';
    if (user.role === 'SALES_USER') return 'bg-amber-100 text-amber-900 border-amber-200';
    if (user.role === 'OPERATIONS_MANAGER') return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    if (user.seller_profile) return 'bg-teal-100 text-teal-900 border-teal-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Top Controls Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#128c46]" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                إدارة المستخدمين والأدوار المخصصة (RBAC)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
              التحكم بالحسابات، فحص الأذونات الممنوحة، وتعيين الصلاحيات الدقيقة لفريق العمل
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#25d366] hover:bg-[#1eb956] text-slate-950 text-xs sm:text-sm font-black rounded-xl transition shadow-xs whitespace-nowrap active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>+ إضافة مستخدم بدور وصلاحيات</span>
          </button>
        </div>

        {/* Search & Quick Filter Pills */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم، البريد أو الموبايل..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#25d366]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الكل ({visibleUsers.length})
            </button>
            <button
              onClick={() => setRoleFilter('STAFF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'STAFF' ? 'bg-[#128c46] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              فريق العمل الداخلي
            </button>
            <button
              onClick={() => setRoleFilter('PROPERTY_REVIEWER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'PROPERTY_REVIEWER' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المراجعين
            </button>
            <button
              onClick={() => setRoleFilter('SALES_USER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'SALES_USER' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المبيعات (CRM)
            </button>
            <button
              onClick={() => setRoleFilter('SELLERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'SELLERS' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الملاك والمكاتب
            </button>
            <button
              onClick={() => setRoleFilter('CUSTOMERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition cursor-pointer ${
                roleFilter === 'CUSTOMERS' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              العملاء
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center animate-in slide-in-from-top-1 shadow-md">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Grid: User Selector & Permission Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Users List (Left / Col 5) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1">
            <span>قائمة المستخدمين ({filteredUsers.length}):</span>
            <span className="text-slate-400 font-semibold">اختر مستخدماً لمعاينة صلاحياته</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-200 text-slate-500 text-xs font-bold">
                لا يوجد مستخدمين مطابقين لمعايير البحث
              </div>
            ) : (
              filteredUsers.map(u => {
                const isSelected = selectedUser?.id === u.id;
                const isCurrentUser = currentUser?.id === u.id;
                const isSuper = u.role === 'SUPER_ADMIN';

                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-[#128c46] bg-emerald-50/80 shadow-xs ring-1 ring-[#128c46]' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isSuper ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-slate-100 text-slate-900'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{u.name}</h4>
                          {isCurrentUser && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">أنت</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold truncate block dir-ltr text-right">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-md border ${getRoleBadgeStyle(u)}`}>
                        {u.role}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        u.account_status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {u.account_status === 'ACTIVE' ? '● نشط' : '○ معطل'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Roles & Permissions Inspector / Editor (Right / Col 7) */}
        <div className="lg:col-span-7">
          {selectedUser ? (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
              
              {/* User Header Info Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedUser.name}</h3>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${getRoleBadgeStyle(selectedUser)}`}>
                      {getRoleLabel(selectedUser)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">
                    <span>{selectedUser.email}</span> • <span className="dir-ltr">{selectedUser.mobile}</span>
                  </div>
                </div>
                
                {/* Status Toggle Action */}
                <div className="flex items-center gap-2">
                  {/* Super admin cannot be disabled unless by another super admin or prevent disabling the last super admin */}
                  <button
                    disabled={selectedUser.role === 'SUPER_ADMIN' && (!isSuperAdmin || selectedUser.id === currentUser?.id)}
                    onClick={() => toggleUserStatus(selectedUser.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedUser.account_status === 'ACTIVE'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                    }`}
                  >
                    {selectedUser.account_status === 'ACTIVE' ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                  </button>
                </div>
              </div>

              {/* Roles & Permissions Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#128c46]" />
                      <span>الصلاحيات والأذونات الممنوحة للحساب</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {selectedUser.role === 'SUPER_ADMIN' 
                        ? 'يمتلك مدير النظام صلاحيات شمولية مطلقة على كافة محركات النظام' 
                        : 'انقر على أي صلاحية لتفعيلها أو سحبها فورياً لهذا المستخدم'}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {selectedUser.role === 'SUPER_ADMIN' ? 'كاملة' : `${(selectedUser.custom_permissions || []).length} مخصصة`}
                  </span>
                </div>

                {/* Permissions Checkbox Grid */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {standardPermissions.map(p => {
                    const isSuper = selectedUser.role === 'SUPER_ADMIN';
                    const hasPerm = isSuper || (selectedUser.custom_permissions || []).includes(p.key);
                    const isRestrictedForEditor = p.restrictedToSuper && !isSuperAdmin;

                    return (
                      <label 
                        key={p.key}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm transition select-none ${
                          isSuper 
                            ? 'bg-purple-50/70 border-purple-200 text-purple-950 font-bold opacity-90 cursor-default' 
                            : hasPerm 
                              ? 'bg-emerald-50/80 border-emerald-200 text-slate-950 font-bold cursor-pointer hover:bg-emerald-100/70' 
                              : isRestrictedForEditor 
                                ? 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                                : 'bg-slate-50/80 border-slate-200/80 text-slate-700 font-medium cursor-pointer hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            disabled={isSuper || isRestrictedForEditor}
                            checked={hasPerm}
                            onChange={() => handlePermToggle(selectedUser, p.key)}
                            className="w-4 h-4 rounded text-[#128c46] focus:ring-[#25d366] disabled:opacity-50 cursor-pointer"
                          />
                          <div>
                            <span className="block">{p.label}</span>
                            {p.restrictedToSuper && (
                              <span className="text-[10px] text-amber-700 font-bold">صلاحية حساسة مقصورة على الإدارة العليا</span>
                            )}
                          </div>
                        </div>

                        <span className="text-[10.5px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {p.category}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Seller / Profile specific attributes (if any) */}
              {selectedUser.seller_profile && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-950">بيانات التوثيق والملف التجاري:</span>
                    <span className="text-[11px] font-bold text-teal-800">
                      حالة التوثيق: {selectedUser.seller_profile.verification_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-teal-900 font-semibold">
                    <div>نوع البائع: <strong>{selectedUser.seller_profile.seller_type === 'REAL_ESTATE_OFFICE' ? 'مكتب وسيط' : 'مالك فردي'}</strong></div>
                    <div>اسم الكيان: <strong>{selectedUser.seller_profile.agency_name || selectedUser.name}</strong></div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-12 text-center border border-dashed border-slate-200 text-slate-500 text-xs sm:text-sm font-bold">
              اختر مستخدماً من القائمة لتعديل صلاحياته وأدواره.
            </div>
          )}
        </div>

      </div>

      {/* Create Employee / Custom Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-right space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-900">إضافة مستخدم جديد وتخصيص الصلاحيات</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                يمكنك اختيار دور جاهز أو تخصيص صلاحيات محددة حسب حاجة العمل
              </p>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الله"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:border-[#25d366] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    placeholder="name@rawabet.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold dir-ltr text-right focus:border-[#25d366] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">رقم الموبايل</label>
                  <input
                    type="tel"
                    required
                    placeholder="01012345678"
                    value={newMobile}
                    onChange={e => setNewMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold dir-ltr text-right focus:border-[#25d366] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">نوع الدور الوظيفي</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole | 'CUSTOM_ROLE')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:border-[#25d366] focus:outline-hidden cursor-pointer"
                >
                  <option value="PROPERTY_REVIEWER">مراجع عقارات (Property Reviewer)</option>
                  <option value="SALES_USER">مسؤول مبيعات ومعاينات (Sales CRM)</option>
                  <option value="OPERATIONS_MANAGER">مدير عمليات ميدانية (Operations)</option>
                  <option value="CONTENT_MANAGER">مدير محتوى وتصنيفات (Content)</option>
                  {isSuperAdmin && (
                    <option value="SUPER_ADMIN">مدير نظام كامل (Super Admin)</option>
                  )}
                  <option value="CUSTOM_ROLE">دور مخصص بصلاحيات منتقاة (Custom Role)</option>
                </select>
              </div>

              {newRole === 'CUSTOM_ROLE' && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                  <label className="block text-xs font-black text-emerald-950">مسمى الدور المخصص</label>
                  <input
                    type="text"
                    placeholder="مثال: منسق عقود ومعاينات"
                    value={customRoleTitle}
                    onChange={e => setCustomRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold focus:outline-hidden"
                  />
                </div>
              )}

              {/* Specific Custom Permissions Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs sm:text-sm font-black text-slate-800">
                  حدد الصلاحيات الممنوحة لهذا الحساب:
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {standardPermissions.map(p => {
                    const isChecked = selectedPerms.includes(p.key);
                    const isRestricted = p.restrictedToSuper && !isSuperAdmin;
                    if (isRestricted) return null;

                    return (
                      <label 
                        key={p.key}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedPerms(selectedPerms.filter(k => k !== p.key));
                            } else {
                              setSelectedPerms([...selectedPerms, p.key]);
                            }
                          }}
                          className="w-4 h-4 rounded text-[#128c46] focus:ring-[#25d366]"
                        />
                        <span className="flex-1 text-slate-800">{p.label}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{p.category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#25d366] hover:bg-[#1eb956] text-slate-950 text-xs sm:text-sm font-black rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
                >
                  إنشاء الحساب وتفعيل الصلاحيات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
