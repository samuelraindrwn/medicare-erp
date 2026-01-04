"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export function PanelLoader({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] w-full bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 ${className}`}
    >
      <div className="bg-white p-4 rounded-full shadow-lg border border-blue-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Loading data...
      </p>
    </div>
  );
}
