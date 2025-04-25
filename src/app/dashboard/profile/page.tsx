import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileCSR from "./_components/profile-csr";
import { getImageUrl } from "@/lib/url";

export default async function Page() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <main className="grid">
      <Card className="w-1/2 mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileCSR
            defaultValues={{
              name: user?.user?.name ?? "",
              avatar: user?.user?.image ? getImageUrl(user.user.image) : "",
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
