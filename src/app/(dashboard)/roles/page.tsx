"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Plus, Edit } from "lucide-react";
import { InputText } from "@/components/ui/InputText";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ModernDataTable } from "@/components/ui/DataTable";
import { TableColumn } from "react-data-table-component";

interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
}

export default function RolesPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [roles, setRoles] = React.useState<Role[]>([
    {
      id: 1,
      name: "Superadmin",
      description: "Full access to all modules and configurations.",
      usersCount: 2,
    },
    {
      id: 2,
      name: "Admin",
      description: "Access to user management and operational modules.",
      usersCount: 5,
    },
    {
      id: 3,
      name: "Doctor",
      description: "Access to patient records and scheduling.",
      usersCount: 15,
    },
    {
      id: 4,
      name: "Nurse",
      description: "Access to patient vitals and care plans.",
      usersCount: 30,
    },
    {
      id: 5,
      name: "HR",
      description:
        "Access to human resources, payroll, and employee management.",
      usersCount: 4,
    },
    {
      id: 6,
      name: "Finance",
      description: "Access to billing, invoicing, and financial reports.",
      usersCount: 6,
    },
    {
      id: 7,
      name: "Warehouse",
      description: "Access to inventory, stock management, and procurement.",
      usersCount: 8,
    },
    {
      id: 8,
      name: "Patient",
      description:
        "Limited access to personal health records and appointments.",
      usersCount: 120,
    },
  ]);

  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRoleDesc, setNewRoleDesc] = React.useState("");

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setRoles([
        ...roles,
        {
          id: roles.length + 1,
          name: newRoleName,
          description: newRoleDesc,
          usersCount: 0,
        },
      ]);
      setIsLoading(false);
      setIsModalOpen(false);
      setNewRoleName("");
      setNewRoleDesc("");
      addToast("success", "Role created successfully");
    }, 800);
  };

  const columns: TableColumn<Role>[] = [
    {
      name: "Role Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Shield size={18} />
          </div>
          <span className="font-semibold text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
    },
    {
      name: "Users",
      selector: (row) => row.usersCount,
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {row.usersCount} users
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit size={16} className="mr-1" /> Edit Permissions
        </Button>
      ),
      right: true,
      width: "180px",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500">
            Manage user roles and their access levels.
          </p>
        </div>
      </div>

      <ModernDataTable
        columns={columns}
        data={roles}
        searchable
        searchField="name"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Role
          </Button>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Custom Role"
        description="Define a new role for the system."
      >
        <form
          id="create-role-form"
          onSubmit={handleCreateRole}
          className="space-y-4"
        >
          <InputText
            label="Role Name"
            placeholder="e.g. Pharmacist"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
          />
          <InputText
            label="Description"
            placeholder="Briefly describe the responsibilities..."
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            required
          />
        </form>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form="create-role-form" isLoading={isLoading}>
            Create Role
          </Button>
        </div>
      </Modal>
    </div>
  );
}
