import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar role={user.role} />

      <div className="lg:pl-64">
        <Navbar
          email={user.email}
          role={user.role}
        />

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}