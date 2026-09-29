"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type Machine = {
  _id: string;
  machineName: string;
  machineCode: string;
  manufacturer: string;
  model: string;
  machineType: string;
  location: string;
  status: string;
};

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMachines() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/machines?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to fetch machines");
        return;
      }

      setMachines(data.machines);
    } catch {
      setError("Unable to fetch machines");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMachines();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status]);

  async function deleteMachine(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this machine?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/machines/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete machine");
        return;
      }

      setMachines((previous) =>
        previous.filter((machine) => machine._id !== id)
      );
    } catch {
      alert("Unable to delete machine");
    }
  }

  function statusClass(machineStatus: string) {
    switch (machineStatus) {
      case "OPERATIONAL":
        return "bg-green-950 text-green-400";

      case "MAINTENANCE":
        return "bg-yellow-950 text-yellow-400";

      case "CRITICAL":
        return "bg-red-950 text-red-400";

      default:
        return "bg-slate-800 text-slate-400";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Machines
          </h1>

          <p className="mt-2 text-slate-400">
            Manage and monitor all registered equipment.
          </p>
        </div>

        <Link
          href="/dashboard/machines/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Machine
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search machines..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
        >
          <option value="">All Statuses</option>
          <option value="OPERATIONAL">
            Operational
          </option>
          <option value="MAINTENANCE">
            Maintenance
          </option>
          <option value="CRITICAL">
            Critical
          </option>
          <option value="INACTIVE">
            Inactive
          </option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading machines...
          </div>
        ) : machines.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-400">
              No machines found.
            </p>

            <Link
              href="/dashboard/machines/new"
              className="mt-4 inline-flex text-sm text-blue-400 hover:text-blue-300"
            >
              Add your first machine
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-800 text-left text-sm text-slate-500">
                  <th className="px-6 py-4">
                    Machine
                  </th>
                  <th className="px-6 py-4">
                    Manufacturer
                  </th>
                  <th className="px-6 py-4">
                    Type
                  </th>
                  <th className="px-6 py-4">
                    Location
                  </th>
                  <th className="px-6 py-4">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {machines.map((machine) => (
                  <tr
                    key={machine._id}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-950/50"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium">
                          {machine.machineName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {machine.machineCode}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {machine.manufacturer}
                      <span className="block text-xs text-slate-500">
                        {machine.model}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {machine.machineType}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {machine.location}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                          machine.status
                        )}`}
                      >
                        {machine.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/machines/${machine._id}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/dashboard/machines/${machine._id}/edit`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() =>
                            deleteMachine(machine._id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-950 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}