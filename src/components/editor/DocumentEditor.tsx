import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { DocumentDraft, CorrespondenceType } from '../../types';
import {
  PenTool,
  Printer,
  Save,
  Send,
  FileCheck,
  Building,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const DocumentEditor: React.FC = () => {
  const {
    activeOrg,
    tenantDrafts,
    saveDraft,
    registerCorrespondence,
    tenantDepartments,
    tenantClassifications,
    language,
    setActiveModule,
  } = useApp();

  const [activeDraft, setActiveDraft] = useState<DocumentDraft>(
    tenantDrafts[0] || {
      id: 'draft-' + Date.now(),
      orgId: activeOrg.id,
      title: 'Official Transmittal Letter',
      docType: 'outgoing',
      departmentId: tenantDepartments[0]?.id || 'dept-1',
      templateType: 'official_letter',
      referenceNumber: `${activeOrg.logoLetter}/OUT/2026/001`,
      recipient: 'The Executive Secretary',
      recipientTitle: 'District Administration',
      subject: 'TRANSMITTAL OF OFFICIAL CORRESPONDENCE AND DIRECTIVES',
      salutation: 'Distinguished Leaders,',
      paragraphs: [
        'I have the honor to convey the official institutional directives regarding the modernization of correspondence and records registers.',
        'All designated departments are requested to ensure full adherence to the statutory guidelines attached herewith.',
      ],
      signatoryName: 'Authorized Representative',
      signatoryTitle: 'Director General of Administration',
      copiesTo: ['Central Registry & Archives', 'Executive Office'],
      lastModified: new Date().toISOString().substring(0, 16),
    }
  );

  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [registeredToast, setRegisteredToast] = useState<string | null>(null);

  const handleUpdateField = <K extends keyof DocumentDraft>(field: K, val: DocumentDraft[K]) => {
    setActiveDraft((prev) => ({ ...prev, [field]: val }));
  };

  const handleParagraphChange = (idx: number, text: string) => {
    const updated = [...activeDraft.paragraphs];
    updated[idx] = text;
    handleUpdateField('paragraphs', updated);
  };

  const handleAddParagraph = () => {
    handleUpdateField('paragraphs', [...activeDraft.paragraphs, '']);
  };

  const handleRemoveParagraph = (idx: number) => {
    handleUpdateField(
      'paragraphs',
      activeDraft.paragraphs.filter((_, i) => i !== idx)
    );
  };

  const handleSave = () => {
    saveDraft(activeDraft);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleRegisterAsOutgoing = () => {
    const ref = registerCorrespondence({
      docType: 'outgoing',
      subject: activeDraft.subject,
      senderName: activeDraft.signatoryName,
      senderEntity: activeOrg.name,
      recipientName: activeDraft.recipient,
      recipientEntity: activeDraft.recipientTitle || 'Designated Recipient Entity',
      departmentId: activeDraft.departmentId,
      classificationId: tenantClassifications[0]?.id || 'cls-1',
      priority: 'high',
      transmissionMethod: 'digital_portal',
      physicalLocation: 'Executive Outgoing Registry Binder 2026',
      attachmentsCount: 1,
      summary: activeDraft.paragraphs[0] || activeDraft.subject,
      contentBody: activeDraft.paragraphs.join('\n\n'),
      tags: ['Official Letter', activeOrg.shortName],
    });

    setRegisteredToast(ref);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <PenTool className="w-4 h-4" />
            <span>MODULE 11 · COLLABORATIVE DOCUMENT DRAFTING & OFFICIAL LETTERHEAD</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Kwandika Inyandiko Yemewe (Letterhead Editor)' : 'Official Correspondence Editor'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Draft with official letterhead, digital stamp watermark, and statutory formatting
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Draft Saved!
            </span>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Letter</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {registeredToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold">Registered into Outgoing Correspondence Ledger!</span>
              <div className="font-mono text-emerald-800">Assigned Reference: {registeredToast}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('outgoing')}
            className="px-3 py-1 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800"
          >
            View Outgoing Mail
          </button>
        </div>
      )}

      {/* Two Column Layout: Editor Form + Live Letterhead Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
          <h2 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Document Composition
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Template Format</label>
            <select
              value={activeDraft.templateType}
              onChange={(e) => handleUpdateField('templateType', e.target.value as any)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
            >
              <option value="official_letter">Official External Ministerial / Institutional Letter</option>
              <option value="internal_memo">Internal Memorandum (Inter-departmental)</option>
              <option value="public_circular">Public Institutional Circular</option>
              <option value="complaint_response">Citizen Customer Care Formal Response</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject (Uppercase)</label>
            <input
              type="text"
              value={activeDraft.subject}
              onChange={(e) => handleUpdateField('subject', e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Name</label>
              <input
                type="text"
                value={activeDraft.recipient}
                onChange={(e) => handleUpdateField('recipient', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Entity</label>
              <input
                type="text"
                value={activeDraft.recipientTitle}
                onChange={(e) => handleUpdateField('recipientTitle', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Salutation</label>
            <input
              type="text"
              value={activeDraft.salutation}
              onChange={(e) => handleUpdateField('salutation', e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Paragraphs</label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Paragraph
              </button>
            </div>
            {activeDraft.paragraphs.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
                />
                {activeDraft.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Signatory Name</label>
              <input
                type="text"
                value={activeDraft.signatoryName}
                onChange={(e) => handleUpdateField('signatoryName', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Signatory Title</label>
              <input
                type="text"
                value={activeDraft.signatoryTitle}
                onChange={(e) => handleUpdateField('signatoryTitle', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={handleRegisterAsOutgoing}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Register as Outgoing Correspondence</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Printable Institutional Letterhead Sheet */}
        <div className="lg:col-span-7 bg-slate-200/70 p-6 rounded-lg flex items-center justify-center overflow-x-auto">
          <div className="bg-white border border-slate-300 shadow-xl w-full max-w-xl p-10 font-serif text-slate-900 space-y-6 relative select-text">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] text-9xl font-sans font-extrabold rotate-[-25deg]">
              {activeOrg.logoLetter}
            </div>

            {/* Official Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-0.5">
              <div className="text-xs font-sans tracking-widest font-extrabold uppercase text-slate-700">
                REPUBLIC OF RWANDA
              </div>
              <div className="text-sm font-sans font-extrabold tracking-wide text-slate-900">
                {activeOrg.name.toUpperCase()}
              </div>
              <div className="text-[10px] font-sans text-slate-600">
                {activeOrg.address} · Tel: {activeOrg.phone} · Email: {activeOrg.email}
              </div>
            </div>

            {/* Reference and Date */}
            <div className="flex items-center justify-between text-xs font-sans">
              <div>
                <span className="font-bold">Ref: </span>
                <span className="font-mono font-semibold text-blue-900">{activeDraft.referenceNumber}</span>
              </div>
              <div>
                <span className="font-bold">Date: </span>
                <span className="font-mono">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            {/* Recipient Block */}
            <div className="text-xs space-y-0.5 font-sans">
              <div className="font-bold text-slate-800">To: {activeDraft.recipient}</div>
              <div className="text-slate-600">{activeDraft.recipientTitle}</div>
            </div>

            {/* Subject */}
            <div className="font-sans font-extrabold text-xs underline uppercase tracking-wide py-1">
              Re: {activeDraft.subject}
            </div>

            {/* Salutation & Paragraphs */}
            <div className="text-xs space-y-3 font-serif leading-relaxed text-justify">
              <p>{activeDraft.salutation}</p>
              {activeDraft.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Signatory & Digital Seal */}
            <div className="pt-8 flex items-end justify-between font-sans">
              <div className="border border-emerald-600 text-emerald-800 p-2 rounded text-center rotate-[-3deg] select-none text-[9px]">
                <div className="font-extrabold">DIGITALLY AUTHENTICATED</div>
                <div className="font-mono text-[8px]">{activeOrg.shortName} · REGISTRY</div>
              </div>

              <div className="text-right text-xs">
                <div className="font-bold text-slate-900">{activeDraft.signatoryName}</div>
                <div className="text-[11px] text-slate-600">{activeDraft.signatoryTitle}</div>
                <div className="text-[10px] text-slate-500">{activeOrg.name}</div>
              </div>
            </div>

            {/* CC Block */}
            <div className="pt-4 border-t border-slate-200 text-[10px] font-sans text-slate-500">
              <span className="font-bold">CC:</span>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                {activeDraft.copiesTo.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
