import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { Correspondence, DocumentClassification } from '../../types';
import {
  Archive,
  Search,
  Filter,
  MapPin,
  Calendar,
  Lock,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  FolderOpen,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DocumentArchive: React.FC = () => {
  const {
    activeOrg,
    tenantCorrespondence,
    tenantClassifications,
    language,
    archiveCorrespondence,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confidentialityFilter, setConfidentialityFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Correspondence | null>(null);

  const archivedDocs = tenantCorrespondence.filter((c) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchRef = c.referenceNumber.toLowerCase().includes(q);
      const matchSubj = c.subject.toLowerCase().includes(q);
      const matchLoc = c.physicalLocation.toLowerCase().includes(q);
      if (!matchRef && !matchSubj && !matchLoc) return false;
    }
    return true;
  });

  const getClassification = (clsId: string): DocumentClassification | undefined => {
    return tenantClassifications.find((c) => c.id === clsId);
  };

  const handleExportCsv = () => {
    const headers = ['Reference Number', 'Doc Type', 'Subject', 'Sender', 'Recipient', 'Date', 'Physical Shelf Location', 'Status'];
    const rows = archivedDocs.map((d) => [
      `"${d.referenceNumber}"`,
      `"${d.docType}"`,
      `"${d.subject.replace(/"/g, '""')}"`,
      `"${d.senderEntity.replace(/"/g, '""')}"`,
      `"${d.recipientEntity.replace(/"/g, '""')}"`,
      `"${d.dateReceivedOrSent}"`,
      `"${d.physicalLocation.replace(/"/g, '""')}"`,
      `"${d.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeOrg.shortName}_Archive_Registry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Archive className="w-4 h-4" />
            <span>MODULE 10 · DIGITAL REPOSITORY & PHYSICAL ARCHIVE RECONCILIATION</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Ububiko bw’Inyandiko (Digital & Physical Archive)' : 'Digital & Physical Document Archive'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Full records management with exact physical room/shelf/box mapping
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Archive Ledger (CSV)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by shelf, room, box, subject, or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span>{archivedDocs.length} records cataloged in archive ledger</span>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archivedDocs.map((doc) => {
          const cls = getClassification(doc.classificationId);
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate max-w-[200px]">
                  {doc.referenceNumber}
                </span>
                <span className="text-[10px] font-semibold uppercase text-slate-500 px-1.5 py-0.2 bg-slate-100 rounded">
                  {doc.docType}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 line-clamp-2 text-xs leading-snug">
                  {doc.subject}
                </h3>
              </div>

              {/* Physical Shelf Tag */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-mono truncate">{doc.physicalLocation}</span>
              </div>

              {/* Retention & Classification Metadata */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>{cls?.confidentiality || 'Internal'}</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{doc.dateReceivedOrSent}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Document Archive Inspector */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full p-6 text-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedDoc.referenceNumber}</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedDoc.subject}</h2>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs">
              <div>
                <span className="font-bold text-[10px] block uppercase">Physical Archive Location</span>
                <div className="font-mono font-semibold mt-0.5">{selectedDoc.physicalLocation}</div>
              </div>
              <div>
                <span className="font-bold text-[10px] block uppercase">Digital Ledger Status</span>
                <div className="font-semibold mt-0.5 capitalize">{selectedDoc.status.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block mb-1">
                Archived Content Excerpt
              </span>
              <p className="text-slate-800 font-serif leading-relaxed text-sm bg-white p-3 rounded border border-slate-100">
                {selectedDoc.contentBody || selectedDoc.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                Indexed in {activeOrg.shortName} Vault
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-slate-50"
                >
                  Print Record
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
