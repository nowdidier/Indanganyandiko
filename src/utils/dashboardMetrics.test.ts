import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePriorityBreakdown,
  calculateDepartmentWorkload,
  getDaysDifference,
  calculateUpcomingDeadlines,
} from './dashboardMetrics';
import { Correspondence, CustomerTicket, Department } from '../types';

test('calculates correct priority breakdown from correspondence and tickets', () => {
  const dummyCorr: Partial<Correspondence>[] = [
    { priority: 'urgent', status: 'under_review' },
    { priority: 'high', status: 'registered' },
    { priority: 'normal', status: 'registered' },
    { priority: 'urgent', status: 'archived' }, // should be ignored (archived)
  ];

  const dummyTickets: Partial<CustomerTicket>[] = [
    { priority: 'urgent', status: 'in_progress' },
    { priority: 'normal', status: 'resolved' }, // should be ignored (resolved)
    { priority: 'low', status: 'open' },
  ];

  const breakdown = calculatePriorityBreakdown(
    dummyCorr as Correspondence[],
    dummyTickets as CustomerTicket[]
  );

  assert.equal(breakdown.urgent, 2); // 1 corr + 1 ticket
  assert.equal(breakdown.high, 1);
  assert.equal(breakdown.normal, 1);
  assert.equal(breakdown.low, 1);
  assert.equal(breakdown.total, 5);
});

test('calculates days difference accurately', () => {
  assert.equal(getDaysDifference('2026-11-15', '2026-11-11'), 4);
  assert.equal(getDaysDifference('2026-11-11', '2026-11-11'), 0);
  assert.equal(getDaysDifference('2026-11-09', '2026-11-11'), -2);
});

test('ranks deadlines with overdue items first', () => {
  const dummyCorr: Partial<Correspondence>[] = [
    { id: 'c1', subject: 'Future Task', dueDate: '2026-11-20', status: 'registered', priority: 'normal' },
  ];
  const dummyTickets: Partial<CustomerTicket>[] = [
    { id: 't1', subject: 'Urgent Overdue', slaDueDate: '2026-11-09', status: 'open', priority: 'urgent' },
    { id: 't2', subject: 'Due Tomorrow', slaDueDate: '2026-11-12', status: 'in_progress', priority: 'high' },
  ];

  const deadlines = calculateUpcomingDeadlines(
    dummyCorr as Correspondence[],
    dummyTickets as CustomerTicket[],
    '2026-11-11'
  );

  assert.equal(deadlines[0].id, 't1');
  assert.equal(deadlines[0].isOverdue, true);
  assert.equal(deadlines[1].id, 't2');
  assert.equal(deadlines[1].daysRemaining, 1);
  assert.equal(deadlines[2].id, 'c1');
  assert.equal(deadlines[2].daysRemaining, 9);
});
