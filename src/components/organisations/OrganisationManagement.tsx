import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { Organisation, SectorType } from '../../types';
import {
  Building2,
  Plus,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  Files,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const OrganisationManagement: React.FC = () => {
  const {
    organisations,
    activeOrgId,
    setActiveOrgId,
    addOrganisation,
    language,
    activeRole,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [sectorType, setSectorType] = useState<SectorType>('government');
  const [city, setCity] = useState<string>('Kigali');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [motto, setMotto] = useState<string>('');
  const [logoLetter, setLogoLetter] = useState<string>('N');

  const sectorBadges: Record<SectorType, { labelEn: string; labelRw: string; color: string }> = {
    government: { labelEn: 'Government Institution', labelRw: 'Urwego rwa Leta', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    private: { labelEn: 'Private Company', labelRw: 'Ikigo cy’Abikorera', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    ngo: { labelEn: 'NGO & Civil Society', labelRw: 'Umuryango Utegamiye kuri Leta', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    education: { labelEn: 'Education Institution', labelRw: 'Ikigo cy’Uburezi / Kaminuza', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    healthcare: { labelEn: 'Healthcare & Hospital', labelRw: 'Ibitaro n’Ubuvuzi', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    finance: { labelEn: 'Financial Institution', labelRw: 'Ikigo cy’Imari / SACCO', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortName) return;

    addOrganisation({
      name,
      shortName,
      sectorType,
      country: 'Rwanda',
      city,
      address: address || 'Administrative Plaza',
      email: email || `registry@${shortName.toLowerCase().replace(/\s+/g, '')}.rw`,
      phone: phone || '+250 788 000 000',
      website: website || 'https://www.gov.rw',
      logoLetter: logoLetter.toUpperCase() || name[0].toUpperCase(),
      colorScheme: 'blue',
      motto: motto || 'Excellence in Service & Records Governance',
      status: 'active',
    });

    setShowAddModal(false);
    setName('');
    setShortName('');
    setAddress('');
    setEmail('');
    setPhone('');
    setMotto('');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Layers className="w-4 h-4" />
            <span>MODULE 01 · MULTI-TENANT ORGANISATION ECOSYSTEM</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Gucunga Ibigo n’Inzego (Multi-Organisation)' : 'Organisations & Tenants'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'rw'
              ? 'Indanganyandiko ikorana n’inzego za Leta, ibigo by’abikorera, imiryango itegamiye kuri Leta, ibitaro, kaminuza n’ibigo by’imari.'
              : 'Isolated digital workspaces for government agencies, private enterprises, NGOs, universities, hospitals, and financial institutions.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(language, 'actionAddOrg')}</span>
        </button>
      </div>

      {/* Grid of All Organisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organisations.map((org) => {
          const isActive = org.id === activeOrgId;
          const badge = sectorBadges[org.sectorType];

          return (
            <div
              key={org.id}
              className={`bg-white rounded-lg border p-5 flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Sector and Active indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.color}`}>
                    {language === 'rw' ? badge.labelRw : badge.labelEn}
                  </span>
                  {isActive ? (
                    <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'rw' ? 'Ikigo Gifunguye' : 'Active Workspace'}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">Isolated Tenant</span>
                  )}
                </div>

                {/* Org Logo Letter & Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {org.logoLetter}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                      {org.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{org.city}, {org.country}</span>
                    </p>
                  </div>
                </div>

                {/* Motto */}
                {org.motto && (
                  <p className="text-[11px] text-slate-600 italic mt-3 bg-slate-50 p-2 rounded border border-slate-100">
                    "{org.motto}"
                  </p>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Departments</span>
                    <span className="font-bold text-slate-800 tabular-nums">{org.departmentsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Staff</span>
                    <span className="font-bold text-slate-800 tabular-nums">{org.employeesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Documents</span>
                    <span className="font-bold text-blue-700 tabular-nums">{org.activeDocumentsCount}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {isActive ? (
                  <div className="text-center py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded">
                    {language === 'rw' ? 'Ubu Mukorera muri Iki Kigo' : 'Currently Operating In Workspace'}
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveOrgId(org.id)}
                    className="w-full py-1.5 px-3 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-blue-600 rounded transition-colors text-center"
                  >
                    {language === 'rw' ? 'Fungura Iki Kigo' : 'Enter Organisation Workspace'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Organisation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {language === 'rw' ? 'Kwandika Ikigo Gishya muri Indanganyandiko' : 'Establish New Organisation Workspace'}
            </h2>
            <p className="text-slate-500 mb-4">
              {language === 'rw'
                ? 'Iki kigo kizagira umwanya wacyo witaruye n’amabwiriza y’inomero z’inyandiko yacyo.'
                : 'Each organisation operates in complete data isolation with its own rules, departments, and staff.'}
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Organisation Official Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rwanda Social Security Board (RSSB) / Inyange Agro-Hub"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Name / Acronym *
                  </label>
                  <input
                    type="text"
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. RSSB"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sector Category *
                  </label>
                  <select
                    value={sectorType}
                    onChange={(e) => setSectorType(e.target.value as SectorType)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="government">Government Institution</option>
                    <option value="private">Private Company</option>
                    <option value="ngo">NGO</option>
                    <option value="education">Education Institution</option>
                    <option value="healthcare">Healthcare Institution</option>
                    <option value="finance">Financial Institution</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kigali / Huye / Nyanza"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logo Letter</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={logoLetter}
                    onChange={(e) => setLogoLetter(e.target.value)}
                    placeholder="e.g. R"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs uppercase font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motto / Core Mandate</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="e.g. Transforming Public Health Through Innovation"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
