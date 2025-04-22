type TTab = {
  id: string;
  title: string;
  path: string;
  isActive: (status: string) => boolean;
};

export const testStatus = [
  {
    id: "all",
    title: "All",
    path: "/dashboard/tests",
    isActive(status) {
      return status === this.id;
    },
  },
  {
    id: "draft",
    title: "Draft",
    path: "/dashboard/tests?status=draft",
    isActive(status) {
      return status === this.id;
    },
  },
  {
    id: "published",
    title: "Published",
    path: "/dashboard/tests?status=published",
    isActive(status) {
      return status === this.id;
    },
  },
  {
    id: "archieved",
    title: "Archieved",
    path: "/dashboard/tests?status=archieved",
    isActive(status) {
      return status === this.id;
    },
  },
] as const satisfies TTab[];

export const publishingStatus = testStatus.slice(1, 3);

export const isTestArchieved = (status: string) => status === "archieved";
export const isTestPublished = (status: string) => status === "published";
export const isTestDraft = (status: string) => status === "draft";

export const draft = testStatus.find((t) => t.id === "draft")!;
export const published = testStatus.find((t) => t.id === "published")!;
export const archieved = testStatus.find((t) => t.id === "archieved")!;
