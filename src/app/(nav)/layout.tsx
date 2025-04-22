import Navbar from "@/components/custom/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-fit">
      <Navbar />
      {children}
    </main>
  );
}
