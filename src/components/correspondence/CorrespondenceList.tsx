import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { Correspondence, CorrespondenceType, CorrespondenceStatus } from '../../types';
import {
  Search,
  Filter,
  FilePlus,
  Eye,
  CheckCircle2,
  Send,
  Archive,
  Download,
  Printer,
  Calendar,
  Building,
  MapPin,
  Paperclip,
  Check,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface Props {
  initialTypeFilter?: CorrespondenceType | 'all';
  onOpenNewModal: (type?: CorrespondenceType) => void;
}

export const CorrespondenceList: React.FC<Props> = ({ initialTypeFilter = 'all', onOpenNewModal }) => {
  const {
    tenantCorrespondence,
    tenantDepartments,
    language,
    approveCorrespondenceStep,
    dispatchCorrespondence,
    archiveCorrespondence,
    activeOrg,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<CorrespondenceType | 'all'>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<Correspondence | null>(null);

  // Filter items
  const filteredList = tenantCorrespondence.filter((doc) => {
    if (typeFilter !== 'all' && doc.docType !== typeFilter) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (deptFilter !== 'all' && doc.departmentId !== deptFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchRef = doc.referenceNumber.toLowerCase().includes(q);
      const matchSubj = doc.subject.toLowerCase().includes(q);
      const matchSender = doc.senderEntity.toLowerCase().includes(q) || doc.senderName.toLowerCase().includes(q);
      const matchRecip = doc.recipientEntity.toLowerCase().includes(q) || doc.recipientName.toLowerCase().includes(q);
      if (!matchRef && !matchSubj && !matchSender && !matchRecip) return false;
    }

    return true;
  });

  const getDepartmentName = (id: string) => {
    return tenantDepartments.find((d) => d.id === id)?.name || id;
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {typeFilter === 'incoming'
              ? getTranslation(language, 'navIncoming')
              : typeFilter === 'outgoing'
              ? getTranslation(language, 'navOutgoing')
              : typeFilter === 'internal'
              ? getTranslation(language, 'navInternal')
              : language === 'rw' ? 'Igitabo cy’Amabaruwa n’Inyandiko Zose' : 'Official Correspondence Registry'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'rw'
              ? 'Inyandiko zemewe, amabaruwa yinjiye n’asohotse muri ' + activeOrg.name
              : 'Registered correspondence records for ' + activeOrg.name}
          </p>
        </div>

        <button
          onClick={() => onOpenNewModal(typeFilter === 'all' ? 'incoming' : typeFilter)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          <span>{getTranslation(language, 'actionNew')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Type Segmented Buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'rw' ? 'Byose' : 'All Types'} ({tenantCorrespondence.length})
          </button>
          <button
            onClick={() => setTypeFilter('incoming')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              typeFilter === 'incoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'rw' ? 'Yinjiye' : 'Incoming'} ({tenantCorrespondence.filter((c) => c.docType === 'incoming').length})
          </button>
          <button
            onClick={() => setTypeFilter('outgoing')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              typeFilter === 'outgoing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'rw' ? 'Yasohotse' : 'Outgoing'} ({tenantCorrespondence.filter((c) => c.docType === 'outgoing').length})
          </button>
          <button
            onClick={() => setTypeFilter('internal')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              typeFilter === 'internal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'rw' ? 'Imbere (Memos)' : 'Internal'} ({tenantCorrespondence.filter((c) => c.docType === 'internal').length})
          </button>
        </div>

        {/* Search Input & Dropdowns */}
        <div className="flex items-center gap-2 flex-1 md:justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={getTranslation(language, 'actionSearch')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700"
          >
            <option value="all">{language === 'rw' ? 'Imiterere Yose' : 'All Statuses'}</option>
            <option value="registered">Registered</option>
            <option value="under_review">Under Review</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved & Stamped</option>
            <option value="dispatched">Dispatched</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 max-w-[140px] truncate"
          >
            <option value="all">{language === 'rw' ? 'Amashami Yose' : 'All Departments'}</option>
            {tenantDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">{getTranslation(language, 'colRefNumber')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colSubject')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colSenderRecipient')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colDepartment')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colStatus')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colPriority')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'colDate')}</th>
                <th className="py-2.5 px-4 text-right">{getTranslation(language, 'colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {language === 'rw'
                      ? 'Nta nyandiko ibonetse ihuye n’ibyo mushakishije.'
                      : 'No correspondence records match the selected criteria.'}
                  </td>
                </tr>
              ) : (
                filteredList.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {doc.referenceNumber}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">{doc.subject}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{doc.physicalLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{doc.senderEntity}</div>
                      <div className="text-[11px] text-slate-500">→ {doc.recipientEntity}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {getDepartmentName(doc.departmentId)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        doc.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'dispatched'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : doc.status === 'archived'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : doc.status === 'under_review' || doc.status === 'pending_approval'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-medium ${
                        doc.priority === 'urgent'
                          ? 'text-rose-600 font-bold'
                          : doc.priority === 'high'
                          ? 'text-amber-600 font-semibold'
                          : 'text-slate-600'
                      }`}>
                        {doc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums">
                      {doc.dateReceivedOrSent}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                        }}
                        className="px-2.5 py-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors text-xs font-medium"
                      >
                        {getTranslation(language, 'actionViewDetails')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Document Detail Slide-Over / Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-600 font-bold">
                  {selectedDoc.referenceNumber}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedDoc.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6 text-xs">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Type & Transmission:</span>
                  <span className="font-medium text-slate-900 capitalize">
                    {selectedDoc.docType} · {selectedDoc.transmissionMethod.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date Received / Sent:</span>
                  <span className="font-mono font-medium text-slate-900">{selectedDoc.dateReceivedOrSent}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status:</span>
                  <span className="font-semibold text-blue-700 capitalize">
                    {selectedDoc.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Physical Shelf Archive:</span>
                  <span className="font-medium text-slate-900">{selectedDoc.physicalLocation}</span>
                </div>
              </div>

              {/* Sender & Recipient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block">Sender</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedDoc.senderEntity}</div>
                  <div className="text-slate-600">Represented by: {selectedDoc.senderName}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block">Recipient</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedDoc.recipientEntity}</div>
                  <div className="text-slate-600">Attention: {selectedDoc.recipientName}</div>
                </div>
              </div>

              {/* Summary and Content */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Executive Summary</h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                  {selectedDoc.summary || 'Official correspondence processed under institutional records procedure.'}
                </p>
              </div>

              {/* Approval History Audit Trail */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Institutional Routing & Approval History</span>
                  {selectedDoc.digitalStampApproved && (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      Digital Institutional Seal Affixed
                    </span>
                  )}
                </h4>

                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedDoc.approvalHistory.map((step, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{step.approverName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-normal">{step.approverRole}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({step.timestamp || 'Recorded'})</span>
                      </div>
                      <div className="text-slate-600 italic text-[11px]">
                        "{step.comments}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      archiveCorrespondence(selectedDoc.id);
                      setSelectedDoc(null);
                    }}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive Record</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {(selectedDoc.status === 'under_review' || selectedDoc.status === 'pending_approval') && (
                    <button
                      onClick={() => {
                        approveCorrespondenceStep(selectedDoc.id, 'Official statutory endorsement given');
                        setSelectedDoc(null);
                      }}
                      className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{getTranslation(language, 'actionApprove')}</span>
                    </button>
                  )}

                  {selectedDoc.status === 'approved' && selectedDoc.docType === 'outgoing' && (
                    <button
                      onClick={() => {
                        dispatchCorrespondence(selectedDoc.id);
                        setSelectedDoc(null);
                      }}
                      className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{getTranslation(language, 'actionDispatch')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
