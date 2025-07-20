import { getTests } from "@/actions/test";
import PublicTestsCSR from "./_components/public-tests-csr";
import PublicTestsProvider from "@/providers/public-tests-provider";

export const dynamic = "auto";
export const revalidate = 10;

export default async function Home() {
  const resp = await getTests({});

  return (
    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 p-5">
      <PublicTestsProvider defaultValues={resp.data}>
        <PublicTestsCSR />
      </PublicTestsProvider>
    </div>
  );
}
