import React from "react";

export default function Layout({
  children,
  attempts,
}: {
  children: React.ReactNode;
  attempts: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-center items-center p-10 @container">
      <div className="@4xl:w-3/5 w-full space-y-10">
        {children}
        {attempts}
      </div>
    </main>
  );
}
