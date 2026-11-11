export type SectorType = 
  | 'government' 
  | 'private' 
  | 'ngo' 
  | 'education' 
  | 'healthcare' 
  | 'finance';

export type UserRole = 
  | 'super_admin' 
  | 'org_admin' 
  | 'dept_head' 
  | 'records_officer' 
  | 'secretary' 
  | 'staff_member' 
  | 'customer_care' 
  | 'viewer';

export type CorrespondenceType = 'incoming' | 'outgoing' | 'internal';

export type CorrespondenceStatus = 
  | 'registered' 
  | 'under_review' 
  | 'pending_approval' 
  | 'approved' 
  | 'dispatched' 
  | 'archived';

export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export type TransmissionMethod = 
  | 'physical_courier' 
  | 'hand_delivery' 
  | 'email' 
  | 'digital_portal' 
  | 'postal';

export type ConfidentialityLevel = 
  | 'public' 
  | 'internal' 
  | 'confidential' 
  | 'secret' 
  | 'top_secret';

export type TicketCategory = 
  | 'inquiry' 
  | 'complaint' 
  | 'service_request' 
  | 'appeal';

export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'pending_correspondence' 
  | 'resolved' 
  | 'closed';

export type SLAStatus = 'on_track' | 'approaching_breach' | 'breached';

export type Language = 'en' | 'rw';

export interface Organisation {
  id: string;
  name: string;
  shortName: string;
  sectorType: SectorType;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoLetter: string;
  colorScheme: string;
  motto: string;
  status: 'active' | 'suspended';
  createdAt: string;
  departmentsCount: number;
  employeesCount: number;
  activeDocumentsCount: number;
}

export interface Department {
  id: string;
  orgId: string;
  name: string;
  code: string;
  headName: string;
  headEmployeeId?: string;
  description: string;
}

export interface Employee {
  id: string;
  orgId: string;
  departmentId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  position: string;
  avatarText: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface NumberingRule {
  id: string;
  orgId: string;
  docType: CorrespondenceType | 'customer_ticket';
  pattern: string; // e.g. "[ORG]/[DEPT]/[YEAR]/[CAT]/[SEQ:4]"
  prefix: string;
  currentSequence: number;
  minDigits: number;
  resetCadence: 'yearly' | 'monthly' | 'never';
  lastGeneratedNumber?: string;
  description: string;
}

export interface DocumentClassification {
  id: string;
  orgId: string;
  name: string;
  code: string;
  confidentiality: ConfidentialityLevel;
  retentionYears: number; // 0 means permanent
  actionAfterRetention: 'archive_permanently' | 'review' | 'destroy';
  description: string;
}

export interface ApprovalStep {
  stepNumber: number;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected' | 'delegated';
  comments?: string;
  timestamp?: string;
}

export interface Correspondence {
  id: string;
  orgId: string;
  docType: CorrespondenceType;
  referenceNumber: string;
  subject: string;
  senderName: string;
  senderEntity: string;
  recipientName: string;
  recipientEntity: string;
  departmentId: string;
  assignedEmployeeId?: string;
  classificationId: string;
  status: CorrespondenceStatus;
  priority: PriorityLevel;
  transmissionMethod: TransmissionMethod;
  dateReceivedOrSent: string;
  dueDate?: string;
  physicalLocation: string; // e.g., "Cabinet C-3, Shelf 2, File 14"
  attachmentsCount: number;
  summary: string;
  contentBody: string;
  tags: string[];
  approvalHistory: ApprovalStep[];
  digitalStampApproved?: boolean;
  createdAt: string;
}

export interface CustomerTicket {
  id: string;
  orgId: string;
  ticketNumber: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: PriorityLevel;
  status: TicketStatus;
  departmentId: string;
  assignedEmployeeId?: string;
  slaDueDate: string;
  slaStatus: SLAStatus;
  linkedCorrespondenceRef?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface DocumentDraft {
  id: string;
  orgId: string;
  title: string;
  docType: CorrespondenceType;
  departmentId: string;
  templateType: 'official_letter' | 'internal_memo' | 'public_circular' | 'complaint_response';
  referenceNumber: string;
  recipient: string;
  recipientTitle: string;
  subject: string;
  salutation: string;
  paragraphs: string[];
  signatoryName: string;
  signatoryTitle: string;
  copiesTo: string[];
  lastModified: string;
}
