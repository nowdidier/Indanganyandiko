import { Language } from '../types';

export const translations = {
  en: {
    // Brand & System
    brandName: 'Indanganyandiko',
    systemTitle: 'Universal Correspondence, Records & Customer Care Management System',
    tagline: 'One platform. Every organisation. Every document. One organised system.',
    multiTenantLabel: 'Multi-Tenant SaaS Workspace',
    superAdminBadge: 'Platform Super Admin',
    
    // Modules
    navOverview: 'Overview',
    navOrganisations: 'Organisations',
    navDepartments: 'Departments & Staff',
    navIncoming: 'Incoming Mail',
    navOutgoing: 'Outgoing Mail',
    navInternal: 'Internal Memos',
    navReferenceRules: 'Reference Engine',
    navClassification: 'Classifications',
    navWorkflow: 'Approvals & Routing',
    navCustomerCare: 'Customer Care & Tickets',
    navArchive: 'Digital & Physical Archive',
    navEditor: 'Official Document Editor',
    navReports: 'Reports & Analytics',
    navAudit: 'Audit Logs & Security',
    navSettings: 'System Settings',

    // Common Actions
    actionNew: 'Register Document',
    actionAddOrg: 'Add Organisation',
    actionAddDept: 'Add Department',
    actionAddEmployee: 'Add Employee',
    actionSave: 'Save Changes',
    actionCancel: 'Cancel',
    actionApprove: 'Approve & Sign',
    actionReject: 'Reject',
    actionDispatch: 'Dispatch Letter',
    actionExport: 'Export Report',
    actionSearch: 'Search records, reference, subject or sender...',
    actionFilter: 'Filter',
    actionReset: 'Reset',
    actionPrint: 'Print Official Letter',
    actionViewDetails: 'View Details',
    actionSwitchTenant: 'Switch Organisation',
    actionSwitchRole: 'Switch Role (Preview Mode)',

    // Table Headers & Labels
    colRefNumber: 'Reference Number',
    colSubject: 'Subject / Title',
    colSenderRecipient: 'Sender / Recipient',
    colDepartment: 'Department',
    colStatus: 'Status',
    colPriority: 'Priority',
    colDate: 'Date',
    colPhysicalLocation: 'Archive Location',
    colActions: 'Actions',

    // Statuses
    statusRegistered: 'Registered',
    statusUnderReview: 'Under Review',
    statusPendingApproval: 'Pending Approval',
    statusApproved: 'Approved & Stamped',
    statusDispatched: 'Dispatched',
    statusArchived: 'Archived',

    // Priority
    priorityLow: 'Low',
    priorityNormal: 'Normal',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent',

    // Customer Care
    ticketNumber: 'Ticket #',
    citizenName: 'Citizen / Client',
    ticketCategory: 'Category',
    slaDue: 'SLA Due',
    slaOnTrack: 'On Track',
    slaApproaching: 'Approaching Breach',
    slaBreached: 'SLA Overdue',
    resolveTicket: 'Resolve Ticket',

    // Notifications
    alertPendingApprovals: 'documents require your official signature and review.',
    alertSlaWarning: 'citizen customer tickets are approaching SLA response deadline.',
  },
  rw: {
    // Brand & System
    brandName: 'Indanganyandiko',
    systemTitle: 'Urubuga Rusange rwo Gucunga Amabaruwa, Inyandiko z’Ububiko no Kwakira Abagana Ikigo',
    tagline: 'Urubuga rumwe. Buri kigo. Buri nyandiko. Gahunda imwe inoze.',
    multiTenantLabel: 'Umwanya w’Ibigo Byinshi (Multi-Tenant SaaS)',
    superAdminBadge: 'Umuyobozi Mukuru w’Urubuga',

    // Modules
    navOverview: 'Incamake',
    navOrganisations: 'Ibigo n’Inzego',
    navDepartments: 'Amashami n’Abakozi',
    navIncoming: 'Amabaruwa Yinjiye',
    navOutgoing: 'Amabaruwa Asotse',
    navInternal: 'Ubutumwa bw’Imbere (Memos)',
    navReferenceRules: 'Gahunda y’Inomero (Reference)',
    navClassification: 'Ibyiciro by’Ibanga',
    navWorkflow: 'Ibyemezo n’Imikono',
    navCustomerCare: 'Kwakira Abagana Ikigo (Customer Care)',
    navArchive: 'Ububiko bw’Inyandiko',
    navEditor: 'Kwandika Inyandiko Yemewe',
    navReports: 'Raporo n’Imibare',
    navAudit: 'Umutekano n’Ibyakozwe (Audit Logs)',
    navSettings: 'Igenamiterere',

    // Common Actions
    actionNew: 'Kwandika Inyandiko Nshya',
    actionAddOrg: 'Kongeramo Ikigo Gishya',
    actionAddDept: 'Kongeramo Ishami',
    actionAddEmployee: 'Kongeramo Umukozi',
    actionSave: 'Bika Impinduka',
    actionCancel: 'Kureka',
    actionApprove: 'Kwemera & Gushyiraho Umukono',
    actionReject: 'Kwangira',
    actionDispatch: 'Kohereza Ibaruwa',
    actionExport: 'Gukuramo Raporo',
    actionSearch: 'Shakisha inyandiko, inomero, umutwe cyangwa uwanditse...',
    actionFilter: 'Akayunguruzo',
    actionReset: 'Kugarura',
    actionPrint: 'Gucapa Ibaruwa Yemewe',
    actionViewDetails: 'Reba Birambuye',
    actionSwitchTenant: 'Hindura Ikigo',
    actionSwitchRole: 'Hindura Inshingano',

    // Table Headers & Labels
    colRefNumber: 'Inomero y’Inyandiko',
    colSubject: 'Umutwe w’Inyandiko',
    colSenderRecipient: 'Uwoheje / Uwakiriye',
    colDepartment: 'Ishami Rirebwa',
    colStatus: 'Imiterere',
    colPriority: 'Ubwihutirwe',
    colDate: 'Itariki',
    colPhysicalLocation: 'Aho Ibikwa mu Bubiko',
    colActions: 'Ibikorwa',

    // Statuses
    statusRegistered: 'Yanditswe mu Gitabo',
    statusUnderReview: 'Irasuzumwa',
    statusPendingApproval: 'Itegereje Umukono',
    statusApproved: 'Yemejwe & Yashyizweho Kashe',
    statusDispatched: 'Yoherejwe',
    statusArchived: 'Yabitswe mu Bubiko',

    // Priority
    priorityLow: 'Bisanzwe buhoro',
    priorityNormal: 'Bisanzwe',
    priorityHigh: 'Byihutirwa',
    priorityUrgent: 'Byihutirwa Cyane',

    // Customer Care
    ticketNumber: 'Inomero y’Ikibazo',
    citizenName: 'Umuturage / Umukiriya',
    ticketCategory: 'Ubwoko bw’Ikibazo',
    slaDue: 'Igihe Ntarengwa',
    slaOnTrack: 'Biri mu Gihe',
    slaApproaching: 'Biri hafi Kurenga Igihe',
    slaBreached: 'Byarenze Igihe',
    resolveTicket: 'Kemura Ikibazo',

    // Notifications
    alertPendingApprovals: 'zitegereje umukono wawe n’isuzuma rya burundu.',
    alertSlaWarning: 'z’abaturage ziri hafi kurenga igihe ntarengwa cyo gusubizwa.',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
