"use client";

import { getPresignedUrlForAvatar } from "@/actions/s3";
import SignUpForm from "@/components/custom/forms/sign-up";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/auth-client";
import { base64toBlob, isBase64Image } from "@/lib/utils";
import { defaultValues, signUpSchema, TSignUpSchema } from "@/schema/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: defaultValues(),
  });
  const { back } = useRouter();

  const onSubmit = async (formdata: TSignUpSchema) => {
    let avatar_path: string = "";

    if (isBase64Image(formdata.avatar)) {
      const blobData = base64toBlob(formdata.avatar!, "image/webp");
      const { url: preSignedUrl, path } = await getPresignedUrlForAvatar();
      avatar_path = path;

      await fetch(preSignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "image/webp",
        },
        body: blobData,
      });
    }

    const { data, error } = await signUp.email(
      {
        email: formdata.email,
        password: formdata.password,
        image: avatar_path,
        name: formdata.name,
        callbackURL: "/dashboard",
      },
      {
        onSuccess(context) {
          toast("Signed up successfully");
        },
        onError(context) {
          toast(context.error.statusText, {
            description: context.error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog defaultOpen onOpenChange={(e) => !e && back()}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <SignUpForm form={form} onSubmit={onSubmit} />
          <Separator />
          <p className="text-center">
            Already have an account?&nbsp;
            <Link href={"/auth/sign-in"} className="inline-block">
              <Label className="underline cursor-pointer">Sign In</Label>
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
