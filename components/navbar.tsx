"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  email: string;
  role: string;
}

export default function Navbar({
  email,
  role,
}: NavbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-500">
          MachineCare
        </p>

        <h2 className="font-semibold">
          Equipment Management
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">
            {email}
          </p>

          <p className="text-xs text-slate-500">
            {role}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
          <User className="h-5 w-5 text-slate-400" />
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          title="Logout"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}