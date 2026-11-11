import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import {
  BarChart3,
  TrendingUp,
  Inbox,
  Send,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const {
    activeOrg,
    tenantCorrespondence,
    tenantTickets,
    tenantDepartments,
    language,
  } = useApp();

  const totalIncoming = tenantCorrespondence.filter((c) => c.docType === 'incoming').length;
  const totalOutgoing = tenantCorrespondence.filter((c) => c.docType === 'outgoing').length;
  const totalInternal = tenantCorrespondence.filter((c) => c.docType === 'internal').length;
  const totalTickets = tenantTickets.length;
  const resolvedTickets = tenantTickets.filter((t) => t.status === 'resolved').length;
  const slaResolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>MODULE 13 · INSTITUTIONAL REPORTS & PERFORMANCE ANALYTICS</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Raporo n’Imibare y’Ibikorwa' : 'Reports & Institutional Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Correspondence velocity, SLA adherence, and departmental workload
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print Executive Briefing</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-slate-500 text-xs">Total Records Registered</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {tenantCorrespondence.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalIncoming} In / {totalOutgoing} Out / {totalInternal} Memos
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-slate-500 text-xs">Citizen / Client SLA Rate</div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">
            {slaResolutionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {resolvedTickets} of {totalTickets} requests resolved
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-slate-500 text-xs">Avg. Processing Velocity</div>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-1">
            1.8 Days
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            From registry to dispatch
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-slate-500 text-xs">Archive Audit Index</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            100%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Reconciled with physical shelves
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Departmental Correspondence Volume & Processing Performance
          </h2>
          <span className="text-xs text-slate-500 font-mono">Current Period 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Department Name</th>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Assigned Documents</th>
                <th className="py-2.5 px-4">Completed / Dispatched</th>
                <th className="py-2.5 px-4">Pending Endorsements</th>
                <th className="py-2.5 px-4">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantDepartments.map((dept) => {
                const docs = tenantCorrespondence.filter((c) => c.departmentId === dept.id);
                const approved = docs.filter((c) => c.status === 'approved' || c.status === 'dispatched').length;
                const pending = docs.filter((c) => c.status === 'under_review' || c.status === 'pending_approval').length;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {dept.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {dept.code}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {docs.length}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-emerald-600 font-medium">
                      {approved}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-amber-600 font-medium">
                      {pending}
                    </td>
                    <td className="py-3 px-4">
                      {pending === 0 ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Optimal
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          Reviewing
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
