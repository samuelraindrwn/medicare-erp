"use client";

import * as React from "react";
import Select, { Props as SelectProps } from "react-select";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string | number;
}

export interface InputDropdownProps extends Omit<SelectProps, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  value?: Option | null; // React-select expects object or null
  onChange: (option: Option | null) => void;
  className?: string;
  required?: boolean;
}

export function InputDropdown({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  className,
  required,
  ...props
}: InputDropdownProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        options={options}
        value={value}
        onChange={(val) => onChange(val as Option | null)}
        menuPlacement="auto"
        menuPosition="fixed"
        closeMenuOnScroll={() => true}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({
            ...base,
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15)",
          }),
          menuList: (base) => ({
            ...base,
            padding: "0.25rem",
          }),
          option: (base, state) => ({
            ...base,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            padding: "0.625rem 0.75rem",
            backgroundColor: state.isSelected
              ? "#3b82f6"
              : state.isFocused
              ? "#f3f4f6"
              : "transparent",
            color: state.isSelected ? "#ffffff" : "#374151",
            cursor: "pointer",
            "&:active": {
              backgroundColor: state.isSelected ? "#2563eb" : "#e5e7eb",
            },
          }),
          control: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#ffffff" : "#f9fafb", // gray-50
            boxShadow: state.isFocused
              ? "0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)" // blue shadow
              : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            "&:hover": {
              backgroundColor: state.isFocused ? "#ffffff" : "#f3f4f6", // gray-100
              borderColor: "#d1d5db", // gray-300 on hover
            },
            minHeight: "2.75rem", // h-11
            fontSize: "0.875rem",
            borderRadius: "0.75rem", // rounded-xl
            paddingLeft: "0.25rem",
            borderWidth: "1px",
            borderColor: error
              ? "#ef4444"
              : state.isFocused
              ? "rgba(59, 130, 246, 0.1)"
              : "#e5e7eb", // gray-200 default
            transition: "all 0.2s ease",
          }),
        }}
        className={cn("react-select-container", className)}
        classNamePrefix="react-select"
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
