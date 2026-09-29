import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

type UserRole = "ADMIN" | "MANAGER" | "TECHNICIAN";

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Machines",
      href: "/dashboard/machines",
      icon: Boxes,
    },
    {
      label: "Maintenance",
      href: "/dashboard/maintenance",
      icon: ClipboardList,
    },
    {
      label: "AI Assistant",
      href: "/dashboard/ai-assistant",
      icon: Bot,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ];

  if (role === "ADMIN") {
    links.push({
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-950 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 font-bold">
              M
            </div>

            <div>
              <h1 className="font-bold">MachineCare</h1>
              <p className="text-xs text-slate-500">
                Maintenance Platform
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 px-3 py-2 text-sm text-slate-500">
            <Activity className="h-4 w-4" />
            System Operational
          </div>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}