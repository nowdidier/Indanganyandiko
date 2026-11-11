import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organisation,
  Department,
  Employee,
  NumberingRule,
  DocumentClassification,
  Correspondence,
  CustomerTicket,
  AuditLog,
  DocumentDraft,
  UserRole,
  Language,
} from '../types';
import {
  INITIAL_ORGANISATIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_NUMBERING_RULES,
  INITIAL_CLASSIFICATIONS,
  INITIAL_CORRESPONDENCE,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DRAFTS,
} from '../data/mockData';
import { generateReferenceNumber } from '../utils/referenceNumber';

interface AppContextType {
  // Navigation & View
  activeModule: string;
  setActiveModule: (mod: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active Tenant & User
  activeOrgId: string;
  setActiveOrgId: (id: string) => void;
  activeOrg: Organisation;
  activeUser: Employee;
  setActiveUser: (emp: Employee) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Data Collections (isolated by active tenant or global for super admin)
  organisations: Organisation[];
  departments: Department[];
  employees: Employee[];
  numberingRules: NumberingRule[];
  classifications: DocumentClassification[];
  correspondenceList: Correspondence[];
  tickets: CustomerTicket[];
  auditLogs: AuditLog[];
  drafts: DocumentDraft[];

  // Tenant-Scoped Data Accessors
  tenantDepartments: Department[];
  tenantEmployees: Employee[];
  tenantCorrespondence: Correspondence[];
  tenantTickets: CustomerTicket[];
  tenantNumberingRules: NumberingRule[];
  tenantClassifications: DocumentClassification[];
  tenantAuditLogs: AuditLog[];
  tenantDrafts: DocumentDraft[];

  // Actions
  addOrganisation: (org: Omit<Organisation, 'id' | 'createdAt' | 'departmentsCount' | 'employeesCount' | 'activeDocumentsCount'>) => void;
  updateOrganisation: (id: string, updates: Partial<Organisation>) => void;
  addDepartment: (dept: Omit<Department, 'id' | 'orgId'>) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'orgId' | 'joinedDate'>) => void;
  updateNumberingRule: (ruleId: string, updates: Partial<NumberingRule>) => void;
  addClassification: (cls: Omit<DocumentClassification, 'id' | 'orgId'>) => void;
  
  // Correspondence Actions
  registerCorrespondence: (data: {
    docType: Correspondence['docType'];
    subject: string;
    senderName: string;
    senderEntity: string;
    recipientName: string;
    recipientEntity: string;
    departmentId: string;
    classificationId: string;
    priority: Correspondence['priority'];
    transmissionMethod: Correspondence['transmissionMethod'];
    physicalLocation: string;
    summary: string;
    contentBody: string;
    attachmentsCount: number;
    tags: string[];
    dueDate?: string;
  }) => string; // returns generated reference number
  
  updateCorrespondenceStatus: (id: string, status: Correspondence['status'], comment?: string) => void;
  approveCorrespondenceStep: (id: string, comment?: string) => void;
  dispatchCorrespondence: (id: string) => void;
  archiveCorrespondence: (id: string, location?: string) => void;

  // Ticket Actions
  createCustomerTicket: (data: Omit<CustomerTicket, 'id' | 'orgId' | 'ticketNumber' | 'createdAt' | 'slaStatus'>) => string;
  resolveCustomerTicket: (id: string, resolutionNote: string) => void;
  updateTicketStatus: (id: string, status: CustomerTicket['status']) => void;

  // Draft Actions
  saveDraft: (draft: Omit<DocumentDraft, 'id' | 'orgId' | 'lastModified'> & { id?: string }) => void;

  // System
  logAuditEvent: (action: string, module: string, details: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'indanganyandiko_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [language, setLanguageState] = useState<Language>(() => loadFromStorage<Language>('lang', 'en'));
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [organisations, setOrganisations] = useState<Organisation[]>(() =>
    loadFromStorage('organisations', INITIAL_ORGANISATIONS)
  );
  const [activeOrgId, setActiveOrgId] = useState<string>(() => {
    return loadFromStorage('activeOrgId', 'org-minaloc');
  });

  const [departments, setDepartments] = useState<Department[]>(() =>
    loadFromStorage('departments', INITIAL_DEPARTMENTS)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadFromStorage('employees', INITIAL_EMPLOYEES)
  );
  const [numberingRules, setNumberingRules] = useState<NumberingRule[]>(() =>
    loadFromStorage('numberingRules', INITIAL_NUMBERING_RULES)
  );
  const [classifications, setClassifications] = useState<DocumentClassification[]>(() =>
    loadFromStorage('classifications', INITIAL_CLASSIFICATIONS)
  );
  const [correspondenceList, setCorrespondenceList] = useState<Correspondence[]>(() =>
    loadFromStorage('correspondence', INITIAL_CORRESPONDENCE)
  );
  const [tickets, setTickets] = useState<CustomerTicket[]>(() =>
    loadFromStorage('tickets', INITIAL_TICKETS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS)
  );
  const [drafts, setDrafts] = useState<DocumentDraft[]>(() =>
    loadFromStorage('drafts', INITIAL_DRAFTS)
  );

  // Active user and active role
  const [activeUser, setActiveUserState] = useState<Employee>(() => {
    return INITIAL_EMPLOYEES[0];
  });
  const [activeRole, setActiveRoleState] = useState<UserRole>('super_admin');

  // Persistence effects
  useEffect(() => saveToStorage('organisations', organisations), [organisations]);
  useEffect(() => saveToStorage('departments', departments), [departments]);
  useEffect(() => saveToStorage('employees', employees), [employees]);
  useEffect(() => saveToStorage('numberingRules', numberingRules), [numberingRules]);
  useEffect(() => saveToStorage('classifications', classifications), [classifications]);
  useEffect(() => saveToStorage('correspondence', correspondenceList), [correspondenceList]);
  useEffect(() => saveToStorage('tickets', tickets), [tickets]);
  useEffect(() => saveToStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('drafts', drafts), [drafts]);
  useEffect(() => saveToStorage('activeOrgId', activeOrgId), [activeOrgId]);
  useEffect(() => saveToStorage('lang', language), [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const activeOrg = organisations.find((o) => o.id === activeOrgId) || organisations[0];

  const setActiveUser = (emp: Employee) => {
    setActiveUserState(emp);
    setActiveRoleState(emp.role);
    if (emp.role !== 'super_admin' && emp.orgId) {
      setActiveOrgId(emp.orgId);
    }
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
  };

  const logAuditEvent = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      orgId: activeOrgId,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeRole,
      action,
      module,
      details,
      ipAddress: '197.243.' + Math.floor(Math.random() * 200 + 10) + '.' + Math.floor(Math.random() * 200 + 10),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Filtered views by active tenant
  const isSuperAdminGlobal = activeRole === 'super_admin' && activeModule === 'organisations';

  const tenantDepartments = departments.filter((d) => d.orgId === activeOrgId);
  const tenantEmployees = employees.filter((e) => e.orgId === activeOrgId);
  const tenantCorrespondence = correspondenceList.filter(
    (c) => isSuperAdminGlobal ? true : c.orgId === activeOrgId
  );
  const tenantTickets = tickets.filter(
    (t) => isSuperAdminGlobal ? true : t.orgId === activeOrgId
  );
  const tenantNumberingRules = numberingRules.filter((r) => r.orgId === activeOrgId);
  const tenantClassifications = classifications.filter((c) => c.orgId === activeOrgId);
  const tenantAuditLogs = auditLogs.filter(
    (l) => activeRole === 'super_admin' ? true : l.orgId === activeOrgId
  );
  const tenantDrafts = drafts.filter((d) => d.orgId === activeOrgId);

  // Add organisation
  const addOrganisation = (
    orgData: Omit<Organisation, 'id' | 'createdAt' | 'departmentsCount' | 'employeesCount' | 'activeDocumentsCount'>
  ) => {
    const newId = 'org-' + Date.now();
    const newOrg: Organisation = {
      ...orgData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      departmentsCount: 1,
      employeesCount: 1,
      activeDocumentsCount: 0,
    };
    setOrganisations((prev) => [...prev, newOrg]);

    // Create default department
    const defDept: Department = {
      id: 'dept-' + Date.now(),
      orgId: newId,
      name: 'General Administration',
      code: 'ADM',
      headName: 'Department Head',
      description: 'Central operational department for ' + orgData.name,
    };
    setDepartments((prev) => [...prev, defDept]);

    // Create default numbering rules for this tenant
    const defaultRules: NumberingRule[] = [
      {
        id: 'num-' + newId + '-in',
        orgId: newId,
        docType: 'incoming',
        pattern: `${newOrg.logoLetter}-[DEPT]/[YEAR]/[SEQ:4]`,
        prefix: newOrg.logoLetter,
        currentSequence: 1,
        minDigits: 4,
        resetCadence: 'yearly',
        description: 'Standard Incoming Mail Register',
      },
      {
        id: 'num-' + newId + '-out',
        orgId: newId,
        docType: 'outgoing',
        pattern: `${newOrg.logoLetter}/OUT/[DEPT]/[YEAR]/[SEQ:4]`,
        prefix: newOrg.logoLetter + '/OUT',
        currentSequence: 1,
        minDigits: 4,
        resetCadence: 'yearly',
        description: 'Standard Outgoing Dispatches',
      },
      {
        id: 'num-' + newId + '-internal',
        orgId: newId,
        docType: 'internal',
        pattern: `${newOrg.logoLetter}/MEMO/[DEPT]/[YEAR]/[SEQ:3]`,
        prefix: newOrg.logoLetter + '/MEMO',
        currentSequence: 1,
        minDigits: 3,
        resetCadence: 'yearly',
        description: 'Internal Memos & Notices',
      },
      {
        id: 'num-' + newId + '-tck',
        orgId: newId,
        docType: 'customer_ticket',
        pattern: `${newOrg.logoLetter}-TCK-[YEAR]-[SEQ:4]`,
        prefix: newOrg.logoLetter + '-TCK',
        currentSequence: 1,
        minDigits: 4,
        resetCadence: 'yearly',
        description: 'Customer Care & Citizen Tickets',
      },
    ];
    setNumberingRules((prev) => [...prev, ...defaultRules]);

    logAuditEvent('ORGANISATION_PROVISIONED', 'Organisations', `Provisioned new tenant: ${newOrg.name} (${newOrg.sectorType})`);
  };

  const updateOrganisation = (id: string, updates: Partial<Organisation>) => {
    setOrganisations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    logAuditEvent('ORGANISATION_UPDATED', 'Organisations', `Updated organization profile (${id})`);
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'orgId'>) => {
    const newDept: Department = {
      ...dept,
      id: 'dept-' + Date.now(),
      orgId: activeOrgId,
    };
    setDepartments((prev) => [...prev, newDept]);
    setOrganisations((prev) =>
      prev.map((o) =>
        o.id === activeOrgId ? { ...o, departmentsCount: o.departmentsCount + 1 } : o
      )
    );
    logAuditEvent('DEPARTMENT_CREATED', 'Departments', `Added department ${newDept.name} (${newDept.code})`);
  };

  const addEmployee = (emp: Omit<Employee, 'id' | 'orgId' | 'joinedDate'>) => {
    const newEmp: Employee = {
      ...emp,
      id: 'emp-' + Date.now(),
      orgId: activeOrgId,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [...prev, newEmp]);
    setOrganisations((prev) =>
      prev.map((o) =>
        o.id === activeOrgId ? { ...o, employeesCount: o.employeesCount + 1 } : o
      )
    );
    logAuditEvent('EMPLOYEE_ONBOARDED', 'Staff Directory', `Onboarded ${newEmp.name} as ${newEmp.role}`);
  };

  const updateNumberingRule = (ruleId: string, updates: Partial<NumberingRule>) => {
    setNumberingRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r))
    );
    logAuditEvent('NUMBERING_RULE_CONFIGURED', 'Reference Engine', `Configured reference pattern formula`);
  };

  const addClassification = (cls: Omit<DocumentClassification, 'id' | 'orgId'>) => {
    const newCls: DocumentClassification = {
      ...cls,
      id: 'cls-' + Date.now(),
      orgId: activeOrgId,
    };
    setClassifications((prev) => [...prev, newCls]);
    logAuditEvent('CLASSIFICATION_ADDED', 'Classifications', `Created classification tier: ${newCls.name}`);
  };

  // Register correspondence
  const registerCorrespondence = (data: {
    docType: Correspondence['docType'];
    subject: string;
    senderName: string;
    senderEntity: string;
    recipientName: string;
    recipientEntity: string;
    departmentId: string;
    classificationId: string;
    priority: Correspondence['priority'];
    transmissionMethod: Correspondence['transmissionMethod'];
    physicalLocation: string;
    summary: string;
    contentBody: string;
    attachmentsCount: number;
    tags: string[];
    dueDate?: string;
  }): string => {
    // Find active rule for docType in this org
    const matchingRule = numberingRules.find(
      (r) => r.orgId === activeOrgId && r.docType === data.docType
    );
    const pattern = matchingRule?.pattern || `[ORG]/[DEPT]/[YEAR]/[SEQ:4]`;
    const nextSeq = (matchingRule?.currentSequence || 0) + 1;

    const dept = departments.find((d) => d.id === data.departmentId);
    const cls = classifications.find((c) => c.id === data.classificationId);

    const refNumber = generateReferenceNumber(pattern, {
      orgCode: activeOrg.logoLetter || activeOrg.shortName.slice(0, 4),
      deptCode: dept?.code || 'GEN',
      catCode: cls?.code || 'DOC',
      docType: data.docType,
      sequence: nextSeq,
    });

    // Increment sequence
    if (matchingRule) {
      updateNumberingRule(matchingRule.id, {
        currentSequence: nextSeq,
        lastGeneratedNumber: refNumber,
      });
    }

    const newDoc: Correspondence = {
      id: 'corr-' + Date.now(),
      orgId: activeOrgId,
      docType: data.docType,
      referenceNumber: refNumber,
      subject: data.subject,
      senderName: data.senderName,
      senderEntity: data.senderEntity,
      recipientName: data.recipientName,
      recipientEntity: data.recipientEntity,
      departmentId: data.departmentId,
      assignedEmployeeId: activeUser.id,
      classificationId: data.classificationId,
      status: data.docType === 'outgoing' ? 'under_review' : 'registered',
      priority: data.priority,
      transmissionMethod: data.transmissionMethod,
      dateReceivedOrSent: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      physicalLocation: data.physicalLocation || 'Registry Shelf Central',
      attachmentsCount: data.attachmentsCount || 1,
      summary: data.summary,
      contentBody: data.contentBody,
      tags: data.tags,
      approvalHistory: [
        {
          stepNumber: 1,
          approverName: activeUser.name,
          approverRole: activeRole,
          status: 'approved',
          comments: 'Initial registration into Indanganyandiko digital ledger',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
      digitalStampApproved: false,
      createdAt: new Date().toISOString(),
    };

    setCorrespondenceList((prev) => [newDoc, ...prev]);
    setOrganisations((prev) =>
      prev.map((o) =>
        o.id === activeOrgId ? { ...o, activeDocumentsCount: o.activeDocumentsCount + 1 } : o
      )
    );

    logAuditEvent(
      'CORRESPONDENCE_REGISTERED',
      data.docType === 'incoming' ? 'Incoming Mail' : data.docType === 'outgoing' ? 'Outgoing Mail' : 'Internal Memos',
      `Registered document [${refNumber}]: ${data.subject.substring(0, 60)}...`
    );

    return refNumber;
  };

  const updateCorrespondenceStatus = (id: string, status: Correspondence['status'], comment?: string) => {
    setCorrespondenceList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newHistory = [...c.approvalHistory];
          if (comment) {
            newHistory.push({
              stepNumber: newHistory.length + 1,
              approverName: activeUser.name,
              approverRole: activeRole,
              status: status === 'approved' ? 'approved' : status === 'under_review' ? 'pending' : 'approved',
              comments: comment,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            });
          }
          return { ...c, status, approvalHistory: newHistory };
        }
        return c;
      })
    );
    logAuditEvent('STATUS_UPDATED', 'Workflow', `Document status updated to ${status} for ID ${id}`);
  };

  const approveCorrespondenceStep = (id: string, comment?: string) => {
    setCorrespondenceList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newHistory = [
            ...c.approvalHistory,
            {
              stepNumber: c.approvalHistory.length + 1,
              approverName: activeUser.name,
              approverRole: activeRole,
              status: 'approved' as const,
              comments: comment || 'Official endorsement granted under statutory authority.',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ];
          return {
            ...c,
            status: 'approved',
            digitalStampApproved: true,
            approvalHistory: newHistory,
          };
        }
        return c;
      })
    );
    logAuditEvent('APPROVAL_GRANTED', 'Approvals', `Official approval and digital seal stamped for document ${id}`);
  };

  const dispatchCorrespondence = (id: string) => {
    setCorrespondenceList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'dispatched' } : c))
    );
    logAuditEvent('CORRESPONDENCE_DISPATCHED', 'Outgoing Mail', `Document ${id} dispatched via registered carrier`);
  };

  const archiveCorrespondence = (id: string, location?: string) => {
    setCorrespondenceList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'archived',
              physicalLocation: location || c.physicalLocation || 'Permanent Archive Vault',
            }
          : c
      )
    );
    logAuditEvent('DOCUMENT_ARCHIVED', 'Digital Archive', `Archived document ${id} to ${location || 'vault'}`);
  };

  // Customer care ticket actions
  const createCustomerTicket = (
    data: Omit<CustomerTicket, 'id' | 'orgId' | 'ticketNumber' | 'createdAt' | 'slaStatus'>
  ): string => {
    const matchingRule = numberingRules.find(
      (r) => r.orgId === activeOrgId && r.docType === 'customer_ticket'
    );
    const pattern = matchingRule?.pattern || `CITIZEN-[YEAR]-[SEQ:4]`;
    const nextSeq = (matchingRule?.currentSequence || 0) + 1;

    const ticketNumber = generateReferenceNumber(pattern, {
      orgCode: activeOrg.logoLetter || 'ORG',
      deptCode: 'CARE',
      docType: 'customer_ticket',
      sequence: nextSeq,
    });

    if (matchingRule) {
      updateNumberingRule(matchingRule.id, {
        currentSequence: nextSeq,
        lastGeneratedNumber: ticketNumber,
      });
    }

    const newTicket: CustomerTicket = {
      ...data,
      id: 'tck-' + Date.now(),
      orgId: activeOrgId,
      ticketNumber,
      slaStatus: 'on_track',
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    logAuditEvent('CUSTOMER_TICKET_CREATED', 'Customer Care', `Created ticket ${ticketNumber} from ${data.citizenName}`);
    return ticketNumber;
  };

  const resolveCustomerTicket = (id: string, resolutionNote: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved', resolutionNote } : t))
    );
    logAuditEvent('CUSTOMER_TICKET_RESOLVED', 'Customer Care', `Resolved ticket ${id}`);
  };

  const updateTicketStatus = (id: string, status: CustomerTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    logAuditEvent('TICKET_STATUS_CHANGED', 'Customer Care', `Ticket ${id} status updated to ${status}`);
  };

  // Drafts
  const saveDraft = (draft: Omit<DocumentDraft, 'id' | 'orgId' | 'lastModified'> & { id?: string }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    if (draft.id) {
      setDrafts((prev) =>
        prev.map((d) => (d.id === draft.id ? { ...draft, id: draft.id, orgId: activeOrgId, lastModified: now } : d))
      );
    } else {
      const newDraft: DocumentDraft = {
        ...draft,
        id: 'draft-' + Date.now(),
        orgId: activeOrgId,
        lastModified: now,
      };
      setDrafts((prev) => [newDraft, ...prev]);
    }
    logAuditEvent('DOCUMENT_DRAFT_SAVED', 'Document Editor', `Saved official letter draft: ${draft.title}`);
  };

  const resetAllData = () => {
    localStorage.clear();
    setOrganisations(INITIAL_ORGANISATIONS);
    setDepartments(INITIAL_DEPARTMENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setNumberingRules(INITIAL_NUMBERING_RULES);
    setClassifications(INITIAL_CLASSIFICATIONS);
    setCorrespondenceList(INITIAL_CORRESPONDENCE);
    setTickets(INITIAL_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDrafts(INITIAL_DRAFTS);
    setActiveOrgId('org-minaloc');
    setActiveUserState(INITIAL_EMPLOYEES[0]);
    setActiveRoleState('super_admin');
  };

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        activeOrgId,
        setActiveOrgId,
        activeOrg,
        activeUser,
        setActiveUser,
        activeRole,
        setActiveRole,
        organisations,
        departments,
        employees,
        numberingRules,
        classifications,
        correspondenceList,
        tickets,
        auditLogs,
        drafts,
        tenantDepartments,
        tenantEmployees,
        tenantCorrespondence,
        tenantTickets,
        tenantNumberingRules,
        tenantClassifications,
        tenantAuditLogs,
        tenantDrafts,
        addOrganisation,
        updateOrganisation,
        addDepartment,
        addEmployee,
        updateNumberingRule,
        addClassification,
        registerCorrespondence,
        updateCorrespondenceStatus,
        approveCorrespondenceStep,
        dispatchCorrespondence,
        archiveCorrespondence,
        createCustomerTicket,
        resolveCustomerTicket,
        updateTicketStatus,
        saveDraft,
        logAuditEvent,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
