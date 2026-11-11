import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { OrganisationManagement } from './components/organisations/OrganisationManagement';
import { DepartmentEmployeeManagement } from './components/departments/DepartmentEmployeeManagement';
import { CorrespondenceList } from './components/correspondence/CorrespondenceList';
import { CorrespondenceModal } from './components/correspondence/CorrespondenceModal';
import { ReferenceNumberManager } from './components/reference/ReferenceNumberManager';
import { ClassificationManager } from './components/classification/ClassificationManager';
import { WorkflowApprovals } from './components/workflow/WorkflowApprovals';
import { CustomerCareManager } from './components/customercare/CustomerCareManager';
import { DocumentArchive } from './components/archive/DocumentArchive';
import { DocumentEditor } from './components/editor/DocumentEditor';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SystemSettings } from './components/settings/SystemSettings';
import { CorrespondenceType } from './types';

const MainApp: React.FC = () => {
  const { activeModule } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<CorrespondenceType>('incoming');

  const handleOpenModal = (type: CorrespondenceType = 'incoming') => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewDashboard onOpenNewDocModal={() => handleOpenModal('incoming')} />;
      case 'organisations':
        return <OrganisationManagement />;
      case 'departments':
        return <DepartmentEmployeeManagement />;
      case 'incoming':
        return (
          <CorrespondenceList
            key="incoming"
            initialTypeFilter="incoming"
            onOpenNewModal={handleOpenModal}
          />
        );
      case 'outgoing':
        return (
          <CorrespondenceList
            key="outgoing"
            initialTypeFilter="outgoing"
            onOpenNewModal={handleOpenModal}
          />
        );
      case 'internal':
        return (
          <CorrespondenceList
            key="internal"
            initialTypeFilter="internal"
            onOpenNewModal={handleOpenModal}
          />
        );
      case 'editor':
        return <DocumentEditor />;
      case 'reference-rules':
        return <ReferenceNumberManager />;
      case 'classifications':
        return <ClassificationManager />;
      case 'workflow':
        return <WorkflowApprovals />;
      case 'customer-care':
        return <CustomerCareManager />;
      case 'archive':
        return <DocumentArchive />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'audit':
        return <AuditLogsView />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OverviewDashboard onOpenNewDocModal={() => handleOpenModal('incoming')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNav onOpenNewDocModal={() => handleOpenModal('incoming')} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderModuleContent()}
        </main>
      </div>

      <CorrespondenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDocType={modalDefaultType}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
