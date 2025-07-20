import { Button } from "@/components/ui/button";
import useCompressImage from "@/hooks/use-compress-image";
import useFileReader from "@/hooks/use-file-reader";
import { cn, isBase64Image } from "@/lib/utils";
import { TTestSchema } from "@/schema/test";
import { TFormChildrenDefaultParams } from "@/types/form-default-params";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useId, useRef } from "react";
import { useWatch } from "react-hook-form";
import SafeRemove from "../../safe-remove";
import { getImageUrl } from "@/lib/url";

export default function TestThumbnailDetails({
  form,
}: TFormChildrenDefaultParams<TTestSchema>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { read } = useFileReader();
  const { compress } = useCompressImage();
  const thumbnail = useWatch({
    control: form.control,
    name: "thumbnail",
  });

  const handleRemoveThumbnail = () => form.setValue("thumbnail", "");

  useEffect(() => {
    const controller = new AbortController();

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener(
        "change",
        (e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (file) {
            read(file)
              .then((res) => compress(res))
              .then((res) => form.setValue("thumbnail", res));
          }
        },
        {
          signal: controller.signal,
        }
      );
    }

    return () => controller.abort();
  }, []);
  return (
    <>
      <input type="file" accept="image/*" ref={inputRef} id={id} hidden />
      <label htmlFor={id}>
        <div
          className={cn(
            "w-full aspect-video bg-accent rounded-xl border overflow-hidden",
            !thumbnail && "grid place-content-center"
          )}
        >
          {thumbnail ? (
            <Image
              src={
                isBase64Image(thumbnail) ? thumbnail : getImageUrl(thumbnail)
              }
              alt="Thumbnail"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-muted-foreground" />
          )}
        </div>
      </label>
      <div
        className={cn(
          "grid gap-2 mt-2",
          thumbnail ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <Button
          type="button"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          <span>Upload</span>
        </Button>
        {thumbnail && (
          <SafeRemove action={handleRemoveThumbnail}>
            <Button type="button" className="w-full" variant={"destructive"}>
              <Trash2 />
              <span>Remove</span>
            </Button>
          </SafeRemove>
        )}
      </div>
    </>
  );
}
