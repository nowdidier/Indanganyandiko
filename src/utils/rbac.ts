import { UserRole } from '../types';

export interface UserPermissionContext {
  role: UserRole;
  userOrgId: string;
  userDepartmentId?: string;
}

export function canAccessPlatformAdmin(role: UserRole): boolean {
  return role === 'super_admin';
}

export function canManageOrganisation(role: UserRole): boolean {
  return role === 'super_admin' || role === 'org_admin';
}

export function canManageDepartments(role: UserRole): boolean {
  return role === 'super_admin' || role === 'org_admin';
}

export function canRegisterCorrespondence(role: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'org_admin' ||
    role === 'records_officer' ||
    role === 'secretary'
  );
}

export function canApproveCorrespondence(role: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'org_admin' ||
    role === 'dept_head'
  );
}

export function canDispatchCorrespondence(role: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'org_admin' ||
    role === 'records_officer' ||
    role === 'secretary'
  );
}

export function canManageCustomerCare(role: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'org_admin' ||
    role === 'customer_care' ||
    role === 'records_officer'
  );
}

export function canManageArchive(role: UserRole): boolean {
  return (
    role === 'super_admin' ||
    role === 'org_admin' ||
    role === 'records_officer'
  );
}

export function canConfigureReferenceNumbers(role: UserRole): boolean {
  return role === 'super_admin' || role === 'org_admin';
}

export function isReadOnlyRole(role: UserRole): boolean {
  return role === 'viewer';
}

/**
 * Multi-tenant isolation validator:
 * Super Admins can view all organisations.
 * All other roles are strictly locked to their own organisation ID.
 */
export function hasTenantAccess(userContext: UserPermissionContext, targetOrgId: string): boolean {
  if (userContext.role === 'super_admin') {
    return true;
  }
  return userContext.userOrgId === targetOrgId;
}

export function getRoleDisplayName(role: UserRole, lang: 'en' | 'rw' = 'en'): string {
  const titlesEn: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    org_admin: 'Organisation Admin',
    dept_head: 'Department Head',
    records_officer: 'Records Officer',
    secretary: 'Secretary',
    staff_member: 'Staff Member',
    customer_care: 'Customer Care Officer',
    viewer: 'Viewer',
  };

  const titlesRw: Record<UserRole, string> = {
    super_admin: 'Umuyobozi Mukuru w’Urubuga',
    org_admin: 'Umuyobozi w’Ikigo',
    dept_head: 'Umuyobozi w’Ishami',
    records_officer: 'Ushinzwe Ububiko n’Ubwanditsi',
    secretary: 'Umunyamabanga',
    staff_member: 'Umukozi',
    customer_care: 'Ushinzwe Kwakira Abagana Ikigo',
    viewer: 'Ureba Gusa',
  };

  return lang === 'rw' ? titlesRw[role] : titlesEn[role];
}
