"use client";

import ResetPasswordForm from "@/components/custom/forms/reset-password";
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
  resetPasswordSchema,
  TResetPasswordSchema,
} from "@/schema/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultValues(),
  });
  const { push } = useRouter();
  const searchParamsObject = useSearchParams();
  const token = searchParamsObject.get("token");

  const onSubmit = async (formdata: TResetPasswordSchema) => {
    await authClient.resetPassword({
      token: token!,
      newPassword: formdata.password,
      fetchOptions: {
        onSuccess(context) {
          toast.success("Password reset successfully");
          return push("/auth/sign-in");
        },
        onError(context) {
          toast.error(context.error.message);
        },
      },
    });
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
