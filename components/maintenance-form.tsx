"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Machine = {
  _id: string;
  machineName: string;
  machineCode: string;
  manufacturer?: string;
  model?: string;
};

type Technician = {
  _id: string;
  name?: string;
  email: string;
  role: string;
};

type MaintenanceFormProps = {
  maintenance?: {
    _id?: string;
    machine?: {
      _id: string;
    } | string;
    title: string;
    description: string;
    maintenanceType: string;
    priority: string;
    status: string;
    technician?: {
      _id: string;
    } | string;
    scheduledDate: string;
    startedAt?: string;
    completedAt?: string;
    diagnosis?: string;
    actionTaken?: string;
    partsUsed?: string[];
    downtimeHours?: number;
    cost?: number;
    notes?: string;
  };
};

export default function MaintenanceForm({
  maintenance,
}: MaintenanceFormProps) {
  const router = useRouter();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [machine, setMachine] = useState(
    typeof maintenance?.machine === "string"
      ? maintenance.machine
      : maintenance?.machine?._id || ""
  );

  const [title, setTitle] = useState(
    maintenance?.title || ""
  );

  const [description, setDescription] = useState(
    maintenance?.description || ""
  );

  const [maintenanceType, setMaintenanceType] =
    useState(
      maintenance?.maintenanceType || "PREVENTIVE"
    );

  const [priority, setPriority] = useState(
    maintenance?.priority || "MEDIUM"
  );

  const [status, setStatus] = useState(
    maintenance?.status || "SCHEDULED"
  );

  const [technician, setTechnician] = useState(
    typeof maintenance?.technician === "string"
      ? maintenance.technician
      : maintenance?.technician?._id || ""
  );

  const [scheduledDate, setScheduledDate] =
    useState(
      maintenance?.scheduledDate
        ? new Date(maintenance.scheduledDate)
            .toISOString()
            .slice(0, 16)
        : ""
    );

  const [startedAt, setStartedAt] = useState(
    maintenance?.startedAt
      ? new Date(maintenance.startedAt)
          .toISOString()
          .slice(0, 16)
      : ""
  );

  const [completedAt, setCompletedAt] =
    useState(
      maintenance?.completedAt
        ? new Date(maintenance.completedAt)
            .toISOString()
            .slice(0, 16)
        : ""
    );

  const [diagnosis, setDiagnosis] = useState(
    maintenance?.diagnosis || ""
  );

  const [actionTaken, setActionTaken] =
    useState(
      maintenance?.actionTaken || ""
    );

  const [partsUsed, setPartsUsed] = useState(
    maintenance?.partsUsed?.join(", ") || ""
  );

  const [downtimeHours, setDowntimeHours] =
    useState(
      String(maintenance?.downtimeHours ?? 0)
    );

  const [cost, setCost] = useState(
    String(maintenance?.cost ?? 0)
  );

  const [notes, setNotes] = useState(
    maintenance?.notes || ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Load machines and technicians
   */
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);

        const [machinesResponse, usersResponse] =
          await Promise.all([
            fetch("/api/machines"),
            fetch("/api/users?role=TECHNICIAN"),
          ]);

        const machinesData =
          await machinesResponse.json();

        const usersData =
          await usersResponse.json();

        if (!machinesResponse.ok) {
          throw new Error(
            machinesData.message ||
              "Unable to load machines"
          );
        }

        if (!usersResponse.ok) {
          throw new Error(
            usersData.message ||
              "Unable to load technicians"
          );
        }

        setMachines(
          machinesData.machines || []
        );

        setTechnicians(
          usersData.users || []
        );
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load form data"
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (!machine) {
      setError("Please select a machine.");
      setLoading(false);
      return;
    }

    if (!technician) {
      setError("Please select a technician.");
      setLoading(false);
      return;
    }

    const payload = {
      machine,
      title,
      description,
      maintenanceType,
      priority,
      status,
      technician,
      scheduledDate,
      startedAt,
      completedAt,
      diagnosis,
      actionTaken,
      partsUsed: partsUsed
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
      downtimeHours: Number(downtimeHours) || 0,
      cost: Number(cost) || 0,
      notes,
    };

    try {
      const url = maintenance?._id
        ? `/api/maintenance/${maintenance._id}`
        : "/api/maintenance";

      const method = maintenance?._id
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to save maintenance record"
        );
        return;
      }

      setSuccess(
        maintenance?._id
          ? "Maintenance updated successfully!"
          : "Maintenance created successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard/maintenance");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Loading machines and technicians...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Basic Information */}
      <section>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Maintenance Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Machine */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Machine
            </label>

            <select
              value={machine}
              onChange={(e) =>
                setMachine(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">
                Select machine
              </option>

              {machines.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.machineName} —{" "}
                  {item.machineCode}
                </option>
              ))}
            </select>
          </div>

          {/* Technician */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Technician
            </label>

            <select
              value={technician}
              onChange={(e) =>
                setTechnician(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">
                Select technician
              </option>

              {technicians.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name || item.email}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Maintenance Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Example: Spindle vibration inspection"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the problem or maintenance requirement..."
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Classification */}
      <section>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Classification
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Maintenance Type
            </label>

            <select
              value={maintenanceType}
              onChange={(e) =>
                setMaintenanceType(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="PREVENTIVE">
                Preventive
              </option>

              <option value="CORRECTIVE">
                Corrective
              </option>

              <option value="EMERGENCY">
                Emergency
              </option>

              <option value="INSPECTION">
                Inspection
              </option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
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
        </div>
      </section>

      {/* Dates */}
      <section>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Schedule
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Scheduled Date
            </label>

            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) =>
                setScheduledDate(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Started At
            </label>

            <input
              type="datetime-local"
              value={startedAt}
              onChange={(e) =>
                setStartedAt(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Completed At
            </label>

            <input
              type="datetime-local"
              value={completedAt}
              onChange={(e) =>
                setCompletedAt(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Work Details */}
      <section>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Work Details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Diagnosis
            </label>

            <textarea
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
              rows={3}
              placeholder="What was found during inspection?"
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Action Taken
            </label>

            <textarea
              value={actionTaken}
              onChange={(e) =>
                setActionTaken(e.target.value)
              }
              rows={3}
              placeholder="What action was taken to resolve the issue?"
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Parts Used
            </label>

            <input
              type="text"
              value={partsUsed}
              onChange={(e) =>
                setPartsUsed(e.target.value)
              }
              placeholder="Bearing, Lubricant, Belt"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-slate-500">
              Separate multiple parts using commas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Downtime (Hours)
              </label>

              <input
                type="number"
                min="0"
                step="0.5"
                value={downtimeHours}
                onChange={(e) =>
                  setDowntimeHours(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Maintenance Cost (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) =>
                  setCost(e.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows={3}
              placeholder="Additional notes..."
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-800 bg-green-950/50 p-4 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            router.push("/dashboard/maintenance")
          }
          className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : maintenance?._id
              ? "Update Maintenance"
              : "Create Maintenance"}
        </button>
      </div>
    </form>
  );
}