import BreadCrumbGenerator from "@/components/custom/breadcrumb";
import DashbaordNavbar from "@/components/custom/dashboard/navbar";
import DashboardSidebar from "@/components/custom/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex justify-start w-full">
        <DashboardSidebar />
        <div className="w-full flex flex-col justify-start">
          <DashbaordNavbar />

          <div className="p-5 space-y-5">
            <BreadCrumbGenerator />
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
