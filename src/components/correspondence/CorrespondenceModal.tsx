import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { generateReferenceNumber } from '../../utils/referenceNumber';
import { CorrespondenceType, PriorityLevel, TransmissionMethod } from '../../types';
import { X, FileText, CheckCircle2, AlertCircle, Hash, Building2, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultDocType?: CorrespondenceType;
}

export const CorrespondenceModal: React.FC<Props> = ({ isOpen, onClose, defaultDocType = 'incoming' }) => {
  const {
    activeOrg,
    tenantDepartments,
    tenantClassifications,
    tenantNumberingRules,
    registerCorrespondence,
    language,
  } = useApp();

  const [docType, setDocType] = useState<CorrespondenceType>(defaultDocType);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [classificationId, setClassificationId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [senderEntity, setSenderEntity] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEntity, setRecipientEntity] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [transmissionMethod, setTransmissionMethod] = useState<TransmissionMethod>('physical_courier');
  const [physicalLocation, setPhysicalLocation] = useState<string>('Registry Room A, Shelf 1, Box 01');
  const [attachmentsCount, setAttachmentsCount] = useState<number>(1);
  const [dueDate, setDueDate] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [contentBody, setContentBody] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('official, correspondence');
  const [previewRef, setPreviewRef] = useState<string>('');
  const [registeredSuccessRef, setRegisteredSuccessRef] = useState<string | null>(null);

  // Set default dropdowns
  useEffect(() => {
    if (tenantDepartments.length > 0 && !departmentId) {
      setDepartmentId(tenantDepartments[0].id);
    }
    if (tenantClassifications.length > 0 && !classificationId) {
      setClassificationId(tenantClassifications[0].id);
    }
  }, [tenantDepartments, tenantClassifications]);

  // Update live preview reference number
  useEffect(() => {
    const rule = tenantNumberingRules.find((r) => r.docType === docType);
    const pattern = rule?.pattern || '[ORG]/[DEPT]/[YEAR]/[SEQ:4]';
    const nextSeq = (rule?.currentSequence || 0) + 1;
    const dept = tenantDepartments.find((d) => d.id === departmentId);
    const cls = tenantClassifications.find((c) => c.id === classificationId);

    const ref = generateReferenceNumber(pattern, {
      orgCode: activeOrg.logoLetter || activeOrg.shortName.slice(0, 4),
      deptCode: dept?.code || 'GEN',
      catCode: cls?.code || 'DOC',
      docType,
      sequence: nextSeq,
    });
    setPreviewRef(ref);
  }, [docType, departmentId, classificationId, tenantNumberingRules, activeOrg]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !senderEntity || !recipientEntity) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const generated = registerCorrespondence({
      docType,
      subject,
      senderName: senderName || 'Authorized Official',
      senderEntity,
      recipientName: recipientName || 'Head of Entity',
      recipientEntity,
      departmentId,
      classificationId,
      priority,
      transmissionMethod,
      physicalLocation,
      attachmentsCount: Number(attachmentsCount) || 1,
      dueDate: dueDate || undefined,
      summary,
      contentBody,
      tags,
    });

    setRegisteredSuccessRef(generated);
  };

  const handleFinish = () => {
    setRegisteredSuccessRef(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'rw' ? 'Kwandika Inyandiko mu Gitabo cy’Ubwanditsi' : 'Register Official Correspondence'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeOrg.name} · {getTranslation(language, 'multiTenantLabel')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {registeredSuccessRef ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'rw' ? 'Inyandiko Yanditswe neza mu Gitabo!' : 'Correspondence Successfully Registered!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {language === 'rw'
                ? 'Inomero yemejwe na gahunda y’ikigo cyanyu yahawe iyi nyandiko:'
                : 'The system has assigned the official institutional reference number in compliance with tenant numbering syntax:'}
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg inline-block font-mono text-sm font-bold text-blue-700">
              {registeredSuccessRef}
            </div>
            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {language === 'rw' ? 'Komeza ku Rutonde' : 'Continue to Registry'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs">
            {/* Live Reference Preview Strip */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  {language === 'rw' ? 'Inomero y’Inyandiko izakorwa:' : 'Auto-Generated Reference Number:'}
                </span>
              </div>
              <span className="font-mono font-bold text-xs text-blue-700 bg-white px-2.5 py-1 rounded border border-blue-200">
                {previewRef}
              </span>
            </div>

            {/* Document Type Selector (Segmented control) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'rw' ? 'Ubwoko bw’Inyandiko' : 'Correspondence Type'} *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['incoming', 'outgoing', 'internal'] as CorrespondenceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocType(type)}
                    className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-colors capitalize ${
                      docType === type
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'incoming'
                      ? language === 'rw' ? 'Ibaruwa Yinjiye' : 'Incoming Mail'
                      : type === 'outgoing'
                      ? language === 'rw' ? 'Ibaruwa Isotse' : 'Outgoing Dispatch'
                      : language === 'rw' ? 'Ubutumwa bw’Imbere' : 'Internal Memo'}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'rw' ? 'Umutwe w’Inyandiko' : 'Document Subject / Title'} *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request for Infrastructure Review / Quarterly Procurement Report"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>

            {/* Sender and Recipient in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  {language === 'rw' ? 'Amakuru y’Uwohereje' : 'Sender Details'}
                </span>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    {language === 'rw' ? 'Ikigo / Urwego Rwohereje' : 'Originating Entity / Institution'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderEntity}
                    onChange={(e) => setSenderEntity(e.target.value)}
                    placeholder="e.g. Nyanza District Administration"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    {language === 'rw' ? 'Amazina y’Uwanditse / Umuyobozi' : 'Signatory / Sender Representative'}
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Hon. Mayor / Director General"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  {language === 'rw' ? 'Amakuru y’Uwakiriye' : 'Recipient Details'}
                </span>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    {language === 'rw' ? 'Ikigo / Urwego Rwakira' : 'Destination Entity / Institution'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientEntity}
                    onChange={(e) => setRecipientEntity(e.target.value)}
                    placeholder={activeOrg.name}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    {language === 'rw' ? 'Uwo Byagenewe' : 'Addressed Official / Title'}
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Permanent Secretary / Head of Medical Division"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Department, Classification, Priority, Transmission in 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Ishami Rirebwa' : 'Department'} *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs bg-white"
                >
                  {tenantDepartments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Icyiciro cy’Ibanga' : 'Classification'} *
                </label>
                <select
                  value={classificationId}
                  onChange={(e) => setClassificationId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs bg-white"
                >
                  {tenantClassifications.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.confidentiality})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Ubwihutirwe' : 'Priority'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs bg-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Uburyo bwo Kohereza' : 'Transmission'}
                </label>
                <select
                  value={transmissionMethod}
                  onChange={(e) => setTransmissionMethod(e.target.value as TransmissionMethod)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs bg-white"
                >
                  <option value="physical_courier">Physical Courier</option>
                  <option value="hand_delivery">Hand Delivery</option>
                  <option value="email">Official Email</option>
                  <option value="digital_portal">Digital Portal</option>
                  <option value="postal">Registered Postal Mail</option>
                </select>
              </div>
            </div>

            {/* Physical Archive Location & Attachments & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Aho Ibikwa mu Bubiko' : 'Physical Archive Location'}
                </label>
                <input
                  type="text"
                  value={physicalLocation}
                  onChange={(e) => setPhysicalLocation(e.target.value)}
                  placeholder="e.g. Vault B, Shelf 3, Box 12"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Umubare w’Imigereka' : 'Attached Documents Count'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={attachmentsCount}
                  onChange={(e) => setAttachmentsCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'rw' ? 'Igihe Ntarengwa cy’Igisubizo' : 'SLA Due Date'}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                />
              </div>
            </div>

            {/* Summary & Tags */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'rw' ? 'Incamake y’Inyandiko' : 'Executive Summary / Key Notes'}
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of requested action or subject matter..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                {getTranslation(language, 'actionCancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
              >
                {language === 'rw' ? 'Kwandika & Gutanga Inomero' : 'Register & Assign Reference'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
