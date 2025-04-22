"use client";

import { defaultValues, signInSchema, TSignInSchema } from "@/schema/sign-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/custom/forms/sign-in";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultValues(),
  });

  const onSubmit = async (formdata: TSignInSchema) => {
    const { error, data } = await signIn.email({
      email: formdata.email,
      password: formdata.password,
      rememberMe: formdata.rememberMe,
      callbackURL: "/dashboard",
    });

    if (error) {
      return toast(error.statusText, { description: error.message });
    }
    toast("Signed in successfully");
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm form={form} onSubmit={onSubmit} />
        <Separator orientation="horizontal" />
        <p className="text-center">
          Don&apos;t have an account?&nbsp;
          <Link href={"/auth/sign-up"} className="inline-block">
            <Label className="underline cursor-pointer">Sign Up</Label>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
