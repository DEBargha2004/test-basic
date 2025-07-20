export default function Layout({
  children,
  tests,
  totalattempts,
}: {
  children: React.ReactNode;
  tests: React.ReactNode;
  totalattempts: React.ReactNode;
}) {
  return (
    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-5">
      {children}
      {tests}
      {totalattempts}
    </div>
  );
}
