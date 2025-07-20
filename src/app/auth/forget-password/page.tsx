"use client";

import ForgetPasswordForm from "@/components/custom/forms/forget-password";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  defaultValues,
  forgetPasswordSchema,
  TForgetPasswordSchema,
} from "@/schema/forget-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<TForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: defaultValues(),
  });
  const { push } = useRouter();

  const onSubmit = async (formdata: TForgetPasswordSchema) => {
    const res = await authClient.forgetPassword({
      email: formdata.email,
      redirectTo: "/auth/reset-password",
    });

    if (res.data?.status) {
      toast.success("Password reset link sent to your email");
      return push("/auth/reset-password");
    }
    return toast.error(res.error?.message);
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Forget Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgetPasswordForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
