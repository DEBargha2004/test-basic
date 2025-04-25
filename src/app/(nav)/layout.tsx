import AppSidebar from "@/components/custom/app-sidebar";
import Navbar from "@/components/custom/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="h-fit w-full flex">
        <AppSidebar />
        <div className="flex-1 h-fit min-h-dvh">
          <Navbar />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
