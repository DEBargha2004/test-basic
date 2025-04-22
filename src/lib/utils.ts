import { AttemptStatus } from "@/constants/question-attempt-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(image?: string) {
  if (!image) return false;

  const base64Regex =
    /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(image);
}

export function base64toBlob(base64: string, contentType: string) {
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType });
}

export function getAcronym(name: string) {
  return name
    .trim()
    .replaceAll("  ", "")
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function sort<
  T extends Record<string, any>[],
  K extends keyof T[number]
>(list: T, key: K, order: "asc" | "desc" = "asc"): T {
  list = JSON.parse(JSON.stringify(list));
  list.sort(
    (a, b) =>
      (a[key.toString()] > b[key.toString()] ? 1 : -1) *
      (order === "asc" ? 1 : -1)
  );
  return list;
}

export function formatDate(date: Date) {
  const intl = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
  });
  return intl.format(date);
}

export function getDurationInfo(duration: number) {
  return {
    hours: Math.floor(duration / 3600),
    minutes: Math.floor((duration % 3600) / 60),
    seconds: Math.floor((duration % 3600) % 60),
  };
}

/**
 *
 * @param duration seconds
 * @returns
 */
export function formatDuration(duration: number) {
  const { hours, minutes, seconds } = getDurationInfo(duration);

  return `
  ${hours ? `${hours}h` : ""} 
  ${minutes ? `${minutes} min` : ""} 
  ${seconds ? `${seconds}s` : ""}
  `;
}

export function getNextPossibleQAStatus(
  current: AttemptStatus
): AttemptStatus[] {
  switch (current) {
    case "not-visited":
      return [
        "marked",
        "answered",
        "unanswered",
        "marked&answered",
        "not-visited",
      ];
    case "marked":
      return ["answered", "unanswered", "marked&answered", "marked"];
    case "answered":
      return ["marked&answered", "unanswered", "marked", "answered"];
    case "marked&answered":
      return ["answered", "marked", "unanswered", "marked&answered"];
    case "unanswered":
      return ["answered", "marked&answered", "marked", "unanswered"];
    default:
      return [];
  }
}

export function canUpdateQAStatus(current: AttemptStatus, next: AttemptStatus) {
  const nextPossibleStatus = getNextPossibleQAStatus(current);
  // console.log({ nextPossibleStatus, next, current });
  return nextPossibleStatus.includes(next);
}

export function getUniqueValues<T, K extends keyof T>(arr: T[], key: K) {
  const set = new Set(arr.map((item) => item[key]));

  return Array.from(set).map((entry) => arr.find((i) => i[key] === entry)!);
}
