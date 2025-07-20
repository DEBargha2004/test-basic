"use client";

import { getPresignedUrlForTestThumbnail } from "@/actions/s3";
import { TRootTest, updateTest } from "@/actions/test";
import TestForm from "@/components/custom/forms/test";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/url";
import { base64toBlob, isBase64Image } from "@/lib/utils";
import { testSchema, TTestSchema } from "@/schema/test";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CSR({ data }: { data: TRootTest }) {
  const form = useForm<TTestSchema>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? "",
      duration: data.duration,
      totalMarks: data.totalMarks,
      publishingStatus: data.publishingStatus,
      passMarks: data.passMarks,
      thumbnail: data.thumbnail ?? "" ?? "",
      marksDistribution: data.marksDistribution,
      questions: data.questions.map((q, i) => ({
        qid: q.id.toString(),
        title: q.title,
        serial: q.serial,
        options: q.options,
        correctOptionId: q.correctOptionId,
      })),
    },
  });

  const onSubmit = async (formdata: TTestSchema) => {
    if (isBase64Image(formdata.thumbnail)) {
      const blob = base64toBlob(formdata.thumbnail!, "image/webp");
      const signedUrl = await getPresignedUrlForTestThumbnail();
      formdata.thumbnail = signedUrl.path;
      await fetch(signedUrl.url, {
        method: "PUT",
        body: blob,
      });
    }

    const res = await updateTest(data.id.toString(), formdata);
    if (!res.success) return toast("Error", { description: res.message });

    toast.success("Test updated successfully", {
      action: (
        <Link href={"/dashboard/tests"} className="ml-auto">
          <Button variant={"secondary"}>Go To Tests</Button>
        </Link>
      ),
    });
  };

  return <TestForm form={form} onSubmit={onSubmit} />;
}
