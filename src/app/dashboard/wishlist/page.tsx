import { getWishlistOfUser } from "@/actions/test";
import PublicTestsCSR from "@/app/(nav)/_components/public-tests-csr";
import PublicTestsProvider from "@/providers/public-tests-provider";

export default async function Page() {
  const resp = await getWishlistOfUser();
  if (!resp.success) return <h1>{resp.message}</h1>;

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
      <PublicTestsProvider defaultValues={resp.data} removeAfterUnWishlist>
        <PublicTestsCSR />
      </PublicTestsProvider>
    </div>
  );
}
