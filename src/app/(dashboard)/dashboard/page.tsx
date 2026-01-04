"use client";

import * as React from "react";
import {
  Users,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp,
  UserPlus,
  FileText,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  {
    label: "Total Patients",
    value: "1,284",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Monthly Revenue",
    value: "$48,290",
    change: "+8.2%",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Active Staff",
    value: "142",
    change: "+4%",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Appointments",
    value: "84",
    change: "+24 today",
    icon: Calendar,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const mockActivity = [
  {
    user: "Dr. Sarah Smith",
    action: "completed appointment",
    target: "Patient #1024",
    time: "10 minutes ago",
    icon: Activity,
  },
  {
    user: "HR System",
    action: "posted new job opening",
    target: "Senior Nurse",
    time: "25 minutes ago",
    icon: Users,
  },
  {
    user: "Finance Dept",
    action: "generated invoice",
    target: "INV-2024-001",
    time: "1 hour ago",
    icon: DollarSign,
  },
  {
    user: "System",
    action: "backup completed",
    target: "Daily Snapshot",
    time: "2 hours ago",
    icon: FileText,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Administrator. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} /> Jan 2026
          </Button>
          <Button className="gap-2">
            <FileText size={16} /> Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area (Placeholder) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Revenue Overview</h3>
            <Button variant="ghost" size="sm">
              View Full Report
            </Button>
          </div>
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>Chart Visualization Area</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <Bell size={16} className="text-gray-400" />
          </div>
          <div className="space-y-6">
            {mockActivity.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                    <item.icon size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{item.user}</span>{" "}
                    {item.action}{" "}
                    <span className="font-medium text-blue-600">
                      {item.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-6 text-sm text-gray-500 hover:text-gray-900"
          >
            View All History
          </Button>
        </div>
      </div>
    </div>
  );
}
