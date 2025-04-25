import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  avatar: z.string().optional(),
});

export type TProfileSchema = z.infer<typeof profileSchema>;

export const defaultValues = (): TProfileSchema => ({
  name: "",
  avatar: "",
});
