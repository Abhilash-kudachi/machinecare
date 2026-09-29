import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CalendarDays,
  Factory,
  MapPin,
  Settings2,
} from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import Machine from "@/models/Machine";
import { getCurrentUser } from "@/lib/auth";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MachineDetailsPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDB();

  const machine = await Machine.findById(id)
    .populate("createdBy", "name email")
    .lean();

  if (!machine) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/machines"
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        ← Back to Machines
      </Link>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {machine.machineName}
            </h1>

            <span className="rounded-full bg-green-950 px-3 py-1 text-xs text-green-400">
              {machine.status}
            </span>
          </div>

          <p className="mt-2 text-slate-500">
            {machine.machineCode}
          </p>
        </div>

        <Link
          href={`/dashboard/machines/${id}/edit`}
          className="rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold hover:bg-blue-600"
        >
          Edit Machine
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Factory className="h-5 w-5 text-blue-400" />

            <h2 className="font-semibold">
              Machine Information
            </h2>
          </div>

          <div className="space-y-4">
            <InfoRow
              label="Manufacturer"
              value={machine.manufacturer}
            />

            <InfoRow
              label="Model"
              value={machine.model}
            />

            <InfoRow
              label="Machine Type"
              value={machine.machineType}
            />

            <InfoRow
              label="Location"
              value={machine.location}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-blue-400" />

            <h2 className="font-semibold">
              Maintenance Information
            </h2>
          </div>

          <div className="space-y-4">
            <InfoRow
              label="Installation Date"
              value={formatDate(machine.installationDate)}
            />

            <InfoRow
              label="Last Maintenance"
              value={
                machine.lastMaintenanceDate
                  ? formatDate(machine.lastMaintenanceDate)
                  : "Not recorded"
              }
            />

            <InfoRow
              label="Next Maintenance"
              value={
                machine.nextMaintenanceDate
                  ? formatDate(machine.nextMaintenanceDate)
                  : "Not scheduled"
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-blue-400" />

          <div>
            <h2 className="font-semibold">
              Current Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {machine.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm text-slate-200">
        {value}
      </span>
    </div>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}