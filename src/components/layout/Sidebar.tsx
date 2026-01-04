"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Package,
  ShoppingCart,
  UserCog,
  Shield,
  ChevronDown,
  ClipboardList,
  Calendar,
  FileText,
  Building2,
  CreditCard,
  Timer,
  Award,
  UserCheck,
  BookOpen,
  Receipt,
  Wallet,
  BarChart3,
  PieChart,
  ReceiptText,
  Pill,
  Microscope,
  Syringe,
  Monitor,
  Building,
  FileQuestion,
  FileCheck,
  FileSignature,
  User,
  Settings,
  LogOut,
  History,
  FileSearch,
  ShieldAlert,
} from "lucide-react";

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([
    "Patients",
  ]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      href: "/dashboard",
    },
    {
      name: "Patients",
      icon: <Users size={18} />,
      subItems: [
        {
          name: "Patient Information",
          href: "/patient",
          icon: <ClipboardList size={16} />,
        },
        {
          name: "Patient Schedule",
          href: "/patient/schedule",
          icon: <Calendar size={16} />,
        },
        {
          name: "Patient Records",
          href: "/patient/records",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      name: "HR",
      icon: <Briefcase size={18} />,
      subItems: [
        {
          name: "Core HR",
          href: "/hr/core",
          icon: <Building2 size={16} />,
        },
        {
          name: "Payroll & Compensation",
          href: "/hr/payroll",
          icon: <CreditCard size={16} />,
        },
        {
          name: "Time & Attendance",
          href: "/hr/attendance",
          icon: <Timer size={16} />,
        },
        {
          name: "Talent Management",
          href: "/hr/talent",
          icon: <Award size={16} />,
        },
        {
          name: "Employee Self-Service",
          href: "/hr/self-service",
          icon: <UserCheck size={16} />,
        },
      ],
    },
    {
      name: "Finance",
      icon: <DollarSign size={18} />,
      subItems: [
        {
          name: "General Ledger",
          href: "/finance/general-ledger",
          icon: <BookOpen size={16} />,
        },
        {
          name: "AP & AR",
          href: "/finance/ap-ar",
          icon: <Receipt size={16} />,
        },
        {
          name: "Cash Management",
          href: "/finance/cash-management",
          icon: <Wallet size={16} />,
        },
        {
          name: "Financial Reporting & Tax",
          href: "/finance/reporting-tax",
          icon: <BarChart3 size={16} />,
        },
        {
          name: "Assets Depreciation",
          href: "/finance/assets",
          icon: <PieChart size={16} />,
        },
        {
          name: "Medical Billings & Invoices",
          href: "/finance/billing",
          icon: <ReceiptText size={16} />,
        },
      ],
    },
    {
      name: "Inventory",
      icon: <Package size={18} />,
      subItems: [
        {
          name: "Drugs Management",
          href: "/inventory/drugs",
          icon: <Pill size={16} />,
        },
        {
          name: "BHP & Consignment",
          href: "/inventory/bhp",
          icon: <Syringe size={16} />,
        },
        {
          name: "Unit-Dose Dispensing",
          href: "/inventory/udd",
          icon: <Microscope size={16} />,
        },
        {
          name: "Office Assets",
          href: "/inventory/office-assets",
          icon: <Monitor size={16} />,
        },
      ],
    },
    {
      name: "Procurement",
      icon: <ShoppingCart size={18} />,
      subItems: [
        {
          name: "Vendor Management",
          href: "/procurement/vendors",
          icon: <Building size={16} />,
        },
        {
          name: "Purchase Requisition",
          href: "/procurement/requisition",
          icon: <FileQuestion size={16} />,
        },
        {
          name: "Purchase Order",
          href: "/procurement/po",
          icon: <FileCheck size={16} />,
        },
        {
          name: "Contract Management",
          href: "/procurement/contracts",
          icon: <FileSignature size={16} />,
        },
      ],
    },
  ];

  const adminItems: MenuItem[] = [
    { name: "Users", icon: <UserCog size={18} />, href: "/users" },
    { name: "Roles", icon: <Shield size={18} />, href: "/roles" },
    {
      name: "Audit",
      icon: <History size={18} />,
      subItems: [
        {
          name: "Activity Logs",
          href: "/audit/activity",
          icon: <FileSearch size={16} />,
        },
        {
          name: "Security Logs",
          href: "/audit/security",
          icon: <ShieldAlert size={16} />,
        },
      ],
    },
  ];

  const isMenuActive = (item: MenuItem) => {
    if (item.href) {
      return pathname.startsWith(item.href);
    }
    if (item.subItems) {
      return item.subItems.some((sub) => pathname.startsWith(sub.href));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.name);
    const isActive = isMenuActive(item);

    if (hasSubItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              "w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              isActive
                ? "bg-blue-600/20 text-blue-400"
                : "hover:bg-gray-800 hover:text-white"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "mr-3",
                  isActive
                    ? "text-blue-400"
                    : "text-gray-500 group-hover:text-white"
                )}
              >
                {item.icon}
              </div>
              {item.name}
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                isExpanded ? "rotate-180" : "",
                isActive ? "text-blue-400" : "text-gray-500"
              )}
            />
          </button>

          {/* Sub-menu */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-4">
              {item.subItems?.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === sub.href
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                      : "hover:bg-gray-800 hover:text-white text-gray-400"
                  )}
                >
                  <div
                    className={cn(
                      "mr-2",
                      pathname === sub.href
                        ? "text-white"
                        : "text-gray-500 group-hover:text-white"
                    )}
                  >
                    {sub.icon}
                  </div>
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={cn(
          "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
          pathname.startsWith(item.href!)
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : "hover:bg-gray-800 hover:text-white hover:translate-x-1"
        )}
      >
        <div
          className={cn(
            "mr-3",
            pathname.startsWith(item.href!)
              ? "text-white"
              : "text-gray-500 group-hover:text-white"
          )}
        >
          {item.icon}
        </div>
        {item.name}
      </Link>
    );
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 transform bg-[#212529] text-gray-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center h-20 px-8 bg-[#212529]">
          <span className="text-xl font-bold tracking-tight text-white flex gap-2 items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="font-bold text-lg">M</span>
            </div>
            MediCare
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto dark-scrollbar">
          <div className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Main Menu
          </div>
          {menuItems.map(renderMenuItem)}

          <div className="pt-8 mt-4">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Administration
            </p>
            {adminItems.map(renderMenuItem)}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl mb-8 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Administrator
              </p>
              <p className="text-xs text-gray-400 truncate">
                Superadmin Access
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all group">
              <User
                size={14}
                className="text-gray-500 group-hover:text-blue-400 transition-colors"
              />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all group">
              <Settings
                size={14}
                className="text-gray-500 group-hover:text-blue-400 transition-colors"
              />
              Settings
            </button>
            <div className="pt-2 mt-2 border-t border-gray-700/50">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all group">
                <LogOut
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
