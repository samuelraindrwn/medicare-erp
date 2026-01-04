"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import "./date-picker.css"; // We'll create this for custom overrides

// Custom hook to load CSS if we decide to keep it separate or just inline it via global CSS
// For now, we will assume standard css import works and we might style wrapper

export interface InputDateProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
}

export function InputDate({
  label,
  error,
  helperText,
  value,
  onChange,
  className,
  placeholder = "Select date",
  minDate,
  maxDate,
  required,
}: InputDateProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={value}
          onChange={onChange}
          className={cn(
            "flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 pl-10 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:bg-white focus-visible:shadow-md transition-all duration-200",
            error
              ? "border-red-500 focus-visible:ring-red-500 bg-red-50"
              : "hover:bg-gray-100/50 hover:border-gray-300",
            className
          )}
          placeholderText={placeholder}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat="dd/MM/yyyy"
          showPopperArrow={false}
        />
        <div className="absolute left-3 top-2.5 pointer-events-none text-gray-400">
          <CalendarIcon size={16} />
        </div>
      </div>
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
