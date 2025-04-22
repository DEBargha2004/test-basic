"use client";

export default function useCompressImage() {
  const compress = (image: string, quality: number = 0.5) =>
    new Promise<string>((res, rej) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const data = canvas.toDataURL("image/jpeg", quality);

        res(data);
      };

      img.onerror = rej;

      img.src = image;
    });

  return { compress };
}
