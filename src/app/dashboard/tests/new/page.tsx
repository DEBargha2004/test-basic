"use client";

import { getPresignedUrlForTestThumbnail } from "@/actions/s3";
import { createTest } from "@/actions/test";
import TestForm from "@/components/custom/forms/test";
import { Button } from "@/components/ui/button";
import { base64toBlob, isBase64Image } from "@/lib/utils";
import { defaultValues, testSchema, TTestSchema } from "@/schema/test";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<TTestSchema>({
    resolver: zodResolver(testSchema),
    defaultValues: defaultValues(),
  });

  const onSubmit = async (formdata: TTestSchema) => {
    if (isBase64Image(formdata.thumbnail)) {
      const blob = base64toBlob(formdata.thumbnail!, "image/webp");

      const preSignedUrl = await getPresignedUrlForTestThumbnail();
      formdata.thumbnail = preSignedUrl.path;

      let resp = await fetch(preSignedUrl.url, {
        method: "PUT",
        body: blob,
      });
    }

    const res = await createTest(formdata);
    if (!res.success) return toast("Error", { description: res.message });

    toast("Test created successfully", {
      action: (
        <Link href={"/dashboard/tests"} className="ml-auto">
          <Button variant={"secondary"}>Go To Tests</Button>
        </Link>
      ),
    });
  };
  return <TestForm form={form} onSubmit={onSubmit} />;
}
