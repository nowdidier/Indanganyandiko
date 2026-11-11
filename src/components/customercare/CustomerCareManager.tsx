import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { CustomerTicket, TicketCategory, PriorityLevel, TicketStatus } from '../../types';
import {
  Headphones,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  FileText,
  User,
  Phone,
  Mail,
  Send,
  ExternalLink,
} from 'lucide-react';

export const CustomerCareManager: React.FC = () => {
  const {
    activeOrg,
    tenantTickets,
    tenantDepartments,
    createCustomerTicket,
    resolveCustomerTicket,
    updateTicketStatus,
    language,
    setActiveModule,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<CustomerTicket | null>(null);
  const [resolutionInput, setResolutionInput] = useState<string>('');

  // New ticket state
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [citizenEmail, setCitizenEmail] = useState<string>('');
  const [category, setCategory] = useState<TicketCategory>('service_request');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [deptId, setDeptId] = useState<string>(tenantDepartments[0]?.id || '');
  const [slaDays, setSlaDays] = useState<number>(3);

  const filteredTickets = tenantTickets.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      const matchName = t.citizenName.toLowerCase().includes(q);
      const matchSubj = t.subject.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchSubj) return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !subject) return;

    const due = new Date();
    due.setDate(due.getDate() + (slaDays || 3));
    const slaDueDate = due.toISOString().split('T')[0];

    createCustomerTicket({
      citizenName,
      citizenPhone: citizenPhone || '+250 788 000 000',
      citizenEmail: citizenEmail || '',
      category,
      subject,
      description: description || 'Citizen inquiry lodged at service desk',
      priority,
      status: 'open',
      departmentId: deptId || tenantDepartments[0]?.id || 'dept-1',
      slaDueDate,
    });

    setShowNewModal(false);
    setCitizenName('');
    setCitizenPhone('');
    setCitizenEmail('');
    setSubject('');
    setDescription('');
  };

  const handleResolve = (ticketId: string) => {
    if (!resolutionInput) {
      alert('Please provide the resolution remarks and official follow-up details.');
      return;
    }
    resolveCustomerTicket(ticketId, resolutionInput);
    setResolutionInput('');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Headphones className="w-4 h-4" />
            <span>MODULE 09 · CITIZEN ENGAGEMENT, INQUIRIES & PUBLIC SERVICE SLAS</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Kwakira Abagana Ikigo n’Ibibazo by’Abaturage' : 'Customer Care & Citizen Inquiries'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · Direct linkage between public requests and official correspondence
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'rw' ? 'Kwandika Ikibazo Gishya' : 'Log Citizen Ticket'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="inquiry">General Inquiry</option>
            <option value="complaint">Complaint</option>
            <option value="service_request">Service Request</option>
            <option value="appeal">Administrative Appeal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending_correspondence">Pending Official Letter</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets by citizen or #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">{getTranslation(language, 'ticketNumber')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'citizenName')}</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'ticketCategory')}</th>
                <th className="py-2.5 px-4">Subject & Details</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">{getTranslation(language, 'slaDue')}</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No customer care requests logged in this category.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{t.citizenName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.citizenPhone}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-600">
                      {t.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1">{t.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{t.description}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold uppercase ${
                        t.priority === 'urgent' ? 'text-rose-600' : 'text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] tabular-nums">
                      <span className={t.slaStatus === 'approaching_breach' ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                        {t.slaDueDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        t.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'pending_correspondence'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(t);
                        }}
                        className="px-2.5 py-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Management Modal / Detail */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full p-6 text-xs space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.ticketNumber}</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedTicket.subject}</h2>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Lodged by: <span className="font-semibold text-slate-700">{selectedTicket.citizenName}</span> ({selectedTicket.citizenPhone})
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">Issue Narrative</span>
              <p className="text-slate-800 leading-relaxed">{selectedTicket.description}</p>
            </div>

            {selectedTicket.resolutionNote && (
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                <span className="font-bold text-[11px] block uppercase">Resolution Note</span>
                <p className="mt-0.5">{selectedTicket.resolutionNote}</p>
              </div>
            )}

            {selectedTicket.status !== 'resolved' && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  Official Customer Care Actions
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveModule('editor')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Draft Formal Response Letter in Editor</span>
                  </button>

                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, 'pending_correspondence')}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                  >
                    Mark Pending Official Correspondence
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Direct Resolution Remarks (Citizens received SMS/Call notification):
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Enter resolution actions, outcome, or administrative decision..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleResolve(selectedTicket.id)}
                    className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                  >
                    Mark Ticket as Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Log Customer / Citizen Ticket</h2>
            <p className="text-slate-500 mb-4">
              Auto-assigns ticket reference number based on {activeOrg.shortName} numbering format.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Citizen / Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Jean Damascene Kayitare"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="service_request">Service Request</option>
                    <option value="complaint">Complaint</option>
                    <option value="inquiry">General Inquiry</option>
                    <option value="appeal">Administrative Appeal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request for Land Endorsement in Ntyazo Sector"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Citizen explanation of the issue or requested document..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
