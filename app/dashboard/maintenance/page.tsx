"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Maintenance = {
  _id: string;

  title: string;

  description: string;

  maintenanceType: string;

  priority: string;

  status: string;

  scheduledDate: string;

  downtimeHours?: number;

  cost?: number;

  machine?: {
    _id: string;
    machineName: string;
    machineCode: string;
  };

  technician?: {
    _id: string;
    name?: string;
    email: string;
  };
};

export default function MaintenancePage() {
  const [records, setRecords] = useState<
    Maintenance[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("");

  async function loadMaintenance() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (priorityFilter) {
        params.set("priority", priorityFilter);
      }

      const query = params.toString();

      const response = await fetch(
        `/api/maintenance${query ? `?${query}` : ""}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch maintenance"
        );
      }

      setRecords(data.maintenance || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load maintenance records"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaintenance();
  }, [statusFilter, priorityFilter]);

  async function deleteMaintenance(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/maintenance/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete maintenance record"
        );
        return;
      }

      setRecords((current) =>
        current.filter(
          (record) => record._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while deleting the record."
      );
    }
  }

  function getPriorityClass(priority: string) {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      case "HIGH":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";

      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

      default:
        return "bg-green-500/10 text-green-400 border-green-500/30";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-400 border-green-500/30";

      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";

      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Maintenance Management
            </h1>

            <p className="mt-2 text-slate-400">
              Track maintenance activities, downtime,
              technicians and costs.
            </p>
          </div>

          <Link
            href="/dashboard/maintenance/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            + Schedule Maintenance
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">All statuses</option>
                <option value="SCHEDULED">
                  Scheduled
                </option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">
                  Medium
                </option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">
                  Critical
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              Loading maintenance records...
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center">
              <h2 className="text-lg font-semibold text-white">
                No maintenance records
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Schedule your first maintenance activity
                to get started.
              </p>

              <Link
                href="/dashboard/maintenance/new"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
              >
                Schedule Maintenance
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Maintenance
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Machine
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Technician
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Scheduled
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Cost
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {records.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-5">
                        <div className="font-medium text-white">
                          {record.title}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {record.maintenanceType}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-sm text-white">
                          {record.machine
                            ?.machineName ||
                            "Unknown"}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {record.machine
                            ?.machineCode || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {record.technician?.name ||
                          record.technician?.email ||
                          "Unknown"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClass(
                            record.priority
                          )}`}
                        >
                          {record.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {formatDate(
                          record.scheduledDate
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        ₹
                        {(
                          record.cost || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <Link
                            href={`/dashboard/maintenance/${record._id}`}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            View
                          </Link>

                          <Link
                            href={`/dashboard/maintenance/${record._id}/edit`}
                            className="text-sm text-slate-400 hover:text-white"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              deleteMaintenance(
                                record._id
                              )
                            }
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Delete
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
    </main>
  );
}