import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessPlatformAdmin,
  canManageOrganisation,
  canRegisterCorrespondence,
  canApproveCorrespondence,
  hasTenantAccess,
} from './rbac';

test('super admin has global access', () => {
  assert.equal(canAccessPlatformAdmin('super_admin'), true);
  assert.equal(canAccessPlatformAdmin('org_admin'), false);
  assert.equal(hasTenantAccess({ role: 'super_admin', userOrgId: 'org-1' }, 'org-2'), true);
});

test('org admin cannot access other tenant data', () => {
  const user = { role: 'org_admin' as const, userOrgId: 'org-minaloc' };
  assert.equal(hasTenantAccess(user, 'org-minaloc'), true);
  assert.equal(hasTenantAccess(user, 'org-kfh'), false);
  assert.equal(canManageOrganisation('org_admin'), true);
});

test('records officer can register correspondence but cannot manage organisation', () => {
  assert.equal(canRegisterCorrespondence('records_officer'), true);
  assert.equal(canManageOrganisation('records_officer'), false);
  assert.equal(canApproveCorrespondence('records_officer'), false);
});

test('department head can approve correspondence in their domain', () => {
  assert.equal(canApproveCorrespondence('dept_head'), true);
  assert.equal(canApproveCorrespondence('staff_member'), false);
});
