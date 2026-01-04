"use client";

import * as React from "react";
import { mockCourses, Course } from "@/lib/mock-data";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useConfirm } from "@/components/ui/ConfirmDialog";

export function CourseManager() {
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [courses, setCourses] = React.useState<Course[]>(mockCourses);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Partial<Course>>({});

  const columns = [
    {
      name: "Course Title",
      selector: (row: Course) => row.title,
      sortable: true,
      cell: (row: Course) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg ${row.thumbnail} flex-shrink-0`}
          />
          <div>
            <div className="font-semibold text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">
              {row.duration} • {row.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row: Course) => row.category,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row: Course) => row.status, // Using status property from mock, though for manager view "Active" might be better
      cell: (row: Course) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
          Published
        </span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row: Course) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            <Edit size={14} className="text-gray-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={14} className="text-red-500" />
          </Button>
        </div>
      ),
      width: "100px",
      right: true,
    },
  ];

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Course",
      description:
        "Are you sure you want to delete this course? This action cannot be undone.",
      confirmText: "Delete",
      variant: "destructive",
    });

    if (confirmed) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      addToast("success", "Course deleted successfully.");
    }
  };

  const handleSave = () => {
    if (!editingCourse.title || !editingCourse.category) {
      addToast("error", "Please fill in all required fields.");
      return;
    }

    if (editingCourse.id) {
      // Update
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id ? ({ ...c, ...editingCourse } as Course) : c
        )
      );
      addToast("success", "Course updated successfully.");
    } else {
      // Create
      const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        title: editingCourse.title,
        category: editingCourse.category as any,
        duration: editingCourse.duration || "1h",
        progress: 0,
        thumbnail: "bg-blue-500",
        status: "Not Started",
        ...editingCourse,
      } as Course;
      setCourses((prev) => [...prev, newCourse]);
      addToast("success", "New module created successfully.");
    }
    setIsModalOpen(false);
    setEditingCourse({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Course Management</h3>
            <p className="text-sm text-blue-700">
              Create, edit, and assign learning modules to employees.
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingCourse({});
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" /> Add Module
        </Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={courses}
        searchable
        searchField="title"
        pagination
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse.id ? "Edit Module" : "Create New Module"}
        description="Define the course details and material."
      >
        <div className="space-y-4 py-4">
          <InputText
            label="Module Title"
            placeholder="e.g. Advanced Fire Safety"
            value={editingCourse.title || ""}
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, title: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <InputDropdown
                options={[
                  { label: "Technical", value: "Technical" },
                  { label: "Soft Skills", value: "Soft Skills" },
                  { label: "Compliance", value: "Compliance" },
                  { label: "Onboarding", value: "Onboarding" },
                ]}
                value={
                  editingCourse.category
                    ? {
                        label: editingCourse.category,
                        value: editingCourse.category,
                      }
                    : null
                }
                onChange={(opt) =>
                  setEditingCourse({
                    ...editingCourse,
                    category: opt?.value as any,
                  })
                }
                placeholder="Select Category"
              />
            </div>
            <InputText
              label="Duration"
              placeholder="e.g. 2h 30m"
              value={editingCourse.duration || ""}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, duration: e.target.value })
              }
            />
          </div>

          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-500">
              Upload Video or PDF Material
            </p>
            <p className="text-xs text-gray-400">(Mock Upload Area)</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Module</Button>
        </div>
      </Modal>
    </div>
  );
}
