"use client";
"use client";

import * as React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Search, ChevronDown, Filter } from "lucide-react";
import { InputDropdown } from "./InputDropdown";

// Custom Styles for Odoo/Pro look
// Custom Styles for Odoo/Pro look
const customStyles: any = {
  table: {
    style: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
    },
  },
  headRow: {
    style: {
      minHeight: "48px",
      borderBottomWidth: "0px",
      backgroundColor: "#f8fafc", // Lighter gray/slate
      color: "#475569",
    },
  },
  headCells: {
    style: {
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#64748b", // Slate 500
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
  rows: {
    style: {
      minHeight: "60px", // More breathing room
      fontSize: "0.9rem",
      backgroundColor: "#ffffff",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "#f1f5f9", // Very subtle divider
      "&:hover": {
        backgroundColor: "#f8fafc",
        cursor: "pointer",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)", // Subtle lift
        transform: "translateY(-1px)",
        transition: "all 0.2s ease",
        zIndex: 1,
        position: "relative",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      color: "#334155", // Slate 700
    },
  },
  pagination: {
    style: {
      borderTopWidth: "0px",
      marginTop: "10px",
    },
  },
};

export interface TableFilter {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchField?: keyof T;
  filters?: TableFilter[];
  onRowClicked?: (row: T) => void;
  actions?: React.ReactNode;
  pagination?: boolean;
  searchPlaceholder?: string;
}

// Ensure T extends object to satisfy react-data-table-component constraint
function ModernDataTable<T extends object>({
  columns,
  data,
  searchable = true,
  searchField,
  filters,
  onRowClicked,
  actions,
  pagination = true,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [filterText, setFilterText] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<
    Record<string, string>
  >({});

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!value) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const filteredItems = data.filter((item) => {
    // 1. Global Search
    const matchesSearch =
      !searchable ||
      !searchField ||
      !filterText ||
      String(item[searchField!])
        .toLowerCase()
        .includes(filterText.toLowerCase());

    // 2. Column Filters
    const matchesFilters = Object.entries(activeFilters).every(
      ([key, value]) => {
        if (!value) return true;
        // Handles nested objects if key has dot notation? (Simple for now: flat or explicit key in T)
        const itemValue = (item as any)[key];

        // If itemValue is object (like {label, value}), check generic 'value' or 'label' property or stringify
        if (typeof itemValue === "object" && itemValue !== null) {
          return (itemValue.value || itemValue.label || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
    );

    return matchesSearch && matchesFilters;
  });

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <div className="flex items-center gap-3 w-full sm:w-auto mb-4 sm:mb-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-64 shadow-sm"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        {actions}
      </div>
    );
  }, [filterText, actions, searchPlaceholder]);

  const displayData = filteredItems;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200">
      {/* Header / Toolbar */}
      <div className="flex flex-col border-b border-gray-50">
        {(searchable || actions || (filters && filters.length > 0)) && (
          <div className="p-6 bg-white flex flex-col sm:flex-row justify-between items-center sm:gap-4">
            <div className="flex gap-2 w-full overflow-x-auto pb-2 sm:pb-0">
              {/* Render Filters if present */}
              {filters?.map((filter) => (
                <div key={filter.key} className="min-w-[140px]">
                  {filter.type === "select" ? (
                    <InputDropdown
                      options={filter.options || []}
                      value={
                        filter.options?.find(
                          (opt) => opt.value === activeFilters[filter.key]
                        ) || null
                      }
                      onChange={(selected) =>
                        handleFilterChange(
                          filter.key,
                          String(selected?.value || "")
                        )
                      }
                      placeholder={`Filter by ${filter.label}`}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Filter ${filter.label}`}
                      className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white shadow-sm transition-all hover:border-gray-300"
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      value={activeFilters[filter.key] || ""}
                    />
                  )}
                </div>
              ))}
            </div>
            {subHeaderComponentMemo}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        customStyles={customStyles} // @ts-ignore styled-components typing issue
        pagination={pagination}
        highlightOnHover
        pointerOnHover
        onRowClicked={onRowClicked}
        responsive
        // Removed striped for cleaner look
      />
    </div>
  );
}

export { ModernDataTable };
