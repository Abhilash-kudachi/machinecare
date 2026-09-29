import Link from "next/link";
import { redirect } from "next/navigation";

import MachineForm from "@/components/machine-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewMachinePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/machines"
            className="text-sm text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Machines
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Add Machine
          </h1>

          <p className="mt-2 text-slate-400">
            Register a new machine in your facility.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
          <MachineForm />
        </div>
      </div>
    </main>
  );
}