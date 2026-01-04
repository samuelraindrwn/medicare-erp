"use client";

import * as React from "react";
import {
  Inbox,
  Mail,
  Search,
  Filter,
  MoreVertical,
  Archive,
  Trash2,
  Reply,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [activeTab, setActiveTab] = React.useState("all");

  const emails = [
    {
      id: 1,
      sender: "System Alert",
      subject: "New Patient Registration",
      preview: "Sarah Connor has been added to the system under Cardiology...",
      time: "5 min ago",
      unread: true,
      category: "notifications",
    },
    {
      id: 2,
      sender: "Dr. John Smith",
      subject: "Lab Report Review Requested",
      preview: "Please review the latest lab results for patient ID #8829...",
      time: "1 hour ago",
      unread: true,
      category: "messages",
    },
    {
      id: 3,
      sender: "HR Department",
      subject: "Upcoming Policy Update",
      preview: "Starting next month, there will be changes to the insurance...",
      time: "3 hours ago",
      unread: false,
      category: "announcements",
    },
    {
      id: 4,
      sender: "Pharmacy Dept",
      subject: "Stock Alert: Amoxicillin",
      preview:
        "Current stock level for Amoxicillin 500mg is below threshold...",
      time: "Yesterday",
      unread: false,
      category: "notifications",
    },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Inbox size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage your notifications, messages, and announcements.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Inbox Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {["all", "unread", "important"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize",
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search mail..."
                className="bg-gray-50 border border-gray-100 text-xs rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 thin-scrollbar">
          {emails.map((email) => (
            <div
              key={email.id}
              className={cn(
                "group p-4 flex items-center gap-4 hover:bg-blue-50/30 cursor-pointer transition-all",
                email.unread ? "bg-blue-50/10" : "opacity-80"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm",
                  email.category === "notifications"
                    ? "bg-blue-500"
                    : email.category === "messages"
                    ? "bg-purple-500"
                    : "bg-orange-500"
                )}
              >
                {email.sender.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3
                    className={cn(
                      "text-sm truncate",
                      email.unread ? "font-bold text-gray-900" : "text-gray-600"
                    )}
                  >
                    {email.sender}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {email.time}
                  </span>
                </div>
                <h4
                  className={cn(
                    "text-xs mb-1 truncate",
                    email.unread
                      ? "font-semibold text-gray-800"
                      : "text-gray-500"
                  )}
                >
                  {email.subject}
                </h4>
                <p className="text-xs text-gray-400 truncate leading-relaxed">
                  {email.preview}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded transition-colors"
                  title="Archive"
                >
                  <Archive size={14} />
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Inbox Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 px-6">
          <div className="flex items-center gap-4">
            <span>2.4GB / 5GB (48%) used</span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-[48%] h-full bg-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:text-gray-600">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-gray-600">Account Security</button>
          </div>
        </div>
      </div>
    </div>
  );
}
