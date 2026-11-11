import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { ShieldAlert, Search, Filter, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const {
    activeOrg,
    tenantAuditLogs,
    language,
    activeRole,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = tenantAuditLogs.filter((log) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>MODULE 14 · IMMUTABLE AUDIT TRAILS & MULTI-TENANT ISOLATION</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Umutekano n’Ibyakozwe Byose (Audit Logs)' : 'Security Audit Trail & Compliance'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeRole === 'super_admin'
              ? 'Super Admin View: Global immutable event stream across all system workspaces'
              : `${activeOrg.name} · Tamper-evident ledger of all user actions and reference transactions`}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tenant Data Isolation Active</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
          />
        </div>
        <span className="text-slate-500">{filteredLogs.length} verified log entries</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Action Code</th>
                <th className="py-2.5 px-4">Module</th>
                <th className="py-2.5 px-4">Actor & Role</th>
                <th className="py-2.5 px-4">IP Address</th>
                <th className="py-2.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
