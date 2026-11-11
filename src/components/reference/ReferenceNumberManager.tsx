import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { NumberingRule, CorrespondenceType } from '../../types';
import { previewPattern, validatePattern } from '../../utils/referenceNumber';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Hash,
  Play,
  RotateCcw,
} from 'lucide-react';

export const ReferenceNumberManager: React.FC = () => {
  const {
    activeOrg,
    tenantNumberingRules,
    updateNumberingRule,
    language,
    tenantDepartments,
  } = useApp();

  const [selectedRuleId, setSelectedRuleId] = useState<string>(
    tenantNumberingRules[0]?.id || ''
  );
  const [editingPattern, setEditingPattern] = useState<string>('');
  const [editingResetCadence, setEditingResetCadence] = useState<'yearly' | 'monthly' | 'never'>('yearly');
  const [testDeptCode, setTestDeptCode] = useState<string>('TAG');
  const [testSeq, setTestSeq] = useState<number>(42);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [patternError, setPatternError] = useState<string | null>(null);

  const activeRule = tenantNumberingRules.find((r) => r.id === selectedRuleId) || tenantNumberingRules[0];

  React.useEffect(() => {
    if (activeRule) {
      setEditingPattern(activeRule.pattern);
      setEditingResetCadence(activeRule.resetCadence);
      setPatternError(null);
    }
  }, [activeRule?.id]);

  const insertToken = (token: string) => {
    setEditingPattern((prev) => prev + token);
  };

  const handlePatternChange = (val: string) => {
    setEditingPattern(val);
    const check = validatePattern(val);
    if (!check.valid) {
      setPatternError(check.error || 'Invalid pattern');
    } else {
      setPatternError(null);
    }
  };

  const handleSave = () => {
    if (!activeRule) return;
    const check = validatePattern(editingPattern);
    if (!check.valid) {
      setPatternError(check.error || 'Invalid pattern');
      return;
    }

    updateNumberingRule(activeRule.id, {
      pattern: editingPattern,
      resetCadence: editingResetCadence,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSequence = () => {
    if (!activeRule) return;
    if (window.confirm(language === 'rw' ? 'Muremeza ko mushaka gusubiza umubare kuri 0?' : 'Are you sure you want to reset the sequence counter to 0 for this document register?')) {
      updateNumberingRule(activeRule.id, {
        currentSequence: 0,
      });
    }
  };

  const availableTokens = [
    { token: '[ORG]', label: 'Organisation Acronym', example: activeOrg.logoLetter || 'ORG' },
    { token: '[DEPT]', label: 'Department Code', example: 'MED' },
    { token: '[CAT]', label: 'Classification Code', example: 'PUB' },
    { token: '[TYPE]', label: 'Doc Type (IN/OUT/MEMO)', example: 'IN' },
    { token: '[YEAR]', label: '4-Digit Year', example: '2026' },
    { token: '[YY]', label: '2-Digit Year', example: '26' },
    { token: '[MONTH]', label: '2-Digit Month', example: '11' },
    { token: '[SEQ:4]', label: '4-Digit Sequence (0001)', example: '0042' },
    { token: '[SEQ:5]', label: '5-Digit Sequence (00001)', example: '00042' },
  ];

  const testPreview = activeRule
    ? previewPattern(editingPattern || activeRule.pattern, activeOrg.logoLetter || 'ORG', testDeptCode, activeRule.docType === 'customer_ticket' ? 'customer_ticket' : activeRule.docType)
    : '';

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <FileCode2 className="w-4 h-4" />
            <span>MODULE 06 · CONFIGURABLE REFERENCE NUMBER ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Igenamiterere ry’Inomero z’Inyandiko' : 'Reference Number Syntax Engine'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'rw'
              ? 'Buri kigo gifite uburenganzira bwo kwishyiriraho amabwiriza agenga inomero z’amabaruwa n’inyandiko zacyo.'
              : 'Configure custom reference numbering patterns, sequence resets, and formatting tokens for ' + activeOrg.name}
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pattern updated & activated!</span>
          </div>
        )}
      </div>

      {/* Rules Navigation / Tabs by Document Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tenantNumberingRules.map((rule) => {
          const isSelected = rule.id === selectedRuleId;
          return (
            <button
              key={rule.id}
              onClick={() => setSelectedRuleId(rule.id)}
              className={`p-3.5 text-left rounded-lg border transition-all text-xs ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold capitalize text-slate-900">
                  {rule.docType.replace('_', ' ')}
                </span>
                <span className="font-mono text-[11px] text-slate-500">#{rule.currentSequence}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-blue-700 truncate font-medium">
                {rule.pattern}
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                Reset: {rule.resetCadence}
              </div>
            </button>
          );
        })}
      </div>

      {activeRule && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pattern Syntax for {activeRule.docType.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assemble tokens using delimiters like <code className="text-slate-800">/</code> or <code className="text-slate-800">-</code>. Must include a sequence token.
              </p>
            </div>

            {/* Pattern Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Pattern Formula Expression
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingPattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md font-mono text-xs font-bold text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              {patternError && (
                <div className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{patternError}</span>
                </div>
              )}
            </div>

            {/* Available Tokens Button Strip */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Insert Configurable Syntax Tokens:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTokens.map((t) => (
                  <button
                    key={t.token}
                    type="button"
                    onClick={() => insertToken(t.token)}
                    className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 rounded border border-slate-200 transition-colors"
                    title={`e.g. ${t.example}`}
                  >
                    {t.token}
                  </button>
                ))}
              </div>
            </div>

            {/* Cadence and Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Automatic Counter Reset Cadence
                </label>
                <select
                  value={editingResetCadence}
                  onChange={(e) => setEditingResetCadence(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                >
                  <option value="yearly">Yearly (Every Jan 1st resets to 1)</option>
                  <option value="monthly">Monthly (Every 1st of month resets)</option>
                  <option value="never">Continuous / Never reset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Sequence Counter
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs flex-1 tabular-nums">
                    #{activeRule.currentSequence}
                  </span>
                  <button
                    onClick={handleResetSequence}
                    className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded transition-colors flex items-center gap-1"
                    title="Reset counter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={handleSave}
                disabled={Boolean(patternError)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-xs transition-colors"
              >
                {getTranslation(language, 'actionSave')}
              </button>
            </div>
          </div>

          {/* Live Simulator Workbench */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 text-blue-600" />
                <span>Real-Time Syntax Simulator</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Test how the formula evaluates across departments and sequences.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                Simulated Output:
              </span>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded font-mono text-xs font-bold text-blue-900 break-all select-all">
                {testPreview}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Test Department Code:
                </label>
                <select
                  value={testDeptCode}
                  onChange={(e) => setTestDeptCode(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                >
                  {tenantDepartments.map((d) => (
                    <option key={d.id} value={d.code}>
                      {d.code} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Why this matters:</span>
                <p>
                  Every tenant in Indanganyandiko maintains independent syntax standards. MINALOC can use national ministerial standards, while King Faisal Hospital can encode clinical branches without interference.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
