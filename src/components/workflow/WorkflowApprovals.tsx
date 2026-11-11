import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { Correspondence } from '../../types';
import {
  CheckSquare,
  ShieldCheck,
  AlertCircle,
  Clock,
  Check,
  X,
  FileText,
  Building,
  UserCheck,
  Stamp,
  MessageSquare,
} from 'lucide-react';

export const WorkflowApprovals: React.FC = () => {
  const {
    tenantCorrespondence,
    approveCorrespondenceStep,
    updateCorrespondenceStatus,
    language,
    activeOrg,
    activeUser,
    activeRole,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [stampNotice, setStampNotice] = useState<string | null>(null);

  const pendingList = tenantCorrespondence.filter(
    (c) => c.status === 'under_review' || c.status === 'pending_approval'
  );
  const approvedList = tenantCorrespondence.filter((c) => c.status === 'approved' || c.status === 'dispatched');

  const selectedDoc = tenantCorrespondence.find((c) => c.id === selectedDocId) || pendingList[0] || tenantCorrespondence[0];

  const handleApprove = (docId: string) => {
    approveCorrespondenceStep(
      docId,
      comment || 'Official endorsement granted under statutory administrative authority.'
    );
    setStampNotice(`Digital Institutional Seal stamped for ${selectedDoc?.referenceNumber}!`);
    setComment('');
    setTimeout(() => setStampNotice(null), 4000);
  };

  const handleRequestRevision = (docId: string) => {
    if (!comment) {
      alert('Please provide amendment notes for the drafting officer.');
      return;
    }
    updateCorrespondenceStatus(docId, 'under_review', `Revision Requested: ${comment}`);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>MODULE 08 · WORKFLOW, ENDORSEMENT & DIGITAL SIGNATURE SEALS</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Ibyemezo n’Imikono y’Inyandiko (Approvals)' : 'Approvals & Institutional Workflow'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · {pendingList.length} items awaiting administrative clearance
          </p>
        </div>

        {stampNotice && (
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{stampNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Approval Queue */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Action ({pendingList.length})</span>
            <span className="font-mono text-amber-600 text-[11px]">Action Required</span>
          </div>

          {pendingList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-xs">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">All Clear!</p>
              <p className="mt-1">No correspondence is currently pending official approval in this workspace.</p>
            </div>
          ) : (
            pendingList.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700 text-[11px]">
                      {doc.referenceNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {doc.priority}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 line-clamp-1">{doc.subject}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>{doc.senderEntity}</span>
                    <span className="font-mono text-slate-400">{doc.dateReceivedOrSent}</span>
                  </div>
                </div>
              );
            })
          )}

          {/* Cleared / Stamped History */}
          <div className="pt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Recently Cleared & Stamped ({approvedList.length})
            </div>
            <div className="space-y-1.5">
              {approvedList.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className="p-2.5 bg-white border border-slate-200 rounded text-xs cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600 font-semibold">{doc.referenceNumber}</span>
                    <span className="text-emerald-700 font-medium">Approved</span>
                  </div>
                  <div className="text-slate-800 font-medium truncate mt-0.5">{doc.subject}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Document Review & Signing Panel */}
        {selectedDoc ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedDoc.referenceNumber}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {selectedDoc.subject}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Origin: <span className="font-medium text-slate-700">{selectedDoc.senderEntity}</span> · Recipient: <span className="font-medium text-slate-700">{selectedDoc.recipientEntity}</span>
                </div>
              </div>

              {selectedDoc.digitalStampApproved && (
                <div className="border-2 border-emerald-600 text-emerald-800 p-2 rounded text-center rotate-[-3deg] select-none shadow-xs">
                  <div className="text-[9px] font-mono uppercase tracking-widest font-extrabold">REPUBLIC OF RWANDA</div>
                  <div className="text-xs font-extrabold tracking-wider">{activeOrg.shortName}</div>
                  <div className="text-[8px] font-mono font-semibold">DIGITALLY AUTHENTICATED</div>
                </div>
              )}
            </div>

            {/* Content Preview */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                Document Executive Text & Context:
              </span>
              <p className="text-slate-800 leading-relaxed font-serif text-sm bg-white p-4 rounded border border-slate-200">
                {selectedDoc.contentBody || selectedDoc.summary}
              </p>
            </div>

            {/* Workflow Approval History */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Step Endorsement Audit Trail
              </h3>

              <div className="space-y-2 border-l-2 border-blue-500 pl-4 ml-2">
                {selectedDoc.approvalHistory.map((step, idx) => (
                  <div key={idx} className="text-xs relative">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>Step {step.stepNumber}: {step.approverName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-normal">{step.approverRole}</span>
                      <span className="text-emerald-600 font-semibold text-[11px] font-mono">
                        [{step.status.toUpperCase()}]
                      </span>
                    </div>
                    {step.comments && (
                      <p className="text-slate-600 italic text-[11px] mt-0.5">
                        "{step.comments}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {step.timestamp || 'Recorded in Ledger'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Box for Approvers */}
            {(selectedDoc.status === 'under_review' || selectedDoc.status === 'pending_approval') && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Authorizing Official Action ({activeUser.name} · {activeRole})
                </span>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Endorsement Note / Statutory Clearance Comments:
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter official approval comments, directives, or amendment instructions..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleRequestRevision(selectedDoc.id)}
                    className="px-3.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors"
                  >
                    Request Amendments
                  </button>
                  <button
                    onClick={() => handleApprove(selectedDoc.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs transition-colors"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>Approve & Apply Digital Seal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs">
            Select an item from the approval queue to review.
          </div>
        )}
      </div>
    </div>
  );
};
