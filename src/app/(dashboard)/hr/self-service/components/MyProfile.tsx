"use client";

import * as React from "react";
import { mockEmployees, Employee } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { useToast } from "@/components/ui/Toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Save,
} from "lucide-react";

// Mock logged-in employee
const CURRENT_EMPLOYEE_ID = "emp-5";

export function MyProfile() {
  const { addToast } = useToast();
  const employee = mockEmployees.find((e) => e.id === CURRENT_EMPLOYEE_ID);
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState({
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta",
    emergencyContact: "Jane Wright (+62 811 2345 6789)",
  });

  if (!employee) return <div>Employee not found</div>;

  const handleSave = () => {
    setIsEditing(false);
    addToast("success", "Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <img
            src={employee.avatar}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-blue-200">{employee.role}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <Briefcase size={14} /> {employee.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Joined {employee.joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-2" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="font-medium text-gray-900">{employee.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>
            </div>

            {isEditing ? (
              <InputText
                label="Phone Number"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <InputText
                label="Address"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{profile.address}</p>
                </div>
              </div>
            )}

            {isEditing ? (
              <InputText
                label="Emergency Contact"
                value={profile.emergencyContact}
                onChange={(e) =>
                  setProfile({ ...profile, emergencyContact: e.target.value })
                }
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="font-medium text-gray-900">
                    {profile.emergencyContact}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{employee.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Leave Balances
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 uppercase font-medium">
              Annual Leave
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {employee.leaveBalance?.annual ?? 0} days
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-xs text-green-600 uppercase font-medium">
              Sick Leave
            </p>
            <p className="text-2xl font-bold text-green-700">
              {employee.leaveBalance?.sick ?? 0} days
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Unpaid Used
            </p>
            <p className="text-2xl font-bold text-gray-700">
              {employee.leaveBalance?.unpaid ?? 0} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
