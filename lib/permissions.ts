import type { UserRole } from "@/models/User";

export function canCreateMachine(role: UserRole) {
  return role === "ADMIN" || role === "MANAGER";
}

export function canUpdateMachine(role: UserRole) {
  return role === "ADMIN" || role === "MANAGER";
}

export function canDeleteMachine(role: UserRole) {
  return role === "ADMIN";
}

export function canViewMachines(role: UserRole) {
  return (
    role === "ADMIN" ||
    role === "MANAGER" ||
    role === "TECHNICIAN"
  );
}