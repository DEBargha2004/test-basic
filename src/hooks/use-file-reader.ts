"use client";

export default function useFileReader() {
  const read = async (file: File) => {
    return new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        res(reader.result as string);
      };

      reader.onerror = rej;
    });
  };
  return { read };
}
