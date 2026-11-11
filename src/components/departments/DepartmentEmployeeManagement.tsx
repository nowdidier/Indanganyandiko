import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';
import { getRoleDisplayName } from '../../utils/rbac';
import { Department, Employee, UserRole } from '../../types';
import {
  Users,
  Building,
  Plus,
  Mail,
  Phone,
  Shield,
  Briefcase,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';

export const DepartmentEmployeeManagement: React.FC = () => {
  const {
    activeOrg,
    tenantDepartments,
    tenantEmployees,
    addDepartment,
    addEmployee,
    language,
    activeRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'departments' | 'employees'>('departments');
  const [showDeptModal, setShowDeptModal] = useState<boolean>(false);
  const [showEmpModal, setShowEmpModal] = useState<boolean>(false);

  // New Dept Form
  const [deptName, setDeptName] = useState<string>('');
  const [deptCode, setDeptCode] = useState<string>('');
  const [headName, setHeadName] = useState<string>('');
  const [deptDesc, setDeptDesc] = useState<string>('');

  // New Employee Form
  const [empName, setEmpName] = useState<string>('');
  const [empEmail, setEmpEmail] = useState<string>('');
  const [empPhone, setEmpPhone] = useState<string>('');
  const [empRole, setEmpRole] = useState<UserRole>('staff_member');
  const [empPosition, setEmpPosition] = useState<string>('');
  const [empDeptId, setEmpDeptId] = useState<string>(tenantDepartments[0]?.id || '');

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    addDepartment({
      name: deptName,
      code: deptCode.toUpperCase(),
      headName: headName || 'Acting Head',
      description: deptDesc || 'Operational department under ' + activeOrg.name,
    });
    setShowDeptModal(false);
    setDeptName('');
    setDeptCode('');
    setHeadName('');
    setDeptDesc('');
  };

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) return;

    const initials = empName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    addEmployee({
      departmentId: empDeptId || tenantDepartments[0]?.id || 'dept-1',
      name: empName,
      email: empEmail,
      phone: empPhone || '+250 788 000 000',
      role: empRole,
      position: empPosition || 'Staff Specialist',
      avatarText: initials,
      status: 'active',
    });
    setShowEmpModal(false);
    setEmpName('');
    setEmpEmail('');
    setEmpPhone('');
    setEmpPosition('');
  };

  const getDeptName = (deptId: string) => {
    return tenantDepartments.find((d) => d.id === deptId)?.name || 'General';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Users className="w-4 h-4" />
            <span>MODULE 02 · INSTITUTIONAL STRUCTURE & ROLE HIERARCHY</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'rw' ? 'Amashami n’Abakozi b’Ikigo' : 'Departments & Staff Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeOrg.name} · {tenantDepartments.length} Departments · {tenantEmployees.length} Active Staff Members
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'departments' ? (
            <button
              onClick={() => setShowDeptModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'actionAddDept')}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowEmpModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'actionAddEmployee')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'departments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {language === 'rw' ? 'Amashami (Departments)' : 'Departments'} ({tenantDepartments.length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'employees'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {language === 'rw' ? 'Abakozi n’Inshingano (Staff & RBAC)' : 'Employees & Roles'} ({tenantEmployees.length})
        </button>
      </div>

      {/* Department Cards Grid */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenantDepartments.map((dept) => {
            const staffCount = tenantEmployees.filter((e) => e.departmentId === dept.id).length;
            return (
              <div key={dept.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {dept.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{dept.name}</h3>
                  </div>
                  <Building className="w-4 h-4 text-slate-400" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {dept.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Department Head</span>
                    <span className="font-medium text-slate-800">{dept.headName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Assigned Staff</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">{staffCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employees Table */}
      {activeTab === 'employees' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Staff Member</th>
                  <th className="py-2.5 px-4">Assigned Department</th>
                  <th className="py-2.5 px-4">Role & Access Level</th>
                  <th className="py-2.5 px-4">Position Title</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenantEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {emp.avatarText}
                        </div>
                        <div>
                          <div className="font-semibold">{emp.name}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {getDeptName(emp.departmentId)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {getRoleDisplayName(emp.role, language)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {emp.position}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {emp.phone}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Add Department</h2>
            <form onSubmit={handleCreateDept} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Planning, Monitoring & Evaluation"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code (for Ref tokens) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    placeholder="e.g. PME"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs uppercase font-mono font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Head of Department</label>
                  <input
                    type="text"
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    placeholder="e.g. Marie Claire"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="Institutional remit and function..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Onboard Employee</h2>
            <form onSubmit={handleCreateEmp} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="e.g. Diane Mukamana"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    placeholder="diane@org.rw"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="+250 788 111 222"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={empDeptId}
                    onChange={(e) => setEmpDeptId(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    {tenantDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Role *</label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value as UserRole)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="org_admin">Organisation Admin</option>
                    <option value="dept_head">Department Head</option>
                    <option value="records_officer">Records Officer</option>
                    <option value="secretary">Secretary</option>
                    <option value="staff_member">Staff Member</option>
                    <option value="customer_care">Customer Care Officer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position Title</label>
                <input
                  type="text"
                  value={empPosition}
                  onChange={(e) => setEmpPosition(e.target.value)}
                  placeholder="e.g. Senior Archives Specialist"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Onboard Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
