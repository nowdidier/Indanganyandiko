import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import {
  calculatePriorityBreakdown,
  calculateDepartmentWorkload,
  calculateUpcomingDeadlines,
  DeadlineItem,
} from '../../utils/dashboardMetrics';
import {
  Inbox,
  Send,
  FileCheck2,
  Headphones,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Flame,
  Check,
  ChevronRight,
  User,
  MapPin,
  PieChart as PieIcon,
  BarChart2,
  Hourglass,
} from 'lucide-react';

export const OverviewDashboard: React.FC<{ onOpenNewDocModal: () => void }> = ({ onOpenNewDocModal }) => {
  const {
    activeOrg,
    tenantCorrespondence,
    tenantTickets,
    tenantDepartments,
    tenantNumberingRules,
    language,
    setActiveModule,
    approveCorrespondenceStep,
    resolveCustomerTicket,
    activeRole,
  } = useApp();

  const [selectedDeadlineFilter, setSelectedDeadlineFilter] = useState<'all' | 'urgent_only'>('all');
  const [quickResolveId, setQuickResolveId] = useState<string | null>(null);
  const [quickResolveNote, setQuickResolveNote] = useState<string>('');
  const [approvalToast, setApprovalToast] = useState<string | null>(null);

  const incomingTotal = tenantCorrespondence.filter((c) => c.docType === 'incoming').length;
  const outgoingTotal = tenantCorrespondence.filter((c) => c.docType === 'outgoing').length;
  const pendingApprovals = tenantCorrespondence.filter(
    (c) => c.status === 'under_review' || c.status === 'pending_approval'
  );
  const openTickets = tenantTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
  const breachedTickets = tenantTickets.filter(
    (t) => t.slaStatus === 'approaching_breach' || t.slaStatus === 'breached'
  );

  // Calculations via pure logic helpers
  const priorityBreakdown = calculatePriorityBreakdown(tenantCorrespondence, tenantTickets);
  const departmentWorkloads = calculateDepartmentWorkload(tenantDepartments, tenantCorrespondence);
  const deadlines = calculateUpcomingDeadlines(tenantCorrespondence, tenantTickets);

  // Filtered deadlines
  const displayedDeadlines = selectedDeadlineFilter === 'urgent_only'
    ? deadlines.filter((d) => d.priority === 'urgent' || d.isOverdue)
    : deadlines;

  // Find active incoming numbering rule
  const incomingRule = tenantNumberingRules.find((r) => r.docType === 'incoming');

  // Urgent items collection (High or Urgent priority active items)
  const urgentTasks = [
    ...tenantCorrespondence
      .filter((c) => (c.priority === 'urgent' || c.priority === 'high') && (c.status === 'under_review' || c.status === 'pending_approval'))
      .map((c) => ({
        id: c.id,
        title: c.subject,
        ref: c.referenceNumber,
        type: 'correspondence' as const,
        priority: c.priority,
        origin: c.senderEntity,
        dueDate: c.dueDate,
        status: c.status,
      })),
    ...tenantTickets
      .filter((t) => (t.priority === 'urgent' || t.priority === 'high' || t.slaStatus === 'approaching_breach') && t.status !== 'resolved' && t.status !== 'closed')
      .map((t) => ({
        id: t.id,
        title: t.subject,
        ref: t.ticketNumber,
        type: 'ticket' as const,
        priority: t.priority,
        origin: t.citizenName,
        dueDate: t.slaDueDate,
        status: t.status,
      })),
  ];

  const handleQuickApprove = (docId: string, ref: string) => {
    approveCorrespondenceStep(docId, 'Endorsed via Executive Dashboard Quick Actions');
    setApprovalToast(`Document [${ref}] officially approved & sealed!`);
    setTimeout(() => setApprovalToast(null), 3500);
  };

  const handleQuickResolveSubmit = (ticketId: string) => {
    if (!quickResolveNote.trim()) {
      alert('Please provide resolution remarks.');
      return;
    }
    resolveCustomerTicket(ticketId, quickResolveNote);
    setQuickResolveId(null);
    setQuickResolveNote('');
    setApprovalToast('Citizen ticket marked as resolved!');
    setTimeout(() => setApprovalToast(null), 3500);
  };

  // SVG Donut calculations for Priority Distribution
  const totalItems = priorityBreakdown.total || 1;
  const urgentPct = (priorityBreakdown.urgent / totalItems) * 100;
  const highPct = (priorityBreakdown.high / totalItems) * 100;
  const normalPct = (priorityBreakdown.normal / totalItems) * 100;
  const lowPct = (priorityBreakdown.low / totalItems) * 100;

  // Circumference = 2 * PI * r = 2 * 3.14159 * 36 ≈ 226.2
  const circ = 226.2;
  const urgentOffset = 0;
  const urgentStroke = (urgentPct / 100) * circ;

  const highOffset = -urgentStroke;
  const highStroke = (highPct / 100) * circ;

  const normalOffset = -(urgentStroke + highStroke);
  const normalStroke = (normalPct / 100) * circ;

  const lowOffset = -(urgentStroke + highStroke + normalStroke);
  const lowStroke = (lowPct / 100) * circ;

  // 7-Day Deadlines histogram forecast bins
  const dayHistogram = [
    { label: 'Past/Due', count: deadlines.filter((d) => d.daysRemaining <= 0).length, alert: true },
    { label: '+1 Day', count: deadlines.filter((d) => d.daysRemaining === 1).length, alert: false },
    { label: '+2 Days', count: deadlines.filter((d) => d.daysRemaining === 2).length, alert: false },
    { label: '+3 Days', count: deadlines.filter((d) => d.daysRemaining === 3).length, alert: false },
    { label: '+4-7 Days', count: deadlines.filter((d) => d.daysRemaining >= 4 && d.daysRemaining <= 7).length, alert: false },
    { label: '+8d+', count: deadlines.filter((d) => d.daysRemaining > 7).length, alert: false },
  ];
  const maxDayCount = Math.max(...dayHistogram.map((h) => h.count), 1);

  return (
    <div className="space-y-6">
      {/* Top Tenant Header & Welcome */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Building className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{activeOrg.sectorType} WORKSPACE</span>
            <span>·</span>
            <span className="text-slate-500 font-mono text-[11px]">ID: {activeOrg.id}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {activeOrg.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {activeOrg.motto || 'Empowering institutional excellence through organized correspondence, traceable references, and citizen care.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModule('editor')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
          >
            {language === 'rw' ? 'Kwandika Ibaruwa' : 'Draft Official Letter'}
          </button>
          <button
            onClick={onOpenNewDocModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            {getTranslation(language, 'actionNew')}
          </button>
        </div>
      </div>

      {approvalToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-emerald-800 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{approvalToast}</span>
        </div>
      )}

      {/* KPI Metric Strips (Tabular figures, domain native) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Incoming Mail */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{getTranslation(language, 'navIncoming')}</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {incomingTotal}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'rw' ? 'Yose yinjiye mu kigo' : 'Registered in digital ledger'}</span>
            <span className="font-mono text-emerald-600 font-medium">100% indexed</span>
          </div>
        </div>

        {/* Metric 2: Outgoing Dispatches */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{getTranslation(language, 'navOutgoing')}</span>
            <Send className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {outgoingTotal}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'rw' ? 'Amabaruwa yasohotse' : 'Official institutional dispatches'}</span>
            <span className="text-slate-400 font-mono">Archive sync</span>
          </div>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{language === 'rw' ? 'Itegereje Umukono' : 'Pending Approvals'}</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {pendingApprovals.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'rw' ? 'Ikeneye kwemezwa' : 'Requires official endorsement'}</span>
            {pendingApprovals.length > 0 ? (
              <span className="text-amber-600 font-medium font-mono">Action Needed</span>
            ) : (
              <span className="text-emerald-600 font-medium font-mono">All Cleared</span>
            )}
          </div>
        </div>

        {/* Metric 4: Customer Care & Citizen Requests */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{getTranslation(language, 'navCustomerCare')}</span>
            <Headphones className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {openTickets.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{breachedTickets.length} {language === 'rw' ? 'yihutirwa' : 'approaching SLA'}</span>
            <span className="font-mono text-teal-600 font-medium">96.4% on-track</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 ENHANCED VISUAL SUMMARY WIDGETS (Urgent Tasks, Approvals, Deadlines)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WIDGET 1: Urgent Tasks & SLA Risk Center (with Visual Donut Chart) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'rw' ? 'Ibyihutirwa Cyane (Urgent Tasks)' : 'Urgent Tasks & SLA Risks'}
                </h3>
              </div>
              <span className="font-mono font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {urgentTasks.length} {language === 'rw' ? 'byihutirwa' : 'Active'}
              </span>
            </div>

            {/* Visual SVG Donut Chart + Priority Distribution */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 88 88">
                  {/* Background Track */}
                  <circle
                    cx="44"
                    cy="44"
                    r="36"
                    className="stroke-slate-200"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Urgent segment */}
                  {urgentStroke > 0 && (
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      stroke="#DC2626"
                      strokeWidth="8"
                      strokeDasharray={`${urgentStroke} ${circ}`}
                      strokeDashoffset={urgentOffset}
                      fill="transparent"
                    />
                  )}
                  {/* High segment */}
                  {highStroke > 0 && (
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      stroke="#D97706"
                      strokeWidth="8"
                      strokeDasharray={`${highStroke} ${circ}`}
                      strokeDashoffset={highOffset}
                      fill="transparent"
                    />
                  )}
                  {/* Normal segment */}
                  {normalStroke > 0 && (
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      stroke="#2563EB"
                      strokeWidth="8"
                      strokeDasharray={`${normalStroke} ${circ}`}
                      strokeDashoffset={normalOffset}
                      fill="transparent"
                    />
                  )}
                  {/* Low segment */}
                  {lowStroke > 0 && (
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      stroke="#94A3B8"
                      strokeWidth="8"
                      strokeDasharray={`${lowStroke} ${circ}`}
                      strokeDashoffset={lowOffset}
                      fill="transparent"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-slate-900 tabular-nums leading-none">
                    {priorityBreakdown.total}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5">Total</span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="flex-1 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    Urgent
                  </span>
                  <span className="font-mono font-bold text-rose-700 tabular-nums">
                    {priorityBreakdown.urgent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    High Priority
                  </span>
                  <span className="font-mono font-bold text-amber-700 tabular-nums">
                    {priorityBreakdown.high}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Normal
                  </span>
                  <span className="font-mono text-slate-700 tabular-nums">
                    {priorityBreakdown.normal}
                  </span>
                </div>
              </div>
            </div>

            {/* Urgent Tasks Action Queue */}
            <div className="mt-3 space-y-2">
              {urgentTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-lg text-xs space-y-1 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-semibold text-rose-800">{task.ref}</span>
                    <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-100 px-1.5 py-0.2 rounded">
                      {task.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 line-clamp-1">{task.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="truncate max-w-[150px]">{task.origin}</span>
                    {task.type === 'correspondence' ? (
                      <button
                        onClick={() => handleQuickApprove(task.id, task.ref)}
                        className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Endorse
                      </button>
                    ) : (
                      <button
                        onClick={() => setQuickResolveId(task.id)}
                        className="px-2 py-0.5 bg-teal-600 text-white rounded text-[10px] font-semibold hover:bg-teal-700 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('customer-care')}
            className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1 border border-dashed border-blue-200"
          >
            <span>{language === 'rw' ? 'Gufungura Ibibazo Byose' : 'Open Citizen Risk Desk'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WIDGET 2: Pending Approvals & Departmental Workload (with Visual Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'rw' ? 'Umutwaro w’Imirimo mu Mashami' : 'Departmental Workload & Approvals'}
                </h3>
              </div>
              <span className="font-mono font-bold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {pendingApprovals.length} {language === 'rw' ? 'Gusinya' : 'Pending'}
              </span>
            </div>

            {/* Visual Horizontal Workload Bars */}
            <div className="mt-3 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                Active Pending Workload per Department:
              </span>
              {departmentWorkloads.slice(0, 4).map((dept) => {
                const maxWorkload = Math.max(...departmentWorkloads.map((d) => d.pendingCount), 1);
                const barPercent = Math.min(Math.round((dept.pendingCount / maxWorkload) * 100), 100);

                return (
                  <div key={dept.deptId} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {dept.deptCode} · {dept.deptName}
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        <strong className="text-amber-700">{dept.pendingCount}</strong> pending / {dept.totalCount} tot
                      </span>
                    </div>
                    {/* Bar visualization */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          dept.pendingCount > 1
                            ? 'bg-amber-500'
                            : dept.pendingCount === 1
                            ? 'bg-blue-600'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(barPercent, 6)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Approval Queue Item */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider mb-2">
                Next in Queue for Endorsement:
              </span>
              {pendingApprovals.length > 0 ? (
                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-amber-800">
                      {pendingApprovals[0].referenceNumber}
                    </span>
                    <span className="capitalize text-slate-500">{pendingApprovals[0].docType}</span>
                  </div>
                  <div className="font-semibold text-slate-900 line-clamp-1">
                    {pendingApprovals[0].subject}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Due: {pendingApprovals[0].dueDate || 'Immediate'}
                    </span>
                    <button
                      onClick={() => handleQuickApprove(pendingApprovals[0].id, pendingApprovals[0].referenceNumber)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>{language === 'rw' ? 'Gushyiraho Umukono' : 'Approve & Seal'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-slate-500 text-xs bg-slate-50 rounded border border-slate-100">
                  All approvals cleared across departments!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('workflow')}
            className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1 border border-dashed border-blue-200"
          >
            <span>{language === 'rw' ? 'Reba Inzira z’Imikono Zose' : 'Open Full Approvals Pipeline'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WIDGET 3: Upcoming Deadlines & SLA Horizon (with Visual 7-Day Histogram Chart) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'rw' ? 'Ibihe Ntarengwa (Upcoming Deadlines)' : 'Upcoming Deadlines & SLAs'}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setSelectedDeadlineFilter('all')}
                  className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                    selectedDeadlineFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({deadlines.length})
                </button>
                <button
                  onClick={() => setSelectedDeadlineFilter('urgent_only')}
                  className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                    selectedDeadlineFilter === 'urgent_only'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-500 hover:text-rose-600'
                  }`}
                >
                  Critical
                </button>
              </div>
            </div>

            {/* Visual 7-Day Histogram Forecast Chart */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>7-Day Deadline Volume Forecast</span>
                <span className="font-mono text-slate-400">Total: {deadlines.length}</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 items-end h-16 pt-2">
                {dayHistogram.map((bin, idx) => {
                  const heightPercent = Math.max(Math.round((bin.count / maxDayCount) * 100), 12);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="font-mono text-[10px] font-bold tabular-nums text-slate-700">
                        {bin.count}
                      </span>
                      <div
                        className={`w-full rounded-t transition-all ${
                          bin.alert && bin.count > 0
                            ? 'bg-rose-500'
                            : bin.count > 0
                            ? 'bg-indigo-600'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      <span className="text-[9px] text-slate-500 text-center truncate w-full">
                        {bin.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Items List */}
            <div className="mt-3 space-y-2">
              {displayedDeadlines.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-lg border text-xs space-y-1 transition-colors ${
                    item.isOverdue
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : item.daysRemaining <= 1
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold truncate max-w-[160px]">
                      {item.referenceOrNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        item.isOverdue
                          ? 'bg-rose-600 text-white'
                          : item.daysRemaining === 0
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {item.isOverdue
                        ? `${Math.abs(item.daysRemaining)}d OVERDUE`
                        : item.daysRemaining === 0
                        ? 'DUE TODAY'
                        : `${item.daysRemaining}d left`}
                    </span>
                  </div>
                  <div className="font-semibold truncate">{item.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="truncate max-w-[140px]">{item.entityOrCitizen}</span>
                    <span className="font-mono text-[10px]">Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('archive')}
            className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1 border border-dashed border-blue-200"
          >
            <span>{language === 'rw' ? 'Reba Inyandiko Zose Zifite Amatariki' : 'View All Deadline Commitments'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: In-Flight Approvals & Tenant Reference Engine Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Approvals In-Flight & Priority Documents */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'rw' ? 'Amabaruwa n’Inyandiko Ziri Gusuzumwa' : 'Correspondence In-Flight & Approvals'}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'rw' ? 'Inyandiko zikurikiranywa mu nzego z’ubuyobozi' : 'Active document lifecycle with department assignments'}
              </p>
            </div>
            <button
              onClick={() => setActiveModule('workflow')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{language === 'rw' ? 'Kureba Byose' : 'Open Approvals Queue'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tenantCorrespondence.slice(0, 5).map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-blue-700 text-[11px]">
                      {doc.referenceNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="capitalize text-slate-500 text-[11px]">
                      {doc.docType}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {doc.dateReceivedOrSent}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {doc.subject}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{doc.senderEntity}</span>
                    <span>→</span>
                    <span>{doc.recipientEntity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    doc.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : doc.status === 'under_review' || doc.status === 'pending_approval'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status.replace('_', ' ')}
                  </span>

                  {(doc.status === 'under_review' || doc.status === 'pending_approval') && (
                    <button
                      onClick={() => handleQuickApprove(doc.id, doc.referenceNumber)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors"
                      title="Quick Endorse"
                    >
                      {language === 'rw' ? 'Emeza' : 'Approve'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tenant Reference Engine & Quick Tools */}
        <div className="space-y-6">
          {/* Active Reference Engine Summary Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'rw' ? 'Gahunda y’Inomero z’Inyandiko' : 'Reference Number Engine'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModule('reference-rules')}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                {language === 'rw' ? 'Guhindura' : 'Configure'}
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">
                  {language === 'rw' ? 'Imiterere y’Inomero Yinjiye (Pattern):' : 'Active Incoming Pattern:'}
                </span>
                <code className="mt-1 block font-mono text-xs font-semibold text-blue-900 bg-blue-50/80 p-2 rounded border border-blue-100">
                  {incomingRule?.pattern || '[ORG]/[DEPT]/[YEAR]/[SEQ:4]'}
                </code>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>{language === 'rw' ? 'Iheruka Gusohoka:' : 'Last Generated Ref:'}</span>
                <span className="font-mono font-medium text-slate-900">
                  {incomingRule?.lastGeneratedNumber || 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{language === 'rw' ? 'Umubare Ugezweho:' : 'Current Counter:'}</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  #{incomingRule?.currentSequence || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Care / Customer Queue Snapshot */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'rw' ? 'Kwakira Abaturage / Abakiriya' : 'Customer Care SLAs'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModule('customer-care')}
                className="text-[11px] font-semibold text-teal-600 hover:underline"
              >
                {language === 'rw' ? 'Reba Byose' : 'View Tickets'}
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {tenantTickets.slice(0, 3).map((t) => (
                <div key={t.id} className="text-xs p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-medium text-slate-700">{t.ticketNumber}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      t.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="font-medium text-slate-900 truncate mt-1">{t.subject}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>{t.citizenName}</span>
                    <span className="font-mono text-slate-400">Due: {t.slaDueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Resolve Modal for Citizen Tickets */}
      {quickResolveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs space-y-3.5">
            <h3 className="text-base font-bold text-slate-900">Quick Resolve Citizen Request</h3>
            <p className="text-slate-500">
              Provide resolution notes to mark this customer ticket as resolved and fulfill SLA.
            </p>
            <textarea
              rows={3}
              value={quickResolveNote}
              onChange={(e) => setQuickResolveNote(e.target.value)}
              placeholder="Resolution details or administrative outcome..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setQuickResolveId(null)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleQuickResolveSubmit(quickResolveId)}
                className="px-4 py-1.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded transition-colors"
              >
                Resolve Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
