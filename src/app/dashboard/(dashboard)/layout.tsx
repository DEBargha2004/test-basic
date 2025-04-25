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
    <div className="grid grid-cols-4 gap-5">
      {children}
      {tests}
      {totalattempts}
    </div>
  );
}
