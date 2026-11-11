import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { getRoleDisplayName } from '../../utils/rbac';
import { UserRole } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  ChevronDown, 
  FilePlus, 
  Bell, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const TopNav: React.FC<{ onOpenNewDocModal: () => void }> = ({ onOpenNewDocModal }) => {
  const {
    activeOrg,
    organisations,
    setActiveOrgId,
    activeRole,
    setActiveRole,
    activeUser,
    employees,
    setActiveUser,
    language,
    setLanguage,
    activeModule,
    correspondenceList,
    tickets,
  } = useApp();

  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const pendingApprovalsCount = correspondenceList.filter(
    (c) => c.orgId === activeOrg.id && (c.status === 'under_review' || c.status === 'pending_approval')
  ).length;

  const urgentTicketsCount = tickets.filter(
    (t) => t.orgId === activeOrg.id && t.status !== 'resolved' && (t.priority === 'urgent' || t.slaStatus === 'approaching_breach')
  ).length;

  const rolesList: UserRole[] = [
    'super_admin',
    'org_admin',
    'dept_head',
    'records_officer',
    'secretary',
    'staff_member',
    'customer_care',
    'viewer',
  ];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleDropdown(false);
    // Switch to a sample employee with that role if available
    const emp = employees.find((e) => e.role === role);
    if (emp) {
      setActiveUser(emp);
    }
  };

  const handleOrgSelect = (orgId: string) => {
    setActiveOrgId(orgId);
    setShowOrgDropdown(false);
    // pick an employee from that org
    const emp = employees.find((e) => e.orgId === orgId);
    if (emp) {
      setActiveUser(emp);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Brand Wordmark (Single text element, no subtitle clutter) */}
      <div className="flex items-center gap-4 shrink-0">
        <a 
          href="#overview" 
          className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2.5 whitespace-nowrap"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-sm shadow-sm">
            I
          </span>
          <span className="font-extrabold text-slate-900 tracking-tight">INDANGANYANDIKO</span>
        </a>

        {/* Multi-Tenant Active Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
            aria-label="Active Organisation Workspace"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[200px] truncate">{activeOrg.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'rw' ? 'Guhindura Ikigo cy’Ubwanditsi' : 'Select Organisation Workspace'}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {organisations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSelect(org.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      org.id === activeOrg.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium text-slate-900 truncate">{org.name}</div>
                      <div className="text-[11px] text-slate-500">{org.city} · {org.sectorType}</div>
                    </div>
                    {org.id === activeOrg.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links / Contextual Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 truncate">
        <span className="font-medium text-slate-700">{activeOrg.shortName}</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold capitalize">
          {activeModule.replace('-', ' ')}
        </span>
      </div>

      {/* Zone 3: Actions, Language Switch, Role Simulator, Notifications & Primary CTA */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Switcher (EN / RW) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('rw')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              language === 'rw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Ikinyarwanda"
          >
            RW
          </button>
        </div>

        {/* Role Simulator Pill (Allows testing RBAC & access levels) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            title="Switch User Role to test permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">
              {getRoleDisplayName(activeRole, language)}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                {language === 'rw' ? 'Guhindura Inshingano (Simulation)' : 'Simulate User Role Access'}
              </div>
              {rolesList.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    activeRole === role ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span>{getRoleDisplayName(role, language)}</span>
                  {activeRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition-colors"
            aria-label="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {(pendingApprovalsCount > 0 || urgentTicketsCount > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 text-xs">
              <div className="font-semibold text-slate-900 pb-2 border-b border-slate-100">
                {language === 'rw' ? 'Imenyekanisha n’Impuruza' : 'Notifications & Reminders'}
              </div>
              <div className="py-2 space-y-2">
                {pendingApprovalsCount > 0 ? (
                  <div className="p-2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    <span className="font-bold">{pendingApprovalsCount}</span> {getTranslation(language, 'alertPendingApprovals')}
                  </div>
                ) : (
                  <div className="text-slate-500 py-1">
                    {language === 'rw' ? 'Nta mabaruwa ategereje umukono.' : 'No pending document approvals.'}
                  </div>
                )}
                {urgentTicketsCount > 0 && (
                  <div className="p-2 rounded bg-rose-50 text-rose-900 border border-rose-200">
                    <span className="font-bold">{urgentTicketsCount}</span> {getTranslation(language, 'alertSlaWarning')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button (Zero pill, standard button padding) */}
        <button
          onClick={onOpenNewDocModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>{getTranslation(language, 'actionNew')}</span>
        </button>
      </div>
    </header>
  );
};
