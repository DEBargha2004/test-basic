import { getImageUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image, { ImageProps } from "next/image";
import React from "react";

export default function TestThumbnail({
  path,
  className,
  alt,
  ...props
}: Omit<ImageProps, "src"> & { path: string }) {
  return path ? (
    <Image
      alt={alt}
      height={300}
      width={300}
      src={getImageUrl(path)}
      className="w-full h-full object-cover"
      {...props}
    />
  ) : (
    <div
      className={cn(
        "bg-muted text-muted-foreground w-full h-full grid place-content-center",
        className
      )}
    >
      <ImageIcon size={20} />
    </div>
  );
}
