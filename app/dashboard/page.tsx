import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cog,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Machines",
      value: "42",
      description: "Across all locations",
      icon: Cog,
    },
    {
      title: "Operational",
      value: "34",
      description: "Currently running",
      icon: CheckCircle2,
    },
    {
      title: "Maintenance Due",
      value: "5",
      description: "Within next 7 days",
      icon: Clock3,
    },
    {
      title: "Critical Issues",
      value: "3",
      description: "Requires attention",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor your equipment and maintenance operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-800 p-3">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Recent Maintenance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest service activities
              </p>
            </div>

            <Wrench className="h-5 w-5 text-slate-500" />
          </div>

          <div className="space-y-4">
            {[
              {
                machine: "VMC-001",
                issue: "Spindle vibration",
                status: "In Progress",
              },
              {
                machine: "LATHE-004",
                issue: "Lubrication service",
                status: "Completed",
              },
              {
                machine: "VMC-008",
                issue: "Coolant system",
                status: "Open",
              },
            ].map((item) => (
              <div
                key={item.machine}
                className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
              >
                <div>
                  <p className="font-medium">
                    {item.machine}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.issue}
                  </p>
                </div>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold">
            System Overview
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Operational
                </span>

                <span>81%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 w-[81%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Maintenance
                </span>

                <span>12%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 w-[12%] rounded-full bg-yellow-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Critical
                </span>

                <span>7%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 w-[7%] rounded-full bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}