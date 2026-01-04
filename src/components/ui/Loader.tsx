"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = "md",
  text,
  className,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          "rounded-full border-blue-200 border-t-blue-600 animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm",
          className
        )}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      {spinner}
    </div>
  );
};

// Page loader component with skeleton-like animation
const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-100" />
        {/* Spinning ring */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">{text}</p>
        <p className="text-xs text-gray-400 mt-1">Please wait...</p>
      </div>
    </div>
  );
};

// Inline loader for buttons or small areas
const InlineLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin",
        className
      )}
    />
  );
};

// Skeleton loader for content placeholders
const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};

// Card skeleton for dashboard widgets
const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

// Table skeleton for data tables
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>
      {/* Table header */}
      <div className="flex gap-4 p-4 border-b border-gray-100 bg-gray-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 flex-1 bg-gray-200 rounded" />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-gray-50">
          {[1, 2, 3, 4, 5].map((j) => (
            <div key={j} className="h-4 flex-1 bg-gray-100 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export {
  Loader,
  PageLoader,
  InlineLoader,
  SkeletonLoader,
  CardSkeleton,
  TableSkeleton,
};
