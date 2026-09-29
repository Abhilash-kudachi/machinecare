import Link from "next/link";
import { redirect } from "next/navigation";

import MaintenanceForm from "@/components/maintenance-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewMaintenancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/dashboard/maintenance"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Maintenance
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Schedule Maintenance
          </h1>

          <p className="mt-2 text-slate-400">
            Create a maintenance record and assign it
            to a technician.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
          <MaintenanceForm />
        </div>
      </div>
    </main>
  );
}