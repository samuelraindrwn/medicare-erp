"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (username === "admin" && password === "admin") {
        addToast("success", "Welcome Admin!");
        router.push("/dashboard");
      } else if (username === "superadmin" && password === "superadmin") {
        addToast("success", "Welcome Superadmin!");
        router.push("/dashboard");
      } else if (username === "patient" && password === "patient") {
        addToast("warning", "Patients have limited access.");
        // Redirect to a patient page later
        router.push("/dashboard");
      } else {
        addToast("error", "Invalid credentials");
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">MediCare ERP</h1>
        <p className="text-sm text-gray-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <InputText
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <InputText
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-400">
        <p>Demo Credentials:</p>
        <p>Admin: admin / admin</p>
        <p>Superadmin: superadmin / superadmin</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoginForm />
      </div>
    </ToastProvider>
  );
}
