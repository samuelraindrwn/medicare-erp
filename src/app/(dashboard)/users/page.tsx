"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { TableColumn } from "react-data-table-component";

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  email: string;
}

export default function UsersPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    username: "",
    role: { label: "Admin", value: "admin" },
    email: "",
    password: "",
  });

  // Mock Data
  const [users, setUsers] = React.useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      role: "Superadmin",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      role: "Admin",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Robert Johnson",
      username: "rjohnson",
      role: "Doctor",
      email: "robert@medicare.com",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        username: formData.username,
        role: formData.role ? formData.role.label : "Admin",
        email: formData.email,
      };
      setUsers([...users, newUser]);
      setIsLoading(false);
      setIsModalOpen(false);
      addToast("success", "User created successfully");
      setFormData({
        name: "",
        username: "",
        role: { label: "Admin", value: "admin" },
        email: "",
        password: "",
      });
    }, 1000);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
      addToast("success", "User deleted");
    }
  };

  const columns: TableColumn<User>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === "Superadmin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800">
            <Edit size={16} />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "100px",
      right: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">
            Manage system administrators and roles.
          </p>
        </div>
      </div>

      <ModernDataTable
        columns={columns}
        data={users}
        searchable
        searchField="name"
        filters={[
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "Superadmin", value: "Superadmin" },
              { label: "Admin", value: "Admin" },
              { label: "Doctor", value: "Doctor" },
              { label: "Nurse", value: "Nurse" },
            ],
          },
        ]}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
        description="Add a new administrator to the system."
      >
        <form
          id="create-user-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <InputText
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g. John Doe"
          />
          <InputText
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            placeholder="e.g. jdoe"
          />
          <InputText
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="e.g. john@example.com"
          />
          <InputDropdown
            label="Role"
            name="role"
            value={formData.role}
            onChange={(option) =>
              setFormData((prev) => ({ ...prev, role: option as any }))
            }
            options={[
              { label: "Admin", value: "admin" },
              { label: "Superadmin", value: "superadmin" },
              { label: "Doctor", value: "doctor" },
              { label: "Nurse", value: "nurse" },
            ]}
          />
          <InputText
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="••••••••"
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
          <Button type="submit" form="create-user-form" isLoading={isLoading}>
            Create User
          </Button>
        </div>
      </Modal>
    </div>
  );
}
