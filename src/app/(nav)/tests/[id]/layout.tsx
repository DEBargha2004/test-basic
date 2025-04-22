import React from "react";

export default function Layout({
  children,
  attempts,
}: {
  children: React.ReactNode;
  attempts: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-center items-center pt-10">
      <div className="w-3/5 space-y-10">
        {children}
        {attempts}
      </div>
    </main>
  );
}
