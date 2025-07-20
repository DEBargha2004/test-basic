"use client";

import { getPresignedUrlForAvatar } from "@/actions/s3";
import ProfileForm from "@/components/custom/forms/profile";
import { authClient } from "@/lib/auth-client";
import { base64toBlob, isBase64Image } from "@/lib/utils";
import { profileSchema, TProfileSchema } from "@/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileCSR({
  defaultValues,
}: {
  defaultValues: TProfileSchema;
}) {
  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (formdata: TProfileSchema) => {
    let avatar_path: string = "";
    if (isBase64Image(formdata.avatar)) {
      const blob = base64toBlob(formdata.avatar!, "image/webp");
      const signedUrl = await getPresignedUrlForAvatar();
      avatar_path = signedUrl.path;
      await fetch(signedUrl.url, {
        method: "PUT",
        headers: {
          "Content-Type": "image/webp",
        },
        body: blob,
      });
    }
    await authClient.updateUser(
      {
        name: formdata.name,
        ...(isBase64Image(formdata.avatar) ? { image: avatar_path } : {}),
      },
      {
        onSuccess(context) {
          toast.success("Profile updated successfully");
        },
        onError(context) {
          toast.error("Error updating profile");
        },
      }
    );
  };

  return <ProfileForm form={form} onSubmit={onSubmit} />;
}
