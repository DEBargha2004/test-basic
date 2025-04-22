"use client";

import { defaultValues, signInSchema, TSignInSchema } from "@/schema/sign-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInForm from "@/components/custom/forms/sign-in";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultValues(),
  });
  const { back } = useRouter();
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
    <Dialog defaultOpen onOpenChange={(e) => !e && back()}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <SignInForm form={form} onSubmit={onSubmit} />
          <Separator orientation="horizontal" />
          <p className="text-center">
            Don&apos;t have an account?&nbsp;
            <Link href={"/auth/sign-up"} className="inline-block">
              <Label className="underline cursor-pointer">Sign Up</Label>
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
