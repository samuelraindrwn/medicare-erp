"use client";

import * as React from "react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { mockEmployees, Employee } from "@/lib/mock-data";
import {
  Users,
  Network,
  FileText,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Laptop,
  File,
  Download,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { InputDate } from "@/components/ui/InputDate";
import { InputText } from "@/components/ui/InputText";
import { ScheduleTab } from "./components/ScheduleTab";
import { DocumentGeneratorModal } from "./components/DocumentGeneratorModal";
import { EmployeeEditModal } from "./components/EmployeeEditModal";
import { Edit } from "lucide-react";

// --- Org Chart Components ---
interface TreeNode extends Employee {
  children: TreeNode[];
}

const buildTree = (employees: Employee[]): TreeNode[] => {
  const employeeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // 1. Create all nodes
  employees.forEach((emp) => {
    employeeMap.set(emp.id, { ...emp, children: [] });
  });

  // 2. Build hierarchy
  employees.forEach((emp) => {
    const node = employeeMap.get(emp.id)!;
    if (emp.managerId && employeeMap.has(emp.managerId)) {
      const manager = employeeMap.get(emp.managerId)!;
      manager.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const OrgNode = ({ node }: { node: TreeNode }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative z-10 w-64">
        <img
          src={node.avatar}
          alt={node.firstName}
          className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-3"
        />
        <p className="font-bold text-gray-900">
          {node.firstName} {node.lastName}
        </p>
        <p className="text-xs text-blue-600 font-medium mb-1">{node.role}</p>
        <p className="text-xs text-gray-400">{node.department}</p>
      </div>

      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex relative">
            {/* Horizontal connector line logic would go here for complex trees, 
                for now we use a simple flex row for children */}
            {/* We need a horizontal line connecting all children if multiple */}
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-16rem)] h-px bg-gray-300 hidden md:block" />
              // Simplified: A real tree usually needs precise lines.
              // We will skip the complex horizontal line for this iteration and just show branches.
            )}

            <div className="flex gap-8 pt-4">
              {node.children.map((child) => (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center"
                >
                  {/* Top vertical connector for child */}
                  {/* <div className="absolute -top-4 w-px h-4 bg-gray-300"></div> */}
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function CoreHRPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = React.useState("employees");
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    null
  );
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(
    null
  );

  // --- Analytics Logic ---
  const today = new Date();
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(
    (e) => e.status === "Active"
  ).length;
  const expiringContracts = mockEmployees.filter((e) => {
    if (!e.contractEndDate) return false;
    const end = new Date(e.contractEndDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90; // Expiring in 3 months
  }).length;

  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return null;
    const end = new Date(dateStr);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const overviewStats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Workforce",
      value: activeEmployees,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Expiring Contracts",
      value: expiringContracts,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Open Positions",
      value: "4", // Mock
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const columns: TableColumn<Employee>[] = [
    {
      name: "Employee",
      selector: (row) => row.firstName,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <img
            src={row.avatar}
            alt={row.firstName}
            className="w-10 h-10 rounded-full border border-gray-100"
          />
          <div>
            <p className="font-semibold text-gray-900">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
      minWidth: "250px",
    },
    {
      name: "Role & Dept",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.role}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Building2 size={12} />
            {row.department}
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            row.status === "Active" && "bg-green-50 text-green-700",
            row.status === "On Leave" && "bg-yellow-50 text-yellow-700",
            row.status === "Terminated" && "bg-red-50 text-red-700"
          )}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Contract",
      selector: (row) => row.contractType,
      sortable: true,
    },
    {
      name: "Join Date",
      selector: (row) => row.joinDate,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar size={14} />
          {row.joinDate}
        </div>
      ),
    },
    {
      name: "Contract End",
      sortable: true,
      selector: (row) => row.contractEndDate || "",
      cell: (row) => {
        const days = getDaysRemaining(row.contractEndDate);
        if (days === null) return <span className="text-gray-400">-</span>;

        // Logic for styling
        let colorClass = "text-green-600 bg-green-50";
        if (days < 30) colorClass = "text-red-600 bg-red-50";
        else if (days < 90) colorClass = "text-orange-600 bg-orange-50";

        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-gray-900 font-medium">
              {row.contractEndDate}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                days < 30
                  ? "bg-red-50 text-red-700 border-red-100"
                  : days < 90
                  ? "bg-orange-50 text-orange-700 border-orange-100"
                  : "bg-green-50 text-green-700 border-green-100"
              )}
            >
              {days} days left
            </span>
          </div>
        );
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            title="Edit Profile"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => setEditingEmployee(row)}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setSelectedEmployee(row)}
          >
            View
          </Button>
        </div>
      ),
      button: true,
      minWidth: "140px",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "employees":
        return (
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={cn(
                        "p-3 rounded-xl bg-gradient-to-br from-white to-transparent shadow-sm border border-gray-100/50",
                        stat.bg
                      )}
                    >
                      <stat.icon size={22} className={cn(stat.color)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <ModernDataTable
              columns={columns}
              data={mockEmployees}
              searchable
              searchField="firstName"
              filters={[
                {
                  key: "department",
                  label: "Department",
                  type: "select",
                  options: [
                    { label: "Executive", value: "Executive" },
                    { label: "Human Resources", value: "Human Resources" },
                    {
                      label: "Information Technology",
                      value: "Information Technology",
                    },
                    { label: "Finance", value: "Finance" },
                  ],
                },
                {
                  key: "status",
                  label: "Status",
                  type: "select",
                  options: [
                    { label: "Active", value: "Active" },
                    { label: "On Leave", value: "On Leave" },
                    { label: "Terminated", value: "Terminated" },
                  ],
                },
                {
                  key: "contractType",
                  label: "Contract",
                  type: "select",
                  options: [
                    { label: "Full-Time", value: "Full-Time" },
                    { label: "Part-Time", value: "Part-Time" },
                    { label: "Contract", value: "Contract" },
                  ],
                },
              ]}
            />
          </div>
        );
      case "schedule":
        return <ScheduleTab />;
      case "documents":
        const templates = [
          {
            id: 1,
            title: "Employment Certificate",
            description: "Proof of employment for loans or visa applications.",
            icon: FileText,
          },
          {
            id: 2,
            title: "Promotion Letter",
            description: "Official letter regarding role change or promotion.",
            icon: Award,
          },
          {
            id: 3,
            title: "Contract Renewal",
            description: "Agreement for extending employment contract.",
            icon: FileText,
          },
          {
            id: 4,
            title: "Termination Letter",
            description: "Official notice of employment termination.",
            icon: FileText,
          },
        ];

        const storedDocuments = [
          {
            name: "Employee_Handbook_2024.pdf",
            size: "2.4 MB",
            date: "2024-01-10",
            type: "PDF",
          },
          {
            name: "IT_Security_Policy.docx",
            size: "1.1 MB",
            date: "2024-02-15",
            type: "DOCX",
          },
          {
            name: "Holiday_Calendar_2025.xlsx",
            size: "850 KB",
            date: "2024-03-01",
            type: "XLSX",
          },
          {
            name: "Remote_Work_Agreement.pdf",
            size: "1.8 MB",
            date: "2024-03-10",
            type: "PDF",
          },
        ];

        return (
          <div className="space-y-8">
            {/* Document Generation */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Document Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <template.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {template.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">
                          {template.description}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all"
                          onClick={() => setSelectedTemplate(template.title)}
                        >
                          Generate Document
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Repository */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Company Repository
                  </h3>
                  <p className="text-sm text-gray-500">
                    Shared policies and internal documents.
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  <UploadCloud size={16} /> Upload File
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 bg-gray-50 p-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                  <div className="col-span-6 pl-2">Filename</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Uploaded</div>
                  <div className="col-span-2 text-right pr-2">Actions</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {storedDocuments.map((file, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 p-3 text-sm items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-6 flex items-center gap-3 pl-2">
                        <div className="p-2 bg-gray-100 rounded text-gray-500">
                          <File size={16} />
                        </div>
                        <span className="font-medium text-gray-900">
                          {file.name}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-500">
                        {file.size}
                      </div>
                      <div className="col-span-2 text-gray-500">
                        {file.date}
                      </div>
                      <div className="col-span-2 flex justify-end gap-2 pr-2">
                        <button
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal */}
            {selectedTemplate && (
              <DocumentGeneratorModal
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                templateTitle={selectedTemplate}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Core HR</h1>
          <p className="text-sm text-gray-500">
            Employee database and organization management.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs">
          {[
            { id: "employees", name: "Employees", icon: Users },
            { id: "schedule", name: "Interviews & Schedule", icon: Calendar },
            { id: "documents", name: "Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group inline-flex items-center py-3 px-4 font-medium text-sm transition-all rounded-t-lg border-b-2",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <tab.icon
                className={cn(
                  "mr-2 h-4 w-4 transition-colors",
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderTabContent()}
      </div>

      {/* Employee Modal */}
      <Modal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={
          selectedEmployee
            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
            : "Employee Details"
        }
        description="Manage employee profile, contract details, and comprehensive history."
        size="2xl"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Header Profile */}
            <div className="flex items-center gap-4 border-b pb-6">
              <img
                src={selectedEmployee.avatar}
                className="w-16 h-16 rounded-full border-2 border-gray-100"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-gray-500">
                  {selectedEmployee.role} &bull; {selectedEmployee.department}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                    {selectedEmployee.contractType}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addToast("success", "Opened Promotion Workflow")
                  }
                >
                  Promote
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    addToast("success", "Contract Renewed by 1 Year!")
                  }
                >
                  Renew Contract
                </Button>
              </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Briefcase size={16} /> Employment History
                </h4>
                <div className="relative border-l border-gray-200 ml-2 space-y-6">
                  {selectedEmployee.history?.map((event, i) => (
                    <div key={i} className="ml-6 relative">
                      <div className="absolute -left-[1.95rem] w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.action}
                      </p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.description}
                      </p>
                    </div>
                  ))}
                  {!selectedEmployee.history && (
                    <p className="text-sm text-gray-400 ml-6">
                      No history found.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Laptop size={16} /> Assets Assigned
                </h4>
                <ul className="space-y-3">
                  {selectedEmployee.assets?.map((asset, i) => (
                    <li
                      key={i}
                      className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm"
                    >
                      <span>{asset.item}</span>
                      <span className="bg-white px-2 py-0.5 rounded border text-xs text-gray-500">
                        {asset.serialNumber}
                      </span>
                    </li>
                  ))}
                  {!selectedEmployee.assets && (
                    <p className="text-sm text-gray-400">No assets assigned.</p>
                  )}
                </ul>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <TrendingUp size={16} /> Stats
                  </h4>
                  <div className="flex justify-between items-center text-sm p-3 bg-orange-50 rounded-lg text-orange-700">
                    <span>Contract Ends</span>
                    <span className="font-bold">
                      {selectedEmployee.contractEndDate || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      {editingEmployee && (
        <EmployeeEditModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
          onSave={(updated) => {
            // In a real app, this would be an API call
            // For mock, we just close the modal and show success (handled in Modal)
            // We can optionally update the local data array if we moved it to state,
            // but for this prototype, the Toast confirms the action.
            const index = mockEmployees.findIndex((e) => e.id === updated.id);
            if (index !== -1) mockEmployees[index] = updated; // local mutation for consistency in session
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
}
