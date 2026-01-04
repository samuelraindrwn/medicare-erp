"use client";

import * as React from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = React.createContext<ConfirmContextType | undefined>(
  undefined
);

export function useConfirm() {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = React.useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = React.useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    if (resolvePromise) resolvePromise(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolvePromise) resolvePromise(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={options.title || "Confirm Action"}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={handleCancel}>
              {options.cancelText || "Cancel"}
            </Button>
            <Button
              variant={options.variant || "default"}
              onClick={handleConfirm}
            >
              {options.confirmText || "Confirm"}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4 py-2">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div className="text-sm text-gray-600">
            {options.description || "Are you sure you want to proceed?"}
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
};
