"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MachineFormProps = {
  machine?: {
    _id?: string;
    machineName: string;
    machineCode: string;
    manufacturer: string;
    model: string;
    machineType: string;
    location: string;
    installationDate: string;
    status: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
  };
};

export default function MachineForm({
  machine,
}: MachineFormProps) {
  const router = useRouter();

  const [machineName, setMachineName] = useState(
    machine?.machineName || ""
  );

  const [machineCode, setMachineCode] = useState(
    machine?.machineCode || ""
  );

  const [manufacturer, setManufacturer] = useState(
    machine?.manufacturer || ""
  );

  const [model, setModel] = useState(
    machine?.model || ""
  );

  const [machineType, setMachineType] = useState(
    machine?.machineType || ""
  );

  const [location, setLocation] = useState(
    machine?.location || ""
  );

  const [installationDate, setInstallationDate] =
    useState(
      machine?.installationDate
        ? new Date(machine.installationDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

  const [status, setStatus] = useState(
    machine?.status || "OPERATIONAL"
  );

  const [lastMaintenanceDate, setLastMaintenanceDate] =
    useState(
      machine?.lastMaintenanceDate
        ? new Date(machine.lastMaintenanceDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

  const [nextMaintenanceDate, setNextMaintenanceDate] =
    useState(
      machine?.nextMaintenanceDate
        ? new Date(machine.nextMaintenanceDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      machineName,
      machineCode,
      manufacturer,
      model,
      machineType,
      location,
      installationDate,
      status,
      lastMaintenanceDate,
      nextMaintenanceDate,
    };

    try {
      const url = machine?._id
        ? `/api/machines/${machine._id}`
        : "/api/machines";

      const method = machine?._id ? "PUT" : "POST";

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
          data.message || "Unable to save machine"
        );
        return;
      }

      setSuccess(
        machine
          ? "Machine updated successfully!"
          : "Machine created successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard/machines");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Machine Information */}
      <div>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Machine Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Machine Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Machine Name
            </label>

            <input
              type="text"
              value={machineName}
              onChange={(e) =>
                setMachineName(e.target.value)
              }
              placeholder="VMC Machine 01"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Machine Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Machine Code
            </label>

            <input
              type="text"
              value={machineCode}
              onChange={(e) =>
                setMachineCode(e.target.value)
              }
              placeholder="VMC-001"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Manufacturer
            </label>

            <input
              type="text"
              value={manufacturer}
              onChange={(e) =>
                setManufacturer(e.target.value)
              }
              placeholder="BFW"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Model */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Model
            </label>

            <input
              type="text"
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
              placeholder="VMC 850"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Machine Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Machine Type
            </label>

            <input
              type="text"
              value={machineType}
              onChange={(e) =>
                setMachineType(e.target.value)
              }
              placeholder="Vertical Machining Center"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Mumbai Plant"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Installation Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Installation Date
            </label>

            <input
              type="date"
              value={installationDate}
              onChange={(e) =>
                setInstallationDate(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
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
        </div>
      </div>

      {/* Maintenance Information */}
      <div>
        <h2 className="mb-5 text-lg font-semibold text-white">
          Maintenance Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Last Maintenance */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Last Maintenance Date
            </label>

            <input
              type="date"
              value={lastMaintenanceDate}
              onChange={(e) =>
                setLastMaintenanceDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Next Maintenance */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Next Maintenance Date
            </label>

            <input
              type="date"
              value={nextMaintenanceDate}
              onChange={(e) =>
                setNextMaintenanceDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Success */}
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
            router.push("/dashboard/machines")
          }
          className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : machine
              ? "Update Machine"
              : "Create Machine"}
        </button>
      </div>
    </form>
  );
}