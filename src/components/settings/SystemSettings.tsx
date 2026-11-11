import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { Settings, Globe, Shield, RefreshCw, CheckCircle2, Building } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const {
    activeOrg,
    updateOrganisation,
    language,
    setLanguage,
    resetAllData,
  } = useApp();

  const [name, setName] = useState(activeOrg.name);
  const [address, setAddress] = useState(activeOrg.address);
  const [email, setEmail] = useState(activeOrg.email);
  const [phone, setPhone] = useState(activeOrg.phone);
  const [motto, setMotto] = useState(activeOrg.motto);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganisation(activeOrg.id, {
      name,
      address,
      email,
      phone,
      motto,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state to fresh default institutional dataset?')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Settings className="w-4 h-4" />
            <span>MODULE 15 · SYSTEM SETTINGS & LOCALIZATION</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Igenamiterere rya Sisitemu (Settings)' : 'System Settings & Preferences'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Language localization (English / Ikinyarwanda), tenant branding & operational parameters
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Regional Settings */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Language & Localization</h2>
          </div>

          <p className="text-slate-600">
            {language === 'rw'
              ? 'Indanganyandiko ikora mu ndimi zombi: Icyongereza n’Ikinyarwanda kugira ngo yorohereze abakozi bose.'
              : 'Indanganyandiko supports bilingual operations out of the box in English and Kinyarwanda for full administrative clarity.'}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                language === 'en'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-sm">English</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Official Universal Edition</div>
            </button>

            <button
              type="button"
              onClick={() => setLanguage('rw')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                language === 'rw'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-sm">Ikinyarwanda</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Urubuga mu Kinyarwanda</div>
            </button>
          </div>
        </div>

        {/* Tenant Profile Settings */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Tenant Institutional Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Motto</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Developer & Data Reset Tool */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-5 flex items-center justify-between text-xs">
        <div>
          <h3 className="font-bold text-slate-900">Reset Demo Data & Reseed</h3>
          <p className="text-slate-600 text-[11px] mt-0.5">
            Restore sample institutions, initial reference numbers, and test tickets to fresh defaults.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};
