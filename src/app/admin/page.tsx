import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";
import { ensureSeeded } from "@/lib/seed/seed";
import { logDatabaseError } from "@/lib/db-error";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  try {
    await ensureSeeded();
  } catch (error) {
    logDatabaseError("seed unavailable", error);
  }
  return <AdminDashboard />;
}
