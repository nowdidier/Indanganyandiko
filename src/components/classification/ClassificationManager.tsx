import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { DocumentClassification, ConfidentialityLevel } from '../../types';
import { Tags, ShieldAlert, Plus, Lock, Clock, CheckCircle2 } from 'lucide-react';

export const ClassificationManager: React.FC = () => {
  const {
    activeOrg,
    tenantClassifications,
    addClassification,
    language,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>('internal');
  const [retentionYears, setRetentionYears] = useState<number>(5);
  const [action, setAction] = useState<'archive_permanently' | 'review' | 'destroy'>('archive_permanently');
  const [description, setDescription] = useState<string>('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    addClassification({
      name,
      code: code.toUpperCase(),
      confidentiality,
      retentionYears: Number(retentionYears) || 0,
      actionAfterRetention: action,
      description: description || 'Institutional document classification schedule',
    });

    setShowAddModal(false);
    setName('');
    setCode('');
    setDescription('');
  };

  const getTierColor = (level: ConfidentialityLevel) => {
    switch (level) {
      case 'public':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'internal':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'confidential':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'secret':
      case 'top_secret':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Tags className="w-4 h-4" />
            <span>MODULE 07 · DOCUMENT CLASSIFICATION & STATUTORY RETENTION</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Ibyiciro by’Ibanga n’Igihe Inyandiko Zibikwa' : 'Document Classification & Retention'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Confidentiality tiers, security clearance levels, and legal retention schedules
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Classification Tier</span>
        </button>
      </div>

      {/* Grid of Classifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenantClassifications.map((cls) => (
          <div key={cls.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {cls.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{cls.name}</h3>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getTierColor(cls.confidentiality)}`}>
                {cls.confidentiality}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {cls.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {cls.retentionYears === 0 ? 'Permanent Archive' : `${cls.retentionYears} Years Retention`}
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 capitalize">
                {cls.actionAfterRetention.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Add Document Classification Tier</h2>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Classification Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Confidential Executive Council Minutes"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Token Code (e.g. for [CAT]) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. MIN"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs uppercase font-mono font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confidentiality Tier</label>
                  <select
                    value={confidentiality}
                    onChange={(e) => setConfidentiality(e.target.value as ConfidentialityLevel)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="confidential">Confidential</option>
                    <option value="secret">Secret</option>
                    <option value="top_secret">Top Secret</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Retention (Years)</label>
                  <input
                    type="number"
                    min={0}
                    value={retentionYears}
                    onChange={(e) => setRetentionYears(parseInt(e.target.value, 10) || 0)}
                    placeholder="0 for permanent"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Action Post-Retention</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="archive_permanently">Archive Permanently</option>
                    <option value="review">Review before disposal</option>
                    <option value="destroy">Secure Destruction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Legal basis and distribution rules..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
