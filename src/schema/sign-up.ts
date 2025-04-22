import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const defaultValues = (): TSignUpSchema => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
