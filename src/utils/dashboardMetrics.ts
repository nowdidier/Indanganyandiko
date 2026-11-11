import { Correspondence, CustomerTicket, Department, PriorityLevel } from '../types';

export interface PriorityBreakdown {
  urgent: number;
  high: number;
  normal: number;
  low: number;
  total: number;
}

export interface DepartmentWorkload {
  deptId: string;
  deptCode: string;
  deptName: string;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
}

export interface DeadlineItem {
  id: string;
  title: string;
  type: 'correspondence' | 'ticket';
  referenceOrNumber: string;
  dueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  priority: PriorityLevel;
  entityOrCitizen: string;
}

export function calculatePriorityBreakdown(
  correspondence: Correspondence[],
  tickets: CustomerTicket[]
): PriorityBreakdown {
  let urgent = 0;
  let high = 0;
  let normal = 0;
  let low = 0;

  for (const c of correspondence) {
    if (c.status !== 'archived' && c.status !== 'dispatched') {
      if (c.priority === 'urgent') urgent++;
      else if (c.priority === 'high') high++;
      else if (c.priority === 'normal') normal++;
      else low++;
    }
  }

  for (const t of tickets) {
    if (t.status !== 'resolved' && t.status !== 'closed') {
      if (t.priority === 'urgent') urgent++;
      else if (t.priority === 'high') high++;
      else if (t.priority === 'normal') normal++;
      else low++;
    }
  }

  return {
    urgent,
    high,
    normal,
    low,
    total: urgent + high + normal + low,
  };
}

export function calculateDepartmentWorkload(
  departments: Department[],
  correspondence: Correspondence[]
): DepartmentWorkload[] {
  return departments.map((dept) => {
    const deptDocs = correspondence.filter((c) => c.departmentId === dept.id);
    const pending = deptDocs.filter(
      (c) => c.status === 'under_review' || c.status === 'pending_approval' || c.status === 'registered'
    ).length;
    const completed = deptDocs.filter(
      (c) => c.status === 'approved' || c.status === 'dispatched' || c.status === 'archived'
    ).length;

    return {
      deptId: dept.id,
      deptCode: dept.code,
      deptName: dept.name,
      pendingCount: pending,
      completedCount: completed,
      totalCount: deptDocs.length,
    };
  });
}

export function getDaysDifference(dueDateStr: string, currentIsoDate?: string): number {
  const current = currentIsoDate ? new Date(currentIsoDate) : new Date();
  current.setHours(0, 0, 0, 0);

  const target = new Date(dueDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - current.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateUpcomingDeadlines(
  correspondence: Correspondence[],
  tickets: CustomerTicket[],
  currentDateIso?: string
): DeadlineItem[] {
  const items: DeadlineItem[] = [];

  // Correspondence with dueDate
  for (const c of correspondence) {
    if (c.dueDate && c.status !== 'dispatched' && c.status !== 'archived') {
      const days = getDaysDifference(c.dueDate, currentDateIso);
      items.push({
        id: c.id,
        title: c.subject,
        type: 'correspondence',
        referenceOrNumber: c.referenceNumber,
        dueDate: c.dueDate,
        daysRemaining: days,
        isOverdue: days < 0,
        priority: c.priority,
        entityOrCitizen: c.recipientEntity || c.senderEntity,
      });
    }
  }

  // Tickets with slaDueDate
  for (const t of tickets) {
    if (t.slaDueDate && t.status !== 'resolved' && t.status !== 'closed') {
      const days = getDaysDifference(t.slaDueDate, currentDateIso);
      items.push({
        id: t.id,
        title: t.subject,
        type: 'ticket',
        referenceOrNumber: t.ticketNumber,
        dueDate: t.slaDueDate,
        daysRemaining: days,
        isOverdue: days < 0,
        priority: t.priority,
        entityOrCitizen: t.citizenName,
      });
    }
  }

  // Sort by urgency: overdue first, then closest deadline
  return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
