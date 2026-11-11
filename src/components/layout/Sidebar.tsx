import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import {
  LayoutDashboard,
  Building,
  Users,
  Inbox,
  Send,
  MessageSquare,
  FileCode2,
  Tags,
  CheckSquare,
  Headphones,
  Archive,
  PenTool,
  BarChart3,
  ShieldAlert,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  alert?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, language, correspondenceList, tickets, activeOrg } = useApp();

  const incomingCount = correspondenceList.filter(
    (c) => c.orgId === activeOrg.id && c.docType === 'incoming'
  ).length;

  const outgoingCount = correspondenceList.filter(
    (c) => c.orgId === activeOrg.id && c.docType === 'outgoing'
  ).length;

  const pendingApprovalsCount = correspondenceList.filter(
    (c) => c.orgId === activeOrg.id && (c.status === 'under_review' || c.status === 'pending_approval')
  ).length;

  const activeTicketsCount = tickets.filter(
    (t) => t.orgId === activeOrg.id && t.status !== 'resolved'
  ).length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: language === 'rw' ? 'Ibanze & Umwanya w’Akazi' : 'Workspace & Structure',
      items: [
        { id: 'overview', label: getTranslation(language, 'navOverview'), icon: LayoutDashboard },
        { id: 'organisations', label: getTranslation(language, 'navOrganisations'), icon: Building },
        { id: 'departments', label: getTranslation(language, 'navDepartments'), icon: Users },
      ],
    },
    {
      groupTitle: language === 'rw' ? 'Amabaruwa n’Ubutumwa' : 'Official Correspondence',
      items: [
        { id: 'incoming', label: getTranslation(language, 'navIncoming'), icon: Inbox, count: incomingCount },
        { id: 'outgoing', label: getTranslation(language, 'navOutgoing'), icon: Send, count: outgoingCount },
        { id: 'internal', label: getTranslation(language, 'navInternal'), icon: MessageSquare },
        { id: 'editor', label: getTranslation(language, 'navEditor'), icon: PenTool },
      ],
    },
    {
      groupTitle: language === 'rw' ? 'Ibyemezo n’Inomero' : 'Rules & Workflow',
      items: [
        { id: 'reference-rules', label: getTranslation(language, 'navReferenceRules'), icon: FileCode2 },
        { id: 'classifications', label: getTranslation(language, 'navClassification'), icon: Tags },
        { id: 'workflow', label: getTranslation(language, 'navWorkflow'), icon: CheckSquare, count: pendingApprovalsCount, alert: pendingApprovalsCount > 0 },
      ],
    },
    {
      groupTitle: language === 'rw' ? 'Abagana Ikigo n’Ububiko' : 'Citizen Care & Archive',
      items: [
        { id: 'customer-care', label: getTranslation(language, 'navCustomerCare'), icon: Headphones, count: activeTicketsCount },
        { id: 'archive', label: getTranslation(language, 'navArchive'), icon: Archive },
      ],
    },
    {
      groupTitle: language === 'rw' ? 'Raporo n’Umutekano' : 'Governance & Settings',
      items: [
        { id: 'reports', label: getTranslation(language, 'navReports'), icon: BarChart3 },
        { id: 'audit', label: getTranslation(language, 'navAudit'), icon: ShieldAlert },
        { id: 'settings', label: getTranslation(language, 'navSettings'), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-53px)]">
      {/* Organisation Banner in Sidebar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {language === 'rw' ? 'Ikigo Gifunguye' : 'Active Tenant Workspace'}
        </div>
        <div className="mt-1 text-sm font-bold text-white truncate">
          {activeOrg.name}
        </div>
        <div className="mt-0.5 text-xs text-slate-400 capitalize">
          {activeOrg.sectorType} · {activeOrg.city}
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {group.groupTitle}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                          isActive
                            ? 'bg-blue-800 text-white'
                            : item.alert
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Version */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Indanganyandiko SaaS</span>
        <span className="font-mono text-slate-400">v2026.4</span>
      </div>
    </aside>
  );
};
