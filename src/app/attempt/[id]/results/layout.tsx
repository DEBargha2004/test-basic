import Navbar from "@/components/custom/navbar";

export default function Layout({
  children,
  markdistribution,
  answers,
}: {
  children: React.ReactNode;
  markdistribution: React.ReactNode;
  answers: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh h-fit flex flex-col">
      <Navbar />
      <div className="flex-1 2xl:w-3/5 @2xl:p-0 p-4 w-full mx-auto py-5 space-y-10">
        {children}
        {markdistribution}
        {answers}
      </div>
    </main>
  );
}
