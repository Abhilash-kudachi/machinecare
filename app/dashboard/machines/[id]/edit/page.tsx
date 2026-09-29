import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import MachineForm from "@/components/machine-form";
import { connectDB } from "@/lib/mongodb";
import Machine from "@/models/Machine";
import { getCurrentUser } from "@/lib/auth";
import { canUpdateMachine } from "@/lib/permissions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMachinePage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!canUpdateMachine(user.role)) {
    redirect("/dashboard/machines");
  }

  const { id } = await params;

  await connectDB();

  const machine = await Machine.findById(id).lean();

  if (!machine) {
    notFound();
  }

  const serializedMachine = {
    _id: machine._id.toString(),
    machineName: machine.machineName,
    machineCode: machine.machineCode,
    manufacturer: machine.manufacturer,
    model: machine.model,
    machineType: machine.machineType,
    location: machine.location,
    installationDate: machine.installationDate.toISOString(),
    status: machine.status,
    lastMaintenanceDate:
      machine.lastMaintenanceDate?.toISOString(),
    nextMaintenanceDate:
      machine.nextMaintenanceDate?.toISOString(),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/dashboard/machines"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Machines
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Machine
        </h1>

        <p className="mt-2 text-slate-400">
          Update machine information and maintenance details.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <MachineForm machine={serializedMachine} />
      </div>
    </div>
  );
}