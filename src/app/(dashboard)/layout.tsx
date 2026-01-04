"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  User,
  X,
  Inbox,
  Clock,
} from "lucide-react";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Patient Registered",
      message: "Sarah Connor has been added to the system.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "John Wick has an appointment at 2:00 PM.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Lab Results Ready",
      message: "Ellen Ripley's lab results are now available.",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const searchableItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Patients", href: "/patient" },
    { name: "HR", href: "/hr" },
    { name: "Finance", href: "/finance" },
    { name: "Inventory", href: "/inventory" },
    { name: "Procurement", href: "/procurement" },
    { name: "Users", href: "/users" },
    { name: "Roles", href: "/roles" },
  ];

  const filteredItems = searchQuery
    ? searchableItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8 bg-white/80 backdrop-blur-md z-10 relative border-b border-gray-200">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu size={24} />
              </button>

              {/* Center Search Bar */}
              <div className="flex-1 max-w-xl mx-4 relative hidden sm:block">
                <div className="relative group">
                  <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    className="w-full bg-gray-50/50 border border-gray-200 text-sm text-gray-900 rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:shadow-xl focus:shadow-blue-500/5 transition-all hover:border-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchQuery && isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Menu Items
                    </div>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                          onClick={() => setSearchQuery("")}
                        >
                          <Search size={14} className="mr-3 text-gray-400" />
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>

                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setNotificationOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Notifications
                          </h3>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                            {notifications.filter((n) => n.unread).length} new
                          </span>
                        </div>
                        <div className="max-h-80 overflow-y-auto thin-scrollbar">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                                notif.unread ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full mt-2 ${
                                    notif.unread ? "bg-blue-500" : "bg-gray-300"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                    <Clock size={10} />
                                    {notif.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link
                          href="/inbox"
                          onClick={() => setNotificationOpen(false)}
                          className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-blue-600 transition-colors"
                        >
                          <Inbox size={16} />
                          View All Notifications
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-sm text-right hidden sm:block">
                  <div className="font-medium text-gray-900 border-l pl-4 border-gray-200">
                    Medicare Inc.
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
